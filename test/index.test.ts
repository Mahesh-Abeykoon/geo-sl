import { describe, it, expect } from 'vitest';
import {
  getProvinces,
  getProvince,
  PROVINCE_MAP,
  getProvinceName,
  getProvinceByCode,
  getDistricts,
  getDistrict,
  DISTRICT_MAP,
  getDistrictName,
  getDistrictByCode,
  getDistrictsByProvince,
  getCities,
  getCityByPostalCode,
  getCitiesByDistrict,
  getPostalCode,
  lookupPostalCode,
  lookupAllByPostalCode,
  search,
  getCascadingData,
  getAdministrativeCascadingData,
  toSelectOptions,
  getDivisions,
  getDivisionsByDistrict,
  getDivisionsByProvince,
  getName,
  isValidPostalCode
} from '../src/index';
import {
  getBanks,
  getBankByCode,
  getBranches
} from '../src/banks';

describe('Provinces', () => {
  it('should return exactly 9 provinces', () => {
    const provinces = getProvinces();
    expect(provinces).toHaveLength(9);
  });

  it('should support trilingual names', () => {
    const wpEn = getProvinceByCode('WP', { lang: 'en' });
    expect(wpEn?.name).toBe('Western');

    const wpSi = getProvinceByCode('WP', { lang: 'si' });
    expect(wpSi?.name).toBe('බස්නාහිර');

    const wpTa = getProvinceByCode('WP', { lang: 'ta' });
    expect(wpTa?.name).toBe('மேற்கு');
  });

  it('should support direct O(1) getProvince() and PROVINCE_MAP dictionary lookup', () => {
    // Direct code lookup
    const wp = getProvince('WP');
    expect(wp).toBeDefined();
    expect(wp?.name_en).toBe('Western');
    expect(wp?.name_si).toBe('බස්නාහිර');
    expect(wp?.name_ta).toBe('மேற்கு');

    // Dictionary access with IDE autocomplete
    expect(PROVINCE_MAP.WP.name_en).toBe('Western');

    // Direct helper
    expect(getProvinceName('WP', 'si')).toBe('බස්නාහිර');
    expect(getProvinceName('WP', 'ta')).toBe('மேற்கு');
  });
});

describe('Districts', () => {
  it('should return exactly 25 districts', () => {
    const districts = getDistricts();
    expect(districts).toHaveLength(25);
  });

  it('should filter districts by province', () => {
    const westernDistricts = getDistrictsByProvince('Western');
    expect(westernDistricts).toHaveLength(3);
    const codes = westernDistricts.map((d) => d.code);
    expect(codes).toContain('CO');
    expect(codes).toContain('GQ');
    expect(codes).toContain('KT');
  });

  it('should find district by code', () => {
    const colombo = getDistrictByCode('CO');
    expect(colombo?.name_en).toBe('Colombo');
    expect(colombo?.name_si).toBe('කොළඹ');
    expect(colombo?.name_ta).toBe('கொழும்பு');

    const kandy = getDistrictByCode('KY');
    expect(kandy?.name_en).toBe('Kandy');
  });

  it('should support direct O(1) getDistrict(), DISTRICT_MAP, and getDistrictName()', () => {
    // Direct code lookup
    const colombo = getDistrict('CO');
    expect(colombo).toBeDefined();
    expect(colombo?.name_en).toBe('Colombo');
    expect(colombo?.province_code).toBe('WP');

    // Dictionary access with autocomplete
    expect(DISTRICT_MAP.KY.name_en).toBe('Kandy');
    expect(DISTRICT_MAP.KY.name_si).toBe('මහනුවර');
    expect(DISTRICT_MAP.KY.name_ta).toBe('கண்டி');

    // Direct translation helper
    expect(getDistrictName('KY', 'si')).toBe('මහනුවර');
    expect(getDistrictName('KY', 'ta')).toBe('கண்டி');

    // Generic getName helper
    expect(getName(DISTRICT_MAP.CO, 'si')).toBe('කොළඹ');
    expect(getName(DISTRICT_MAP.CO, 'ta')).toBe('கொழும்பு');
  });
});

describe('Cities & Postal Codes', () => {
  it('should contain more than 2,000 cities and post offices', () => {
    const cities = getCities();
    expect(cities.length).toBeGreaterThan(2000);
  });

  it('should lookup city by postal code accurately with O(1) getCityByPostalCode()', () => {
    const kandy = getCityByPostalCode('20000');
    expect(kandy).toBeDefined();
    expect(kandy?.district).toBe('Kandy');

    const colomboFort = getCityByPostalCode('00100');
    expect(colomboFort).toBeDefined();
    expect(colomboFort?.district).toBe('Colombo');
    expect(colomboFort?.name_en).toBe('Colombo 1');

    const galle = lookupPostalCode('80000');
    expect(galle?.district).toBe('Galle');

    const jaffna = lookupPostalCode('40000');
    expect(jaffna?.district).toBe('Jaffna');
  });

  it('should get postal code by city name and handle zero-padded number variations', () => {
    expect(getPostalCode('Athurugiriya')).toBe('10150');
    expect(getPostalCode('Colombo 1')).toBe('00100');
    expect(getPostalCode('Colombo 01')).toBe('00100');
    expect(getPostalCode('colombo')).toBe('00100');
  });

  it('should verify postal code existence with isValidPostalCode()', () => {
    expect(isValidPostalCode('00100')).toBe(true);
    expect(isValidPostalCode('10150')).toBe(true);
    expect(isValidPostalCode('20000')).toBe(true);
    expect(isValidPostalCode('99999')).toBe(false);
    expect(isValidPostalCode('invalid')).toBe(false);
  });

  it('should get cities by district', () => {
    const gampahaCities = getCitiesByDistrict('Gampaha');
    expect(gampahaCities.length).toBeGreaterThan(50);
    expect(gampahaCities.every((c) => c.district === 'Gampaha')).toBe(true);
  });

  it('should perform relevance-ranked search matching English, Sinhala, and Tamil', () => {
    // Exact/prefix match must rank ahead of district matches
    const colomboResults = search('colombo');
    expect(colomboResults.length).toBeGreaterThan(0);
    // The top results should be Colombo itself, NOT Akarawita or Batawala!
    expect(colomboResults[0].name_en).toMatch(/^Colombo/i);

    // Exact city match "Nawala" must rank before "Danawala Thiniyawala"
    const nawalaResults = search('nawala');
    expect(nawalaResults.length).toBeGreaterThan(0);
    expect(nawalaResults[0].name_en).toBe('Nawala');

    const searchEng = search('kaduwela');
    expect(searchEng.length).toBeGreaterThan(0);
    expect(searchEng.some((c) => c.name_en.toLowerCase().includes('kaduwela'))).toBe(true);

    const searchSi = search('කොළඹ');
    expect(searchSi.length).toBeGreaterThan(0);

    const searchByCode = search('10150');
    expect(searchByCode.some((c) => c.postal_code === '10150')).toBe(true);
  });

  it('should have 100% trilingual completeness (no English fallbacks in Sinhala/Tamil)', () => {
    const allCities = getCities();
    const missingSi = allCities.filter((c) => !c.name_si || c.name_si === c.name_en);
    const missingTa = allCities.filter((c) => !c.name_ta || c.name_ta === c.name_en);
    expect(missingSi).toHaveLength(0);
    expect(missingTa).toHaveLength(0);
  });
});

describe('Divisional Secretariats (DSD)', () => {
  it('should return all 340 DS divisions', () => {
    const divisions = getDivisions();
    expect(divisions.length).toBeGreaterThan(330);
  });

  it('should filter divisions by district', () => {
    const colomboDivisions = getDivisionsByDistrict('Colombo');
    expect(colomboDivisions.length).toBeGreaterThan(10);
    const names = colomboDivisions.map((d) => d.name_en.toLowerCase());
    expect(names.some((n) => n.includes('kaduwela') || n.includes('colombo'))).toBe(true);
  });

  it('should filter divisions by province', () => {
    const westernDivisions = getDivisionsByProvince('Western');
    expect(westernDivisions.length).toBeGreaterThan(20);
    // All returned divisions must belong to Western province districts
    const colomboDivs = getDivisionsByDistrict('Colombo');
    const gampahaDiv = getDivisionsByDistrict('Gampaha');
    const kalutaraDiv = getDivisionsByDistrict('Kalutara');
    const expectedTotal = colomboDivs.length + gampahaDiv.length + kalutaraDiv.length;
    expect(westernDivisions).toHaveLength(expectedTotal);
  });
});

describe('CBSL Bank & Branch Codes', () => {
  it('should return licensed banks', () => {
    const banks = getBanks();
    expect(banks.length).toBeGreaterThan(30);
  });

  it('should find Bank of Ceylon (7010) and its branches', () => {
    const boc = getBankByCode('7010');
    expect(boc).toBeDefined();
    expect(boc?.name).toContain('Bank of Ceylon');

    const branches = getBranches('7010');
    expect(branches.length).toBeGreaterThan(10);
    expect(branches.some((b) => b.name.includes('City Office') || b.name.includes('Kandy'))).toBe(true);
  });
});

describe('Cascading Form Data', () => {
  it('should build a 3-level hierarchy for React/Vue dropdown forms', () => {
    const tree = getCascadingData({ lang: 'en' });
    expect(tree).toHaveLength(9);

    const western = tree.find((p) => p.code === 'WP');
    expect(western).toBeDefined();
    expect(western?.districts).toHaveLength(3);

    const colombo = western?.districts.find((d) => d.code === 'CO');
    expect(colombo).toBeDefined();
    expect(colombo?.cities.length).toBeGreaterThan(20);
  });

  it('should build an administrative hierarchy (Province -> District -> DS Divisions)', () => {
    const adminTree = getAdministrativeCascadingData({ lang: 'en' });
    expect(adminTree).toHaveLength(9);

    const western = adminTree.find((p) => p.code === 'WP');
    expect(western).toBeDefined();
    expect(western?.districts).toHaveLength(3);

    const colombo = western?.districts.find((d) => d.code === 'CO');
    expect(colombo).toBeDefined();
    expect(colombo?.divisions.length).toBeGreaterThan(10);
    expect(colombo?.divisions.some((div) => div.name_en === 'Colombo')).toBe(true);

    // Sinhala localization
    const adminSi = getAdministrativeCascadingData({ lang: 'si' });
    const colomboSi = adminSi.find((p) => p.code === 'WP')?.districts.find((d) => d.code === 'CO');
    expect(colomboSi?.name).toBe('කොළඹ');
  });
});

describe('toSelectOptions Helper', () => {
  it('should format array items using string keys', () => {
    const provinces = getProvinces();
    const options = toSelectOptions(provinces, 'name', 'code');
    expect(options).toHaveLength(9);
    expect(options[0]).toHaveProperty('label');
    expect(options[0]).toHaveProperty('value');
    expect(options.some((o) => o.label === 'Western' && o.value === 'WP')).toBe(true);
  });

  it('should format array items using mapper functions', () => {
    const cities = getCitiesByDistrict('CO');
    const options = toSelectOptions(
      cities,
      (c) => `${c.name} (${c.postal_code})`,
      (c) => c.postal_code
    );
    expect(options.length).toBeGreaterThan(20);
    expect(options.some((o) => o.label.includes('00100') && o.value === '00100')).toBe(true);
  });
});

