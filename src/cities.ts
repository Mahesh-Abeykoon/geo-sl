import citiesData from './data/cities.json';
import type {
  City,
  CityWithDistance,
  DistrictAbbreviation,
  DistrictCode,
  Language,
  NearestCityOptions,
  ProvinceCode,
  QueryOptions,
  RadiusSearchOptions,
  SearchOptions
} from './types';

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

// Internal index maps
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

  const normName = c.name_en.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!CITY_NAME_MAP.has(normName)) {
    CITY_NAME_MAP.set(normName, c);
  }
  const strippedZeros = normName.replace(/^([a-z]+)0+(\d+)$/, '$1$2');
  if (!CITY_NAME_MAP.has(strippedZeros)) {
    CITY_NAME_MAP.set(strippedZeros, c);
  }

  if (!CITY_NAME_MAP.has(c.name_si.trim())) {
    CITY_NAME_MAP.set(c.name_si.trim(), c);
  }
  if (!CITY_NAME_MAP.has(c.name_ta.trim())) {
    CITY_NAME_MAP.set(c.name_ta.trim(), c);
  }

  const dAbbr = c.district_abbr.toUpperCase();
  const dName = c.district.toLowerCase();
  const dCode = c.district_code;

  for (const key of [dAbbr, dName, dCode]) {
    if (!DISTRICT_CITIES_MAP.has(key)) DISTRICT_CITIES_MAP.set(key, []);
    DISTRICT_CITIES_MAP.get(key)!.push(c);
  }

  const provCode = c.province_code.toUpperCase();
  const provName = c.province.toLowerCase();

  for (const key of [provCode, provName]) {
    if (!PROVINCE_CITIES_MAP.has(key)) PROVINCE_CITIES_MAP.set(key, []);
    PROVINCE_CITIES_MAP.get(key)!.push(c);
  }
}

for (const [k, arr] of DISTRICT_CITIES_MAP.entries()) {
  DISTRICT_CITIES_MAP.set(k, Object.freeze(arr) as any);
}
for (const [k, arr] of PROVINCE_CITIES_MAP.entries()) {
  PROVINCE_CITIES_MAP.set(k, Object.freeze(arr) as any);
}

// Canonical default for Colombo (GPO) across English, Sinhala, and Tamil
const colombo1 = POSTAL_CODE_MAP.get('00100');
if (colombo1) {
  if (!CITY_NAME_MAP.has('colombo')) CITY_NAME_MAP.set('colombo', colombo1);
  if (!CITY_NAME_MAP.has('කොළඹ')) CITY_NAME_MAP.set('කොළඹ', colombo1);
  if (!CITY_NAME_MAP.has('கொழும்பு')) CITY_NAME_MAP.set('கொழும்பு', colombo1);
}

/**
 * Finds a city or post office by its 5-digit postal code.
 *
 * @param postalCode - 5-digit postal code (e.g. '00100' or 100).
 * @param lang - Target language ('en' | 'si' | 'ta'). Default is 'en'.
 * @returns Matching City object, or undefined if not found.
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
 * Alias for getCityByPostalCode.
 *
 * @see getCityByPostalCode
 */
export function lookupPostalCode(postalCode: string | number, options?: QueryOptions): City | undefined {
  return getCityByPostalCode(postalCode, options?.lang);
}

/**
 * Returns all postal stations or sub-offices that share the specified postal code.
 *
 * @param postalCode - 5-digit postal code.
 * @param options - Query options including language selection.
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
 * Finds a city or post office by its name across English, Sinhala, or Tamil.
 *
 * @param cityName - Name of the city or town.
 * @param options - Query options including language selection.
 *
 * @example
 * getCityByName('Kandy') // => Kandy City object
 * getCityByName('මහනුවර') // => Kandy City object
 */
export function getCityByName(cityName: string, options?: QueryOptions): City | undefined {
  if (!cityName || typeof cityName !== 'string') return undefined;
  const raw = cityName.trim();
  let city = CITY_NAME_MAP.get(raw);

  if (!city) {
    const strippedNumber = raw.replace(/(\s+)0+(\d+)/, '$1$2');
    city = CITY_NAME_MAP.get(strippedNumber);
  }

  if (!city) {
    const norm = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
    city = CITY_NAME_MAP.get(norm) || CITY_NAME_MAP.get(norm.replace(/^([a-z]+)0+(\d+)$/, '$1$2'));
  }

  if (!city) return undefined;
  const lang = options?.lang;
  if (!lang || lang === 'en') return city;
  return {
    ...city,
    name: lang === 'si' ? city.name_si : city.name_ta
  };
}

/**
 * Finds a city by postal code (e.g. '00100') or city name (English, Sinhala, or Tamil).
 *
 * @param codeOrName - 5-digit postal code or city name.
 * @param options - Query options including language selection.
 *
 * @example
 * getCity('00100') // => Colombo 1
 * getCity('Kandy') // => Kandy
 */
export function getCity(codeOrName: string | number, options?: QueryOptions): City | undefined {
  if (codeOrName === undefined || codeOrName === null) return undefined;
  const str = String(codeOrName).trim();
  if (/^\d{1,5}$/.test(str)) {
    return getCityByPostalCode(str, options?.lang);
  }
  return getCityByName(str, options);
}

/**
 * Resolves the 5-digit postal code for a given city name (English, Sinhala, or Tamil).
 *
 * @param cityName - Name of the city or town.
 * @returns 5-digit postal code string, or undefined if not found.
 *
 * @example
 * getPostalCode('Athurugiriya') // => "10150"
 * getPostalCode('Colombo 1')    // => "00100"
 * getPostalCode('Colombo 01')   // => "00100"
 * getPostalCode('මහනුවර')      // => "20000"
 * getPostalCode('කොළඹ')        // => "00100"
 */
export function getPostalCode(cityName: string): string | undefined {
  if (!cityName || typeof cityName !== 'string') return undefined;
  const raw = cityName.trim();
  const directMatch = CITY_NAME_MAP.get(raw);
  if (directMatch) return directMatch.postal_code;

  // Handle number zero padding variations across scripts (e.g. "Colombo 01" -> "Colombo 1", "කොළඹ 01" -> "කොළඹ 1")
  const strippedNumber = raw.replace(/(\s+)0+(\d+)/, '$1$2');
  if (CITY_NAME_MAP.has(strippedNumber)) {
    return CITY_NAME_MAP.get(strippedNumber)!.postal_code;
  }

  let norm = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
  const match = CITY_NAME_MAP.get(norm);
  if (match) return match.postal_code;

  norm = norm.replace(/^([a-z]+)0+(\d+)$/, '$1$2');
  return CITY_NAME_MAP.get(norm)?.postal_code;
}

/**
 * Checks whether a given postal code exists in the official Sri Lanka Post dataset.
 *
 * @param postalCode - 5-digit postal code.
 *
 * @example
 * isValidPostalCode('00100') // => true
 * isValidPostalCode('99999') // => false
 */
export function isValidPostalCode(postalCode: string | number): boolean {
  if (postalCode === undefined || postalCode === null) return false;
  const codeStr = String(postalCode).trim().padStart(5, '0');
  return POSTAL_CODE_MAP.has(codeStr);
}

/**
 * Returns all cities and post offices within a district.
 *
 * @param district - District code (e.g. 'CO') or district name.
 * @param options - Query options including language selection.
 *
 * @example
 * getCitiesByDistrict('CO')       // => Colombo cities
 * getCitiesByDistrict('Gampaha')  // => Gampaha cities
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
 * Returns all cities and post offices within a province.
 *
 * @param province - Province code (e.g. 'WP') or province name.
 * @param options - Query options including language selection.
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
 * Returns cities and post offices, optionally filtered by district.
 *
 * @param districtOrOptions - District code/name or query options.
 * @param options - Query options if district was specified as first argument.
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
 * Searches cities, towns, and postal stations across English, Sinhala, and Tamil.
 * Uses relevance scoring to prioritize exact and prefix matches over district matches.
 *
 * @param query - Search term (town name, postal code, or district).
 * @param options - Search options including limit, language, and district/province filters.
 *
 * @example
 * search('colombo') // => ['Colombo 1', 'Colombo 2', ...]
 * search('nawala')  // => ['Nawala', 'Nawala-Koswatte', ...]
 */
export function search(query: string, options?: SearchOptions): City[] {
  if (!query || !query.trim()) return [];
  const rawQuery = query.trim();
  const q = rawQuery.toLowerCase();
  const qNorm = q.replace(/(\s+)0+(\d+)/, '$1$2');
  const rawNorm = rawQuery.replace(/(\s+)0+(\d+)/, '$1$2');
  const limit = options?.limit ?? 15;
  const lang = options?.lang || 'en';

  const scored: Array<{ city: City; score: number }> = [];

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

    const nameEn = c.name_en.toLowerCase();
    let score = 0;

    if (
      nameEn === q ||
      nameEn === qNorm ||
      c.name_si === rawQuery ||
      c.name_si === rawNorm ||
      c.name_ta === rawQuery ||
      c.name_ta === rawNorm
    ) {
      score = 100;
    } else if (c.postal_code === q) {
      score = 95;
    } else if (nameEn.startsWith(q) || nameEn.startsWith(qNorm)) {
      score = 80;
    } else if (
      c.name_si.startsWith(rawQuery) ||
      c.name_si.startsWith(rawNorm) ||
      c.name_ta.startsWith(rawQuery) ||
      c.name_ta.startsWith(rawNorm)
    ) {
      score = 80;
    } else if (c.postal_code.startsWith(q)) {
      score = 70;
    } else if (nameEn.includes(q) || nameEn.includes(qNorm)) {
      score = 50;
    } else if (
      c.name_si.includes(rawQuery) ||
      c.name_si.includes(rawNorm) ||
      c.name_ta.includes(rawQuery) ||
      c.name_ta.includes(rawNorm)
    ) {
      score = 50;
    } else if (c.district.toLowerCase() === q || c.district_abbr.toLowerCase() === q) {
      score = 25;
    } else if (c.district.toLowerCase().includes(q)) {
      score = 15;
    }

    if (score > 0) {
      scored.push({ city: c, score });
    }
  }

  // Sort by score descending; tie-break by shorter name length, then alphabetical
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.city.name_en.length !== b.city.name_en.length) {
      return a.city.name_en.length - b.city.name_en.length;
    }
    return a.city.name_en.localeCompare(b.city.name_en);
  });

  const results: City[] = [];
  const max = Math.min(scored.length, limit);
  for (let i = 0; i < max; i++) {
    const c = scored[i].city;
    results.push(
      lang === 'en'
        ? c
        : {
            ...c,
            name: lang === 'si' ? c.name_si : c.name_ta
          }
    );
  }

  return results;
}

/**
 * Calculates the great-circle distance between two geographic coordinates or cities
 * in kilometers using the Haversine formula.
 *
 * @param from - Origin coordinate or City object.
 * @param to - Destination coordinate or City object.
 * @returns Distance in kilometers rounded to 2 decimal places, or null if coordinates are missing.
 *
 * @example
 * getDistance({ latitude: 6.9271, longitude: 79.8612 }, { latitude: 7.2906, longitude: 80.6337 })
 * // => ~95.14 km (Colombo to Kandy)
 */
export function getDistance(
  from: { latitude: number | null; longitude: number | null },
  to: { latitude: number | null; longitude: number | null }
): number | null {
  if (
    from.latitude === null ||
    from.latitude === undefined ||
    from.longitude === null ||
    from.longitude === undefined ||
    to.latitude === null ||
    to.latitude === undefined ||
    to.longitude === null ||
    to.longitude === undefined
  ) {
    return null;
  }

  const R = 6371; // Earth's mean radius in kilometers
  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLng = ((to.longitude - from.longitude) * Math.PI) / 180;
  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
}

/**
 * Finds the closest Sri Lankan city, town, or post office to the given GPS coordinates.
 *
 * @param coordsOrLat - Coordinates object or latitude number.
 * @param lngOrOptions - Longitude number (if lat provided) or NearestCityOptions.
 * @param options - NearestCityOptions (if lat & lng provided separately).
 * @returns City object with distanceKm property, or undefined if no city found within maxDistance.
 *
 * @example
 * getNearestCity(6.9271, 79.8612) // => Colombo 1 (~0.4 km)
 * getNearestCity({ latitude: 7.2906, longitude: 80.6337 }) // => Kandy
 */
export function getNearestCity(
  coordsOrLat: number | { latitude: number; longitude: number },
  lngOrOptions?: number | NearestCityOptions,
  options?: NearestCityOptions
): CityWithDistance | undefined {
  let lat: number;
  let lng: number;
  let opts: NearestCityOptions | undefined;

  if (typeof coordsOrLat === 'object') {
    lat = coordsOrLat.latitude;
    lng = coordsOrLat.longitude;
    opts = typeof lngOrOptions === 'object' ? lngOrOptions : undefined;
  } else {
    lat = coordsOrLat;
    lng = typeof lngOrOptions === 'number' ? lngOrOptions : 0;
    opts = options;
  }

  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return undefined;
  }

  const maxDist = opts?.maxDistanceKm ?? Infinity;
  let closest: City | undefined;
  let minDistance = Infinity;

  const targetCoords = { latitude: lat, longitude: lng };

  for (const c of CITIES) {
    if (c.latitude === null || c.longitude === null) continue;

    if (opts?.district) {
      const dNorm = opts.district.trim().toLowerCase();
      if (
        c.district.toLowerCase() !== dNorm &&
        c.district_abbr.toLowerCase() !== dNorm &&
        c.district_code !== dNorm
      ) {
        continue;
      }
    }

    if (opts?.province) {
      const pNorm = opts.province.trim().toLowerCase();
      if (c.province.toLowerCase() !== pNorm && c.province_code.toLowerCase() !== pNorm) {
        continue;
      }
    }

    const dist = getDistance(targetCoords, { latitude: c.latitude, longitude: c.longitude });
    if (dist !== null && dist < minDistance && dist <= maxDist) {
      minDistance = dist;
      closest = c;
    }
  }

  if (!closest) return undefined;

  const lang = opts?.lang;
  return {
    ...closest,
    name: lang === 'si' ? closest.name_si : lang === 'ta' ? closest.name_ta : closest.name_en,
    distanceKm: minDistance
  };
}

/**
 * Finds all Sri Lankan cities and post offices within a given radius (in km) from a coordinate.
 * Results are sorted in ascending order by distance.
 *
 * @param coordsOrLat - Coordinates object or latitude number.
 * @param lngOrRadius - Longitude number (if lat provided) or radius in kilometers.
 * @param radiusOrOptions - Radius in km (if lat/lng provided) or RadiusSearchOptions.
 * @param options - RadiusSearchOptions if lat, lng, and radius provided.
 * @returns Array of matching cities with distanceKm, sorted closest to farthest.
 *
 * @example
 * getCitiesWithinRadius(6.9271, 79.8612, 10) // Cities within 10 km of Colombo
 */
export function getCitiesWithinRadius(
  coordsOrLat: number | { latitude: number; longitude: number },
  lngOrRadius: number,
  radiusOrOptions?: number | RadiusSearchOptions,
  options?: RadiusSearchOptions
): CityWithDistance[] {
  let lat: number;
  let lng: number;
  let radiusKm: number;
  let opts: RadiusSearchOptions | undefined;

  if (typeof coordsOrLat === 'object') {
    lat = coordsOrLat.latitude;
    lng = coordsOrLat.longitude;
    radiusKm = lngOrRadius;
    opts = typeof radiusOrOptions === 'object' ? radiusOrOptions : undefined;
  } else {
    lat = coordsOrLat;
    lng = lngOrRadius;
    radiusKm = typeof radiusOrOptions === 'number' ? radiusOrOptions : 10;
    opts = options;
  }

  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng) || radiusKm <= 0) {
    return [];
  }

  const limit = opts?.limit ?? 50;
  const lang = opts?.lang;
  const targetCoords = { latitude: lat, longitude: lng };
  const matches: CityWithDistance[] = [];

  for (const c of CITIES) {
    if (c.latitude === null || c.longitude === null) continue;

    if (opts?.district) {
      const dNorm = opts.district.trim().toLowerCase();
      if (
        c.district.toLowerCase() !== dNorm &&
        c.district_abbr.toLowerCase() !== dNorm &&
        c.district_code !== dNorm
      ) {
        continue;
      }
    }

    if (opts?.province) {
      const pNorm = opts.province.trim().toLowerCase();
      if (c.province.toLowerCase() !== pNorm && c.province_code.toLowerCase() !== pNorm) {
        continue;
      }
    }

    const dist = getDistance(targetCoords, { latitude: c.latitude, longitude: c.longitude });
    if (dist !== null && dist <= radiusKm) {
      matches.push({
        ...c,
        name: lang === 'si' ? c.name_si : lang === 'ta' ? c.name_ta : c.name_en,
        distanceKm: dist
      });
    }
  }

  matches.sort((a, b) => a.distanceKm - b.distanceKm);

  return matches.slice(0, limit);
}


