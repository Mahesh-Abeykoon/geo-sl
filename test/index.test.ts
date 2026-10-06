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
  getCity,
  getCityByName,
  getCityByPostalCode,
  getCitiesByDistrict,
  getPostalCode,
  lookupPostalCode,
  lookupAllByPostalCode,
  search,
  getDistance,
  getNearestCity,
  getCitiesWithinRadius,
  getCascadingData,
  getAdministrativeCascadingData,
  toSelectOptions,
  getDivisions,
  getDivision,
  getDivisionsByDistrict,
  getDivisionsByProvince,
  getName,
  isValidPostalCode
} from '../src/index';
import {
  getBanks,
  getBankByCode,
  getBranches,
  searchBanks,
  searchAllBranches,
  getRoutingNumber,
  parseRoutingNumber,
  validateRoutingNumber
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

  it('should get postal code by city name and handle zero-padded number variations across languages', () => {
    expect(getPostalCode('Athurugiriya')).toBe('10150');
    expect(getPostalCode('Colombo 1')).toBe('00100');
    expect(getPostalCode('Colombo 01')).toBe('00100');
    expect(getPostalCode('colombo')).toBe('00100');
    // Trilingual Colombo GPO default resolution
    expect(getPostalCode('කොළඹ')).toBe('00100');
    expect(getPostalCode('கொழும்பு')).toBe('00100');
    expect(getPostalCode('කොළඹ 1')).toBe('00100');
    expect(getPostalCode('කොළඹ 01')).toBe('00100');
    expect(getPostalCode('கொழும்பு 01')).toBe('00100');
  });

  it('should support direct getCityByName() and getCity() lookups', () => {
    const kandy = getCityByName('Kandy');
    expect(kandy).toBeDefined();
    expect(kandy?.postal_code).toBe('20000');

    const kandySi = getCityByName('මහනුවර');
    expect(kandySi).toBeDefined();
    expect(kandySi?.postal_code).toBe('20000');

    // getCity by code
    const fort = getCity('00100');
    expect(fort).toBeDefined();
    expect(fort?.name_en).toBe('Colombo 1');

    // getCity by name
    const athurugiriya = getCity('Athurugiriya');
    expect(athurugiriya).toBeDefined();
    expect(athurugiriya?.postal_code).toBe('10150');
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

    // Zero-padded query normalization (colombo 05 -> Colombo 5)
    const colombo5Results = search('colombo 05');
    expect(colombo5Results.length).toBeGreaterThan(0);
    expect(colombo5Results[0].name_en).toBe('Colombo 5');

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

  it('should calculate distance and perform proximity lookups with geospatial helpers', () => {
    // Colombo to Kandy distance (~95-100 km)
    const colomboCoords = { latitude: 6.9271, longitude: 79.8612 };
    const kandyCoords = { latitude: 7.2906, longitude: 80.6337 };
    const dist = getDistance(colomboCoords, kandyCoords);
    expect(dist).not.toBeNull();
    expect(dist).toBeGreaterThan(90);
    expect(dist).toBeLessThan(110);

    // Nearest city to Colombo Fort coordinates
    const nearest = getNearestCity(6.9271, 79.8612);
    expect(nearest).toBeDefined();
    expect(nearest?.district).toBe('Colombo');
    expect(nearest?.distanceKm).toBeLessThan(5);

    // Cities within 10 km radius of Colombo
    const nearby = getCitiesWithinRadius(6.9271, 79.8612, 10);
    expect(nearby.length).toBeGreaterThan(5);
    expect(nearby[0].distanceKm).toBeLessThanOrEqual(nearby[1].distanceKm); // sorted
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

  it('should find a division by name with getDivision()', () => {
    const colombo = getDivision('Colombo');
    expect(colombo).toBeDefined();
    expect(colombo?.district).toBe('Colombo');

    const kaduwela = getDivision('කඩුවෙල');
    expect(kaduwela).toBeDefined();
    expect(kaduwela?.name_en).toBe('Kaduwela');
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

describe('CBSL Bank & Branch Codes and LankaPay Routing', () => {
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

  it('should search banks by name or code', () => {
    const searchRes = searchBanks('Ceylon');
    expect(searchRes.length).toBeGreaterThan(0);
    expect(searchRes[0].name).toContain('Bank of Ceylon');

    const codeRes = searchBanks('7010');
    expect(codeRes.length).toBe(1);
    expect(codeRes[0].name).toContain('Bank of Ceylon');
  });

  it('should search branches across all banks', () => {
    const results = searchAllBranches('City Office');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.bankCode === '7010')).toBe(true);
  });

  it('should construct, parse, and validate LankaPay 7-digit routing numbers', () => {
    // Construction
    const routingNum = getRoutingNumber('7010', '1');
    expect(routingNum).toBe('7010001');

    // Parsing
    const parsed = parseRoutingNumber('7010001');
    expect(parsed.isValid).toBe(true);
    expect(parsed.bank?.name).toContain('Bank of Ceylon');
    expect(parsed.branch?.name).toContain('City Office');

    // Validation
    expect(validateRoutingNumber('7010001')).toBe(true);
    expect(validateRoutingNumber('7010-001')).toBe(true);
    expect(validateRoutingNumber('9999999')).toBe(false);
    expect(validateRoutingNumber('invalid')).toBe(false);
  });
});

describe('Cascading Form Data', () => {
  it('should build a 3-level hierarchy for React/Vue dropdown forms with trilingual metadata', () => {
    const tree = getCascadingData({ lang: 'en' });
    expect(tree).toHaveLength(9);

    const western = tree.find((p) => p.code === 'WP');
    expect(western).toBeDefined();
    expect(western?.name_en).toBe('Western');
    expect(western?.name_si).toBe('බස්නාහිර');
    expect(western?.districts).toHaveLength(3);

    const colombo = western?.districts.find((d) => d.code === 'CO');
    expect(colombo).toBeDefined();
    expect(colombo?.name_en).toBe('Colombo');
    expect(colombo?.cities.length).toBeGreaterThan(20);
    expect(colombo?.cities[0].name_en).toBeDefined();
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


