import gnData from './data/gn.json';
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
 * Searches Grama Niladhari divisions by name (English, Sinhala, Tamil) or GN code.
 *
 * @param query - Search term.
 * @param options - Search options including limit, division, district, and language.
 */
export function searchGN(query: string, options?: GNSearchOptions): GNDivision[] {
  if (!query || query.trim() === '') return [];

  const cleanQuery = query.trim().toLowerCase();
  const limit = options?.limit ?? 20;
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
              name: lang === 'si' ? gn.name_si : lang === 'ta' ? gn.name_ta : gn.name_en
            }
      );

      if (results.length >= limit) break;
    }
  }

  return results;
}

