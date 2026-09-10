import citiesData from './data/cities.json';
import type { City, DistrictAbbreviation, DistrictCode, Language, ProvinceCode, QueryOptions, SearchOptions } from './types';

export const CITIES: readonly City[] = Object.freeze(
  (citiesData as any[]).map((c) =>
    Object.freeze({
      name: c.name_en,
      name_en: c.name_en,
      name_si: c.name_si,
      name_ta: c.name_ta,
      postal_code: c.postal_code,
      district: c.district,
      district_code: c.district_code,
      district_abbr: c.district_abbr as DistrictAbbreviation,
      province: c.province,
      province_code: c.province_code as ProvinceCode,
      is_sub_post_office: Boolean(c.is_sub_post_office),
      latitude: c.latitude,
      longitude: c.longitude
    })
  )
);

// High-performance O(1) indexed maps
const POSTAL_CODE_MAP = new Map<string, City>();
const POSTAL_CODE_ALL_MAP = new Map<string, City[]>();
const CITY_NAME_MAP = new Map<string, City>();
const DISTRICT_CITIES_MAP = new Map<string, City[]>();
const PROVINCE_CITIES_MAP = new Map<string, City[]>();

for (const c of CITIES) {
  const pCode = c.postal_code;
  if (!POSTAL_CODE_MAP.has(pCode)) {
    POSTAL_CODE_MAP.set(pCode, c);
  }

  if (!POSTAL_CODE_ALL_MAP.has(pCode)) {
    POSTAL_CODE_ALL_MAP.set(pCode, []);
  }
  POSTAL_CODE_ALL_MAP.get(pCode)!.push(c);

  // Normalize name key
  const normName = c.name_en.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!CITY_NAME_MAP.has(normName)) {
    CITY_NAME_MAP.set(normName, c);
  }
  // Also index Sinhala and Tamil names
  if (!CITY_NAME_MAP.has(c.name_si.trim())) {
    CITY_NAME_MAP.set(c.name_si.trim(), c);
  }
  if (!CITY_NAME_MAP.has(c.name_ta.trim())) {
    CITY_NAME_MAP.set(c.name_ta.trim(), c);
  }

  // Index by district code and name
  const dAbbr = c.district_abbr.toUpperCase();
  const dName = c.district.toLowerCase();
  const dCode = c.district_code;

  for (const key of [dAbbr, dName, dCode]) {
    if (!DISTRICT_CITIES_MAP.has(key)) DISTRICT_CITIES_MAP.set(key, []);
    DISTRICT_CITIES_MAP.get(key)!.push(c);
  }

  // Index by province
  const provCode = c.province_code.toUpperCase();
  const provName = c.province.toLowerCase();

  for (const key of [provCode, provName]) {
    if (!PROVINCE_CITIES_MAP.has(key)) PROVINCE_CITIES_MAP.set(key, []);
    PROVINCE_CITIES_MAP.get(key)!.push(c);
  }
}

// Freeze indexed arrays
for (const [k, arr] of DISTRICT_CITIES_MAP.entries()) {
  DISTRICT_CITIES_MAP.set(k, Object.freeze(arr) as any);
}
for (const [k, arr] of PROVINCE_CITIES_MAP.entries()) {
  PROVINCE_CITIES_MAP.set(k, Object.freeze(arr) as any);
}

/**
 * Direct O(1) lookup of a City by 5-digit postal code.
 *
 * @example
 * getCityByPostalCode('00100') // => Colombo 1
 * getCityByPostalCode('20000') // => Kandy
 */
export function getCityByPostalCode(postalCode: string | number, lang?: Language): City | undefined {
  if (postalCode === undefined || postalCode === null) return undefined;
  const codeStr = String(postalCode).trim().padStart(5, '0');
  const city = POSTAL_CODE_MAP.get(codeStr);
  if (!city) return undefined;

  if (!lang || lang === 'en') return city;
  return {
    ...city,
    name: lang === 'si' ? city.name_si : city.name_ta
  };
}

/**
 * Backward-compatible alias for getCityByPostalCode()
 */
export function lookupPostalCode(postalCode: string | number, options?: QueryOptions): City | undefined {
  return getCityByPostalCode(postalCode, options?.lang);
}

/**
 * Returns all postal stations / sub-offices sharing a postal code.
 */
export function lookupAllByPostalCode(postalCode: string | number, options?: QueryOptions): readonly City[] {
  if (postalCode === undefined || postalCode === null) return [];
  const codeStr = String(postalCode).trim().padStart(5, '0');
  const list = POSTAL_CODE_ALL_MAP.get(codeStr) || [];
  const lang = options?.lang;
  if (!lang || lang === 'en') return list;

  return list.map((c) => ({
    ...c,
    name: lang === 'si' ? c.name_si : c.name_ta
  }));
}

/**
 * Direct O(1) lookup of a 5-digit postal code by city name (English, Sinhala, or Tamil).
 *
 * @example
 * getPostalCode('Athurugiriya') // => "10150"
 * getPostalCode('මහනුවර')      // => "20000"
 */
export function getPostalCode(cityName: string): string | undefined {
  if (!cityName || typeof cityName !== 'string') return undefined;
  const raw = cityName.trim();
  const directMatch = CITY_NAME_MAP.get(raw);
  if (directMatch) return directMatch.postal_code;

  const norm = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
  return CITY_NAME_MAP.get(norm)?.postal_code;
}

/**
 * Get all cities for a district in O(1) constant time.
 *
 * @example
 * getCitiesByDistrict('CO')       // => All Colombo cities (189)
 * getCitiesByDistrict('Gampaha')  // => All Gampaha cities
 */
export function getCitiesByDistrict(district: DistrictCode | string, options?: QueryOptions): readonly City[] {
  if (!district || typeof district !== 'string') return [];
  const key = district.trim();
  const list = DISTRICT_CITIES_MAP.get(key.toUpperCase()) || DISTRICT_CITIES_MAP.get(key.toLowerCase()) || [];

  const lang = options?.lang;
  if (!lang || lang === 'en') return list;

  return list.map((c) => ({
    ...c,
    name: lang === 'si' ? c.name_si : c.name_ta
  }));
}

/**
 * Get all cities for a province in O(1) constant time.
 */
export function getCitiesByProvince(province: ProvinceCode | string, options?: QueryOptions): readonly City[] {
  if (!province || typeof province !== 'string') return [];
  const key = province.trim();
  const list = PROVINCE_CITIES_MAP.get(key.toUpperCase()) || PROVINCE_CITIES_MAP.get(key.toLowerCase()) || [];

  const lang = options?.lang;
  if (!lang || lang === 'en') return list;

  return list.map((c) => ({
    ...c,
    name: lang === 'si' ? c.name_si : c.name_ta
  }));
}

/**
 * Returns all cities. Zero allocations when called without arguments.
 */
export function getCities(
  districtOrOptions?: string | QueryOptions,
  options?: QueryOptions
): readonly City[] {
  let districtFilter: string | undefined;
  let opts: QueryOptions | undefined = options;

  if (typeof districtOrOptions === 'string') {
    districtFilter = districtOrOptions;
  } else if (districtOrOptions && typeof districtOrOptions === 'object') {
    opts = districtOrOptions;
  }

  const lang = opts?.lang || 'en';

  if (districtFilter) {
    return getCitiesByDistrict(districtFilter, opts);
  }

  if (!lang || lang === 'en') {
    return CITIES;
  }

  return CITIES.map((c) => ({
    ...c,
    name: lang === 'si' ? c.name_si : c.name_ta
  }));
}

/**
 * Fast search across English, Sinhala, Tamil town names, district names, and 5-digit postal codes.
 */
export function search(query: string, options?: SearchOptions): City[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  const limit = options?.limit ?? 15;
  const lang = options?.lang || 'en';

  const results: City[] = [];
  for (const c of CITIES) {
    if (options?.district) {
      const dNorm = options.district.trim().toLowerCase();
      if (
        c.district.toLowerCase() !== dNorm &&
        c.district_abbr.toLowerCase() !== dNorm &&
        c.district_code !== dNorm
      ) {
        continue;
      }
    }

    if (options?.province) {
      const pNorm = options.province.trim().toLowerCase();
      if (c.province.toLowerCase() !== pNorm && c.province_code.toLowerCase() !== pNorm) {
        continue;
      }
    }

    const matches =
      c.name_en.toLowerCase().includes(q) ||
      c.postal_code.includes(q) ||
      c.name_si.includes(query) ||
      c.name_ta.includes(query) ||
      c.district.toLowerCase().includes(q);

    if (matches) {
      results.push(
        lang === 'en'
          ? c
          : {
              ...c,
              name: lang === 'si' ? c.name_si : c.name_ta
            }
      );
      if (results.length >= limit) break;
    }
  }

  return results;
}

