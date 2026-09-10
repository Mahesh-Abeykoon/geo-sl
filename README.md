# 🇱🇰 sl-geo

> The definitive, zero-dependency, trilingual (**English**, **සිංහල**, **தமிழ்**) Sri Lanka geographic, postal code, and administrative dataset for TypeScript & JavaScript.

[![npm version](https://img.shields.io/npm/v/sl-geo.svg)](https://www.npmjs.com/package/sl-geo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)]()
[![Trilingual](https://img.shields.io/badge/languages-EN%20%7C%20SI%20%7C%20TA-orange)]()

---

## ✨ Features

- 🚀 **Zero Runtime Dependencies** – Ultra-fast, lightweight (< 100 KB gzipped core), pure TypeScript.
- 🏛️ **100% Authoritative Government Data**:
  - **4,200+ Post Offices & 5-digit Postal Codes** from the **Department of Posts (`slpost.gov.lk`)**.
  - **9 Provinces, 25 Districts, 340 Divisional Secretariats (DSD)** from the **Ministry of Home Affairs (`moha.gov.lk`)**.
  - **Official Bank Codes & Branch Codes** from the **Central Bank of Sri Lanka (`cbsl.gov.lk`) / LankaPay**.
  - **GPS Latitude & Longitude** centroids for 2,100+ cities and towns.
- 🌐 **True Trilingual Support** – Instant translations across **English**, **Sinhala (සිංහල)**, and **Tamil (தமிழ்)**.
- 📦 **Tree-Shakeable Subpath Exports** – Import only what you need:
  - `sl-geo/provinces`
  - `sl-geo/districts`
  - `sl-geo/cities`
  - `sl-geo/divisions`
  - `sl-geo/banks`
- ⚡ **Form-Ready Cascading Dropdowns** – 1-line helper for nested Province ➔ District ➔ City selectors in React, Next.js, Vue, or Svelte.
- 🔍 **Fuzzy & Multi-Lingual Search** – Fast search matching by English name, Sinhala script, Tamil script, or 5-digit postal code.

---

## 📦 Installation

```bash
npm install sl-geo
# or
pnpm add sl-geo
# or
yarn add sl-geo
```

---

## 🚀 Quick Start

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
} from 'sl-geo';

// 1. Direct O(1) Province Lookup (No array indexing!)
const wp = getProvince('WP');
console.log(wp?.name_en); // "Western"
console.log(wp?.name_si); // "බස්නාහිර"
console.log(wp?.name_ta); // "மேற்கு"

// Fast localized name helpers:
getProvinceName('WP', 'si'); // => "බස්නාහිර"
getDistrictName('KY', 'ta');  // => "கண்டி"

// 2. Direct Dictionary Access (with IDE autocomplete!)
PROVINCE_MAP.WP.name_si; // "බස්නාහිර"
DISTRICT_MAP.KY.name_ta;  // "கண்டி"

// 3. Instant O(1) Postal Code Lookup
const fort = getCityByPostalCode('00100');
console.log(fort?.name_en);  // "Colombo 1"
console.log(fort?.district); // "Colombo"

// 4. Get postal code for a town (English, Sinhala, or Tamil)
getPostalCode('Athurugiriya'); // => "10150"
getPostalCode('මහනුවර');       // => "20000"

// 5. Search by town name, Sinhala, Tamil, or postal code
search('kadu'); // => [ { name_en: 'Kaduwela', postal_code: '10640', ... } ]
search('කොළඹ'); // Sinhala search
```

---

## 🌳 Tree-Shaking & Subpath Imports

Need only provinces or districts without loading the full cities dataset into your frontend bundle? Use modular subpath imports:

```typescript
// Only imports ~1.2 KB of data!
import { provinces, getProvinces } from 'sl-geo/provinces';

// Only imports ~5 KB of data!
import { districts, getDistrictsByProvince } from 'sl-geo/districts';

// Only cities and postal codes
import { cities, lookupPostalCode } from 'sl-geo/cities';

// Divisional Secretariats (340 DSDs)
import { divisions, getDivisionsByDistrict } from 'sl-geo/divisions';

// CBSL / LankaPay Bank & Branch codes
import { banks, getBranches } from 'sl-geo/banks';
```

---

## 🎨 Interactive React / Next.js Cascading Form Example

The easiest way to build a Sri Lankan checkout address form:

```tsx
import React, { useState } from 'react';
import { getCascadingData } from 'sl-geo';

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

## 🏦 CBSL Bank & Branch Codes (`sl-geo/banks`)

Essential for fintech, payment gateway integrations, and bank transfer checkouts:

```typescript
import { getBanks, getBankByCode, getBranches } from 'sl-geo/banks';

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

### Grama Niladhari (GN) Divisions (`sl-geo/gn`)
* `getGNDivisions(options?: { lang?: 'en' | 'si' | 'ta' }): GNDivision[]`
* `getGNDivisionsByDSD(divisionName: string, options?: { lang?: 'en' | 'si' | 'ta' }): GNDivision[]`
* `getGNDivisionsByDistrict(districtName: string, options?: { lang?: 'en' | 'si' | 'ta' }): GNDivision[]`
* `findGNByCode(code: string, options?: { lang?: 'en' | 'si' | 'ta' }): GNDivision | undefined`
* `searchGN(query: string, options?: { limit?: number; lang?: 'en' | 'si' | 'ta'; district?: string; division?: string }): GNDivision[]`

### Sri Lanka Validators & Parsers (`sl-geo/validators`)
* `validateNIC(nic: string): boolean`
* `parseNIC(nic: string): ParsedNIC | null` – parses birthdate, gender, age, voter eligibility from Old (9+V/X) and New (12 digits) NICs.
* `convertOldNICToNew(oldNic: string): string | null` – converts 9-digit old NIC to 12-digit format.
* `validatePhone(phone: string): boolean`
* `parsePhone(phone: string): ParsedPhone | null` – parses operator (Dialog, Mobitel, Hutch, Airtel), type (mobile/fixed), and formats.
* `formatPhone(phone: string, style?: 'international' | 'local' | 'e164'): string | null`
* `validatePostalCode(code: string): boolean`

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
} from 'sl-geo';
```

---

## 🏛️ Data Sources & Attribution

- **Postal Data**: [Department of Posts, Sri Lanka](https://slpost.gov.lk)
- **Administrative Hierarchy**: [Ministry of Public Administration & Home Affairs](http://moha.gov.lk) & [Department of Census and Statistics](http://www.statistics.gov.lk)
- **Bank & Branch Codes**: [Central Bank of Sri Lanka](https://www.cbsl.gov.lk) & [LankaPay](https://www.lankapay.net)

---

## 📄 License

MIT © [Mahesh Abeykoon](https://github.com/mahesh-abeykoon)
