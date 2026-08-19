import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins:[react()],
  base:'./',
  build:{
    outDir:resolve(__dirname,'../../../client_packages/veloria'),
    emptyOutDir:true,
    assetsDir:'assets',
    sourcemap:false,
    target:'chrome87'
  }
});
