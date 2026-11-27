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
def pick_datasets(product_id, want='phy', pref=None):
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
        if pref:   # v0.57.05: bölgenin tercihi önce (Karadeniz 2,5 km; Marmara 'mrm' 500 m alt alanı)
            prefs = [tuple([pref]) + tuple(p) for p in prefs] + [(pref,)] + list(prefs)
        for pat in prefs:
            for d in cands:
                if all(x in d for x in pat):
                    return d
        return cands[0] if cands else None
    if want == 'bgc':
        return {'chl': best('chl', [('pft', 'P1D'), ('P1D',)]), 'o2': best('o2', [('bio', 'P1D'), ('P1D',)]),   # v0.56.07: çözünmüş oksijen
                'kd': best('kd490', [('optics', 'P1D'), ('P1D',)]),    # v0.57.03 (Kenny, Fish Radar kıyası): su berraklığı (ışık sönümü, 1/m)
                'zoo': best('zooc', [('plankton', 'P1D'), ('pft', 'P1D'), ('P1D',)])}   # v0.57.03: zooplankton (karbon, mmol/m³)
    return {
        'temp': best('thetao', [('P1D',), ('PT1H',)]),
        'cur': best('uo', [('3D', 'PT1H'), ('PT6H',), ('PT1H',), ('P1D',)]),   # MED: 3B saatlik · GLO: 3B 6 saatlik
        'zos': best('zos', [('ssh', '2D_PT1H'), ('PT1H',), ('PT15M',)]),   # 'detided' (gelgitsiz) seçilmez
        'sal': best('so', [('P1D',), ('PT1H',)]),          # v0.56.07 (Kenny, Fish Radar kıyası): yüzey tuzluluğu
        'mld': best('mlotst', [('P1D',), ('PT1H',)]),      # v0.56.07: karışım tabakası derinliği
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
        for k, var, sc in (('sal', 'so', 0.01), ('mld', 'mlotst', 0.1), ('o2', 'o2', 0.1), ('kd', 'kd490', 0.001), ('zoo', 'zooc', 0.001)):   # v0.56.07 / v0.57.03: kendi ızgarasında günlük yüzey alanları
            d = dsets.get(k)
            if d is None:
                continue
            CLA, CLO = coords(d); a = d[var].values; a = a[:, 0] if a.ndim == 4 else a
            b = grid_block(a, CLA, CLO, d['time'].values, la, lo, ts, sc)
            if b:
                rec[k] = b; rec['src'][k] = reg['_ids'].get(k)
        if dsets.get('chl') is not None:
            c = chl_block(dsets['chl'], la, lo, ts)
            if c:
                rec['chl'] = c; rec['src']['chl'] = reg['_ids'].get('chl')
        for k, v in (sat or {}).items():
            a, CLA, CLO, tt = v[:4]
            b = grid_block(a, CLA, CLO, tt, la, lo, ts, 0.001)
            if b:
                b['sat'] = 1
                if len(v) > 4 and v[4] is not None:
                    b['p90'] = v[4]                                       # cephe eşiği için bölgenin P90 eğimi (3B: eşik = max(P90, taban))
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
                    rec['bati'] = {'lat0': round(float(bati['lat'][by[0]]), 5), 'lon0': round(float(bati['lon'][bx[0]]), 5), 'd': round(float(bati.get('res', B_RES)), 8),
                                   'ny': int(zz.shape[0]), 'nx': int(zz.shape[1]), 'z': b64i16(zz, 1),
                                   'sl': b64i16(bati['slope'][by[0]:by[-1] + 1, bx[0]:bx[-1] + 1], 0.1), 'src': bati.get('src', 'EMODnet DTM')}
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
    if bbox[2] - bbox[0] > 4.5:   # v0.57.05: geniş bölge (Karadeniz 14°) tek istekte gelmiyor; 4°'lik dilimlerle alınıp yan yana konur
        cuts = list(np.arange(bbox[0], bbox[2], 4.0)) + [bbox[2]]
        parts = [bathy_emodnet([float(a), bbox[1], float(b), bbox[3]], cache) for a, b in zip(cuts[:-1], cuts[1:])]
        ny = min(p['z'].shape[0] for p in parts)
        out = {'lat': parts[0]['lat'][:ny], 'lon': np.concatenate([p['lon'] for p in parts]),
               'z': np.hstack([p['z'][:ny] for p in parts]), 'slope': np.hstack([p['slope'][:ny] for p in parts])}
        cache.mkdir(parents=True, exist_ok=True); np.savez_compressed(f, **out); mark_new(cache)
        return out
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
    np.savez_compressed(f, lat=lat, lon=lon, z=a, slope=slope); mark_new(cache)
    return {'lat': lat, 'lon': lon, 'z': a, 'slope': slope}



# v0.54.18 (Kenny, Fish Radar kıyası): ince derinlik döşemeleri. EMODnet DTM'nin kendi çözünürlüğü (1/16 açı dakikası = 1/960°, ~115 m),
# 0,1°'lik ikili döşemeler (96x96 int16, 0,1 m; güneyden kuzeye satır, batıdan doğuya sütun; kara = -32768). Telefon yalnızca gereken döşemeyi indirir.
BF_RES = 1 / 960
BF_TS = 0.1


# v0.57.10 (Madde 1, ABD): EMODnet yalnız Avrupa sularını kapsar. ABD kıyısı için NOAA NCEI DEM küresel mozaiği (ArcGIS ImageServer):
# ABD kıyısında CUDEM ve Kıyı Rölyef Modeli (1/9–1 açı saniyesi, ~3–30 m), açıkta ETOPO 2022 (15 açı saniyesi). Aynı ince döşeme biçimine
# (1/960°, 0,1°'lik 96x96 int16) çift doğrusal örnekleme ile indirilir. Raf dışı derin parçalar (bölgenin "shelf" sınırından derin) indirilmez.
NCEI_IMG = 'https://gis.ngdc.noaa.gov/arcgis/rest/services/DEM_mosaics/DEM_global_mosaic/ImageServer/exportImage'
NEW_MARK = '_yeni'   # önbelleğe yeni parça girdiyse iş akışı önbelleği kaydeder (yoksa her çalışmada yüzlerce MB yeniden yüklenmez)


def mark_new(cache):
    try:
        cache.mkdir(parents=True, exist_ok=True); (cache / NEW_MARK).write_text('1')
    except Exception:
        pass


def fine_src(reg):
    v = reg.get('bati_ince')
    return 'ncei' if v == 'ncei' else 'emodnet' if v else None


def ncei_export(bbox, nx, ny, timeout=180):
    """NCEI DEM mozaiğinden F32 GeoTIFF (yükseklik; deniz eksi). 4 deneme, artan bekleme."""
    import urllib.request, urllib.parse
    lo0, la0, lo1, la1 = bbox
    q = urllib.parse.urlencode({'bbox': '%.6f,%.6f,%.6f,%.6f' % (lo0, la0, lo1, la1), 'bboxSR': 4326, 'imageSR': 4326, 'size': '%d,%d' % (nx, ny),
                                'format': 'tiff', 'pixelType': 'F32', 'interpolation': 'RSP_BilinearInterpolation', 'f': 'image'})
    last = None
    for k in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(NCEI_IMG + '?' + q, headers={'User-Agent': 'alyssa-deniz'}), timeout=timeout) as r:
                data = r.read()
            if data[:2] not in (b'II', b'MM'):
                raise ValueError('tiff değil: %r' % data[:120])
            return data
        except Exception as e:
            last = e; time.sleep(5 * (k + 1))
    raise last


def _fit_grid(B, la0, lo0, n, res):
    z = B['z']
    if z.shape != (n, n):                       # sunucu biraz farklı ızgara verirse en yakın hücreye örnekle
        yy = np.clip(np.round((la0 + (np.arange(n) + 0.5) * res - B['lat'][0]) / (B['lat'][1] - B['lat'][0])).astype(int), 0, len(B['lat']) - 1)
        xx = np.clip(np.round((lo0 + (np.arange(n) + 0.5) * res - B['lon'][0]) / (B['lon'][1] - B['lon'][0])).astype(int), 0, len(B['lon']) - 1)
        z = z[yy][:, xx]
    return z


def bathy_fine_chunk_ncei(la0, lo0, cache, shelf=None, step=1.0):
    """1°x1° NCEI parçası; önce 48x48 kaba bakış: hiç deniz yoksa ya da hepsi raftan (shelf + 150 m) derinse indirilmez ve işaretlenir."""
    f = cache / ('bfn_%.2f_%.2f.npz' % (la0, lo0)); sk = cache / ('bfn_%.2f_%.2f.skip' % (la0, lo0))
    if f.exists():
        return np.load(f)['z']
    if sk.exists():
        return None
    bb = [lo0, la0, lo0 + step, la0 + step]
    pv = bathy_from_tif(ncei_export(bb, 48, 48, 60), step / 48)['z']
    if not np.isfinite(pv).any() or (shelf and np.nanmin(pv) > shelf + 150):
        cache.mkdir(parents=True, exist_ok=True); sk.write_text('deniz yok' if not np.isfinite(pv).any() else 'derin'); mark_new(cache)
        return None
    n = int(round(step / BF_RES))
    z = _fit_grid(bathy_from_tif(ncei_export(bb, n, n), BF_RES), la0, lo0, n, BF_RES)
    cache.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(f, z=z.astype('float32')); mark_new(cache)
    log('NCEI ince', la0, lo0, 'deniz %d%%' % round(100 * np.isfinite(z).mean()))
    return z


def tile_bitmap(keys_ll, bbox, ts=0.1):
    """Döşeme anahtarları yerine bit haritası (index.json küçük kalsın): satır güneyden kuzeye, sütun batıdan doğuya; base64"""
    LA0 = math.floor(bbox[1] / ts + 1e-9) * ts; LO0 = math.floor(bbox[0] / ts + 1e-9) * ts
    nx = int(math.ceil((bbox[2] - LO0) / ts - 1e-9)); ny = int(math.ceil((bbox[3] - LA0) / ts - 1e-9))
    bits = np.zeros(nx * ny, np.uint8)
    for la, lo in keys_ll:
        ix = int(round((lo - LO0) / ts)); iy = int(round((la - LA0) / ts))
        if 0 <= ix < nx and 0 <= iy < ny:
            bits[iy * nx + ix] = 1
    return {'la0': round(LA0, 4), 'lo0': round(LO0, 4), 'nx': nx, 'ny': ny, 'b': base64.b64encode(np.packbits(bits, bitorder='little').tobytes()).decode('ascii')}


def bathy_fine_chunk(la0, lo0, cache, step=1.0):
    """1°x1° parça (960x960): EMODnet WCS'den yükseklik, deniz pozitif derinlik (m), kara NaN. Önbellekte tutulur (derinlik değişmez)."""
    f = cache / ('bf_%.2f_%.2f.npz' % (la0, lo0))
    if f.exists():
        return np.load(f)['z']
    import urllib.request
    url = ('https://ows.emodnet-bathymetry.eu/wcs?service=wcs&version=1.0.0&request=getcoverage&coverage=emodnet:mean&crs=EPSG:4326'
           '&BBOX=%f,%f,%f,%f&format=image/tiff&resx=%.10f&resy=%.10f' % (lo0, la0, lo0 + step, la0 + step, BF_RES, BF_RES))
    log('EMODnet ince', la0, lo0)
    last = None
    for k in range(4):   # v0.57.05: EMODnet 502/504 verebiliyor; 4 deneme, artan bekleme
        try:
            with urllib.request.urlopen(url, timeout=150) as r:
                data = r.read()
            break
        except Exception as e:
            last = e; time.sleep(10 * (k + 1))
    else:
        raise last
    B = bathy_from_tif(data, BF_RES)
    z = B['z']; n = int(round(step / BF_RES))
    if z.shape != (n, n):                       # sunucu biraz farklı ızgara verirse en yakın hücreye örnekle
        yy = np.clip(np.round((la0 + (np.arange(n) + 0.5) * BF_RES - B['lat'][0]) / (B['lat'][1] - B['lat'][0])).astype(int), 0, len(B['lat']) - 1)
        xx = np.clip(np.round((lo0 + (np.arange(n) + 0.5) * BF_RES - B['lon'][0]) / (B['lon'][1] - B['lon'][0])).astype(int), 0, len(B['lon']) - 1)
        z = z[yy][:, xx]
    cache.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(f, z=z.astype('float32')); mark_new(cache)
    return z


def write_fine_bathy(reg, out, cache):
    """Bölgenin ince derinlik döşemelerini out/bf/<anahtar>.bin olarak yazar; döşeme anahtarlarını döndürür.
    v0.57.10: kaynak EMODnet (Türkiye) ya da NCEI (ABD); "shelf" verilmişse bütün hücreleri ondan derin döşemeler yazılmaz (ABD kıyısı geniş, site küçük kalsın)."""
    lo0, la0, lo1, la1 = reg['bbox']
    src = fine_src(reg); shelf = reg.get('shelf')
    bdir = out / 'bf'; bdir.mkdir(parents=True, exist_ok=True)
    n = int(round(BF_TS / BF_RES)); keys = []; reg['_bf_ll'] = []
    chunks = [(float(cla), float(clo)) for cla in range(int(math.floor(la0)), int(math.ceil(la1))) for clo in range(int(math.floor(lo0)), int(math.ceil(lo1)))]
    got = {}
    if src == 'ncei':
        from concurrent.futures import ThreadPoolExecutor
        def one(c):
            try:
                return c, bathy_fine_chunk_ncei(c[0], c[1], cache, shelf), None
            except Exception as e:
                return c, None, e
        with ThreadPoolExecutor(6) as ex:
            for c, z, e in ex.map(one, chunks):
                if e is not None:
                    print('::warning title=İnce derinlik %s %d %d::%s' % (reg['id'], c[0], c[1], repr(e)[:200]), flush=True)
                got[c] = z
    for c in chunks:
        cla, clo = c
        if src == 'ncei':
            z = got.get(c)
        else:
            try:
                z = bathy_fine_chunk(cla, clo, cache)
            except Exception as e:
                print('::warning title=İnce derinlik %s %d %d::%s' % (reg['id'], cla, clo, repr(e)[:200]), flush=True); continue
        if z is None:
            continue
        for i in range(10):
            for j in range(10):
                la = round(cla + i * BF_TS, 2); lo = round(clo + j * BF_TS, 2)
                if la < la0 - 1e-9 or la >= la1 - 1e-9 or lo < lo0 - 1e-9 or lo >= lo1 - 1e-9:
                    continue
                sub = z[i * n:(i + 1) * n, j * n:(j + 1) * n]
                if not np.isfinite(sub).any():
                    continue
                if shelf and np.nanmin(sub) > shelf:
                    continue
                a = np.where(np.isfinite(sub), np.clip(np.round(sub * 10), 0, 32767), NA).astype('<i2')
                k = tkey(la, lo); (bdir / (k + '.bin')).write_bytes(a.tobytes()); keys.append(k); reg['_bf_ll'].append((la, lo))
    return keys


# v0.56.03 (Kenny: "derinlik eğrileri tutarsız"): eğriler ve derinlik renklendirmesi de aynı ince ızgaradan (noktanın derinliğiyle birebir tutar).
# 0,5°'lik döşemeler: dc/<anahtar>.json (eğriler) ve dp/<anahtar>.png (renk). Ek paket yok: yürüyen kareler ve PNG yazıcı numpy + zlib.
DC_LEVELS = [10, 20, 30, 50, 75, 100, 150, 200, 300, 500, 1000]
DC_TS = 0.5
# kenarlar: 0 alt, 1 sağ, 2 üst, 3 sol (hücre köşeleri a=sol alt bit1, b=sağ alt bit2, c=sağ üst bit4, d=sol üst bit8)
_MS = {1: [(3, 0)], 2: [(0, 1)], 3: [(3, 1)], 4: [(1, 2)], 5: [(3, 2), (0, 1)], 6: [(0, 2)], 7: [(3, 2)], 8: [(2, 3)], 9: [(2, 0)],
       10: [(3, 0), (1, 2)], 11: [(2, 1)], 12: [(1, 3)], 13: [(1, 0)], 14: [(0, 3)]}


def _rdp(pts, eps):
    if len(pts) < 3:
        return pts
    keep = np.zeros(len(pts), bool); keep[0] = keep[-1] = True; st = [(0, len(pts) - 1)]
    while st:
        i, j = st.pop()
        if j <= i + 1:
            continue
        a, b = pts[i], pts[j]; d = b - a; n = np.hypot(*d)
        seg = pts[i + 1:j]
        dist = np.abs(d[0] * (seg[:, 1] - a[1]) - d[1] * (seg[:, 0] - a[0])) / n if n > 0 else np.hypot(*(seg - a).T)
        k = int(np.argmax(dist))
        if dist[k] > eps:
            m = i + 1 + k; keep[m] = True; st += [(i, m), (m, j)]
    return pts[keep]


def contours_grid(z, level):
    """z: güneyden kuzeye ızgara (derinlik, kara=0). Dönüş: [(satır,sütun) dizileri]"""
    ny, nx = z.shape
    a = z[:-1, :-1]; b = z[:-1, 1:]; c = z[1:, 1:]; d = z[1:, :-1]
    case = (a >= level) * 1 + (b >= level) * 2 + (c >= level) * 4 + (d >= level) * 8
    W = nx  # kenar kimliği: yatay (i,j) -> 2*(i*W+j), dikey (i,j) -> 2*(i*W+j)+1
    def eid(e, I, J):
        return [2 * (I * W + J), 2 * (I * W + J + 1) + 1, 2 * ((I + 1) * W + J), 2 * (I * W + J) + 1][e]
    segs = []
    for cv, pairs in _MS.items():
        I, J = np.nonzero(case == cv)
        for e1, e2 in pairs:
            segs.append(np.stack([eid(e1, I, J), eid(e2, I, J)], 1))
    if not segs:
        return []
    S = np.concatenate(segs)
    if not len(S):
        return []
    def pos(e):
        i, r = divmod(e // 2, W); j = r
        if e % 2 == 0:   # yatay kenar: satır i, sütun j..j+1
            z0, z1 = z[i, j], z[i, j + 1]; t = (level - z0) / (z1 - z0) if z1 != z0 else 0.5; return (i, j + t)
        z0, z1 = z[i, j], z[i + 1, j]; t = (level - z0) / (z1 - z0) if z1 != z0 else 0.5; return (i + t, j)
    adj = {}
    for k, (u, v) in enumerate(S.tolist()):
        adj.setdefault(u, []).append(k); adj.setdefault(v, []).append(k)
    used = np.zeros(len(S), bool); lines = []
    for k0 in range(len(S)):
        if used[k0]:
            continue
        used[k0] = True; u, v = S[k0].tolist(); chain = [u, v]
        for end in (1, 0):   # iki yöne uzat
            cur = chain[-1] if end else chain[0]
            while True:
                nxt = [k for k in adj.get(cur, []) if not used[k]]
                if not nxt:
                    break
                k = nxt[0]; used[k] = True; p, q = S[k].tolist(); cur = q if p == cur else p
                if end: chain.append(cur)
                else: chain.insert(0, cur)
        lines.append(np.array([pos(e) for e in chain]))
    return lines


def _png(rgba):
    import zlib, struct
    h, w, _ = rgba.shape
    raw = b''.join(b'\x00' + rgba[i].tobytes() for i in range(h))
    def ch(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    return b'\x89PNG\r\n\x1a\n' + ch(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)) + ch(b'IDAT', zlib.compress(raw, 9)) + ch(b'IEND', b'')


# derinlik renkleri (sığdan derine): açık turkuaz -> lacivert; log ölçek
_DPAL = [(0, (178, 236, 236)), (10, (130, 214, 226)), (20, (88, 190, 214)), (50, (52, 156, 200)), (100, (34, 120, 184)), (200, (26, 88, 160)),
         (500, (20, 60, 130)), (1000, (14, 40, 100)), (2500, (8, 22, 66))]


def depth_rgba(z):
    xs = np.log10(np.array([max(1, d) for d, _ in _DPAL], float)); cs = np.array([c for _, c in _DPAL], float)
    zz = np.log10(np.clip(np.nan_to_num(z, nan=1), 1, 5000))
    out = np.zeros(z.shape + (4,), np.uint8)
    for k in range(3):
        out[..., k] = np.interp(zz, xs, cs[:, k]).astype(np.uint8)
    out[..., 3] = np.where(np.isfinite(z) & (z > 0), 255, 0)
    return out


def write_depth_layers(reg, out, cache):
    """İnce ızgaradan 0,5°'lik eğri (json) ve renk (png) döşemeleri; anahtar listelerini döndürür."""
    lo0, la0, lo1, la1 = reg['bbox']
    LA0, LO0 = math.floor(la0), math.floor(lo0); LA1, LO1 = math.ceil(la1), math.ceil(lo1)
    n1 = int(round(1 / BF_RES))
    M = np.full(((LA1 - LA0) * n1, (LO1 - LO0) * n1), np.nan, 'float32')
    for cla in range(LA0, LA1):
        for clo in range(LO0, LO1):
            f = cache / (('bfn_%.2f_%.2f.npz' if fine_src(reg) == 'ncei' else 'bf_%.2f_%.2f.npz') % (cla, clo))
            if f.exists():
                M[(cla - LA0) * n1:(cla - LA0 + 1) * n1, (clo - LO0) * n1:(clo - LO0 + 1) * n1] = np.load(f)['z']
    cdir = out / 'dc'; pdir = out / 'dp'; cdir.mkdir(parents=True, exist_ok=True); pdir.mkdir(parents=True, exist_ok=True)
    nt = int(round(DC_TS / BF_RES)); dck, dpk = [], []
    la = math.floor(la0 / DC_TS) * DC_TS
    while la < la1 - 1e-9:
        lo = math.floor(lo0 / DC_TS) * DC_TS
        while lo < lo1 - 1e-9:
            r0 = int(round((la - LA0) / BF_RES)); c0 = int(round((lo - LO0) / BF_RES))
            sub = M[r0:r0 + nt + 1, c0:c0 + nt + 1]   # bir hücre bindirme: komşu döşemenin eğrisiyle birleşir
            k = tkey(round(la, 2), round(lo, 2))
            if sub.size and np.isfinite(sub).any():
                img = depth_rgba(sub[:nt, :nt])[::-1]   # PNG kuzeyden güneye
                (pdir / (k + '.png')).write_bytes(_png(np.ascontiguousarray(img))); dpk.append(k)
                zz = np.nan_to_num(sub, nan=0.0); L = []
                for lev in DC_LEVELS:
                    if np.nanmax(sub) < lev:
                        continue
                    for ln in contours_grid(zz, lev):
                        if len(ln) < 2 or np.hypot(*np.diff(ln, axis=0).T).sum() < 4:   # kırıntı çizgiler (4 hücreden kısa) atılır
                            continue
                        ln = _rdp(ln, 0.35)
                        pts = [[round(la + (r + 0.5) * BF_RES, 5), round(lo + (c + 0.5) * BF_RES, 5)] for r, c in ln.tolist()]
                        L.append([lev, pts])
                if L:
                    (cdir / (k + '.json')).write_text(json.dumps({'l': L}, separators=(',', ':'))); dck.append(k)
            lo += DC_TS
        la += DC_TS
    return dck, dpk


def bf_diag(reg, out, bati):
    """v0.56.03 tanı: deneme noktasında ince döşeme, kaba ızgara ve canlı EMODnet derinliği yan yana (Fish Radar kıyası)."""
    import urllib.request, json as _j
    for la, lo in [(38.13, 26.6292), (38.13586, 26.62158), (38.1400, 26.6250), (38.1300, 26.6150)]:
        lo0, la0, lo1, la1 = reg['bbox']
        if not (la0 <= la < la1 and lo0 <= lo < lo1):
            continue
        k = tkey(math.floor(la / BF_TS + 1e-9) * BF_TS, math.floor(lo / BF_TS + 1e-9) * BF_TS); f = out / 'bf' / (k + '.bin'); fine = None; ring = None
        if f.exists():
            a = np.frombuffer(f.read_bytes(), '<i2').reshape(96, 96).astype(float); a[a == NA] = np.nan; a /= 10
            y = int((la - math.floor(la / BF_TS + 1e-9) * BF_TS) / BF_RES); x = int((lo - math.floor(lo / BF_TS + 1e-9) * BF_TS) / BF_RES)
            fine = a[y, x]; ring = a[max(0, y - 3):y + 4, max(0, x - 3):x + 4]
        coarse = None
        if bati:
            iy = int(np.argmin(abs(bati['lat'] - la))); ix = int(np.argmin(abs(bati['lon'] - lo))); coarse = float(bati['z'][iy, ix])
        live = None
        try:
            with urllib.request.urlopen('https://rest.emodnet-bathymetry.eu/depth_sample?geom=POINT(%f%%20%f)' % (lo, la), timeout=30) as r:
                live = r.read().decode()[:200]
        except Exception as e:
            live = repr(e)[:120]
        print('::notice title=Derinlik tanı %.4f %.4f::ince %s · kaba %s · canlı %s · çevre 5x5 %s' % (la, lo, fine, coarse, live, None if ring is None else np.round(ring).tolist()), flush=True)


def bathy_from_tif(data, res_hint):
    """GeoTIFF (yükseklik, deniz negatif) -> güneyden kuzeye ızgara, pozitif derinlik ve eğim"""
    import io, rasterio
    with rasterio.open(io.BytesIO(data)) as src:
        a = src.read(1).astype('float64'); nod = src.nodata; tr = src.transform
    if nod is not None:
        a[a == nod] = np.nan
    ny, nx = a.shape
    lat = tr.f + (np.arange(ny) + 0.5) * tr.e; lon = tr.c + (np.arange(nx) + 0.5) * tr.a
    if tr.e < 0:
        a = a[::-1]; lat = lat[::-1]
    a = np.where(a < 0, -a, np.nan)
    res = abs(tr.a) or res_hint
    dy = res * 111320.0; dx = res * 111320.0 * np.cos(np.radians(lat))[:, None]
    gz = np.gradient(np.nan_to_num(a, nan=0.0))
    slope = np.degrees(np.arctan(np.hypot(gz[0] / dy, gz[1] / dx)))
    slope[~np.isfinite(a)] = np.nan
    return {'lat': lat, 'lon': lon, 'z': a, 'slope': slope, 'res': res}


def bathy_erddap(bbox, cache):
    """v0.39.8: EMODnet dışı (ABD): NOAA ERDDAP SRTM15+ (15 açı saniyesi = 1/240°, ~460 m); olmazsa ETOPO1 (1/60°)"""
    f = cache / ('bati_srtm_%s.npz' % '_'.join('%.2f' % x for x in bbox))
    if f.exists():
        z = np.load(f); return {k: z[k] for k in ('lat', 'lon', 'z', 'slope')} | {'res': float(z['res']), 'src': str(z['src'])}
    import urllib.request
    lo0, la0, lo1, la1 = bbox
    tries = [('https://coastwatch.pfeg.noaa.gov/erddap/griddap/srtm15plus.geotif?z%%5B(%f):1:(%f)%%5D%%5B(%f):1:(%f)%%5D' % (la0, la1, lo0, lo1), 1 / 240, 'SRTM15+ (NOAA ERDDAP)'),
             ('https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180.geotif?altitude%%5B(%f):1:(%f)%%5D%%5B(%f):1:(%f)%%5D' % (la0, la1, lo0, lo1), 1 / 60, 'ETOPO1 (NOAA ERDDAP)')]
    err = None
    for url, res, name in tries:
        try:
            log('derinlik indiriliyor', name, url)
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'alyssa-deniz'}), timeout=300) as r:
                data = r.read()
            b = bathy_from_tif(data, res); b['src'] = name
            cache.mkdir(parents=True, exist_ok=True)
            np.savez_compressed(f, lat=b['lat'], lon=b['lon'], z=b['z'], slope=b['slope'], res=b['res'], src=name); mark_new(cache)
            return b
        except Exception as e:
            err = e; log(name, 'olmadı:', e)
    raise err


def region_entry(reg, tiles, ids, bati, bf, dck, dpk):
    """index.json bölge kaydı. EMODnet bölgelerinde ince döşeme anahtar listesi (eski sürümler okur); NCEI bölgelerinde bit haritası (bm)."""
    e = {'id': reg['id'], 'bbox': reg['bbox'], 'tile': reg.get('tile', 0.5), 'tiles': tiles, 'src': ids, 'bati': bati, 'zos_tide': 'MEDSEA' in (reg.get('phy') or '')}
    if bf:
        ncei = fine_src(reg) == 'ncei'
        b = {'res': BF_RES, 'ts': BF_TS, 'n': int(round(BF_TS / BF_RES)), 'scale': 0.1, 'src': 'NOAA NCEI DEM' if ncei else 'EMODnet DTM'}
        if ncei:
            b['bm'] = tile_bitmap(reg.get('_bf_ll') or [], reg['bbox'], BF_TS)
            if reg.get('shelf'):
                b['shelf'] = reg['shelf']
        else:
            b['tiles'] = bf
        e['bf'] = b
        if dck or dpk:
            e['dl'] = {'ts': DC_TS, 'levels': DC_LEVELS, 'dc': dck, 'dp': dpk, 'src': b['src']}
    return e


# ---------------------------------------------------------------- ana akış
def run(args):
    regs = json.loads((HERE / 'bolgeler.json').read_text())
    out = Path(args.out); out.mkdir(parents=True, exist_ok=True)
    now = dt.datetime.now(dt.timezone.utc).replace(tzinfo=None).replace(minute=0, second=0, microsecond=0)
    t0 = (now - dt.timedelta(days=1)).strftime('%Y-%m-%dT%H:%M:%S'); t1 = (now + dt.timedelta(days=args.days)).strftime('%Y-%m-%dT%H:%M:%S')
    index = {'v': 1, 'gen': now.strftime('%Y-%m-%dT%H:%MZ'), 'attr': 'E.U. Copernicus Marine Service Information; EMODnet Bathymetry; NOAA NCEI DEM Global Mosaic', 'v_fr': 1, 'v_chl': 1, 'regions': []}
    cache = Path(args.cache)
    try:
        (cache / NEW_MARK).unlink()
    except Exception:
        pass
    for reg in regs:
        if not reg.get('on', True) or (args.only and reg['id'] not in args.only.split(',')):
            continue
        log('bölge', reg['id'], reg['bbox'])
        if reg.get('only_bati'):   # v0.57.10: yalnız derinlik bölgesi (ABD kıyısı): Copernicus yok, ince döşeme + eğri/renk
            if args.no_bati:
                continue
            try:
                t0r = time.time(); bf = write_fine_bathy(reg, out, cache); dck, dpk = [], []
                try:
                    dck, dpk = write_depth_layers(reg, out, cache)
                except Exception as e:
                    print('::warning title=Derinlik eğri/renk %s::%s' % (reg['id'], repr(e)[:300]), flush=True)
                if bf:
                    index['regions'].append(region_entry(reg, [], {}, False, bf, dck, dpk))
                sz = sum((out / 'bf' / (k + '.bin')).stat().st_size for k in bf)
                print('::notice title=Derinlik %s::%d ince döşeme (%.1f MB) · %d eğri · %d renk · %.0f sn' % (reg['id'], len(bf), sz / 1e6, len(dck), len(dpk), time.time() - t0r), flush=True)
            except Exception as e:
                print('::warning title=Derinlik %s::%s' % (reg['id'], repr(e)[:300]), flush=True)
            continue
        try:
            ids = pick_datasets(reg['phy'], 'phy', reg.get('pref')); reg['_ids'] = ids; log('seçilen', ids)
            pad = 0.05; bb = [reg['bbox'][0] - pad, reg['bbox'][1] - pad, reg['bbox'][2] + pad, reg['bbox'][3] + pad]
            dsets = {}
            dsets['temp'] = open_sub(ids['temp'], ['thetao'], bb, t0, t1, 110) if ids.get('temp') else None
            dsets['cur'] = open_sub(ids['cur'], ['uo', 'vo'], bb, t0, t1, 55) if ids.get('cur') else None
            dsets['zos'] = open_sub(ids['zos'], ['zos'], bb, t0, t1) if ids.get('zos') else None
            dsets['sal'] = None; dsets['mld'] = None; dsets['o2'] = None; dsets['kd'] = None; dsets['zoo'] = None
            for k, var, zmx in (('sal', 'so', 2), ('mld', 'mlotst', None)):   # v0.56.07: tuzluluk ve karışım tabakası; alınamazsa öteki veri etkilenmez
                if ids.get(k):
                    try:
                        dsets[k] = open_sub(ids[k], [var], bb, t0, t1, zmx)
                    except Exception as e:
                        print('::warning title=%s %s::%s' % (k, reg['id'], repr(e)[:200]), flush=True)
            dsets['chl'] = None
            if reg.get('bgc'):
                try:
                    bi = pick_datasets(reg['bgc'], 'bgc', reg.get('pref_bgc')); ids.update(bi); log('klorofil', bi)
                    if bi.get('chl'):
                        dsets['chl'] = open_sub(bi['chl'], ['chl'], bb, t0, t1, 2)
                    if bi.get('o2'):
                        try:
                            dsets['o2'] = open_sub(bi['o2'], ['o2'], bb, t0, t1, 2)
                        except Exception as e:
                            print('::warning title=o2 %s::%s' % (reg['id'], repr(e)[:200]), flush=True)
                    for k, var in (('kd', 'kd490'), ('zoo', 'zooc')):   # v0.57.03: berraklık ve zooplankton; alınamazsa öteki veri etkilenmez
                        if bi.get(k):
                            try:
                                try:
                                    dsets[k] = open_sub(bi[k], [var], bb, t0, t1, 2)
                                except Exception:
                                    dsets[k] = open_sub(bi[k], [var], bb, t0, t1)   # yüzey alanı (derinlik boyutu yok)
                                print('::notice title=%s %s::%s' % (k, reg['id'], bi[k]), flush=True)
                            except Exception as e:
                                print('::warning title=%s %s::%s' % (k, reg['id'], repr(e)[:200]), flush=True)
                        else:
                            print('::notice title=%s %s::veri setinde %s yok' % (k, reg['id'], var), flush=True)
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
                for k, v in list(sat.items()):
                    g = v[0][np.isfinite(v[0])]
                    p90 = round(float(np.percentile(g, 90)), 4) if g.size and k != 'chl' else None
                    sat[k] = tuple(v[:4]) + (p90,)
                    print('::notice title=Uydu %s %s::%s · %s hücre · P90 %s' % (reg['id'], k, str(v[3][0])[:10], g.size, p90), flush=True)
            bati = None
            if reg.get('bati') in ('emodnet', 'srtm15') and not args.no_bati:
                try:
                    bati = (bathy_emodnet if reg['bati'] == 'emodnet' else bathy_erddap)(reg['bbox'], Path(args.cache))
                except Exception as e:
                    log('derinlik alınamadı:', e); print('::warning title=Derinlik %s::%s' % (reg['id'], repr(e)[:300]), flush=True)
            tiles = write_region(reg, dsets, out, bati, sat)
            bf = []; dck = []; dpk = []
            if fine_src(reg) and not args.no_bati:
                try:
                    bf = write_fine_bathy(reg, out, Path(args.cache)); log(reg['id'], len(bf), 'ince derinlik döşemesi')
                    if fine_src(reg) == 'emodnet':
                        bf_diag(reg, out, bati)
                    try:
                        dck, dpk = write_depth_layers(reg, out, Path(args.cache)); print('::notice title=Derinlik eğri/renk %s::%d eğri · %d renk döşemesi' % (reg['id'], len(dck), len(dpk)), flush=True)
                    except Exception as e:
                        dck, dpk = [], []; print('::warning title=Derinlik eğri/renk %s::%s' % (reg['id'], repr(e)[:300]), flush=True)
                    print('::notice title=İnce derinlik %s::%d döşeme' % (reg['id'], len(bf)), flush=True)
                except Exception as e:
                    print('::warning title=İnce derinlik %s::%s' % (reg['id'], repr(e)[:300]), flush=True)
            index['regions'].append(region_entry(reg, tiles, ids, bool(bati), bf, dck, dpk))
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
