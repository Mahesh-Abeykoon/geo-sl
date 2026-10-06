import divisionsData from './data/divisions.json';
import type { Division, QueryOptions } from './types';

export const DIVISIONS: readonly Division[] = Object.freeze(
  divisionsData.map((d: any) =>
    Object.freeze({
      name_en: d.name_en,
      name_si: d.name_si,
      name_ta: d.name_ta,
      district: d.district,
      province: d.province
    })
  )
);

/**
 * Returns Divisional Secretariat (DS) divisions, optionally filtered by district.
 *
 * @param districtOrOptions - District name or query options.
 * @param options - Query options if district was specified as first argument.
 */
export function getDivisions(
  districtOrOptions?: string | QueryOptions,
  options?: QueryOptions
): Array<Division & { name: string }> {
  let districtFilter: string | undefined;
  let opts: QueryOptions | undefined = options;

  if (typeof districtOrOptions === 'string') {
    districtFilter = districtOrOptions;
  } else if (districtOrOptions && typeof districtOrOptions === 'object') {
    opts = districtOrOptions;
  }

  const lang = opts?.lang || 'en';

  let filtered: readonly Division[] = DIVISIONS;
  if (districtFilter) {
    const norm = districtFilter.trim().toLowerCase();
    filtered = DIVISIONS.filter((d) => d.district.toLowerCase() === norm);
  }

  return filtered.map((d) => ({
    ...d,
    name: lang === 'si' ? d.name_si : lang === 'ta' ? d.name_ta : d.name_en
  }));
}

/**
 * Returns all Divisional Secretariat (DS) divisions in a district.
 *
 * @param district - District name (e.g. 'Colombo').
 * @param options - Query options including language selection.
 */
export function getDivisionsByDistrict(
  district: string,
  options?: QueryOptions
): Array<Division & { name: string }> {
  return getDivisions(district, options);
}

/**
 * Returns all Divisional Secretariat (DS) divisions in a province.
 *
 * @param province - Province name (e.g. 'Western').
 * @param options - Query options including language selection.
 */
export function getDivisionsByProvince(
  province: string,
  options?: QueryOptions
): Array<Division & { name: string }> {
  const norm = province.trim().toLowerCase();
  const filtered = DIVISIONS.filter((d) => d.province.toLowerCase() === norm);
  const lang = options?.lang || 'en';
  return filtered.map((d) => ({
    ...d,
    name: lang === 'si' ? d.name_si : lang === 'ta' ? d.name_ta : d.name_en
  }));
}

const DIVISION_NAME_MAP = new Map<string, Division>();
for (const d of DIVISIONS) {
  DIVISION_NAME_MAP.set(d.name_en.toLowerCase(), d);
  DIVISION_NAME_MAP.set(d.name_si.trim(), d);
  DIVISION_NAME_MAP.set(d.name_ta.trim(), d);
}

/**
 * Finds a Divisional Secretariat (DS) division by name (English, Sinhala, or Tamil).
 *
 * @param name - Division name (e.g. 'Colombo', 'මහනුවර', 'கண்டி').
 * @param options - Query options including language selection.
 *
 * @example
 * getDivision('Colombo') // => Colombo Division
 * getDivision('කඩුවෙල')  // => Kaduwela Division
 */
export function getDivision(
  name: string,
  options?: QueryOptions
): (Division & { name: string }) | undefined {
  if (!name || typeof name !== 'string') return undefined;
  const raw = name.trim();
  const d = DIVISION_NAME_MAP.get(raw.toLowerCase()) || DIVISION_NAME_MAP.get(raw);
  if (!d) return undefined;

  const lang = options?.lang || 'en';
  return {
    ...d,
    name: lang === 'si' ? d.name_si : lang === 'ta' ? d.name_ta : d.name_en
  };
}

