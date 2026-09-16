# 🇱🇰 geo-sl

> Trilingual (**English**, **සිංහල**, **தமிழ்**) Sri Lanka geographic, postal code, and administrative dataset for TypeScript & JavaScript with zero runtime dependencies.

[![npm version](https://img.shields.io/npm/v/geo-sl.svg)](https://www.npmjs.com/package/geo-sl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)]()
[![Trilingual](https://img.shields.io/badge/languages-EN%20%7C%20SI%20%7C%20TA-orange)]()

---

## 🗺️ 100% Comprehensive Island-wide Coverage

`geo-sl` is not limited to major metropolitan areas. It provides complete, authoritative, and verified geographic coverage across the entire territory of Sri Lanka—from provincial capitals down to individual rural villages:

| Administrative / Geographic Level | Total Count | Scope & Details | Supported Languages |
|---|---|---|---|
| **Provinces** | **9** | All 9 provinces (WP, CP, SP, NP, EP, NW, NC, UV, SG) | English, සිංහල, தமிழ் |
| **Districts** | **25** | All 25 administrative districts across the island | English, සිංහල, தமிழ் |
| **Divisional Secretariats (DSD)** | **340** | 100% of Divisional Secretariat Divisions (MOHA) | English, සිංහල, தமிழ் |
| **Grama Niladhari (GN) Divisions** | **14,020** | Every single village, ward, and local community | English, සිංහල, தமிழ் |
| **Cities, Towns & Post Offices** | **2,598** | Main post offices, towns, and sub-post offices | English, සිංහල, தமிழ் |
| **GPS Centroids** | **2,100+** | Accurate Latitude & Longitude coordinates | WGS84 coordinates |
| **Licensed Banks & Branches** | **45 Banks / 582+ Branches** | Complete CBSL & LankaPay routing codes | Official routing codes |

---

## ⚡ Key Highlights

- **Zero Runtime Dependencies** – Pure TypeScript with pre-indexed lookup maps. Ultra-fast, deterministic performance.
- **Trilingual First-Class Support** – Seamless lookups in **English**, **Sinhala (සිංහල)**, and **Tamil (தமிழ்)** with native scripts.
- **Optimized Subpath Tree-Shaking** – Import only what you need. Lightweight modules like validators are only **~2.3 KB**.
- **Cascading Form Helper** – Out-of-the-box hierarchy builder (`Province ➔ District ➔ City`) for checkout address selectors.
- **Intelligent Relevance Search** – Multi-lingual search prioritizing exact matches, prefixes, and postal codes over broad substring matches.
- **Built-in Validators & Parsers** – National Identity Card (Old 9-digit + New 12-digit NIC), Sri Lankan mobile & landline phone numbers, and postal codes.

---

## Installation

```bash
npm install geo-sl
# or
pnpm add geo-sl
# or
yarn add geo-sl
```

---

## Quick Start

```typescript
import {
  getProvince,
  getDistrict,
  getCityByPostalCode,
  getPostalCode,
  getProvinceName,
  getDistrictName,
  PROVINCE_MAP,
  DISTRICT_MAP,
  search
} from 'geo-sl';

// 1. Province Lookup
const wp = getProvince('WP');
console.log(wp?.name_en); // "Western"
console.log(wp?.name_si); // "බස්නාහිර"
console.log(wp?.name_ta); // "மேற்கு"

// Localized name helpers
getProvinceName('WP', 'si'); // => "බස්නාහිර"
getDistrictName('KY', 'ta');  // => "கண்டி"

// 2. Dictionary Access (with TypeScript autocomplete)
PROVINCE_MAP.WP.name_si; // "බස්නාහිර"
DISTRICT_MAP.KY.name_ta;  // "கண்டி"

// 3. Postal Code Lookup
const fort = getCityByPostalCode('00100');
console.log(fort?.name_en);  // "Colombo 1"
console.log(fort?.district); // "Colombo"

// 4. Postal Code by City Name (English, Sinhala, or Tamil)
getPostalCode('Athurugiriya'); // => "10150"
getPostalCode('Colombo 1');    // => "00100"
getPostalCode('Colombo 01');   // => "00100"
getPostalCode('මහනුවර');       // => "20000"

// 5. Search with Relevance Ranking
search('colombo'); // => [ { name_en: 'Colombo 1', ... }, { name_en: 'Colombo 2', ... } ]
search('nawala');  // => [ { name_en: 'Nawala', ... }, ... ]
search('කොළඹ');    // Sinhala search
```

---

## Subpath Imports (Tree-Shaking)

To keep client bundles minimal, import only the modules your application needs:

```typescript
// Provinces only (~2 KB)
import { PROVINCES, getProvinces, getProvince } from 'geo-sl/provinces';

// Districts only (~7 KB)
import { DISTRICTS, getDistricts, getDistrictsByProvince } from 'geo-sl/districts';

// Cities & Postal Codes (~900 KB)
import { CITIES, getCityByPostalCode, getPostalCode, search } from 'geo-sl/cities';

// Divisional Secretariats (~68 KB)
import { DIVISIONS, getDivisions, getDivisionsByDistrict } from 'geo-sl/divisions';

// CBSL Bank & Branch Codes (~140 KB)
import { BANKS, getBanks, getBankByCode, getBranches } from 'geo-sl/banks';

// Grama Niladhari Divisions (14,000+ entries, ~3 MB)
import { GN_DIVISIONS, getGNDivisions, searchGN } from 'geo-sl/gn';

// Validators & Parsers (~2.3 KB)
import { validateNIC, parseNIC, validatePhone, parsePhone, validatePostalCode } from 'geo-sl/validators';
```

---

## 🎨 Interactive React / Next.js Cascading Form Example

The easiest way to build a Sri Lankan checkout address form:

```tsx
import React, { useState } from 'react';
import { getCascadingData } from 'geo-sl';

const addressData = getCascadingData({ lang: 'en' });

export function SriLankaAddressForm() {
  const [selectedProvince, setSelectedProvince] = useState(addressData[0].code);
  const [selectedDistrict, setSelectedDistrict] = useState(addressData[0].districts[0].code);
  const [selectedCity, setSelectedCity] = useState(addressData[0].districts[0].cities[0].name);

  const currentProvince = addressData.find((p) => p.code === selectedProvince);
  const currentDistrict = currentProvince?.districts.find((d) => d.code === selectedDistrict);

  return (
    <div className="space-y-4">
      {/* Province */}
      <select
        value={selectedProvince}
        onChange={(e) => {
          setSelectedProvince(e.target.value as any);
          const prov = addressData.find((p) => p.code === e.target.value);
          if (prov && prov.districts[0]) {
            setSelectedDistrict(prov.districts[0].code);
            setSelectedCity(prov.districts[0].cities[0]?.name || '');
          }
        }}
      >
        {addressData.map((p) => (
          <option key={p.code} value={p.code}>{p.name}</option>
        ))}
      </select>

      {/* District */}
      <select
        value={selectedDistrict}
        onChange={(e) => {
          setSelectedDistrict(e.target.value as any);
          const dist = currentProvince?.districts.find((d) => d.code === e.target.value);
          if (dist && dist.cities[0]) {
            setSelectedCity(dist.cities[0].name);
          }
        }}
      >
        {currentProvince?.districts.map((d) => (
          <option key={d.code} value={d.code}>{d.name}</option>
        ))}
      </select>

      {/* City & Postal Code */}
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        {currentDistrict?.cities.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name} ({c.postal_code})
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

## 🏦 CBSL Bank & Branch Codes (`geo-sl/banks`)

Essential for fintech, payment gateway integrations, and bank transfer checkouts:

```typescript
import { getBanks, getBankByCode, getBranches } from 'geo-sl/banks';

// List all licensed banks
const allBanks = getBanks();

// Find Bank of Ceylon
const boc = getBankByCode('7010');
console.log(boc.name); // "Bank of Ceylon"

// Get all branches for a bank
const branches = getBranches('7010');
// => [{ id: 1, code: "001", name: "City Office" }, { id: 2, code: "002", name: "Kandy" }, ...]
```

---

## 📚 API Reference

### Provinces
* `getProvinces(options?: { lang?: 'en' | 'si' | 'ta' }): Province[]`
* `getProvinceByCode(code: string, options?: { lang?: 'en' | 'si' | 'ta' }): Province | undefined`

### Districts
* `getDistricts(province?: string, options?: { lang?: 'en' | 'si' | 'ta' }): District[]`
* `getDistrictByCode(code: string, options?: { lang?: 'en' | 'si' | 'ta' }): District | undefined`
* `getDistrictsByProvince(province: string, options?: { lang?: 'en' | 'si' | 'ta' }): District[]`

### Cities & Postal Codes
* `getCities(district?: string, options?: { lang?: 'en' | 'si' | 'ta' }): City[]`
* `getCitiesByDistrict(district: string, options?: { lang?: 'en' | 'si' | 'ta' }): City[]`
* `getCitiesByProvince(province: string, options?: { lang?: 'en' | 'si' | 'ta' }): City[]`
* `getPostalCode(cityName: string): string | undefined`
* `getCityByPostalCode(postalCode: string | number, lang?: 'en' | 'si' | 'ta'): City | undefined`
* `isValidPostalCode(postalCode: string | number): boolean`
* `lookupPostalCode(code: string | number, options?: { lang?: 'en' | 'si' | 'ta' }): City | undefined`
* `lookupAllByPostalCode(code: string | number, options?: { lang?: 'en' | 'si' | 'ta' }): City[]`
* `search(query: string, options?: { limit?: number; lang?: 'en' | 'si' | 'ta'; district?: string; province?: string }): City[]`

### Cascading Hierarchy
* `getCascadingData(options?: { lang?: 'en' | 'si' | 'ta' }): CascadingProvince[]`

### Administrative Divisions (MOHA)
* `getDivisions(district?: string, options?: { lang?: 'en' | 'si' | 'ta' }): Division[]`
* `getDivisionsByDistrict(district: string, options?: { lang?: 'en' | 'si' | 'ta' }): Division[]`

### Financial Institutions (CBSL / LankaPay)
* `getBanks(): Bank[]`
* `getBankByCode(code: string | number): Bank | undefined`
* `getBranches(bankCode: string | number): Branch[]`
* `getBranchByCode(bankCode: string | number, branchCode: string | number): Branch | undefined`
* `searchBranches(bankCode: string | number, query: string): Branch[]`

### Grama Niladhari (GN) Divisions (`geo-sl/gn`)
* `getGNDivisions(options?: { lang?: 'en' | 'si' | 'ta' }): GNDivision[]`
* `getGNDivisionsByDSD(divisionName: string, options?: { lang?: 'en' | 'si' | 'ta' }): GNDivision[]`
* `getGNDivisionsByDistrict(districtName: string, options?: { lang?: 'en' | 'si' | 'ta' }): GNDivision[]`
* `findGNByCode(code: string, options?: { lang?: 'en' | 'si' | 'ta' }): GNDivision | undefined`
* `searchGN(query: string, options?: { limit?: number; lang?: 'en' | 'si' | 'ta'; district?: string; division?: string }): GNDivision[]`

### Sri Lanka Validators & Parsers (`geo-sl/validators`)
* `validateNIC(nic: string): boolean`
* `parseNIC(nic: string): ParsedNIC | null` – parses birthdate, gender, age, voter eligibility from Old (9+V/X) and New (12 digits) NICs.
* `convertOldNICToNew(oldNic: string): string | null` – converts 9-digit old NIC to 12-digit format.
* `validatePhone(phone: string): boolean`
* `parsePhone(phone: string): ParsedPhone | null` – parses operator (Dialog, Mobitel, Hutch, Airtel), type (mobile/fixed), and formats.
* `formatPhone(phone: string, style?: 'international' | 'local' | 'e164'): string | null`
* `validatePostalCode(code: string): boolean` – validates 5-digit Sri Lankan postal format (ultra-lightweight, zero bundle cost; use `isValidPostalCode()` to verify existence against official postal database).

### 🏷️ TypeScript Types
All data types and interfaces are directly exported:
```typescript
import type {
  Province,
  District,
  City,
  Division,
  Bank,
  Branch,
  GNDivision,
  CascadingProvince,
  CascadingDistrict,
  ParsedNIC,
  ParsedPhone,
  Language,
  ProvinceCode,
  DistrictCode,
  QueryOptions,
  SearchOptions
} from 'geo-sl';
```

---

## 📄 License

MIT © [Mahesh Abeykoon](https://github.com/mahesh-abeykoon)
