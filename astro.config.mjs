// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // TODO: Reemplazar por https://eliasalegre.dev cuando el dominio esté configurado en Vercel.
  site: "https://portafolio2026-seven.vercel.app",

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});
