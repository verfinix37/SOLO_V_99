import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Local development uses the root path. GitHub Pages builds use the /SOLO/
// repository path. If you rename the GitHub repository, update this path.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/SOLO/' : '/',
});
