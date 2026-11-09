#!/usr/bin/env python3
"""Alyssa deniz veri hattı (v1).

GitHub Actions'ta birkaç saatte bir çalışır; Copernicus Marine modellerinden bölge kutularını okur ve uygulamanın
tek bir dosyayla okuyabileceği küçük döşemelere (0,5° x 0,5°) yazar:
  temp : türlerin derinliğindeki su sıcaklığı (günlük, 1–100 m arası seviyeler)
  cur  : derinlikteki akıntı (u, v; 3 saatte bir; 1, 10, 30, 50 m)
  zos  : deniz yüzeyi yüksekliği (saatlik; gelgit motorunu sınamak için)
  bati : derinlik ve eğim (EMODnet; bir kez hesaplanır, önbellekte tutulur)
  fr   : yüzey sıcaklık cephesi (günlük; °C/km, sıcaklığın yatay eğimi, Belkin–O'Reilly benzeri yumuşatma) (v0.39.7)
  chl  : yüzey klorofili (günlük; mg/m³, BGC modeli; kendi ızgarasında, log10 ile saklanır) (v0.39.7)
  v0.39.8 (ChatGPT 3B): uydu L4 (bulutsuz) son gün: chl (uydu klorofili, varsa modelin yerine), frs (uydu SST cephesi °C/km),
         frc (klorofil cephesi, log10(mg/m³)/km). Belkin–O'Reilly: 3x3 medyan süzgeç + merkezî fark. Hepsi kendi ızgarasında.

Kimlik bilgileri yalnız ortam değişkenlerinden gelir (GitHub Secrets):
  COPERNICUSMARINE_SERVICE_USERNAME, COPERNICUSMARINE_SERVICE_PASSWORD
Kullanım:
  python3 hatti/deniz.py --out _site/deniz/v1            # tüm açık bölgeler
  python3 hatti/deniz.py --out out --only ege --no-bati  # tek bölge, derinliksiz
  python3 hatti/deniz.py --selftest                      # ağsız deneme (sentetik veri)
Veri kaynakları atıf: "Generated using E.U. Copernicus Marine Service Information" ve EMODnet Bathymetry Consortium.
"""
import argparse, base64, datetime as dt, json, math, os, sys, time
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
NA = -32768
T_LEVELS = [1, 10, 20, 30, 50, 75, 100]       # m: sıcaklık profili
C_LEVELS = [1, 10, 30, 50]                    # m: akıntı profili
B_RES = 1 / 240                               # derinlik döşemesi çözünürlüğü (~460 m)


def log(*a):
    print(time.strftime('%H:%M:%S'), *a, flush=True)


def b64i16(arr, scale):
    a = np.asarray(arr, dtype='float64') / scale
    a = np.where(np.isfinite(a), np.clip(np.round(a), -32767, 32767), NA).astype('<i2')
    return base64.b64encode(a.tobytes()).decode('ascii')


def tile_keys(bbox, ts):
    lo0, la0, lo1, la1 = bbox
    out = []
    la = math.floor(la0 / ts) * ts
    while la < la1 - 1e-9:
        lo = math.floor(lo0 / ts) * ts
        while lo < lo1 - 1e-9:
            out.append((round(la, 4), round(lo, 4)))
            lo += ts
        la += ts
    return out


def tkey(la, lo):
    return ('%+.2f' % la).replace('+', 'n').replace('-', 's') + '_' + ('%+.2f' % lo).replace('+', 'e').replace('-', 'w')


def nearest_levels(depths, want):
    depths = np.asarray(depths, dtype=float)
    idx, got = [], []
    for w in want:
        i = int(np.argmin(np.abs(depths - w)))
        if i not in idx and abs(depths[i] - w) <= max(3.0, 0.35 * w):
            idx.append(i); got.append(round(float(depths[i]), 1))
    return idx, got


# ---------------------------------------------------------------- Copernicus: ürünün veri setlerini bul
def pick_datasets(product_id, want='phy'):
    import copernicusmarine as cm
    cat = cm.describe(product_id=product_id, disable_progress_bar=True)
    found = {}
    for p in cat.products:
        for d in p.datasets:
            did = d.dataset_id
            vars_ = set()
            for v in d.versions[-1:]:
                for part in v.parts:
                    for s in part.services:
                        for var in s.variables:
                            vars_.add(var.short_name)
            found[did] = vars_
    log('veri setleri:', ', '.join(sorted(found)))

    def best(var, prefs):
        cands = [d for d, vs in found.items() if var in vs and 'detided' not in d]
        for pat in prefs:
            for d in cands:
                if all(x in d for x in pat):
                    return d
        return cands[0] if cands else None
    if want == 'bgc':
        return {'chl': best('chl', [('pft', 'P1D'), ('P1D',)])}
    return {
        'temp': best('thetao', [('P1D',), ('PT1H',)]),
        'cur': best('uo', [('3D', 'PT1H'), ('PT6H',), ('PT1H',), ('P1D',)]),   # MED: 3B saatlik · GLO: 3B 6 saatlik
        'zos': best('zos', [('ssh', '2D_PT1H'), ('PT1H',), ('PT15M',)]),   # 'detided' (gelgitsiz) seçilmez
    }


def open_sub(dsid, variables, bbox, t0, t1, zmax=None):
    import copernicusmarine as cm
    kw = dict(dataset_id=dsid, variables=variables, minimum_longitude=bbox[0], maximum_longitude=bbox[2],
              minimum_latitude=bbox[1], maximum_latitude=bbox[3], start_datetime=t0, end_datetime=t1,
              coordinates_selection_method='outside')
    if zmax is not None:
        kw.update(minimum_depth=0, maximum_depth=zmax)
    return cm.open_dataset(**kw)


# ---------------------------------------------------------------- döşemeleri yaz
def coords(ds):
    la = ds['latitude'].values if 'latitude' in ds.coords else ds['lat'].values
    lo = ds['longitude'].values if 'longitude' in ds.coords else ds['lon'].values
    return la, lo


def ms(t):
    return int(np.datetime64(t, 'ms').astype('int64'))


def front_field(sst, la, lo):
    """yüzey sıcaklığının yatay eğimi (°C/km): 3x3 ortalama ile yumuşatılır, merkezî farklarla türev alınır (kıyıda eksik hücre atlanır)"""
    a = np.array(sst, dtype=float)                      # t, y, x
    pad = np.pad(a, ((0, 0), (1, 1), (1, 1)), constant_values=np.nan)
    st = np.stack([pad[:, 1 + dy:pad.shape[1] - 1 + dy, 1 + dx:pad.shape[2] - 1 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1)])
    import warnings
    with warnings.catch_warnings(), np.errstate(all='ignore'):
        warnings.simplefilter('ignore', RuntimeWarning); sm = np.nanmean(st, axis=0)
    sm[~np.isfinite(a)] = np.nan
    dy_km = abs(float(la[1] - la[0])) * 111.2 if len(la) > 1 else 4.6
    dx_km = abs(float(lo[1] - lo[0])) * 111.2 * np.cos(np.radians(la))[None, :, None] if len(lo) > 1 else 4.6
    gy = np.full_like(sm, np.nan); gx = np.full_like(sm, np.nan)
    gy[:, 1:-1, :] = (sm[:, 2:, :] - sm[:, :-2, :]) / (2 * dy_km)
    gx[:, :, 1:-1] = (sm[:, :, 2:] - sm[:, :, :-2]) / (2 * dx_km[:, :, :] if np.ndim(dx_km) else 2 * dx_km)
    return np.hypot(gx, gy)


def grid_block(a, CLA, CLO, tt, la, lo, ts, scale):
    """kendi ızgarasında döşeme bloğu: a (t, y, x) zaten dönüştürülmüş; int16 x scale"""
    iy = np.where((CLA >= la - 1e-6) & (CLA < la + ts - 1e-6))[0]; ix = np.where((CLO >= lo - 1e-6) & (CLO < lo + ts - 1e-6))[0]
    if not len(iy) or not len(ix):
        return None
    b = a[:, iy[0]:iy[-1] + 1, ix[0]:ix[-1] + 1]
    if not np.isfinite(b).any():
        return None
    return {'lat0': round(float(CLA[iy[0]]), 5), 'lon0': round(float(CLO[ix[0]]), 5), 'dlat': round(float(CLA[1] - CLA[0]), 6), 'dlon': round(float(CLO[1] - CLO[0]), 6),
            'ny': int(b.shape[1]), 'nx': int(b.shape[2]), 't0': ms(tt[0]), 'dt': ms(tt[1]) - ms(tt[0]) if len(tt) > 1 else 86400000, 'nt': int(b.shape[0]), 's': scale, 'd': b64i16(b, scale)}


def median3(a):
    """3x3 medyan süzgeç (t, y, x), eksik hücreler atlanır"""
    import warnings
    pad = np.pad(np.asarray(a, dtype=float), ((0, 0), (1, 1), (1, 1)), constant_values=np.nan)
    st = np.stack([pad[:, 1 + dy:pad.shape[1] - 1 + dy, 1 + dx:pad.shape[2] - 1 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1)])
    with warnings.catch_warnings():
        warnings.simplefilter('ignore', RuntimeWarning); m = np.nanmedian(st, axis=0)
    m[~np.isfinite(a)] = np.nan
    return m


def grad_km(a, la, lo):
    """yatay eğim büyüklüğü (birim/km), merkezî fark; kenar ve eksik komşuda NaN"""
    dy_km = abs(float(la[1] - la[0])) * 111.2
    dx_km = abs(float(lo[1] - lo[0])) * 111.2 * np.cos(np.radians(la))[None, :, None]
    gy = np.full_like(a, np.nan); gx = np.full_like(a, np.nan)
    gy[:, 1:-1, :] = (a[:, 2:, :] - a[:, :-2, :]) / (2 * dy_km)
    gx[:, :, 1:-1] = (a[:, :, 2:] - a[:, :, :-2]) / (2 * dx_km)
    return np.hypot(gx, gy)


def sat_latest(d, var):
    """uydu L4: geçerli verisi olan son gün (t=1), alan ve zaman"""
    a = d[var].values
    a = a[:, 0] if a.ndim == 4 else a
    ok = [i for i in range(a.shape[0]) if np.isfinite(a[i]).mean() > 0.05]
    if not ok:
        return None, None
    i = ok[-1]
    return a[i:i + 1].astype(float), d['time'].values[i:i + 1]


def sat_fields(sst_ds, chl_ds):
    """uydu alanları -> {'chl': (log10, lat, lon, t), 'frs': (°C/km, ...), 'frc': (log10/km, ...)}"""
    out = {}
    if chl_ds is not None:
        a, t = sat_latest(chl_ds, 'CHL' if 'CHL' in chl_ds else 'chl')
        if a is not None:
            la, lo = coords(chl_ds)
            with np.errstate(all='ignore'):
                lg = np.log10(np.clip(a, 1e-3, 100))
            out['chl'] = (lg, la, lo, t)
            out['frc'] = (grad_km(median3(lg), la, lo), la, lo, t)
    if sst_ds is not None:
        a, t = sat_latest(sst_ds, 'analysed_sst')
        if a is not None:
            la, lo = coords(sst_ds)
            out['frs'] = (grad_km(median3(a), la, lo), la, lo, t)     # K ve °C farkı aynı
    return out


def chl_block(d, la, lo, ts):
    """klorofil döşemesi: kendi ızgarası (BGC ızgarası fizik ızgarasından farklı olabilir), log10(mg/m³) x 1000"""
    CLA, CLO = coords(d)
    iy = np.where((CLA >= la - 1e-6) & (CLA < la + ts - 1e-6))[0]; ix = np.where((CLO >= lo - 1e-6) & (CLO < lo + ts - 1e-6))[0]
    if not len(iy) or not len(ix):
        return None
    a = d['chl'].values
    a = a[:, 0] if a.ndim == 4 else a
    a = a[:, iy[0]:iy[-1] + 1, ix[0]:ix[-1] + 1]
    if not np.isfinite(a).any():
        return None
    with np.errstate(all='ignore'):
        lg = np.log10(np.clip(a, 1e-3, 100))
    t = d['time'].values
    return {'lat0': round(float(CLA[iy[0]]), 5), 'lon0': round(float(CLO[ix[0]]), 5), 'dlat': round(float(CLA[1] - CLA[0]), 6) if len(CLA) > 1 else 0.25,
            'dlon': round(float(CLO[1] - CLO[0]), 6) if len(CLO) > 1 else 0.25, 'ny': int(a.shape[1]), 'nx': int(a.shape[2]),
            't0': ms(t[0]), 'dt': ms(t[1]) - ms(t[0]) if len(t) > 1 else 86400000, 'nt': int(a.shape[0]), 's': 0.001, 'd': b64i16(lg, 0.001)}


def write_region(reg, dsets, out, bati=None, sat=None):
    """dsets: {'temp': xr.Dataset|None, 'cur': ..., 'zos': ...} zaten kutuya kesilmiş. bati: {'lat','lon','z','slope'} ya da None"""
    ts = reg.get('tile', 0.5)
    rdir = out / reg['id']; rdir.mkdir(parents=True, exist_ok=True)
    base = next((d for d in dsets.values() if d is not None), None)
    if base is None:
        raise RuntimeError('bölge için veri yok')
    LA, LO = coords(base)
    tiles = []
    FR = None
    if dsets.get('temp') is not None:
        d = dsets['temp']; FR = front_field(d['thetao'].isel(depth=0).values, *coords(d))
    for la, lo in tile_keys(reg['bbox'], ts):
        iy = np.where((LA >= la - 1e-6) & (LA < la + ts - 1e-6))[0]
        ix = np.where((LO >= lo - 1e-6) & (LO < lo + ts - 1e-6))[0]
        if not len(iy) or not len(ix):
            continue
        y0, y1, x0, x1 = iy[0], iy[-1] + 1, ix[0], ix[-1] + 1
        rec = {'v': 1, 'reg': reg['id'], 'gen': dt.datetime.now(dt.timezone.utc).replace(tzinfo=None).strftime('%Y-%m-%dT%H:%MZ'),
               'lat': [round(float(x), 5) for x in LA[y0:y1]], 'lon': [round(float(x), 5) for x in LO[x0:x1]], 'src': {}}
        wet = False
        d = dsets.get('temp')
        if d is not None:
            z = d['depth'].values; zi, zg = nearest_levels(z, T_LEVELS)
            a = d['thetao'].isel(depth=zi).values[:, :, y0:y1, x0:x1]          # t, z, y, x
            if np.isfinite(a).any():
                wet = True
                rec['temp'] = {'t0': ms(d['time'].values[0]), 'dt': ms(d['time'].values[1]) - ms(d['time'].values[0]) if d.sizes['time'] > 1 else 86400000,
                               'nt': int(a.shape[0]), 'z': zg, 's': 0.01, 'd': b64i16(a, 0.01)}
                rec['src']['temp'] = reg['_ids'].get('temp')
                f = FR[:, y0:y1, x0:x1]
                if np.isfinite(f).any():
                    rec['fr'] = {'t0': rec['temp']['t0'], 'dt': rec['temp']['dt'], 'nt': int(f.shape[0]), 's': 0.001, 'd': b64i16(f, 0.001)}
        d = dsets.get('cur')
        if d is not None:
            if 'depth' in d.dims:
                zi, zg = nearest_levels(d['depth'].values, C_LEVELS); dd = d.isel(depth=zi)
            else:
                zg, dd = [1], d.expand_dims(depth=[1.0], axis=1)
            st = 3 if d.sizes['time'] > 48 and (ms(d['time'].values[1]) - ms(d['time'].values[0])) <= 3600000 else 1
            dd = dd.isel(time=slice(0, None, st))
            u = dd['uo'].values[:, :, y0:y1, x0:x1]; v = dd['vo'].values[:, :, y0:y1, x0:x1]
            if np.isfinite(u).any():
                wet = True
                t = dd['time'].values
                rec['cur'] = {'t0': ms(t[0]), 'dt': ms(t[1]) - ms(t[0]) if len(t) > 1 else 10800000, 'nt': int(u.shape[0]), 'z': zg, 's': 0.001,
                              'u': b64i16(u, 0.001), 'v': b64i16(v, 0.001)}
                rec['src']['cur'] = reg['_ids'].get('cur')
        d = dsets.get('zos')
        if d is not None:
            a = d['zos'].values
            a = a[:, y0:y1, x0:x1] if a.ndim == 3 else a[:, 0, y0:y1, x0:x1]
            if np.isfinite(a).any():
                t = d['time'].values
                rec['zos'] = {'t0': ms(t[0]), 'dt': ms(t[1]) - ms(t[0]) if len(t) > 1 else 3600000, 'nt': int(a.shape[0]), 's': 0.001, 'd': b64i16(a, 0.001)}
                rec['src']['zos'] = reg['_ids'].get('zos')
        if dsets.get('chl') is not None:
            c = chl_block(dsets['chl'], la, lo, ts)
            if c:
                rec['chl'] = c; rec['src']['chl'] = reg['_ids'].get('chl')
        for k, (a, CLA, CLO, tt) in (sat or {}).items():
            b = grid_block(a, CLA, CLO, tt, la, lo, ts, 0.001)
            if b:
                b['sat'] = 1
                if k == 'chl':
                    rec['chl'] = b; rec['src']['chl'] = reg.get('sat_chl')
                else:
                    rec[k] = b; rec['src'][k] = reg.get('sat_sst') if k == 'frs' else reg.get('sat_chl')
        if bati is not None:
            by = np.where((bati['lat'] >= la - 1e-6) & (bati['lat'] < la + ts - 1e-6))[0]
            bx = np.where((bati['lon'] >= lo - 1e-6) & (bati['lon'] < lo + ts - 1e-6))[0]
            if len(by) and len(bx):
                zz = bati['z'][by[0]:by[-1] + 1, bx[0]:bx[-1] + 1]
                if np.isfinite(zz).any():
                    rec['bati'] = {'lat0': round(float(bati['lat'][by[0]]), 5), 'lon0': round(float(bati['lon'][bx[0]]), 5), 'd': B_RES,
                                   'ny': int(zz.shape[0]), 'nx': int(zz.shape[1]), 'z': b64i16(zz, 1),
                                   'sl': b64i16(bati['slope'][by[0]:by[-1] + 1, bx[0]:bx[-1] + 1], 0.1), 'src': 'EMODnet DTM'}
        if not wet and 'bati' not in rec:
            continue
        k = tkey(la, lo)
        (rdir / (k + '.json')).write_text(json.dumps(rec, separators=(',', ':')))
        tiles.append(k)
    return tiles


# ---------------------------------------------------------------- derinlik (EMODnet WCS) ve eğim
def bathy_emodnet(bbox, cache):
    """EMODnet DTM ortalama derinliğini ~1/240° ızgarada döndürür (deniz: pozitif metre). Önbellek dosyası varsa onu okur."""
    f = cache / ('bati_%s.npz' % '_'.join('%.2f' % x for x in bbox))
    if f.exists():
        z = np.load(f); return {'lat': z['lat'], 'lon': z['lon'], 'z': z['z'], 'slope': z['slope']}
    import io, urllib.request
    import rasterio
    lo0, la0, lo1, la1 = bbox
    url = ('https://ows.emodnet-bathymetry.eu/wcs?service=wcs&version=1.0.0&request=getcoverage&coverage=emodnet:mean&crs=EPSG:4326'
           '&BBOX=%f,%f,%f,%f&format=image/tiff&resx=%f&resy=%f' % (lo0, la0, lo1, la1, B_RES, B_RES))
    log('EMODnet indiriliyor', url)
    with urllib.request.urlopen(url, timeout=300) as r:
        data = r.read()
    with rasterio.open(io.BytesIO(data)) as src:
        a = src.read(1).astype('float64'); nod = src.nodata
        tr = src.transform
    if nod is not None:
        a[a == nod] = np.nan
    a = np.where(a < 0, -a, np.nan)                 # deniz: pozitif derinlik, kara: boş
    a = a[::-1]                                     # güneyden kuzeye
    ny, nx = a.shape
    lat = la0 + (np.arange(ny) + 0.5) * B_RES; lon = lo0 + (np.arange(nx) + 0.5) * B_RES
    # eğim (derece): merkezi farklar, hücre boyu metre
    dy = B_RES * 111320.0; dx = B_RES * 111320.0 * np.cos(np.radians(lat))[:, None]
    gz = np.gradient(np.nan_to_num(a, nan=0.0))
    slope = np.degrees(np.arctan(np.hypot(gz[0] / dy, gz[1] / dx)))
    slope[~np.isfinite(a)] = np.nan
    cache.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(f, lat=lat, lon=lon, z=a, slope=slope)
    return {'lat': lat, 'lon': lon, 'z': a, 'slope': slope}


# ---------------------------------------------------------------- ana akış
def run(args):
    regs = json.loads((HERE / 'bolgeler.json').read_text())
    out = Path(args.out); out.mkdir(parents=True, exist_ok=True)
    now = dt.datetime.now(dt.timezone.utc).replace(tzinfo=None).replace(minute=0, second=0, microsecond=0)
    t0 = (now - dt.timedelta(days=1)).strftime('%Y-%m-%dT%H:%M:%S'); t1 = (now + dt.timedelta(days=args.days)).strftime('%Y-%m-%dT%H:%M:%S')
    index = {'v': 1, 'gen': now.strftime('%Y-%m-%dT%H:%MZ'), 'attr': 'E.U. Copernicus Marine Service Information; EMODnet Bathymetry', 'v_fr': 1, 'v_chl': 1, 'regions': []}
    for reg in regs:
        if not reg.get('on', True) or (args.only and reg['id'] not in args.only.split(',')):
            continue
        log('bölge', reg['id'], reg['bbox'])
        try:
            ids = pick_datasets(reg['phy']); reg['_ids'] = ids; log('seçilen', ids)
            pad = 0.05; bb = [reg['bbox'][0] - pad, reg['bbox'][1] - pad, reg['bbox'][2] + pad, reg['bbox'][3] + pad]
            dsets = {}
            dsets['temp'] = open_sub(ids['temp'], ['thetao'], bb, t0, t1, 110) if ids.get('temp') else None
            dsets['cur'] = open_sub(ids['cur'], ['uo', 'vo'], bb, t0, t1, 55) if ids.get('cur') else None
            dsets['zos'] = open_sub(ids['zos'], ['zos'], bb, t0, t1) if ids.get('zos') else None
            dsets['chl'] = None
            if reg.get('bgc'):
                try:
                    bi = pick_datasets(reg['bgc'], 'bgc'); ids.update(bi); log('klorofil', bi)
                    if bi.get('chl'):
                        dsets['chl'] = open_sub(bi['chl'], ['chl'], bb, t0, t1, 2)
                except Exception as e:
                    log('klorofil alınamadı:', e); print('::warning title=Klorofil %s::%s' % (reg['id'], repr(e)[:300]), flush=True)
            for k, d in dsets.items():
                if d is not None:
                    dsets[k] = d.load()
                    log(k, dict(d.sizes))
            sat = {}
            if reg.get('sat_chl') or reg.get('sat_sst'):
                ts0 = (now - dt.timedelta(days=5)).strftime('%Y-%m-%dT%H:%M:%S'); ts1 = now.strftime('%Y-%m-%dT%H:%M:%S')
                sd = {}
                for key, var in (('sat_chl', ['CHL']), ('sat_sst', ['analysed_sst'])):
                    if not reg.get(key):
                        continue
                    try:
                        sd[key] = open_sub(reg[key], var, bb, ts0, ts1).load(); log(key, dict(sd[key].sizes))
                    except Exception as e:
                        log(key, 'alınamadı:', e); print('::warning title=Uydu %s %s::%s' % (reg['id'], key, repr(e)[:300]), flush=True)
                try:
                    sat = sat_fields(sd.get('sat_sst'), sd.get('sat_chl'))
                except Exception as e:
                    print('::warning title=Uydu cephe %s::%s' % (reg['id'], repr(e)[:300]), flush=True)
                for k, v in sat.items():
                    g = v[0][np.isfinite(v[0])]
                    print('::notice title=Uydu %s %s::%s · %s hücre · P90 %.3f' % (reg['id'], k, str(v[3][0])[:10], g.size, float(np.percentile(g, 90)) if g.size else float('nan')), flush=True)
            bati = None
            if reg.get('bati') == 'emodnet' and not args.no_bati:
                try:
                    bati = bathy_emodnet(reg['bbox'], Path(args.cache))
                except Exception as e:
                    log('derinlik alınamadı:', e); print('::warning title=Derinlik %s::%s' % (reg['id'], repr(e)[:300]), flush=True)
            tiles = write_region(reg, dsets, out, bati, sat)
            index['regions'].append({'id': reg['id'], 'bbox': reg['bbox'], 'tile': reg.get('tile', 0.5), 'tiles': tiles, 'src': ids, 'bati': bool(bati), 'zos_tide': 'MEDSEA' in reg['phy']})
            log(reg['id'], len(tiles), 'döşeme')
            info = ' · '.join('%s=%s %s' % (k, ids.get(k), dict(d.sizes) if d is not None else '-') for k, d in dsets.items())
            print('::notice title=Deniz %s::%d döşeme · %s · derinlik %s' % (reg['id'], len(tiles), info, 'var' if bati else 'yok'), flush=True)
        except Exception as e:
            log('HATA', reg['id'], repr(e))
            print('::warning title=Deniz %s::%s' % (reg['id'], repr(e)[:300]), flush=True)
    (out / 'index.json').write_text(json.dumps(index, separators=(',', ':')))
    log('bitti', sum(len(r['tiles']) for r in index['regions']), 'döşeme')
    return 0 if index['regions'] else 1


def selftest():
    """Ağsız deneme: sentetik veriyle döşeme yazıp geri okur."""
    import tempfile, xarray as xr
    lat = np.arange(37.80, 38.80, 1 / 24); lon = np.arange(26.00, 27.00, 1 / 24)
    tt = np.array([np.datetime64('2026-11-09T00:00') + np.timedelta64(24 * i, 'h') for i in range(3)])
    th = np.array([np.datetime64('2026-11-09T00:00') + np.timedelta64(i, 'h') for i in range(72)])
    dep = np.array([1.0, 10.5, 20.1, 29.9, 51.0, 76.0, 101.0])
    temp = xr.Dataset({'thetao': (('time', 'depth', 'latitude', 'longitude'), 20 - dep[None, :, None, None] * 0.05 + np.zeros((3, 7, len(lat), len(lon))))},
                      coords={'time': tt, 'depth': dep, 'latitude': lat, 'longitude': lon})
    temp['thetao'][:, :, :3, :3] = np.nan
    cur = xr.Dataset({'uo': (('time', 'depth', 'latitude', 'longitude'), np.full((72, 7, len(lat), len(lon)), 0.12)),
                      'vo': (('time', 'depth', 'latitude', 'longitude'), np.full((72, 7, len(lat), len(lon)), -0.05))},
                     coords={'time': th, 'depth': dep, 'latitude': lat, 'longitude': lon})
    zos = xr.Dataset({'zos': (('time', 'latitude', 'longitude'), 0.1 * np.sin(np.arange(72) / 12.42 * 2 * np.pi)[:, None, None] + np.zeros((72, len(lat), len(lon))))},
                     coords={'time': th, 'latitude': lat, 'longitude': lon})
    # cephe: 26.5° doğusu 1 °C daha sıcak (keskin sınır)
    temp['thetao'][:, 0, :, lon >= 26.5] += 1.0
    clat = np.arange(37.75, 38.85, 0.25); clon = np.arange(26.0, 27.1, 0.25)
    chl = xr.Dataset({'chl': (('time', 'depth', 'latitude', 'longitude'), np.full((3, 1, len(clat), len(clon)), 0.2))},
                     coords={'time': tt, 'depth': [0.5], 'latitude': clat, 'longitude': clon})
    reg = {'id': 'test', 'bbox': [26.0, 37.8, 27.0, 38.8], 'tile': 0.5, '_ids': {'temp': 'T', 'cur': 'C', 'zos': 'Z', 'chl': 'B'}}
    with tempfile.TemporaryDirectory() as d:
        slat = np.arange(37.80, 38.80, 0.01); slon = np.arange(26.0, 27.0, 0.01)
        sst = xr.Dataset({'analysed_sst': (('time', 'latitude', 'longitude'), 293.0 + np.where(slon[None, None, :] >= 26.7, 0.5, 0.0) + np.zeros((3, len(slat), len(slon))))},
                         coords={'time': tt, 'latitude': slat, 'longitude': slon})
        sat = sat_fields(sst, None)
        tiles = write_region(reg, {'temp': temp, 'cur': cur, 'zos': zos, 'chl': chl}, Path(d), None, sat)
        f = json.loads((Path(d) / 'test' / (tiles[0] + '.json')).read_text())
        a = np.frombuffer(base64.b64decode(f['temp']['d']), '<i2').reshape(f['temp']['nt'], len(f['temp']['z']), len(f['lat']), len(f['lon']))
        assert a[0, 0, 0, 0] == NA and abs(a[0, 0, -1, -1] * 0.01 - 19.95) < 0.02, a[0, 0, -1, -1]
        assert f['cur']['nt'] == 24 and f['cur']['z'] == [1.0, 10.5, 29.9, 51.0], f['cur']['z']
        g = json.loads((Path(d) / 'test' / (tkey(38.0, 26.5) + '.json')).read_text())
        fr = np.frombuffer(base64.b64decode(g['fr']['d']), '<i2').reshape(g['fr']['nt'], len(g['lat']), len(g['lon']))
        assert fr[0, 5, 0] * 0.001 > 0.05 and fr[0, 5, 6] * 0.001 < 0.01, (fr[0, 5, :8])
        cl = np.frombuffer(base64.b64decode(g['chl']['d']), '<i2')
        assert abs(10 ** (cl[0] * 0.001) - 0.2) < 0.01 and g['chl']['nt'] == 3, cl[:3]
        frs = np.frombuffer(base64.b64decode(g['frs']['d']), '<i2').reshape(g['frs']['ny'], g['frs']['nx'])
        assert g['frs']['nt'] == 1 and frs.max() * 0.001 > 0.15, frs.max()
        print('uydu cephe en yüksek %.3f °C/km' % (frs.max() * 0.001))
        print('cephe en yüksek %.3f °C/km · klorofil %.2f mg/m³' % (fr[0].max() * 0.001, 10 ** (cl[0] * 0.001)))
        print('selftest ok:', tiles, 'temp z', f['temp']['z'], 'boyut', sum((Path(d) / 'test' / (t + '.json')).stat().st_size for t in tiles), 'bayt')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default='_site/deniz/v1')
    ap.add_argument('--only', default='')
    ap.add_argument('--days', type=int, default=5)
    ap.add_argument('--cache', default='.cache/deniz')
    ap.add_argument('--no-bati', action='store_true')
    ap.add_argument('--selftest', action='store_true')
    a = ap.parse_args()
    if a.selftest:
        selftest(); sys.exit(0)
    sys.exit(run(a))
