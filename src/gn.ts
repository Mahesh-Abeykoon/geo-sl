import gnData from './data/gn.json';
import { getDistrictsByProvince } from './districts';
import type { GNDivision, GNSearchOptions, Language, QueryOptions } from './types';

export const GN_DIVISIONS: readonly GNDivision[] = Object.freeze(
  (gnData as any[]).map((g) =>
    Object.freeze({
      code: g.code,
      name: g.name_en,
      name_en: g.name_en,
      name_si: g.name_si,
      name_ta: g.name_ta,
      division: g.division,
      district: g.district
    })
  )
);

const CODE_MAP = new Map<string, GNDivision>();
const DSD_MAP = new Map<string, GNDivision[]>();
const DISTRICT_MAP = new Map<string, GNDivision[]>();

for (const gn of GN_DIVISIONS) {
  const codeKey = gn.code.toLowerCase();
  if (!CODE_MAP.has(codeKey)) {
    CODE_MAP.set(codeKey, gn);
  }

  const dsdKey = gn.division.toLowerCase();
  if (!DSD_MAP.has(dsdKey)) DSD_MAP.set(dsdKey, []);
  DSD_MAP.get(dsdKey)!.push(gn);

  const distKey = gn.district.toLowerCase();
  if (!DISTRICT_MAP.has(distKey)) DISTRICT_MAP.set(distKey, []);
  DISTRICT_MAP.get(distKey)!.push(gn);
}

for (const [k, arr] of DSD_MAP.entries()) {
  DSD_MAP.set(k, Object.freeze(arr) as any);
}
for (const [k, arr] of DISTRICT_MAP.entries()) {
  DISTRICT_MAP.set(k, Object.freeze(arr) as any);
}

/**
 * Returns all Grama Niladhari (GN) divisions in Sri Lanka.
 *
 * @param optionsOrLang - Query options or language code ('en' | 'si' | 'ta').
 */
export function getGNDivisions(optionsOrLang?: QueryOptions | Language): readonly GNDivision[] | GNDivision[] {
  const lang = typeof optionsOrLang === 'string' ? optionsOrLang : optionsOrLang?.lang;
  if (!lang || lang === 'en') return GN_DIVISIONS;

  return GN_DIVISIONS.map((gn) => ({
    ...gn,
    name: lang === 'si' ? gn.name_si : lang === 'ta' ? gn.name_ta : gn.name_en
  }));
}

/**
 * Returns all Grama Niladhari divisions within a Divisional Secretariat (DS) division.
 *
 * @param divisionName - DS division name (e.g. 'Colombo').
 * @param options - Query options including language selection.
 */
export function getGNDivisionsByDSD(divisionName: string, options?: QueryOptions): readonly GNDivision[] {
  if (!divisionName) return [];
  const clean = divisionName.trim().toLowerCase();
  const list = DSD_MAP.get(clean) || [];

  const lang = options?.lang;
  if (!lang || lang === 'en') return list;

  return list.map((gn) => ({
    ...gn,
    name: lang === 'si' ? gn.name_si : lang === 'ta' ? gn.name_ta : gn.name_en
  }));
}

/**
 * Returns all Grama Niladhari divisions within a district.
 *
 * @param districtName - District name (e.g. 'Kandy').
 * @param options - Query options including language selection.
 */
export function getGNDivisionsByDistrict(districtName: string, options?: QueryOptions): readonly GNDivision[] {
  if (!districtName) return [];
  const clean = districtName.trim().toLowerCase();
  const list = DISTRICT_MAP.get(clean) || [];

  const lang = options?.lang;
  if (!lang || lang === 'en') return list;

  return list.map((gn) => ({
    ...gn,
    name: lang === 'si' ? gn.name_si : lang === 'ta' ? gn.name_ta : gn.name_en
  }));
}

/**
 * Finds a Grama Niladhari division by its administrative GN code.
 *
 * @param code - GN division code.
 * @param options - Query options including language selection.
 */
export function findGNByCode(code: string, options?: QueryOptions): GNDivision | undefined {
  if (!code) return undefined;
  const match = CODE_MAP.get(code.trim().toLowerCase());
  if (!match) return undefined;

  const lang = options?.lang;
  if (!lang || lang === 'en') return match;

  return {
    ...match,
    name: lang === 'si' ? match.name_si : lang === 'ta' ? match.name_ta : match.name_en
  };
}

/**
 * Returns all Grama Niladhari divisions within a province.
 *
 * @param province - Province code (e.g. 'WP') or province name (e.g. 'Western').
 * @param options - Query options including language selection.
 */
export function getGNDivisionsByProvince(province: string, options?: QueryOptions): readonly GNDivision[] {
  if (!province) return [];
  const districts = getDistrictsByProvince(province);
  if (districts.length === 0) return [];
  const distNames = new Set(districts.map((d) => d.name_en.toLowerCase()));

  const list = GN_DIVISIONS.filter((g) => distNames.has(g.district.toLowerCase()));
  const lang = options?.lang;
  if (!lang || lang === 'en') return list;

  return list.map((gn) => ({
    ...gn,
    name: lang === 'si' ? gn.name_si : lang === 'ta' ? gn.name_ta : gn.name_en
  }));
}

/**
 * Searches Grama Niladhari divisions by name (English, Sinhala, Tamil) or GN code.
 * Uses relevance scoring to rank exact matches and prefixes before partial substrings.
 *
 * @param query - Search term.
 * @param options - Search options including limit, division, district, and language.
 */
export function searchGN(query: string, options?: GNSearchOptions): GNDivision[] {
  if (!query || query.trim() === '') return [];

  const rawQuery = query.trim();
  const cleanQuery = rawQuery.toLowerCase();
  const limit = options?.limit ?? 20;
  const lang = options?.lang || 'en';

  const scored: Array<{ gn: GNDivision; score: number }> = [];

  for (const gn of GN_DIVISIONS) {
    if (options?.district && gn.district.toLowerCase() !== options.district.toLowerCase()) {
      continue;
    }
    if (options?.division && gn.division.toLowerCase() !== options.division.toLowerCase()) {
      continue;
    }

    const nameEn = gn.name_en.toLowerCase();
    const codeLower = gn.code.toLowerCase();
    let score = 0;

    if (nameEn === cleanQuery || gn.name_si === rawQuery || gn.name_ta === rawQuery || codeLower === cleanQuery) {
      score = 100;
    } else if (nameEn.startsWith(cleanQuery) || gn.name_si.startsWith(rawQuery) || gn.name_ta.startsWith(rawQuery)) {
      score = 80;
    } else if (codeLower.startsWith(cleanQuery)) {
      score = 75;
    } else if (nameEn.includes(cleanQuery) || gn.name_si.includes(rawQuery) || gn.name_ta.includes(rawQuery)) {
      score = 50;
    } else if (codeLower.includes(cleanQuery)) {
      score = 40;
    }

    if (score > 0) {
      scored.push({ gn, score });
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.gn.name_en.length !== b.gn.name_en.length) {
      return a.gn.name_en.length - b.gn.name_en.length;
    }
    return a.gn.name_en.localeCompare(b.gn.name_en);
  });

  const results: GNDivision[] = [];
  const max = Math.min(scored.length, limit);
  for (let i = 0; i < max; i++) {
    const gn = scored[i].gn;
    results.push(
      lang === 'en'
        ? gn
        : {
            ...gn,
            name: lang === 'si' ? gn.name_si : lang === 'ta' ? gn.name_ta : gn.name_en
          }
    );
  }

  return results;
}

export type { Village, VillageSearchOptions } from './types';

/**
 * Alias for GN_DIVISIONS.
 * Represents all 14,000+ official villages and wards (Grama Niladhari divisions) in Sri Lanka.
 */
export const VILLAGES: readonly GNDivision[] = GN_DIVISIONS;

/**
 * Alias for getGNDivisions.
 * Returns all villages (Grama Niladhari divisions) in Sri Lanka.
 */
export const getVillages = getGNDivisions;

/**
 * Alias for getGNDivisionsByDSD.
 * Returns all villages within a Divisional Secretariat (DS) division.
 */
export const getVillagesByDivision = getGNDivisionsByDSD;

/**
 * Alias for getGNDivisionsByDistrict.
 * Returns all villages within a district.
 */
export const getVillagesByDistrict = getGNDivisionsByDistrict;

/**
 * Alias for getGNDivisionsByProvince.
 * Returns all villages within a province.
 */
export const getVillagesByProvince = getGNDivisionsByProvince;

/**
 * Alias for findGNByCode.
 * Finds a village by its official GN code.
 */
export const findVillageByCode = findGNByCode;

/**
 * Alias for searchGN.
 * Searches villages across English, Sinhala, Tamil, or GN code.
 */
export const searchVillages = searchGN;


