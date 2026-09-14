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
