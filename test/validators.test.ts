import { describe, it, expect } from 'vitest';
import {
  validateNIC,
  parseNIC,
  convertOldNICToNew,
  validatePhone,
  parsePhone,
  formatPhone,
  validatePostalCode
} from '../src/index';

describe('Sri Lankan NIC Validator & Parser', () => {
  it('should parse valid Old NIC for a male citizen', () => {
    // 952134567V -> Year 1995, Day 213 (Aug 1), male, can vote
    const res = parseNIC('952134567V');
    expect(res).not.toBeNull();
    expect(res?.isValid).toBe(true);
    expect(res?.format).toBe('old');
    expect(res?.birthYear).toBe(1995);
    expect(res?.gender).toBe('male');
    expect(res?.birthDate).toBe('1995-07-31');
    expect(res?.canVote).toBe(true);
  });

  it('should parse valid Old NIC for a female citizen', () => {
    // 926521234V -> Year 1992, Day 652 (>500 -> Female, Day 152 = May 31)
    const res = parseNIC('926521234v');
    expect(res).not.toBeNull();
    expect(res?.isValid).toBe(true);
    expect(res?.format).toBe('old');
    expect(res?.birthYear).toBe(1992);
    expect(res?.gender).toBe('female');
    expect(res?.birthDate).toBe('1992-05-31');
  });

  it('should parse valid New 12-digit NIC', () => {
    // 200021301234 -> Year 2000, Day 213
    const res = parseNIC('200021301234');
    expect(res).not.toBeNull();
    expect(res?.isValid).toBe(true);
    expect(res?.format).toBe('new');
    expect(res?.birthYear).toBe(2000);
    expect(res?.gender).toBe('male');
    expect(res?.birthDate).toBe('2000-07-31');
  });

  it('should reject invalid NIC formats', () => {
    expect(validateNIC('')).toBe(false);
    expect(validateNIC('12345')).toBe(false);
    expect(validateNIC('952134567A')).toBe(false); // invalid letter
    expect(validateNIC('959994567V')).toBe(false); // day > 366
  });

  it('should convert Old NIC to New 12-digit format', () => {
    const converted = convertOldNICToNew('952134567V');
    expect(converted).toBe('199521304567');
  });
});

describe('Sri Lankan Phone Validator & Formatter', () => {
  it('should validate and parse Dialog mobile numbers', () => {
    const res1 = parsePhone('0771234567');
    expect(res1).not.toBeNull();
    expect(res1?.isValid).toBe(true);
    expect(res1?.type).toBe('mobile');
    expect(res1?.operator).toBe('Dialog');
    expect(res1?.formatted.international).toBe('+94 77 123 4567');
    expect(res1?.formatted.e164).toBe('+94771234567');

    const res2 = parsePhone('+94 76 987 6543');
    expect(res2?.isValid).toBe(true);
    expect(res2?.operator).toBe('Dialog');
  });

  it('should validate and parse Mobitel mobile numbers', () => {
    const res = parsePhone('0712345678');
    expect(res?.isValid).toBe(true);
    expect(res?.operator).toBe('Mobitel');
    expect(res?.formatted.local).toBe('071 234 5678');
  });

  it('should validate and identify fixed line area codes', () => {
    const res = parsePhone('0112345678'); // Colombo
    expect(res?.isValid).toBe(true);
    expect(res?.type).toBe('fixed');
    expect(res?.area).toBe('Colombo');

    const kandyRes = parsePhone('0812345678'); // Kandy
    expect(kandyRes?.isValid).toBe(true);
    expect(kandyRes?.area).toBe('Kandy');
  });

  it('should reject invalid phone numbers', () => {
    expect(validatePhone('')).toBe(false);
    expect(validatePhone('077123')).toBe(false); // too short
    expect(validatePhone('0991234567')).toBe(false); // non-existent SL prefix
  });

  it('should format numbers with formatPhone()', () => {
    expect(formatPhone('0771234567', 'e164')).toBe('+94771234567');
    expect(formatPhone('0771234567', 'international')).toBe('+94 77 123 4567');
    expect(formatPhone('+94771234567', 'local')).toBe('077 123 4567');
  });
});

describe('Postal Code Validator', () => {
  it('should validate 5-digit Sri Lankan postal code format', () => {
    expect(validatePostalCode('00100')).toBe(true); // Colombo Fort
    expect(validatePostalCode('20000')).toBe(true); // Kandy
    expect(validatePostalCode('80000')).toBe(true); // Galle
    expect(validatePostalCode('abcde')).toBe(false);
    expect(validatePostalCode('123')).toBe(false);
    expect(validatePostalCode('123456')).toBe(false);
  });
});
