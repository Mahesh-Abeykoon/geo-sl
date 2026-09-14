export type Language = 'en' | 'si' | 'ta';

export type ProvinceCode = 'WP' | 'CP' | 'SP' | 'NP' | 'EP' | 'NWP' | 'NCP' | 'UP' | 'SGP';

export type DistrictAbbreviation =
  | 'CO'
  | 'GQ'
  | 'KT'
  | 'KY'
  | 'MT'
  | 'NW'
  | 'GL'
  | 'MH'
  | 'HB'
  | 'JA'
  | 'KO'
  | 'MB'
  | 'VA'
  | 'MP'
  | 'BC'
  | 'AR'
  | 'TC'
  | 'KG'
  | 'PX'
  | 'AD'
  | 'PR'
  | 'BD'
  | 'MJ'
  | 'RN'
  | 'KE';

export type DistrictCode = DistrictAbbreviation;

export interface TrilingualName {
  name_en: string;
  name_si: string;
  name_ta: string;
}

export function getName(item: TrilingualName, lang?: Language): string {
  if (lang === 'si') return item.name_si;
  if (lang === 'ta') return item.name_ta;
  return item.name_en;
}

export interface Province {
  id: string;
  code: ProvinceCode;
  name: string;
  name_en: string;
  name_si: string;
  name_ta: string;
}

export interface District {
  id: string;
  code: DistrictAbbreviation;
  name: string;
  name_en: string;
  name_si: string;
  name_ta: string;
  province_id: string;
  province_code: ProvinceCode;
  province_name: string;
}

export interface City {
  name: string;
  name_en: string;
  name_si: string;
  name_ta: string;
  postal_code: string;
  district: string;
  district_code: string;
  district_abbr: DistrictAbbreviation;
  province: string;
  province_code: ProvinceCode;
  is_sub_post_office: boolean;
  latitude: number | null;
  longitude: number | null;
}

export interface Division {
  name_en: string;
  name_si: string;
  name_ta: string;
  district: string;
  province: string;
}

export interface GNDivision {
  code: string;
  name: string;
  name_en: string;
  name_si: string;
  name_ta: string;
  division: string;
  district: string;
}

export interface GNSearchOptions extends QueryOptions {
  limit?: number;
  division?: string;
  district?: string;
}

export interface Branch {
  id: number;
  code: string;
  name: string;
}

export interface Bank {
  id: number;
  code: string;
  name: string;
  branches: Branch[];
}

export interface QueryOptions {
  lang?: Language;
}

export interface SearchOptions extends QueryOptions {
  limit?: number;
  district?: string;
  province?: string;
}

export interface CascadingDistrict {
  id: string;
  code: DistrictAbbreviation;
  name: string;
  cities: Array<{
    name: string;
    postal_code: string;
    is_sub_post_office: boolean;
  }>;
}

export interface CascadingProvince {
  id: string;
  code: ProvinceCode;
  name: string;
  districts: CascadingDistrict[];
}
