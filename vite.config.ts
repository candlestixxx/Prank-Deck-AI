import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'hero.png'],
      manifest: {
        name: 'PrankDeck Studio (Local Edition)',
        short_name: 'PrankDeck',
        description: 'A safe, local web-based soundboard and voice modification application.',
        theme_color: '#242424',
        background_color: '#242424',
        display: 'standalone',
        icons: [
          {
            src: 'hero.png',
            sizes: '170x179',
            type: 'image/png'
          },
          {
            src: 'hero.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
