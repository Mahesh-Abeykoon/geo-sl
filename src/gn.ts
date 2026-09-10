import gnData from './data/gn.json';
import type { GNDivision, GNSearchOptions, Language, QueryOptions } from './types';

export const GN_DIVISIONS: readonly GNDivision[] = Object.freeze(
  (gnData as GNDivision[]).map((g) => Object.freeze({ ...g }))
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

// Freeze arrays
for (const [k, arr] of DSD_MAP.entries()) {
  DSD_MAP.set(k, Object.freeze(arr) as any);
}
for (const [k, arr] of DISTRICT_MAP.entries()) {
  DISTRICT_MAP.set(k, Object.freeze(arr) as any);
}

/**
 * Returns all Grama Niladhari (GN) divisions. Zero allocations when called without language.
 */
export function getGNDivisions(optionsOrLang?: QueryOptions | Language): readonly GNDivision[] | GNDivision[] {
  const lang = typeof optionsOrLang === 'string' ? optionsOrLang : optionsOrLang?.lang;
  if (!lang || lang === 'en') return GN_DIVISIONS;

  return GN_DIVISIONS.map((gn) => ({
    ...gn,
    name_en: lang === 'si' ? gn.name_si : lang === 'ta' ? gn.name_ta : gn.name_en
  }));
}

/**
 * Direct O(1) lookup of Grama Niladhari divisions by Divisional Secretariat (DS) Division.
 */
export function getGNDivisionsByDSD(divisionName: string, options?: QueryOptions): readonly GNDivision[] {
  if (!divisionName) return [];
  const clean = divisionName.trim().toLowerCase();
  const list = DSD_MAP.get(clean) || [];

  const lang = options?.lang;
  if (!lang || lang === 'en') return list;

  return list.map((gn) => ({
    ...gn,
    name_en: lang === 'si' ? gn.name_si : lang === 'ta' ? gn.name_ta : gn.name_en
  }));
}

/**
 * Direct O(1) lookup of Grama Niladhari divisions by District name.
 */
export function getGNDivisionsByDistrict(districtName: string, options?: QueryOptions): readonly GNDivision[] {
  if (!districtName) return [];
  const clean = districtName.trim().toLowerCase();
  const list = DISTRICT_MAP.get(clean) || [];

  const lang = options?.lang;
  if (!lang || lang === 'en') return list;

  return list.map((gn) => ({
    ...gn,
    name_en: lang === 'si' ? gn.name_si : lang === 'ta' ? gn.name_ta : gn.name_en
  }));
}

/**
 * Direct O(1) lookup of a Grama Niladhari division by its GN code.
 */
export function findGNByCode(code: string, options?: QueryOptions): GNDivision | undefined {
  if (!code) return undefined;
  const match = CODE_MAP.get(code.trim().toLowerCase());
  if (!match) return undefined;

  const lang = options?.lang;
  if (!lang || lang === 'en') return match;

  return {
    ...match,
    name_en: lang === 'si' ? match.name_si : lang === 'ta' ? match.name_ta : match.name_en
  };
}

/**
 * Fuzzy search across Grama Niladhari divisions by name (English, Sinhala, Tamil) or GN code.
 */
export function searchGN(query: string, options?: GNSearchOptions): GNDivision[] {
  if (!query || query.trim() === '') return [];

  const cleanQuery = query.trim().toLowerCase();
  const limit = options?.limit || 20;
  const lang = options?.lang || 'en';

  const results: GNDivision[] = [];

  for (const gn of GN_DIVISIONS) {
    if (options?.district && gn.district.toLowerCase() !== options.district.toLowerCase()) {
      continue;
    }
    if (options?.division && gn.division.toLowerCase() !== options.division.toLowerCase()) {
      continue;
    }

    const matchEn = gn.name_en.toLowerCase().includes(cleanQuery);
    const matchSi = gn.name_si.includes(cleanQuery);
    const matchTa = gn.name_ta.includes(cleanQuery);
    const matchCode = gn.code.toLowerCase().includes(cleanQuery);

    if (matchEn || matchSi || matchTa || matchCode) {
      results.push(
        lang === 'en'
          ? gn
          : {
              ...gn,
              name_en: lang === 'si' ? gn.name_si : lang === 'ta' ? gn.name_ta : gn.name_en
            }
      );

      if (results.length >= limit) break;
    }
  }

  return results;
}

