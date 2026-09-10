import districtsData from './data/districts.json';
import type { District, DistrictAbbreviation, DistrictCode, Language, ProvinceCode, QueryOptions } from './types';

export const DISTRICTS: readonly District[] = Object.freeze(
  districtsData.map((d) =>
    Object.freeze({
      id: d.id,
      code: d.code as DistrictAbbreviation,
      name: d.name_en,
      name_en: d.name_en,
      name_si: d.name_si,
      name_ta: d.name_ta,
      province_id: d.province_id,
      province_code: d.province_code as ProvinceCode,
      province_name: d.province_name
    })
  )
);

export const DISTRICT_MAP: Readonly<Record<DistrictCode, District>> = Object.freeze(
  DISTRICTS.reduce((acc, d) => {
    acc[d.code] = d;
    return acc;
  }, {} as Record<DistrictCode, District>)
);

const CODE_OR_ID_MAP = new Map<string, District>();
const BY_PROVINCE_MAP = new Map<string, District[]>();

for (const d of DISTRICTS) {
  CODE_OR_ID_MAP.set(d.code.toUpperCase(), d);
  CODE_OR_ID_MAP.set(d.id, d);
  CODE_OR_ID_MAP.set(d.name_en.toLowerCase(), d);

  // Index by province code and province name
  const pCode = d.province_code.toUpperCase();
  const pName = d.province_name.toLowerCase();

  if (!BY_PROVINCE_MAP.has(pCode)) BY_PROVINCE_MAP.set(pCode, []);
  BY_PROVINCE_MAP.get(pCode)!.push(d);

  if (!BY_PROVINCE_MAP.has(pName)) BY_PROVINCE_MAP.set(pName, []);
  BY_PROVINCE_MAP.get(pName)!.push(d);

  if (!BY_PROVINCE_MAP.has(d.province_id)) BY_PROVINCE_MAP.set(d.province_id, []);
  BY_PROVINCE_MAP.get(d.province_id)!.push(d);
}

// Freeze the arrays in the province map
for (const [k, arr] of BY_PROVINCE_MAP.entries()) {
  BY_PROVINCE_MAP.set(k, Object.freeze(arr) as any);
}

/**
 * Direct O(1) lookup of a District by code (e.g. 'CO'), id ('5'), or English name ('Colombo').
 */
export function getDistrict(codeOrId: DistrictCode | string): District | undefined {
  if (!codeOrId || typeof codeOrId !== 'string') return undefined;
  const key = codeOrId.trim();
  return CODE_OR_ID_MAP.get(key.toUpperCase()) || CODE_OR_ID_MAP.get(key.toLowerCase()) || CODE_OR_ID_MAP.get(key);
}

/**
 * Direct helper to get a localized District name in English, Sinhala, or Tamil.
 *
 * @example
 * getDistrictName('KY', 'si') // => "මහනුවර"
 * getDistrictName('KY', 'ta') // => "கண்டி"
 */
export function getDistrictName(codeOrId: DistrictCode | string, lang: Language = 'en'): string | undefined {
  const d = getDistrict(codeOrId);
  if (!d) return undefined;
  if (lang === 'si') return d.name_si;
  if (lang === 'ta') return d.name_ta;
  return d.name_en;
}

/**
 * Backward-compatible alias for getDistrict()
 */
export function getDistrictByCode(code: string, options?: QueryOptions): District | undefined {
  const d = getDistrict(code);
  if (!d) return undefined;
  const lang = options?.lang;
  if (!lang || lang === 'en') return d;
  return {
    ...d,
    name: lang === 'si' ? d.name_si : d.name_ta
  };
}

/**
 * Get all districts for a given province (by code like 'WP' or name like 'Western') in O(1).
 */
export function getDistrictsByProvince(province: ProvinceCode | string, options?: QueryOptions): readonly District[] {
  if (!province || typeof province !== 'string') return [];
  const key = province.trim();
  const list = BY_PROVINCE_MAP.get(key.toUpperCase()) || BY_PROVINCE_MAP.get(key.toLowerCase()) || [];

  const lang = options?.lang;
  if (!lang || lang === 'en') return list;

  return list.map((d) => ({
    ...d,
    name: lang === 'si' ? d.name_si : d.name_ta
  }));
}

/**
 * Returns districts. Zero allocations when called without arguments.
 */
export function getDistricts(
  provinceOrOptions?: string | QueryOptions,
  options?: QueryOptions
): readonly District[] {
  let provinceFilter: string | undefined;
  let opts: QueryOptions | undefined = options;

  if (typeof provinceOrOptions === 'string') {
    provinceFilter = provinceOrOptions;
  } else if (provinceOrOptions && typeof provinceOrOptions === 'object') {
    opts = provinceOrOptions;
  }

  const lang = opts?.lang || 'en';

  if (provinceFilter) {
    return getDistrictsByProvince(provinceFilter, opts);
  }

  if (!lang || lang === 'en') {
    return DISTRICTS;
  }

  return DISTRICTS.map((d) => ({
    ...d,
    name: lang === 'si' ? d.name_si : d.name_ta
  }));
}

