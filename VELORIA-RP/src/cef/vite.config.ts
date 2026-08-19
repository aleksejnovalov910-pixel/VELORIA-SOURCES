import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins:[react()],
  base:'./',
  build:{
    outDir:resolve(here,'../../../client_packages/veloria'),
    emptyOutDir:true,
    assetsDir:'assets',
    sourcemap:false,
    target:'chrome87'
  }
});
