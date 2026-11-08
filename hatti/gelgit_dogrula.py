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
    {'k': 'tudes-mentes', 'n': 'Menteş (İzmir)', 'lat': 38.42961, 'lon': 26.72215, 'amp': {'M2': 5.8664, 'S2': 4.0355, 'K1': 2.4448, 'O1': 1.2305}},
    {'k': 'tudes-bodrum-ii', 'n': 'Bodrum-II', 'lat': 37.03218, 'lon': 27.42346, 'amp': {'M2': 4.067, 'S2': 2.6577, 'K1': 1.9855, 'O1': 0.9704}},
    {'k': 'tudes-antalya-ii', 'n': 'Antalya-II', 'lat': 36.83042, 'lon': 30.60868, 'amp': {'M2': 7.1584, 'S2': 4.2613, 'K1': 1.9862, 'O1': 1.1225}},
    {'k': 'tudes-erdek', 'n': 'Erdek', 'lat': 40.38988, 'lon': 27.84518, 'amp': {'M2': 0.4855, 'S2': 0.29, 'K1': 1.168, 'O1': 0.7906}},
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


def fit(t, v):
    days = (t[-1] - t[0]) / 86400
    cs = [(n, w * math.pi / 180) for n, w, d in C if days >= d]
    h = (t - T0) / 3600
    cols = [np.ones_like(h)]
    for _, w in cs:
        cols += [np.cos(w * h), np.sin(w * h)]
    A = np.vstack(cols).T
    x, *_ = np.linalg.lstsq(A, v, rcond=None)
    comp = {n: {'a': x[1 + 2 * i], 'b': x[2 + 2 * i], 'w': w, 'amp': math.hypot(x[1 + 2 * i], x[2 + 2 * i])} for i, (n, w) in enumerate(cs)}
    return {'z0': x[0], 'C': comp, 'days': days}


def pred(F, t):
    h = (np.asarray(t) - T0) / 3600
    v = np.full_like(h, F['z0'], dtype=float)
    for c in F['C'].values():
        v += c['a'] * np.cos(c['w'] * h) + c['b'] * np.sin(c['w'] * h)
    return v


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


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--out', default='_new/deniz/v1'); a = ap.parse_args()
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
    (out / 'gelgit_dogrulama.json').write_text(json.dumps({'gen': now.strftime('%Y-%m-%dT%H:%MZ'), 'st': res}, ensure_ascii=False, separators=(',', ':')))
    return 0


if __name__ == '__main__':
    sys.exit(main())
