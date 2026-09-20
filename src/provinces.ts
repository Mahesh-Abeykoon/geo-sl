import provincesData from './data/provinces.json';
import type { Language, Province, ProvinceCode, QueryOptions } from './types';

export const PROVINCES: readonly Province[] = Object.freeze(
  (provincesData as any[]).map((p) =>
    Object.freeze({
      id: p.id,
      code: p.code as ProvinceCode,
      name: p.name_en,
      name_en: p.name_en,
      name_si: p.name_si,
      name_ta: p.name_ta
    })
  )
);

export const PROVINCE_MAP: Readonly<Record<ProvinceCode, Province>> = Object.freeze(
  PROVINCES.reduce((acc, p) => {
    acc[p.code] = p;
    return acc;
  }, {} as Record<ProvinceCode, Province>)
);

const CODE_OR_ID_MAP = new Map<string, Province>();
for (const p of PROVINCES) {
  CODE_OR_ID_MAP.set(p.code.toUpperCase(), p);
  CODE_OR_ID_MAP.set(p.id, p);
  CODE_OR_ID_MAP.set(p.name_en.toLowerCase(), p);
}

/**
 * Finds a province by code (e.g. 'WP'), ID ('1'), or English name ('Western').
 *
 * @param codeOrId - Province code, ID, or name.
 */
export function getProvince(codeOrId: ProvinceCode | string): Province | undefined {
  if (!codeOrId || typeof codeOrId !== 'string') return undefined;
  const key = codeOrId.trim();
  return CODE_OR_ID_MAP.get(key.toUpperCase()) || CODE_OR_ID_MAP.get(key.toLowerCase()) || CODE_OR_ID_MAP.get(key);
}

/**
 * Returns the localized province name for a given province code or ID.
 *
 * @param codeOrId - Province code or ID.
 * @param lang - Target language ('en' | 'si' | 'ta'). Default is 'en'.
 *
 * @example
 * getProvinceName('WP', 'si') // => "බස්නාහිර"
 * getProvinceName('WP', 'ta') // => "மேற்கு"
 */
export function getProvinceName(codeOrId: ProvinceCode | string, lang: Language = 'en'): string | undefined {
  const p = getProvince(codeOrId);
  if (!p) return undefined;
  if (lang === 'si') return p.name_si;
  if (lang === 'ta') return p.name_ta;
  return p.name_en;
}

/**
 * Alias for getProvince.
 *
 * @see getProvince
 */
export function getProvinceByCode(code: string, options?: QueryOptions): Province | undefined {
  const p = getProvince(code);
  if (!p) return undefined;
  const lang = options?.lang;
  if (!lang || lang === 'en') return p;
  return {
    ...p,
    name: lang === 'si' ? p.name_si : p.name_ta
  };
}

/**
 * Returns all 9 provinces of Sri Lanka.
 *
 * @param optionsOrLang - Query options or language code.
 */
export function getProvinces(optionsOrLang?: QueryOptions | Language): readonly Province[] | Province[] {
  const lang = typeof optionsOrLang === 'string' ? optionsOrLang : optionsOrLang?.lang;
  if (!lang || lang === 'en') {
    return PROVINCES;
  }
  return PROVINCES.map((p) => ({
    ...p,
    name: lang === 'si' ? p.name_si : p.name_ta
  }));
}

