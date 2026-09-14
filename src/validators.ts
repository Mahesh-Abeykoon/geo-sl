export interface ParsedNIC {
  isValid: boolean;
  nic: string;
  format: 'old' | 'new';
  birthYear: number;
  birthDate: string; // YYYY-MM-DD
  gender: 'male' | 'female';
  age: number;
  canVote?: boolean;
}

export interface ParsedPhone {
  isValid: boolean;
  raw: string;
  number: string;
  type: 'mobile' | 'fixed' | 'unknown';
  operator?: string;
  area?: string;
  formatted: {
    international: string;
    local: string;
    e164: string;
  };
}

const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Parses a Sri Lankan National Identity Card (NIC) number.
 * Supports both old (9 digits + V/X) and new (12 digits) formats.
 *
 * @param nic - NIC string to parse.
 * @returns ParsedNIC object with extracted demographic fields, or null if invalid.
 */
export function parseNIC(nic: string): ParsedNIC | null {
  if (!nic || typeof nic !== 'string') return null;

  const cleaned = nic.trim().toUpperCase();

  const oldRegex = /^(\d{2})(\d{3})(\d{4})([VX])$/;
  const newRegex = /^(\d{4})(\d{3})(\d{5})$/;

  let birthYear = 0;
  let dayOfYear = 0;
  let format: 'old' | 'new' = 'old';
  let canVote: boolean | undefined = undefined;

  if (oldRegex.test(cleaned)) {
    format = 'old';
    const match = cleaned.match(oldRegex)!;
    birthYear = 1900 + parseInt(match[1], 10);
    dayOfYear = parseInt(match[2], 10);
    canVote = match[4] === 'V';
  } else if (newRegex.test(cleaned)) {
    format = 'new';
    const match = cleaned.match(newRegex)!;
    birthYear = parseInt(match[1], 10);
    dayOfYear = parseInt(match[2], 10);
  } else {
    return null;
  }

  const gender: 'male' | 'female' = dayOfYear > 500 ? 'female' : 'male';
  const effectiveDays = gender === 'female' ? dayOfYear - 500 : dayOfYear;

  // Day of year must be between 1 and 366 (Sri Lanka NIC treats Feb as 29 days always)
  if (effectiveDays < 1 || effectiveDays > 366) {
    return null;
  }

  let remainingDays = effectiveDays;
  let month = 0;
  while (month < MONTH_DAYS.length && remainingDays > MONTH_DAYS[month]) {
    remainingDays -= MONTH_DAYS[month];
    month++;
  }

  const monthNum = month + 1;
  const dayNum = remainingDays;

  const pad = (n: number) => String(n).padStart(2, '0');
  const birthDate = `${birthYear}-${pad(monthNum)}-${pad(dayNum)}`;

  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  if (currentMonth < monthNum || (currentMonth === monthNum && currentDay < dayNum)) {
    age--;
  }

  return {
    isValid: true,
    nic: cleaned,
    format,
    birthYear,
    birthDate,
    gender,
    age,
    ...(canVote !== undefined ? { canVote } : {})
  };
}

/**
 * Validates whether the given string is a valid Sri Lankan NIC.
 *
 * @param nic - NIC string to validate.
 */
export function validateNIC(nic: string): boolean {
  return parseNIC(nic) !== null;
}

/**
 * Converts a 10-character Old NIC format (e.g. '952134567V') to the 12-digit New standard.
 *
 * @param oldNic - 10-character NIC string.
 * @returns 12-digit NIC string, or null if invalid.
 */
export function convertOldNICToNew(oldNic: string): string | null {
  const parsed = parseNIC(oldNic);
  if (!parsed || parsed.format !== 'old') return null;

  const digits = parsed.nic.slice(0, 9);
  return `19${digits.slice(0, 5)}0${digits.slice(5, 9)}`;
}

const MOBILE_OPERATORS: Record<string, string> = {
  '70': 'Mobitel',
  '71': 'Mobitel',
  '72': 'Hutch',
  '74': 'Dialog',
  '75': 'Airtel',
  '76': 'Dialog',
  '77': 'Dialog',
  '78': 'Hutch'
};

const AREA_CODES: Record<string, string> = {
  '11': 'Colombo',
  '21': 'Jaffna',
  '23': 'Mannar',
  '24': 'Vavuniya',
  '25': 'Anuradhapura',
  '26': 'Trincomalee',
  '27': 'Polonnaruwa',
  '31': 'Negombo',
  '32': 'Chilaw',
  '33': 'Gampaha',
  '34': 'Kalutara',
  '35': 'Kegalle',
  '36': 'Avissawella',
  '37': 'Kurunegala',
  '38': 'Panadura',
  '41': 'Matara',
  '45': 'Ratnapura',
  '47': 'Hambantota',
  '51': 'Hatton',
  '52': 'Nuwara Eliya',
  '54': 'Nawalapitiya',
  '55': 'Badulla',
  '57': 'Bandarawela',
  '63': 'Ampara',
  '65': 'Batticaloa',
  '66': 'Matale',
  '67': 'Kalmunai',
  '81': 'Kandy',
  '91': 'Galle'
};

/**
 * Parses and validates Sri Lankan telephone numbers (mobile and fixed-line).
 * Supports international (+94), local (07X, 011), and plain 9-digit formats.
 *
 * @param phone - Phone number string.
 * @returns ParsedPhone object or null if invalid.
 */
export function parsePhone(phone: string): ParsedPhone | null {
  if (!phone || typeof phone !== 'string') return null;

  // Remove whitespace, dashes, parentheses
  let digits = phone.replace(/[\s\-()]/g, '');

  // Handle +94 prefix
  if (digits.startsWith('+94')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('0094')) {
    digits = digits.slice(4);
  } else if (digits.startsWith('94')) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // A valid Sri Lankan subscriber number without leading 0 / country code has 9 digits
  if (!/^\d{9}$/.test(digits)) {
    return null;
  }

  const prefix = digits.slice(0, 2);
  const isMobile = prefix in MOBILE_OPERATORS;
  const isFixed = prefix in AREA_CODES;

  if (!isMobile && !isFixed) {
    return null;
  }

  const part1 = digits.slice(0, 2);
  const part2 = digits.slice(2, 5);
  const part3 = digits.slice(5);

  return {
    isValid: true,
    raw: phone,
    number: digits,
    type: isMobile ? 'mobile' : 'fixed',
    ...(isMobile ? { operator: MOBILE_OPERATORS[prefix] } : {}),
    ...(isFixed ? { area: AREA_CODES[prefix] } : {}),
    formatted: {
      international: `+94 ${part1} ${part2} ${part3}`,
      local: `0${part1} ${part2} ${part3}`,
      e164: `+94${digits}`
    }
  };
}

/**
 * Validates whether the given string is a valid Sri Lankan phone number.
 *
 * @param phone - Phone number string.
 */
export function validatePhone(phone: string): boolean {
  return parsePhone(phone) !== null;
}

/**
 * Formats a Sri Lankan phone number.
 *
 * @param phone - Phone number string.
 * @param style - Format style ('international' | 'local' | 'e164'). Default is 'local'.
 */
export function formatPhone(phone: string, style: 'international' | 'local' | 'e164' = 'local'): string | null {
  const parsed = parsePhone(phone);
  if (!parsed) return null;
  return parsed.formatted[style];
}

/**
 * Validates whether a string matches the Sri Lankan 5-digit postal code format.
 * To check if a code exists in the official postal database, use `isValidPostalCode()`.
 *
 * @param postalCode - Postal code string.
 *
 * @example
 * validatePostalCode('00100') // => true
 * validatePostalCode('123')   // => false
 */
export function validatePostalCode(postalCode: string): boolean {
  if (!postalCode || typeof postalCode !== 'string') return false;
  const clean = postalCode.trim();
  return /^\d{5}$/.test(clean);
}
