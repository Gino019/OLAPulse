import { defineConfig } from 'vite';

// Use the repository name as the base path on GitHub Pages.
// Local development remains at /.
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/OLAPulse/' : '/',
  build: { target: 'es2022' },
});
