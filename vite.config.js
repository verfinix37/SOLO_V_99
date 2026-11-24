import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site for the SOLO_V_99 repository.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/SOLO_V_99/' : '/',
});
