## Description
<!-- Provide a brief summary of the changes introduced in this pull request and the rationale behind them. -->

## Type of Change
<!-- Check the relevant option(s) with an 'x' -->
- [ ] 🐛 Bug fix (non-breaking change fixing an issue)
- [ ] 📍 Data update/correction (updating coordinates, postal codes, GN divisions, or bank branches)
- [ ] ✨ New feature / helper (non-breaking change adding functionality)
- [ ] 📝 Documentation update (improving guides, examples, or README)
- [ ] ⚡ Performance improvement or bundle optimization

---

## 🛡️ Contribution & Scope Checklist

Before submitting, please ensure your contribution adheres to the **`geo-sl`** design principles:

- [ ] **Scope Discipline**: This PR pertains strictly to **authoritative geographic, administrative (Provinces/Districts/DSD/GN), postal, or banking infrastructure** in Sri Lanka.
  > *(Note: Points of interest, universities, schools, and hospitals belong in dedicated sister packages like [`edu-sl`](https://github.com/mahesh-abeykoon/edu-sl)).*
- [ ] **Trilingual Parity**: Any new or updated geographical or administrative names include valid trilingual entries (`name_en`, `name_si`, `name_ta`).
- [ ] **Zero Runtime Dependencies**: No runtime dependencies have been added to `package.json` (`dependencies` remains empty).
- [ ] **Testing**: Added or updated unit tests in `test/`, and all tests pass locally (`npm test`).
- [ ] **Build**: Production build completes cleanly without errors (`npm run build`).
- [ ] **Target Branch**: This PR targets the `development` branch (not directly `master`).
