export * from './types';
export * from './provinces';
export * from './districts';
export * from './cities';
export * from './divisions';
export * from './validators';
export * from './universities';

import { PROVINCES } from './provinces';
import { getDistrictsByProvince } from './districts';
import { getCitiesByDistrict } from './cities';
import { getDivisionsByDistrict } from './divisions';
import type {
  CascadingProvince,
  CascadingAdministrativeProvince,
  Language,
  QueryOptions,
  SelectOption
} from './types';

const CASCADING_CACHE = new Map<Language, CascadingProvince[]>();
const CASCADING_ADMIN_CACHE = new Map<Language, CascadingAdministrativeProvince[]>();

/**
 * Generates a nested hierarchy (Province -> District -> Cities) for multi-level select forms.
 *
 * @param options - Query options including language selection ('en' | 'si' | 'ta').
 */
export function getCascadingData(options?: QueryOptions): CascadingProvince[] {
  const lang: Language = options?.lang || 'en';

  if (CASCADING_CACHE.has(lang)) {
    return CASCADING_CACHE.get(lang)!;
  }

  const result: CascadingProvince[] = PROVINCES.map((p) => {
    const provName = lang === 'si' ? p.name_si : lang === 'ta' ? p.name_ta : p.name_en;
    const pDistricts = getDistrictsByProvince(p.code);

    return {
      id: p.id,
      code: p.code,
      name: provName,
      districts: pDistricts.map((d) => {
        const distName = lang === 'si' ? d.name_si : lang === 'ta' ? d.name_ta : d.name_en;
        const dCities = getCitiesByDistrict(d.code);

        return {
          id: d.id,
          code: d.code,
          name: distName,
          cities: dCities.map((c) => ({
            name: lang === 'si' ? c.name_si : lang === 'ta' ? c.name_ta : c.name_en,
            postal_code: c.postal_code,
            is_sub_post_office: c.is_sub_post_office
          }))
        };
      })
    };
  });

  CASCADING_CACHE.set(lang, result);
  return result;
}

/**
 * Generates a nested administrative hierarchy (Province -> District -> Divisional Secretariats)
 * for official, government, and KYC multi-level select forms.
 *
 * @param options - Query options including language selection ('en' | 'si' | 'ta').
 */
export function getAdministrativeCascadingData(options?: QueryOptions): CascadingAdministrativeProvince[] {
  const lang: Language = options?.lang || 'en';

  if (CASCADING_ADMIN_CACHE.has(lang)) {
    return CASCADING_ADMIN_CACHE.get(lang)!;
  }

  const result: CascadingAdministrativeProvince[] = PROVINCES.map((p) => {
    const provName = lang === 'si' ? p.name_si : lang === 'ta' ? p.name_ta : p.name_en;
    const pDistricts = getDistrictsByProvince(p.code);

    return {
      id: p.id,
      code: p.code,
      name: provName,
      districts: pDistricts.map((d) => {
        const distName = lang === 'si' ? d.name_si : lang === 'ta' ? d.name_ta : d.name_en;
        const dDivisions = getDivisionsByDistrict(d.name_en);

        return {
          id: d.id,
          code: d.code,
          name: distName,
          divisions: dDivisions.map((div) => ({
            name: lang === 'si' ? div.name_si : lang === 'ta' ? div.name_ta : div.name_en,
            name_en: div.name_en,
            name_si: div.name_si,
            name_ta: div.name_ta
          }))
        };
      })
    };
  });

  CASCADING_ADMIN_CACHE.set(lang, result);
  return result;
}

/**
 * Utility helper to convert any array of items into standard `{ label: string, value: string }`
 * options formatted for `<select>`, React-Select, Shadcn Combobox, MUI Select, etc.
 *
 * @param items - Array of data objects (provinces, districts, cities, divisions, villages, etc.)
 * @param labelKey - Property key or mapper function returning the display label.
 * @param valueKey - Property key or mapper function returning the option value.
 *
 * @example
 * toSelectOptions(getProvinces(), 'name', 'code')
 * // => [{ label: 'Western', value: 'WP' }, ...]
 *
 * toSelectOptions(cities, (c) => `${c.name} (${c.postal_code})`, 'postal_code')
 * // => [{ label: 'Colombo 1 (00100)', value: '00100' }, ...]
 */
export function toSelectOptions<T>(
  items: readonly T[] | T[],
  labelKey: keyof T | ((item: T) => string),
  valueKey: keyof T | ((item: T) => string)
): SelectOption[] {
  return items.map((item) => {
    const label = typeof labelKey === 'function' ? labelKey(item) : String(item[labelKey] ?? '');
    const value = typeof valueKey === 'function' ? valueKey(item) : String(item[valueKey] ?? '');
    return { label, value };
  });
}

