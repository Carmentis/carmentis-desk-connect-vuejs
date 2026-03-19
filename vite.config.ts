import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/plugin/index.ts'),
      name: 'CarmentisConnect',
      fileName: (format) => `carmentis-desk-connect.${format}.js`
    },
    rollupOptions: {
      external: ['vue', '@cmts-dev/carmentis-relay-client', '@cmts-dev/carmentis-sdk', 'primevue'],
      output: {
        globals: {
          vue: 'Vue',
          '@cmts-dev/carmentis-relay-client': 'CarmentisRelayClient',
          '@cmts-dev/carmentis-sdk': 'CarmentisSdk',
          'primevue': 'PrimeVue'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return assetInfo.name || 'asset';
        }
      }
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag:any) => ['appkit-button', 'appkit-network-button'].includes(tag),
        },
      },
    }),
  ]
})