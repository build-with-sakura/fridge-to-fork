import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* BASE PATH
   GitHub Pages serves a project site from a sub-folder:
   https://<username>.github.io/<repository-name>/

   - Default './' makes every path relative. That works in any sub-folder.
   - To force a fixed path, set BASE_PATH before building, for example:
       BASE_PATH=/fridge-to-fork/ npm run build
   The GitHub Actions workflow sets BASE_PATH from the repository name. */
export default defineConfig({
  base: process.env.BASE_PATH || './',
  plugins: [react()],
});
