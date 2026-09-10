export * from './types';
export * from './provinces';
export * from './districts';
export * from './cities';
export * from './divisions';
export * from './banks';
export * from './validators';

// NOTE: Grama Niladhari (GN) data is ~3MB and is NOT included in the main bundle.
// Import it directly via the subpath: import { getGNDivisions } from 'sl-geo/gn';

import { PROVINCES } from './provinces';
import { getDistrictsByProvince } from './districts';
import { getCitiesByDistrict } from './cities';
import type { CascadingProvince, Language, QueryOptions } from './types';

const CASCADING_CACHE = new Map<Language, CascadingProvince[]>();

/**
 * Returns a nested hierarchy (Province -> District -> Cities)
 * designed specifically for cascading dropdowns in frontend checkout and registration forms.
 * Pre-computed and cached per language for ultra-fast rendering.
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
