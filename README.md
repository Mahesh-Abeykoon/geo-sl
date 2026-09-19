# 🇱🇰 geo-sl

> Trilingual (**English**, **සිංහල**, **தமிழ்**) Sri Lanka geographic, postal code, and administrative dataset for TypeScript & JavaScript with zero runtime dependencies.

[![npm version](https://img.shields.io/npm/v/geo-sl.svg)](https://www.npmjs.com/package/geo-sl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)]()
[![Trilingual](https://img.shields.io/badge/languages-EN%20%7C%20SI%20%7C%20TA-orange)]()

---

## 🗺️ 100% Comprehensive Island-wide Coverage

`geo-sl` covers the entire territory of Sri Lanka — not just major cities and urban centers. It provides complete, authoritative, and verified geographic data from provincial capitals all the way down to individual rural villages and remote Grama Niladhari divisions:

| Administrative / Geographic Level | Total Count | Scope & Details | Supported Languages |
|---|---|---|---|
| **Provinces** | **9** | All 9 provinces (WP, CP, SP, NP, EP, NWP, NCP, UP, SGP) | English, සිංහල, தமிழ் |
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
search('කොළඹ');    // => [ { name_en: 'Colombo 1', ... }, ... ]  (Sinhala search)
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
import { validateNIC, parseNIC, convertOldNICToNew, validatePhone, parsePhone, formatPhone, validatePostalCode } from 'geo-sl/validators';
```

---

## 🎨 Interactive React / Next.js Cascading Form Examples

`geo-sl` makes building multi-level dependent dropdowns straightforward for both e-commerce checkouts and official KYC/government forms.

### 1. Delivery & Checkout Address Form (`Province ➔ District ➔ City / Postal Code`)

For shipping and delivery addresses, use `getCascadingData()` or `toSelectOptions()`:

```tsx
import React, { useState } from 'react';
import { getCascadingData, toSelectOptions } from 'geo-sl';

const addressData = getCascadingData({ lang: 'en' });

export function SriLankaAddressForm() {
  const [selectedProvince, setSelectedProvince] = useState(addressData[0].code);
  const [selectedDistrict, setSelectedDistrict] = useState(addressData[0].districts[0].code);
  const [selectedCity, setSelectedCity] = useState(addressData[0].districts[0].cities[0].name);

  const currentProvince = addressData.find((p) => p.code === selectedProvince);
  const currentDistrict = currentProvince?.districts.find((d) => d.code === selectedDistrict);

  // Convert to standard { label, value } options for React-Select / Shadcn / HTML select
  const provinceOptions = toSelectOptions(addressData, 'name', 'code');
  const districtOptions = toSelectOptions(currentProvince?.districts || [], 'name', 'code');
  const cityOptions = toSelectOptions(
    currentDistrict?.cities || [],
    (c) => `${c.name} (${c.postal_code})`,
    'name'
  );

  return (
    <div className="space-y-4">
      {/* Province */}
      <select
        value={selectedProvince}
        onChange={(e) => {
          const code = e.target.value;
          setSelectedProvince(code as any);
          const prov = addressData.find((p) => p.code === code);
          if (prov && prov.districts[0]) {
            setSelectedDistrict(prov.districts[0].code);
            setSelectedCity(prov.districts[0].cities[0]?.name || '');
          }
        }}
      >
        {provinceOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* District */}
      <select
        value={selectedDistrict}
        onChange={(e) => {
          const code = e.target.value;
          setSelectedDistrict(code as any);
          const dist = currentProvince?.districts.find((d) => d.code === code);
          if (dist && dist.cities[0]) {
            setSelectedCity(dist.cities[0].name);
          }
        }}
      >
        {districtOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* City & Postal Code */}
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        {cityOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
```

---

### 2. Administrative & Village Form (`Province ➔ District ➔ DS Division ➔ Village / GN`)

For banking KYC, voter registration, legal documentation, or government administrative forms, query on-demand down to the **14,020 official villages (Grama Niladhari divisions)**:

```tsx
import React, { useState, useEffect } from 'react';
import { getProvinces, getDistrictsByProvince, getDivisionsByDistrict, toSelectOptions } from 'geo-sl';
import { getVillagesByDivision, searchVillages, type Village } from 'geo-sl/gn';

export function SriLankaAdministrativeForm() {
  const [provinceCode, setProvinceCode] = useState('WP');
  const [district, setDistrict] = useState('Colombo');
  const [division, setDivision] = useState('Colombo');
  const [villages, setVillages] = useState<readonly Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState('');

  // Load villages dynamically whenever the DS division changes
  useEffect(() => {
    const list = getVillagesByDivision(division);
    setVillages(list);
    if (list.length > 0) setSelectedVillage(list[0].code);
  }, [division]);

  const provinces = toSelectOptions(getProvinces(), 'name', 'code');
  const districts = toSelectOptions(getDistrictsByProvince(provinceCode), 'name', 'name_en');
  const divisions = toSelectOptions(getDivisionsByDistrict(district), 'name', 'name_en');
  const villageOptions = toSelectOptions(
    villages,
    (v) => `${v.name} (${v.code})`,
    'code'
  );

  return (
    <form className="space-y-4">
      {/* 1. Province */}
      <select
        value={provinceCode}
        onChange={(e) => {
          setProvinceCode(e.target.value);
          const firstDist = getDistrictsByProvince(e.target.value)[0];
          if (firstDist) {
            setDistrict(firstDist.name_en);
            const firstDiv = getDivisionsByDistrict(firstDist.name_en)[0];
            if (firstDiv) setDivision(firstDiv.name_en);
          }
        }}
      >
        {provinces.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>

      {/* 2. District */}
      <select
        value={district}
        onChange={(e) => {
          setDistrict(e.target.value);
          const firstDiv = getDivisionsByDistrict(e.target.value)[0];
          if (firstDiv) setDivision(firstDiv.name_en);
        }}
      >
        {districts.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
      </select>

      {/* 3. DS Division */}
      <select
        value={division}
        onChange={(e) => setDivision(e.target.value)}
      >
        {divisions.map((div) => <option key={div.value} value={div.value}>{div.label}</option>)}
      </select>

      {/* 4. Village (Grama Niladhari Division) */}
      <select
        value={selectedVillage}
        onChange={(e) => setSelectedVillage(e.target.value)}
      >
        {villageOptions.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
      </select>
    </form>
  );
}
```

> [!TIP]
> **Autocomplete for Villages:** With 14,000+ villages, you can also use `searchVillages('Mattakkuliya', { district: 'Colombo', limit: 10 })` to power modern searchable comboboxes (Shadcn, Headless UI, Radix) across English, Sinhala (`මට්ටක්කුලිය`), and Tamil (`மட்டக்குளி`).


---

## 🏦 CBSL Bank & Branch Codes (`geo-sl/banks`)

Essential for fintech, payment gateway integrations, and bank transfer checkouts:

```typescript
import { getBanks, getBankByCode, getBranches } from 'geo-sl/banks';

// List all licensed banks
const allBanks = getBanks();

// Find Bank of Ceylon
const boc = getBankByCode('7010');
console.log(boc?.name); // "Bank of Ceylon"

// Get all branches for a bank
const branches = getBranches('7010');
// => [{ id: 1, code: "001", name: "City Office" }, { id: 2, code: "002", name: "Kandy" }, ...]
```

---

## 🎓 Universities (`geo-sl/universities`)

Government (UGC state universities) and private degree-awarding institutions with trilingual names (English, සිංහල, தமிழ்) and addresses:

```typescript
import { getUniversities, getUniversity, getUniversitiesByDistrict, searchUniversities } from 'geo-sl/universities';

getUniversities('government'); // state universities
getUniversity('UoC');          // => { name: 'University of Colombo', address: 'No. 94, Cumaratunga Munidasa Mawatha', city: 'Colombo 03', postal_code: '00300', ... }
getUniversitiesByDistrict('Kandy');
searchUniversities('malabe', { type: 'private' });
```

---

## 📚 API Reference

### Provinces
* `getProvinces(options?: { lang?: 'en' | 'si' | 'ta' }): Province[]`
* `getProvince(codeOrId: string): Province | undefined` – primary lookup by code (e.g. `'WP'`), ID, or English name.
* `getProvinceName(codeOrId: string, lang?: Language): string | undefined`
* `getProvinceByCode(code: string, options?: { lang?: 'en' | 'si' | 'ta' }): Province | undefined` – alias for `getProvince`

### Districts
* `getDistricts(province?: string, options?: { lang?: 'en' | 'si' | 'ta' }): District[]`
* `getDistrict(codeOrId: string): District | undefined` – primary lookup by abbreviation (e.g. `'CO'`), ID, or English name.
* `getDistrictName(codeOrId: string, lang?: Language): string | undefined`
* `getDistrictsByProvince(province: string, options?: { lang?: 'en' | 'si' | 'ta' }): District[]`
* `getDistrictByCode(code: string, options?: { lang?: 'en' | 'si' | 'ta' }): District | undefined` – alias for `getDistrict`

### Cities & Postal Codes
* `getCities(district?: string, options?: { lang?: 'en' | 'si' | 'ta' }): City[]`
* `getCitiesByDistrict(district: string, options?: { lang?: 'en' | 'si' | 'ta' }): City[]`
* `getCitiesByProvince(province: string, options?: { lang?: 'en' | 'si' | 'ta' }): City[]`
* `getPostalCode(cityName: string): string | undefined`
* `getCityByPostalCode(postalCode: string | number, lang?: 'en' | 'si' | 'ta'): City | undefined`
* `isValidPostalCode(postalCode: string | number): boolean` – checks existence against the Sri Lanka Post database.
* `lookupPostalCode(code: string | number, options?: { lang?: 'en' | 'si' | 'ta' }): City | undefined` – alias for `getCityByPostalCode`
* `lookupAllByPostalCode(code: string | number, options?: { lang?: 'en' | 'si' | 'ta' }): City[]` – returns all offices sharing a postal code.
* `search(query: string, options?: { limit?: number; lang?: 'en' | 'si' | 'ta'; district?: string; province?: string }): City[]`

### Cascading Hierarchy & Form Helpers
* `getCascadingData(options?: { lang?: 'en' | 'si' | 'ta' }): CascadingProvince[]` – pre-nested tree (Province ➔ District ➔ Cities).
* `getAdministrativeCascadingData(options?: { lang?: 'en' | 'si' | 'ta' }): CascadingAdministrativeProvince[]` – pre-nested tree (Province ➔ District ➔ DS Divisions).
* `toSelectOptions<T>(items, labelKey, valueKey): SelectOption[]` – universal formatter converting data objects into `{ label, value }` pairs for UI dropdowns.

### Administrative Divisions (MOHA)
* `getDivisions(district?: string, options?: { lang?: 'en' | 'si' | 'ta' }): Division[]`
* `getDivisionsByDistrict(district: string, options?: { lang?: 'en' | 'si' | 'ta' }): Division[]`
* `getDivisionsByProvince(province: string, options?: { lang?: 'en' | 'si' | 'ta' }): Division[]`

### Financial Institutions (CBSL / LankaPay)
* `getBanks(): readonly Bank[]`
* `getBank(codeOrId: string | number): Bank | undefined` – primary lookup by 4-digit CBSL code, ID, or bank name.
* `getBankByCode(codeOrId: string | number): Bank | undefined` – alias for `getBank`
* `getBranches(bankCode: string | number): readonly Branch[]`
* `getBranchByCode(bankCode: string | number, branchCode: string | number): Branch | undefined`
* `searchBranches(bankCode: string | number, query: string): Branch[]`

### Universities (`geo-sl/universities`)
* `getUniversities(type?: 'government' | 'private'): readonly University[]`
* `getUniversity(idOrName: string): University | undefined` – by id, full name (English, Sinhala or Tamil), or short name.
* `getUniversitiesByDistrict(district: string): University[]` – district name or abbreviation.
* `getUniversitiesByProvince(province: string): University[]` – province name or code.
* `searchUniversities(query: string, options?: { type?, district?, province?, limit? }): University[]`

### Grama Niladhari (GN) & Village Divisions (`geo-sl/gn`)
* `getGNDivisions(options?: { lang?: 'en' | 'si' | 'ta' }): GNDivision[]`
* `getGNDivisionsByDSD(divisionName: string, options?: { lang?: 'en' | 'si' | 'ta' }): GNDivision[]`
* `getGNDivisionsByDistrict(districtName: string, options?: { lang?: 'en' | 'si' | 'ta' }): GNDivision[]`
* `findGNByCode(code: string, options?: { lang?: 'en' | 'si' | 'ta' }): GNDivision | undefined`
* `searchGN(query: string, options?: { limit?: number; lang?: 'en' | 'si' | 'ta'; district?: string; division?: string }): GNDivision[]`
* **Village Aliases:**
  * `getVillages(options?)` – alias for `getGNDivisions`
  * `getVillagesByDivision(divisionName, options?)` – alias for `getGNDivisionsByDSD`
  * `getVillagesByDistrict(districtName, options?)` – alias for `getGNDivisionsByDistrict`
  * `findVillageByCode(code, options?)` – alias for `findGNByCode`
  * `searchVillages(query, options?)` – alias for `searchGN`
  * `VILLAGES` – alias for `GN_DIVISIONS`

### Sri Lanka Validators & Parsers (`geo-sl/validators`)
* `validateNIC(nic: string): boolean`
* `parseNIC(nic: string): ParsedNIC | null` – parses birthdate, gender, age, voter eligibility from Old (9+V/X) and New (12 digits) NICs.
* `convertOldNICToNew(oldNic: string): string | null` – converts 10-character old NIC (9 digits + V/X) to 12-digit new format.
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
  University,
  GNDivision,
  Village,
  SelectOption,
  CascadingProvince,
  CascadingDistrict,
  CascadingAdministrativeProvince,
  CascadingAdministrativeDistrict,
  CascadingAdministrativeDivision,
  ParsedNIC,
  ParsedPhone,
  Language,
  ProvinceCode,
  DistrictCode,
  QueryOptions,
  SearchOptions,
  VillageSearchOptions
} from 'geo-sl';
```

---

## 📄 License

MIT © [Mahesh Abeykoon](https://github.com/mahesh-abeykoon)
