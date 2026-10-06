import banksData from './data/banks.json';
import type { Bank, Branch, ParsedRoutingNumber } from './types';

export const BANKS: readonly Bank[] = Object.freeze(
  (banksData as any[]).map((b: any) =>
    Object.freeze({
      id: b.id,
      code: b.code,
      name: b.name,
      branches: Object.freeze(
        b.branches.map((br: any) =>
          Object.freeze({
            id: br.id,
            code: br.code,
            name: br.name
          })
        )
      ) as readonly Branch[] as Branch[]
    })
  )
);

const BANK_MAP = new Map<string, Bank>();
const BRANCH_MAP = new Map<string, Branch>();

for (const b of BANKS) {
  const codePadded = String(b.code).padStart(4, '0');
  BANK_MAP.set(codePadded, b);
  BANK_MAP.set(String(b.id), b);
  BANK_MAP.set(b.name.toLowerCase(), b);

  for (const br of b.branches) {
    const brKey = `${codePadded}:${String(br.code).padStart(3, '0')}`;
    BRANCH_MAP.set(brKey, br);
  }
}

/**
 * Returns all licensed commercial and specialized banks in Sri Lanka.
 */
export function getBanks(): readonly Bank[] {
  return BANKS;
}

/**
 * Finds a bank by its CBSL 4-digit code or internal ID.
 *
 * @param codeOrId - 4-digit CBSL bank code (e.g. '7010') or ID.
 *
 * @example
 * getBank('7010') // => Bank of Ceylon
 */
export function getBank(codeOrId: string | number): Bank | undefined {
  if (codeOrId === undefined || codeOrId === null) return undefined;
  const raw = String(codeOrId).trim();
  return BANK_MAP.get(raw.padStart(4, '0')) || BANK_MAP.get(raw) || BANK_MAP.get(raw.toLowerCase());
}

/**
 * Alias for getBank.
 *
 * @see getBank
 */
export const getBankByCode = getBank;

/**
 * Searches banks by name or 4-digit bank code.
 *
 * @param query - Bank name or bank code.
 *
 * @example
 * searchBanks('Ceylon') // => [ Bank of Ceylon ]
 * searchBanks('7010')   // => [ Bank of Ceylon ]
 */
export function searchBanks(query: string): Bank[] {
  if (!query || !query.trim()) return [...BANKS];
  const q = query.trim().toLowerCase();
  return BANKS.filter((b) => b.name.toLowerCase().includes(q) || b.code.includes(q));
}

/**
 * Returns all branches for a given bank.
 *
 * @param bankCode - 4-digit CBSL bank code.
 */
export function getBranches(bankCode: string | number): readonly Branch[] {
  const bank = getBank(bankCode);
  return bank?.branches || [];
}

/**
 * Finds a bank branch by bank code and 3-digit branch code.
 *
 * @param bankCode - 4-digit CBSL bank code.
 * @param branchCode - 3-digit branch code.
 */
export function getBranch(bankCode: string | number, branchCode: string | number): Branch | undefined {
  if (bankCode === undefined || branchCode === undefined) return undefined;
  const bCode = String(bankCode).trim().padStart(4, '0');
  const brCode = String(branchCode).trim().padStart(3, '0');
  return BRANCH_MAP.get(`${bCode}:${brCode}`);
}

/**
 * Alias for getBranch.
 *
 * @see getBranch
 */
export const getBranchByCode = getBranch;

/**
 * Searches branches within a bank by name or branch code.
 *
 * @param bankCode - 4-digit CBSL bank code.
 * @param query - Branch name or code query.
 */
export function searchBranches(bankCode: string | number, query: string): Branch[] {
  const branches = getBranches(bankCode);
  if (!query || !query.trim()) return [...branches];
  const q = query.trim().toLowerCase();
  return branches.filter((br) => br.name.toLowerCase().includes(q) || br.code.includes(q));
}

/**
 * Searches branches across all banks in Sri Lanka.
 *
 * @param query - Branch name or 3-digit branch code query.
 *
 * @example
 * searchAllBranches('Kandy') // => Branches named Kandy across all banks
 */
export function searchAllBranches(query: string): Array<Branch & { bankCode: string; bankName: string }> {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  const results: Array<Branch & { bankCode: string; bankName: string }> = [];

  for (const b of BANKS) {
    for (const br of b.branches) {
      if (br.name.toLowerCase().includes(q) || br.code.includes(q)) {
        results.push({
          ...br,
          bankCode: b.code,
          bankName: b.name
        });
      }
    }
  }

  return results;
}

/**
 * Constructs an official 7-digit LankaPay CEFT/SLIPS interbank routing number
 * from a 4-digit CBSL bank code and a 3-digit branch code.
 *
 * @param bankCode - 4-digit CBSL bank code (e.g. '7010').
 * @param branchCode - 3-digit branch code (e.g. '001').
 * @returns 7-digit routing number string (e.g. '7010001').
 *
 * @example
 * getRoutingNumber('7010', '1') // => "7010001"
 */
export function getRoutingNumber(bankCode: string | number, branchCode: string | number): string {
  const bCode = String(bankCode).trim().padStart(4, '0');
  const brCode = String(branchCode).trim().padStart(3, '0');
  return `${bCode}${brCode}`;
}

/**
 * Parses a 7-digit LankaPay routing number into its constituent Bank and Branch.
 *
 * @param routingNumber - 7-digit routing number (e.g. '7010001' or '7010-001').
 * @returns ParsedRoutingNumber with matched Bank and Branch objects if found.
 *
 * @example
 * parseRoutingNumber('7010001')
 * // => { isValid: true, routingNumber: '7010001', bank: Bank of Ceylon, branch: City Office }
 */
export function parseRoutingNumber(routingNumber: string | number): ParsedRoutingNumber {
  if (routingNumber === undefined || routingNumber === null) {
    return { isValid: false, routingNumber: '' };
  }

  const clean = String(routingNumber).replace(/[\s\-]/g, '').trim();
  if (!/^\d{7}$/.test(clean)) {
    return { isValid: false, routingNumber: clean };
  }

  const bankCode = clean.slice(0, 4);
  const branchCode = clean.slice(4, 7);

  const bank = getBank(bankCode);
  const branch = getBranch(bankCode, branchCode);

  return {
    isValid: Boolean(bank && branch),
    routingNumber: clean,
    ...(bank ? { bank } : {}),
    ...(branch ? { branch } : {})
  };
}

/**
 * Validates whether a given string is a valid, registered LankaPay routing number
 * pointing to an official CBSL bank and branch.
 *
 * @param routingNumber - 7-digit routing number.
 *
 * @example
 * validateRoutingNumber('7010001') // => true
 * validateRoutingNumber('9999999') // => false
 */
export function validateRoutingNumber(routingNumber: string | number): boolean {
  return parseRoutingNumber(routingNumber).isValid;
}


