#!/usr/bin/env python3
"""Gelgit motorunun doğrulaması (GitHub Actions'ta, deniz hattından sonra).

Uygulamanın yaptığının aynısını yapar: istasyonun yanındaki deniz hücresinden Open-Meteo deniz seviyesi serisini (son 92 gün + 7 gün)
alır, aynı bileşenlerle harmonik analiz yapar ve sonucu gerçek ölçümle kıyaslar:
  TUDES (Türkiye): yayımlanmış M2, S2, K1, O1 genlikleri (cm) ile model genlikleri
  NOAA CO-OPS (ABD): istasyonun resmî astronomik tahmini (MSL) ile önümüzdeki 3 gün: RMSE, yüksek/alçak su saat farkı
Sonuçlar iş akışı notu (::notice) olarak yazılır ve deniz/v1/gelgit_dogrulama.json dosyasına kaydedilir.
"""
import argparse, datetime as dt, json, math, sys, time, urllib.request
from pathlib import Path

import numpy as np

C = [('M2', 28.9841042, 1), ('S2', 30.0, 14.8), ('N2', 28.4397295, 27.6), ('K1', 15.0410686, 13.7), ('O1', 13.9430356, 13.7), ('Q1', 13.3986609, 27.6), ('M4', 57.9682084, 1)]
T0 = dt.datetime(2000, 1, 1, tzinfo=dt.timezone.utc).timestamp()
ST = [  # TUDES genlikleri: HGM 2003 Ek-C / Ocean Science 2022 (ChatGPT araştırması, 9 Kasım 2026)
    {'k': 'tudes-mentes', 'n': 'Menteş (İzmir)', 'lat': 38.42961, 'lon': 26.72215, 'amp': {'M2': 5.8664, 'S2': 4.0355, 'K1': 2.4448, 'O1': 1.2305}, 'g': {'M2': 45.87, 'S2': 61.01, 'K1': 137.95, 'O1': 126.38}},
    {'k': 'tudes-bodrum-ii', 'n': 'Bodrum-II', 'lat': 37.03218, 'lon': 27.42346, 'amp': {'M2': 4.067, 'S2': 2.6577, 'K1': 1.9855, 'O1': 0.9704}, 'g': {'M2': 250.26, 'S2': 71.52, 'K1': 210.23, 'O1': 358.78}},
    {'k': 'tudes-antalya-ii', 'n': 'Antalya-II', 'lat': 36.83042, 'lon': 30.60868, 'amp': {'M2': 7.1584, 'S2': 4.2613, 'K1': 1.9862, 'O1': 1.1225}, 'g': {'M2': 225.31, 'S2': 46.43, 'K1': 184.54, 'O1': 342.09}},
    {'k': 'tudes-erdek', 'n': 'Erdek', 'lat': 40.38988, 'lon': 27.84518, 'amp': {'M2': 0.4855, 'S2': 0.29, 'K1': 1.168, 'O1': 0.7906}, 'g': {'M2': 114.22, 'S2': 201.0, 'K1': 273.96, 'O1': 165.13}},
    {'k': 'tudes-gokceada', 'n': 'Gökçeada', 'lat': 40.23171, 'lon': 25.89349, 'amp': {'M2': 6.58, 'S2': 4.92, 'K1': 2.10, 'O1': 0.96}},   # Alpar ve Yüce 1998, 1994 geçici mareograf (2B)
    {'k': '8724580', 'n': 'Key West, FL', 'lat': 24.5557, 'lon': -81.8079, 'noaa': True},
    {'k': '8771450', 'n': 'Galveston Pier 21, TX', 'lat': 29.3100, 'lon': -94.7933, 'noaa': True},
    {'k': '9414290', 'n': 'San Francisco, CA', 'lat': 37.806305, 'lon': -122.46589, 'noaa': True},
    {'k': '8443970', 'n': 'Boston, MA', 'lat': 42.3539, 'lon': -71.0503, 'noaa': True},
    {'k': '8638610', 'n': 'Sewells Point, VA', 'lat': 36.9428, 'lon': -76.3286, 'noaa': True},
]


def get(url, tries=2):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'alyssa-tide-check'}), timeout=60) as r:
                return json.loads(r.read().decode('utf-8'))
        except Exception as e:
            err = e; time.sleep(2)
    raise err


def om_series(lat, lon):
    """istasyonun yanındaki ilk dolu deniz hücresi (uygulamadaki en yakın deniz noktası aramasına benzer)"""
    offs = [(0, 0)] + [(dy * r, dx * r) for r in (0.04, 0.08, 0.15) for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (1, -1), (-1, 1), (-1, -1))]
    for dy, dx in offs:
        la, lo = lat + dy, lon + dx
        j = get('https://marine-api.open-meteo.com/v1/marine?latitude=%.4f&longitude=%.4f&timezone=GMT&past_days=92&forecast_days=7&hourly=sea_level_height_msl' % (la, lo))
        h = j.get('hourly') or {}
        v = h.get('sea_level_height_msl')
        if v and sum(x is not None for x in v) > 24 * 20:
            t = [dt.datetime.fromisoformat(s).replace(tzinfo=dt.timezone.utc).timestamp() for s in h['time']]
            ok = [(a, b) for a, b in zip(t, v) if b is not None]
            return np.array([a for a, _ in ok]), np.array([b for _, b in ok]), (la, lo)
    return None, None, None


# ---- astronomik argümanlar ve düğüm (18,6 yıl) düzeltmesi (Schureman; uygulamadaki 31t-gelgit.js ile aynı)
# V: denge argümanı (derece), f/u: düğüm genlik çarpanı ve faz düzeltmesi. K2 ve P1, 92 günlük kayıtta S2 ve K1'den ayrılamaz
# (ayırmak için 183 gün gerekir); denge oranıyla türetilir: K2 = 0,27·S2, P1 = 0,33·K1, fazları eş (Greenwich).
J2000 = dt.datetime(2000, 1, 1, 12, tzinfo=dt.timezone.utc).timestamp()
D2R = math.pi / 180


def astro(t):
    D = (np.asarray(t, dtype=float) - J2000) / 86400
    s = 218.3165 + 13.17639648 * D; h = 280.4661 + 0.98564736 * D; p = 83.3532 + 0.11140353 * D; N = (125.0445 - 0.05295377 * D) * D2R
    T = 180 + 15 * ((np.asarray(t, dtype=float) / 3600) % 24)
    return s, h, p, N, T


def vfu(n, t):
    s, h, p, N, T = astro(t)
    c1, c2, c3, s1, s2, s3 = np.cos(N), np.cos(2 * N), np.cos(3 * N), np.sin(N), np.sin(2 * N), np.sin(3 * N)
    fM2 = 1.0004 - 0.0373 * c1 + 0.0002 * c2; uM2 = -2.14 * s1
    fO1 = 1.0089 + 0.1871 * c1 - 0.0147 * c2 + 0.0014 * c3; uO1 = 10.80 * s1 - 1.34 * s2 + 0.19 * s3
    fK1 = 1.0060 + 0.1150 * c1 - 0.0088 * c2 + 0.0006 * c3; uK1 = -8.86 * s1 + 0.68 * s2 - 0.07 * s3
    fK2 = 1.0241 + 0.2863 * c1 + 0.0083 * c2 - 0.0015 * c3; uK2 = -17.74 * s1 + 0.68 * s2 - 0.04 * s3
    one, zero = np.ones_like(s), np.zeros_like(s)
    V, f, u = {
        'M2': (2 * T - 2 * s + 2 * h, fM2, uM2), 'S2': (2 * T, one, zero), 'N2': (2 * T - 3 * s + 2 * h + p, fM2, uM2),
        'K2': (2 * T + 2 * h, fK2, uK2), 'K1': (T + h - 90, fK1, uK1), 'O1': (T - 2 * s + h + 90, fO1, uO1),
        'P1': (T - h + 90, one, zero), 'Q1': (T - 3 * s + h + p + 90, fO1, uO1), 'M4': (4 * T - 4 * s + 4 * h, fM2 ** 2, 2 * uM2)}[n]
    return (V + u) * D2R, f


INFER = {'S2': ('K2', 0.27), 'K1': ('P1', 0.33)}


def basis(n, t):
    X, f = vfu(n, t); bc, bs = f * np.cos(X), f * np.sin(X)
    if n in INFER:
        m, r = INFER[n]; X2, f2 = vfu(m, t); bc = bc + r * f2 * np.cos(X2); bs = bs + r * f2 * np.sin(X2)
    return bc, bs


def fit(t, v):
    days = (t[-1] - t[0]) / 86400
    cs = [n for n, w, d in C if days >= d]
    cols = [np.ones_like(t, dtype=float)]
    for n in cs:
        cols += list(basis(n, t))
    A = np.vstack(cols).T
    x, *_ = np.linalg.lstsq(A, v, rcond=None)
    comp = {n: {'a': x[1 + 2 * i], 'b': x[2 + 2 * i], 'amp': math.hypot(x[1 + 2 * i], x[2 + 2 * i]),
                'g': math.degrees(math.atan2(x[2 + 2 * i], x[1 + 2 * i])) % 360} for i, n in enumerate(cs)}
    return {'z0': x[0], 'C': comp, 'days': days}


def pred(F, t):
    t = np.asarray(t, dtype=float)
    v = np.full_like(t, F['z0'], dtype=float)
    for n, c in F['C'].items():
        bc, bs = basis(n, t); v += c['a'] * bc + c['b'] * bs
    return v


def selftest():
    """Yapay seri: 8 bileşen (K2, P1 dahil) + düğüm etkisi; 99 günlük uyum, 3 gün ileri tahmin hatası."""
    rng = np.random.default_rng(1)
    t = np.arange(dt.datetime(2026, 8, 1, tzinfo=dt.timezone.utc).timestamp(), dt.datetime(2026, 11, 8, tzinfo=dt.timezone.utc).timestamp(), 3600.0)
    tru = {'M2': (0.60, 40), 'S2': (0.25, 70), 'N2': (0.12, 20), 'K2': (0.068, 70), 'K1': (0.30, 150), 'O1': (0.20, 130), 'P1': (0.10, 150), 'Q1': (0.04, 120), 'M4': (0.02, 10)}
    def truth(tt):
        y = np.zeros_like(tt)
        for n, (H, g) in tru.items():
            X, f = vfu(n, tt); y += f * H * np.cos(X - g * D2R)
        return y
    F = fit(t, truth(t) + rng.normal(0, 0.03, t.size))
    tf = np.arange(t[-1], t[-1] + 3 * 86400, 360.0)
    e = float(np.sqrt(np.mean((pred(F, tf) - truth(tf)) ** 2)))
    print('selftest: 3 gün ileri RMSE %.1f cm (aralık %.0f cm); M2 %.3f/%.0f° S2 %.3f/%.0f° K1 %.3f/%.0f°' % (e * 100, np.ptp(truth(tf)) * 100,
          F['C']['M2']['amp'], F['C']['M2']['g'], F['C']['S2']['amp'], F['C']['S2']['g'], F['C']['K1']['amp'], F['C']['K1']['g']))
    return e


def extrema(t, v):
    out = []
    for i in range(1, len(v) - 1):
        if v[i] > v[i - 1] and v[i] >= v[i + 1]:
            out.append((t[i], 'H'))
        elif v[i] < v[i - 1] and v[i] <= v[i + 1]:
            out.append((t[i], 'L'))
    return out


def noaa_pred(sid, d0, d1):
    u = ('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=alyssa_wf&begin_date=%s&end_date=%s'
         '&datum=MSL&station=%s&time_zone=gmt&units=metric&interval=6&format=json') % (d0.strftime('%Y%m%d'), d1.strftime('%Y%m%d'), sid)
    j = get(u)
    p = j.get('predictions') or []
    t = np.array([dt.datetime.strptime(x['t'], '%Y-%m-%d %H:%M').replace(tzinfo=dt.timezone.utc).timestamp() for x in p])
    v = np.array([float(x['v']) for x in p])
    return t, v


# ---- ABD: NOAA CO-OPS resmî gelgit tahmini (uygulama NOAA'ya doğrudan erişemediği için hat indirir); 30 km içindeki konumda bu gösterilir
# İstasyon kimlikleri: doğrulama istasyonları + balıkçılığın yoğun olduğu kıyılar (ChatGPT 2B listesi gelince genişler). Ad ve konum NOAA'nın kendi
# istasyon kaydından (mdapi) alınır.
NOAA_IDS = ['8724580', '8771450', '9414290', '8443970', '8638610', '8723214', '8722670', '8721604', '8720030', '8725110', '8726724', '8726520', '8729840', '8735180', '8761724', '8775870', '8651370', '8658163', '8665530', '8670870', '8534720', '8518750', '8452660', '8410140', '8574680', '9410170', '9410660', '9447130', '8725520', '8720218', '8775237', '8779770', '8764227', '8768094', '8656483', '8661070', '8575512', '8577330', '8454000', '8418150', '9410230', '9443090', '9439040']   # + ChatGPT 2B listesi (9 Kasım)


def noaa_meta(sid):
    j = get('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/%s.json' % sid)
    s = (j.get('stations') or [{}])[0]
    return {'id': sid, 'n': s.get('name') or sid, 'state': s.get('state') or '', 'lat': round(float(s['lat']), 5), 'lon': round(float(s['lng']), 5)}


def noaa_get(sid, d0, d1, interval):
    u = ('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=alyssa_wf&begin_date=%s&end_date=%s'
         '&datum=MSL&station=%s&time_zone=gmt&units=metric&interval=%s&format=json') % (d0.strftime('%Y%m%d'), d1.strftime('%Y%m%d'), sid, interval)
    return get(u).get('predictions') or []


def ts(x):
    return dt.datetime.strptime(x, '%Y-%m-%d %H:%M').replace(tzinfo=dt.timezone.utc).timestamp()


def noaa_pack(meta, hourly, hilo):
    t = [ts(x['t']) for x in hourly]; v = [round(float(x['v']) * 1000) for x in hourly]
    if len(t) < 48 or any(abs(b - a - 3600) > 1 for a, b in zip(t, t[1:])):
        raise ValueError('saatlik seri eksik')
    hl = [[int(ts(x['t']) * 1000), 'H' if x.get('type', '').upper().startswith('H') else 'L', round(float(x['v']) * 1000)] for x in hilo]
    return dict(meta, t0=int(t[0] * 1000), v=v, hl=hl)


def noaa_export(out, now):
    d0 = (now - dt.timedelta(days=1)).date(); d1 = d0 + dt.timedelta(days=18)
    st, bad = [], []
    for sid in NOAA_IDS:
        try:
            st.append(noaa_pack(noaa_meta(sid), noaa_get(sid, d0, d1, 'h'), noaa_get(sid, d0, d1, 'hilo')))
        except Exception as e:
            bad.append(sid); print('::warning title=NOAA %s::%s' % (sid, repr(e)[:160]))
    (out / 'noaa.json').write_text(json.dumps({'gen': now.strftime('%Y-%m-%dT%H:%MZ'), 'datum': 'MSL', 'st': st}, ensure_ascii=False, separators=(',', ':')))
    print('::notice title=NOAA gelgit tahmini::%d istasyon yazıldı (%d hata) · %s – %s' % (len(st), len(bad), d0, d1))


def noaa_selftest():
    h = [{'t': (dt.datetime(2026, 11, 9) + dt.timedelta(hours=i)).strftime('%Y-%m-%d %H:%M'), 'v': '%.3f' % (0.5 * math.cos(i * 0.5))} for i in range(60)]
    p = noaa_pack({'id': 'x', 'n': 'x', 'state': '', 'lat': 1, 'lon': 2}, h, [{'t': '2026-11-09 06:12', 'v': '0.501', 'type': 'H'}, {'t': '2026-11-09 12:30', 'v': '-0.4', 'type': 'L'}])
    assert p['v'][0] == 500 and p['hl'][0][1] == 'H' and p['hl'][1][2] == -400 and len(p['v']) == 60
    print('noaa selftest ok')


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--out', default='_new/deniz/v1'); ap.add_argument('--selftest', action='store_true'); a = ap.parse_args()
    if a.selftest:
        noaa_selftest()
        return 0 if selftest() < 0.02 else 1
    res = []
    now = dt.datetime.now(dt.timezone.utc)
    for s in ST:
        r = {'k': s['k'], 'n': s['n']}
        try:
            t, v, cell = om_series(s['lat'], s['lon'])
            if t is None:
                r['err'] = 'deniz hücresi bulunamadı'; res.append(r); print('::warning title=Gelgit %s::deniz hücresi bulunamadı' % s['n']); continue
            F = fit(t, v); r['cell'] = cell; r['days'] = round(F['days'], 1); r['model'] = {n: round(c['amp'] * 100, 2) for n, c in F['C'].items()}
            if 'amp' in s:
                r['ist'] = s['amp']
                r['fark'] = {n: round(r['model'].get(n, float('nan')) - s['amp'][n], 2) for n in s['amp'] if n in r['model']}
                msg = ' · '.join('%s model %.1f / istasyon %.1f cm' % (n, r['model'][n], s['amp'][n]) for n in ('M2', 'S2', 'K1', 'O1') if n in r['model'])
                if s.get('g'):   # v0.41.0 (ChatGPT 2C): Greenwich faz gecikmesi (derece); fark -180..180, M2'de 30° ≈ 1 saat
                    r['faz_fark'] = {n: round(((F['C'][n]['g'] - s['g'][n] + 180) % 360) - 180, 1) for n in s['g'] if n in F['C']}
                    msg += ' · faz farkı ' + ', '.join('%s %+.0f°' % (n, d) for n, d in r['faz_fark'].items())
            else:
                d0 = now.date(); d1 = d0 + dt.timedelta(days=3)
                tn, vn = noaa_pred(s['k'], d0, d1)
                vm = pred(F, tn)
                vm = vm - vm.mean() + vn.mean()                     # aynı ortalamaya (MSL) getir
                rmse = float(np.sqrt(np.mean((vm - vn) ** 2)))
                rng = float(vn.max() - vn.min())
                en, em = extrema(tn, vn), extrema(tn, vm)
                dts = []
                for tt, k in en:
                    c = [x for x in em if x[1] == k]
                    if c:
                        dts.append(min(abs(tt - x[0]) for x in c) / 60)
                r.update({'rmse_cm': round(rmse * 100, 1), 'aralik_cm': round(rng * 100, 1), 'olay_dk': round(float(np.median(dts)), 0) if dts else None})
                msg = 'RMSE %.1f cm (gelgit aralığı %.0f cm) · yüksek/alçak su saat farkı ortanca %s dk · %s gün veri' % (r['rmse_cm'], r['aralik_cm'], r['olay_dk'], r['days'])
            print('::notice title=Gelgit %s::%s' % (s['n'], msg))
        except Exception as e:
            r['err'] = repr(e)[:200]; print('::warning title=Gelgit %s::%s' % (s['n'], r['err']))
        res.append(r)
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    try:
        noaa_export(out, now)
    except Exception as e:
        print('::warning title=NOAA gelgit tahmini::%s' % repr(e)[:200])
    (out / 'gelgit_dogrulama.json').write_text(json.dumps({'gen': now.strftime('%Y-%m-%dT%H:%MZ'), 'st': res}, ensure_ascii=False, separators=(',', ':')))
    return 0


if __name__ == '__main__':
    sys.exit(main())
