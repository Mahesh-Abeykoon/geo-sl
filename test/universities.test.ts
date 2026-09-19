import { describe, it, expect } from 'vitest';
import {
  UNIVERSITIES,
  getUniversities,
  getUniversity,
  getUniversitiesByDistrict,
  getUniversitiesByProvince,
  searchUniversities
} from '../src/universities';

describe('Universities', () => {
  it('has unique ids and complete fields', () => {
    expect(new Set(UNIVERSITIES.map((u) => u.id)).size).toBe(UNIVERSITIES.length);
    for (const u of UNIVERSITIES) {
      expect(u.address).toBeTruthy();
      expect(u.postal_code).toMatch(/^\d{5}$/);
      expect(u.province).toBeTruthy();
    }
  });

  it('splits government and private', () => {
    expect(getUniversities('government').length).toBeGreaterThanOrEqual(17);
    expect(getUniversities('private').length).toBeGreaterThan(0);
    expect(getUniversities()).toHaveLength(UNIVERSITIES.length);
  });

  it('looks up by id, name and short name', () => {
    expect(getUniversity('UoC')?.name).toBe('University of Colombo');
    expect(getUniversity('university of peradeniya')?.city).toBe('Peradeniya');
    expect(getUniversity('nope')).toBeUndefined();
  });

  it('filters by district and province', () => {
    expect(getUniversitiesByDistrict('Kandy').map((u) => u.short_name)).toContain('UoP');
    expect(getUniversitiesByDistrict('JA')[0].short_name).toBe('UoJ');
    expect(getUniversitiesByProvince('NP').length).toBe(2);
  });

  it('searches with options', () => {
    expect(searchUniversities('malabe', { type: 'private' }).length).toBeGreaterThan(0);
    expect(searchUniversities('university', { limit: 3 })).toHaveLength(3);
  });
});
