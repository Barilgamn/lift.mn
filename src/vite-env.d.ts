/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  /** Шинэ хэлбэр: sb_publishable_... */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  /** Хуучин хэлбэр: anon JWT (eyJ...). Шинэ нь байхгүй үед ашиглана. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
