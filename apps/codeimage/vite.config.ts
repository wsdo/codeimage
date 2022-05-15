import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import {vanillaExtractPlugin} from '@vanilla-extract/vite-plugin';
import {VitePWA, VitePWAOptions} from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

const pwaOptions: Partial<VitePWAOptions> = {
  base: '/',
  manifest: {
    name: 'Codeimage',
    orientation: 'portrait',
    dir: 'ltr',
    short_name: 'Codeimage',
    start_url: '.',
    display: 'standalone',
    background_color: '#1a1a1a',
    description: 'Create elegant screenshots of your source code.',
    theme_color: '#1a1a1a',
    icons: [
      {
        src: '/pwa/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/pwa/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  srcDir: 'src',
  filename: 'sw.ts',
  strategies: 'injectManifest',
  registerType: 'autoUpdate',
};

export default defineConfig(({mode}) => ({
  clearScreen: true,
  plugins: [
    solidPlugin(),
    vanillaExtractPlugin(),
    VitePWA(pwaOptions),
    tsconfigPaths(),
    {
      name: 'html-inject-umami',
      transformIndexHtml(html) {
        const websiteId = process.env.UMAMI_WEBSITE_ID;
        const scriptSrc = process.env.UMAMI_SCRIPT_SRC;
        const allowedDomains = process.env.UMAMI_ALLOWED_DOMAINS;

        console.log('MODALITY', mode, websiteId, scriptSrc, allowedDomains);
        if (
          mode === 'production' &&
          (!websiteId || !scriptSrc || !allowedDomains)
        )
          return html;

        return html.replace(
          '<!-- %UMAMI% -->',
          `<script async defer data-domains='${allowedDomains}' data-website-id='${websiteId}' src='${scriptSrc}'></script>`,
        );
      },
    },
  ],
  server: {
    strictPort: true,
    port: 4200,
    watch: {
      usePolling: true,
    },
  },
  build: {
    brotliSize: true,
    sourcemap: false,
    minify: true,
    polyfillModulePreload: false,
    polyfillDynamicImport: false,
    cssCodeSplit: true,
    reportCompressedSize: true,
  },
}));
