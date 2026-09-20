# Contributing to geo-sl 🇱🇰

Thank you for your interest in contributing to **`geo-sl`**! We welcome community contributions to keep Sri Lanka's geographic, postal, and administrative datasets accurate, comprehensive, and up-to-date.

---

## 🏛️ Project Scope & Boundaries

To ensure `geo-sl` remains ultra-fast, deterministic, and lightweight for web and mobile applications, we maintain strict architectural boundaries:

### What Belongs in `geo-sl`:
- **Provinces & Districts** (Official ISO codes, administrative metadata)
- **Divisional Secretariat Divisions (DSD)** (MOHA official divisions)
- **Grama Niladhari (GN) & Villages** (14,020 official divisions and codes)
- **Cities, Towns & Postal Codes** (Department of Posts postal routing data)
- **Licensed Financial Institutions** (CBSL bank codes, LankaPay routing numbers)
- **Sri Lanka Identity & Telecom Parsers** (NIC formats, phone number normalization)
- **Form & Selection Utilities** (Cascading selectors, dropdown formatters)

### What Belongs in Sister Packages:
To prevent bundle bloat and ensure domain separation, specific domain datasets are maintained in dedicated sister packages:
- 🎓 **Universities, Campuses & Higher Education**: Maintained in [`edu-sl`](https://github.com/mahesh-abeykoon/edu-sl).
- 🏥 **Hospitals & Medical Centers**: Planned for future dedicated packages.
- 🏨 **Hotels & Commercial POIs**: Excluded from core datasets.

---

## 💎 Core Principles

1. **Zero Runtime Dependencies**
   - The package must have **zero** dependencies in `package.json`'s `"dependencies"` section. All algorithms, parsers, and data lookups must be pure TypeScript/JavaScript.
2. **Trilingual Parity**
   - Every geographical entity (province, district, city, division, GN/village) must provide names in all three official languages:
     - `name_en` (English)
     - `name_si` (සිංහල)
     - `name_ta` (தமிழ்)
3. **Optimized Subpath Tree-Shaking**
   - Modules are split into entry points (`geo-sl/provinces`, `geo-sl/districts`, `geo-sl/cities`, `geo-sl/divisions`, `geo-sl/banks`, `geo-sl/validators`, `geo-sl/gn`). Keep imports isolated.
4. **Authoritative Sources Only**
   - Contributions for postal codes, administrative boundaries, or bank routing codes must be grounded in official government or regulatory publications (Department of Posts, MOHA, CBSL, LankaPay).

---

## 🛠️ Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/mahesh-abeykoon/geo-sl.git
cd geo-sl
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Tests
We use [Vitest](https://vitest.dev/) for fast, deterministic unit testing:
```bash
npm test
# Or run with watch mode during development:
npm run test:watch
```

### 4. Build Bundles
We use [tsup](https://tsup.egoist.dev/) to produce ESM, CommonJS, and TypeScript declaration (`.d.ts` / `.d.cts`) files:
```bash
npm run build
```

---

## 🌿 Git Branching Workflow

We follow a structured branching model:

1. **Branch from `development`**:
   ```bash
   git checkout development
   git pull origin development
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/correct-postal-code-xxx
   ```
2. **Commit your changes**:
   Use clear, descriptive commit messages following Conventional Commits (e.g. `feat: add helper`, `fix: correct postal code for ...`, `docs: update readme`).
3. **Push and Open a Pull Request**:
   - Target branch: **`development`** (never PR directly into `master`).
   - Fill out the PR checklist completely.
   - Ensure the automated GitHub Actions CI tests pass.

---

## 📜 Code of Conduct

Please maintain a respectful, welcoming, and collaborative environment. Thank you for making Sri Lanka's developer ecosystem better!
