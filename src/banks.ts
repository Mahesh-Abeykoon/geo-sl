import banksData from './data/banks.json';
import type { Bank, Branch } from './types';

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
 * Direct O(1) lookup of a bank by its CBSL 4-digit bank code or ID.
 *
 * @example
 * getBank('7010') // => Bank of Ceylon
 */
export function getBank(codeOrId: string | number): Bank | undefined {
  if (codeOrId === undefined || codeOrId === null) return undefined;
  const raw = String(codeOrId).trim();
  return BANK_MAP.get(raw.padStart(4, '0')) || BANK_MAP.get(raw) || BANK_MAP.get(raw.toLowerCase());
}

export const getBankByCode = getBank;

/**
 * Get all branches for a given bank in O(1).
 */
export function getBranches(bankCode: string | number): readonly Branch[] {
  const bank = getBank(bankCode);
  return bank?.branches || [];
}

/**
 * Direct O(1) lookup of a bank branch by bank code and branch code.
 */
export function getBranch(bankCode: string | number, branchCode: string | number): Branch | undefined {
  if (bankCode === undefined || branchCode === undefined) return undefined;
  const bCode = String(bankCode).trim().padStart(4, '0');
  const brCode = String(branchCode).trim().padStart(3, '0');
  return BRANCH_MAP.get(`${bCode}:${brCode}`);
}

export const getBranchByCode = getBranch;

/**
 * Search branches within a bank by name or branch code.
 */
export function searchBranches(bankCode: string | number, query: string): Branch[] {
  const branches = getBranches(bankCode);
  if (!query || !query.trim()) return [...branches];
  const q = query.trim().toLowerCase();
  return branches.filter((br) => br.name.toLowerCase().includes(q) || br.code.includes(q));
}

