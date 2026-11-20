import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

const config = defineConfig({
  // Netlify sets URL (primary domain) at build time; used for canonical/OG tags.
  define: {
    'import.meta.env.VITE_SITE_URL': JSON.stringify(process.env.URL ?? ''),
  },
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), netlify(), tanstackStart(), viteReact()],
})

export default config
