/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MFA_SECRET_SIDCO9?: string;
  readonly VITE_MFA_SECRET_SIDDHARTH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
