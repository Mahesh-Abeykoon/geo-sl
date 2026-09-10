import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    provinces: 'src/provinces.ts',
    districts: 'src/districts.ts',
    cities: 'src/cities.ts',
    divisions: 'src/divisions.ts',
    banks: 'src/banks.ts',
    validators: 'src/validators.ts',
    gn: 'src/gn.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: false,
  splitting: false,
  treeshake: true,
  // Suppress rollup CJS named+default exports warning — we use named exports only
  esbuildOptions(options) {
    options.legalComments = 'none';
  }
});
