import { describe, it, expect } from 'vitest';
import {
  getGNDivisions,
  getGNDivisionsByDSD,
  getGNDivisionsByDistrict,
  getGNDivisionsByProvince,
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

  it('should filter GN divisions by Province', () => {
    const westernGNs = getGNDivisionsByProvince('Western');
    expect(westernGNs.length).toBeGreaterThan(1000);
    expect(westernGNs.every((g) => ['colombo', 'gampaha', 'kalutara'].includes(g.district.toLowerCase()))).toBe(true);

    const wpByCode = getGNDivisionsByProvince('WP');
    expect(wpByCode).toHaveLength(westernGNs.length);
  });

  it('should find GN division by code', () => {
    const gn = findGNByCode('005');
    expect(gn).toBeDefined();
    expect(gn?.name_en).toBe('Sammanthranapura');
  });

  it('should search GN divisions across Sinhala, Tamil, and English with relevance ranking', () => {
    const enSearch = searchGN('Mattakkuliya');
    expect(enSearch.length).toBeGreaterThan(0);
    expect(enSearch[0].name_en).toBe('Mattakkuliya');

    // Relevance ranking should place exact match "Modara" above partial matches like "Thummodara" or "Demodarawatta"
    const modaraSearch = searchGN('Modara');
    expect(modaraSearch.length).toBeGreaterThan(0);
    expect(modaraSearch[0].name_en).toBe('Modara');
    expect(modaraSearch[0].division).toBe('Colombo');

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

  describe('Village Aliases', () => {
    it('should export VILLAGES matching GN_DIVISIONS', async () => {
      const { VILLAGES, GN_DIVISIONS } = await import('../src/gn');
      expect(VILLAGES).toBe(GN_DIVISIONS);
    });

    it('should provide getVillages alias', async () => {
      const { getVillages } = await import('../src/gn');
      const list = getVillages();
      expect(list.length).toBeGreaterThan(14000);
    });

    it('should provide getVillagesByDivision alias', async () => {
      const { getVillagesByDivision } = await import('../src/gn');
      const colomboVillages = getVillagesByDivision('Colombo');
      expect(colomboVillages.length).toBeGreaterThan(20);
      expect(colomboVillages.every((v) => v.division === 'Colombo')).toBe(true);
    });

    it('should provide getVillagesByDistrict alias', async () => {
      const { getVillagesByDistrict } = await import('../src/gn');
      const kandyVillages = getVillagesByDistrict('Kandy');
      expect(kandyVillages.length).toBeGreaterThan(500);
    });

    it('should provide getVillagesByProvince alias', async () => {
      const { getVillagesByProvince } = await import('../src/gn');
      const westernVillages = getVillagesByProvince('Western');
      expect(westernVillages.length).toBeGreaterThan(1000);
    });

    it('should provide findVillageByCode alias', async () => {
      const { findVillageByCode } = await import('../src/gn');
      const village = findVillageByCode('005');
      expect(village).toBeDefined();
      expect(village?.name_en).toBe('Sammanthranapura');
    });

    it('should provide searchVillages alias', async () => {
      const { searchVillages } = await import('../src/gn');
      const results = searchVillages('Mattakkuliya');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name_en).toBe('Mattakkuliya');
    });
  });
});

