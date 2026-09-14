import { describe, it, expect } from 'vitest';
import {
  getGNDivisions,
  getGNDivisionsByDSD,
  getGNDivisionsByDistrict,
  findGNByCode,
  searchGN
} from '../src/gn';

describe('Grama Niladhari (GN) Divisions', () => {
  it('should load all 14,000+ GN divisions', () => {
    const list = getGNDivisions();
    expect(list.length).toBeGreaterThan(14000);
  });

  it('should filter GN divisions by DS Division', () => {
    const colomboGNs = getGNDivisionsByDSD('Colombo');
    expect(colomboGNs.length).toBeGreaterThan(20);
    expect(colomboGNs.every((g) => g.division === 'Colombo')).toBe(true);

    const names = colomboGNs.map((g) => g.name_en.toLowerCase());
    expect(names).toContain('modara');
  });

  it('should filter GN divisions by District', () => {
    const kandyGNs = getGNDivisionsByDistrict('Kandy');
    expect(kandyGNs.length).toBeGreaterThan(500);
  });

  it('should find GN division by code', () => {
    const gn = findGNByCode('005');
    expect(gn).toBeDefined();
    expect(gn?.name_en).toBe('Sammanthranapura');
  });

  it('should search GN divisions across Sinhala, Tamil, and English', () => {
    const enSearch = searchGN('Mattakkuliya');
    expect(enSearch.length).toBeGreaterThan(0);
    expect(enSearch[0].name_en).toBe('Mattakkuliya');

    const siSearch = searchGN('මට්ටක්කුලිය');
    expect(siSearch.length).toBeGreaterThan(0);

    const taSearch = searchGN('மட்டக்குளி');
    expect(taSearch.length).toBeGreaterThan(0);
  });

  it('should preserve name_en and populate localized name when lang option is specified', () => {
    const listSi = getGNDivisions({ lang: 'si' });
    const firstSi = listSi[0];
    expect(firstSi.name).toBe(firstSi.name_si);
    // name_en must remain in English!
    expect(firstSi.name_en).not.toBe(firstSi.name_si);

    const matchTa = findGNByCode('005', { lang: 'ta' });
    expect(matchTa).toBeDefined();
    expect(matchTa?.name).toBe(matchTa?.name_ta);
    expect(matchTa?.name_en).toBe('Sammanthranapura');
  });
});
