/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    locale: import("./i18n/config").Locale;
  }
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
