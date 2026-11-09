#!/usr/bin/env python3
"""TICON-4 (SEANOE, doi 10.17882/109129, CC BY 4.0) gelgit harmonik sabitlerinden Türkiye ve Akdeniz istasyonlarını çıkarır.

Uygulama, NOAA istasyonu olmayan yerde 40 km içindeki resmî ölçüm istasyonunun sabitlerinden gelgit hesaplar (modelden ayrıştırma yerine).
Çıktı: <out>/ticon.json = {gen, src, st: [{id, n, lat, lon, C: {M2: [genlik_m, faz_derece], ...}}]}
Faz: Greenwich gecikmesi g; bileşen f·A·cos(V + u − g) (uygulamadaki 31t-gelgit.js ile aynı tanım).
Ham dosya ~45 MB; Actions önbelleğinde (hatti/_cache) tutulur.
"""
import argparse, csv, io, json, math, sys, urllib.request
from pathlib import Path

URL = 'https://www.seanoe.org/data/00980/109129/data/122848.csv'
BOX = (30.0, 47.0, -6.0, 42.5)   # Akdeniz, Ege, Marmara, Karadeniz
WANT = ('M2', 'S2', 'N2', 'K1', 'O1', 'Q1', 'M4')


def col(h, *keys):
    for k in keys:
        for c in h:
            if c.strip().lower() == k:
                return c
    for k in keys:
        for c in h:
            if k in c.strip().lower():
                return c
    return None


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--out', default='_new/deniz/v1'); ap.add_argument('--cache', default='hatti/_cache'); a = ap.parse_args()
    cache = Path(a.cache); cache.mkdir(parents=True, exist_ok=True); f = cache / 'ticon4.csv'
    if not f.exists() or f.stat().st_size < 1_000_000:
        req = urllib.request.Request(URL, headers={'User-Agent': 'alyssa-deniz'})
        with urllib.request.urlopen(req, timeout=600) as r:
            f.write_bytes(r.read())
    txt = f.read_text(encoding='utf-8', errors='replace')
    rd = csv.DictReader(io.StringIO(txt)); h = rd.fieldnames or []
    cN, cLa, cLo, cC = col(h, 'tide_gauge_name', 'name'), col(h, 'lat', 'latitude'), col(h, 'lon', 'longitude'), col(h, 'con', 'constituent')
    cA, cP = col(h, 'amp', 'amplitude'), col(h, 'pha', 'phase')
    print('::notice title=TICON-4 sütunlar::%s · kullanılan: ad=%s enlem=%s boylam=%s bileşen=%s genlik=%s faz=%s' % (', '.join(h)[:400], cN, cLa, cLo, cC, cA, cP))
    st = {}
    for x in rd:
        try:
            la, lo = float(x[cLa]), float(x[cLo]); lo = lo - 360 if lo > 180 else lo
        except (TypeError, ValueError):
            continue
        if not (BOX[0] <= la <= BOX[1] and BOX[2] <= lo <= BOX[3]):
            continue
        n = (x[cC] or '').strip().upper()
        if n not in WANT:
            continue
        k = '%s|%.4f|%.4f' % (x[cN], la, lo)
        s = st.setdefault(k, {'n': (x[cN] or '').strip(), 'lat': round(la, 5), 'lon': round(lo, 5), 'C': {}})
        try:
            s['C'][n] = [float(x[cA]), float(x[cP]) % 360]
        except (TypeError, ValueError):
            pass
    out = [s for s in st.values() if 'M2' in s['C'] and 'K1' in s['C']]
    # birim: TICON genliği cm (kılavuz); Akdeniz M2 genliği 1–40 cm aralığında beklenir. Metreye çevir, şüpheli durumda uyar
    m2 = sorted(s['C']['M2'][0] for s in out)
    med = m2[len(m2) // 2] if m2 else 0
    k = 0.01 if med > 0.5 else 1.0
    if not (0.5 < med < 60):
        print('::warning title=TICON-4 birim::M2 genlik ortancası %s; birim doğrulanamadı' % med)
    for i, s in enumerate(out):
        s['id'] = 'ticon-%d' % i
        s['C'] = {n: [round(v[0] * k, 4), round(v[1], 1)] for n, v in s['C'].items()}
    tr = [s for s in out if 35.5 <= s['lat'] <= 42.5 and 25.5 <= s['lon'] <= 42]
    o = Path(a.out); o.mkdir(parents=True, exist_ok=True)
    (o / 'ticon.json').write_text(json.dumps({'src': 'TICON-4 (SEANOE doi 10.17882/109129, CC BY 4.0)', 'unit': 'm', 'st': out}, ensure_ascii=False, separators=(',', ':')))
    print('::notice title=TICON-4::%d Akdeniz/Karadeniz istasyonu (Türkiye kıyısı %d) · M2 genlik ortancası %.3f (ham) · %s' % (
        len(out), len(tr), med, ' | '.join('%s M2 %.1f cm %.0f°' % (s['n'], s['C']['M2'][0] * 100, s['C']['M2'][1]) for s in tr[:8])))
    return 0


if __name__ == '__main__':
    sys.exit(main())
