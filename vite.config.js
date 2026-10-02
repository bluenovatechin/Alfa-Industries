import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { seoImageMap, prerenderAll, sitemapXml, robotsTxt, llmsFullTxt } from './scripts/seo-build.js';

// Public address of the live site (no trailing slash) — the ONLY place the address is set.
// Moving to a custom domain: change this to e.g. 'https://www.alfahardware.com'.
// Canonicals, sitemap, robots.txt, llms.txt, 404 redirect and the asset base path all follow it.
const SITE_URL = (process.env.SITE_URL || 'https://bluenovatechin.github.io/Alfa-Industries').replace(/\/+$/, '');
const BASE = new URL(SITE_URL + '/').pathname; // '/Alfa-Industries/' or '/'
const BASE_PATH = BASE.replace(/\/+$/, ''); // '/Alfa-Industries' or ''
const PUBLIC_DIR = path.resolve('public');
const fillTemplate = (file) =>
  fs.readFileSync(path.resolve('scripts', file), 'utf-8')
    .replaceAll('__SITE_URL__', SITE_URL)
    .replaceAll('__BASE__', BASE);

// SEO output: descriptive product image names, sitemap.xml, robots.txt, llms-full.txt
// and a pre-rendered HTML page (head tags, JSON-LD and visible content) for every route.
function seoFiles() {
  let outDir = path.resolve('dist');
  return {
    name: 'seo-files',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        html = html.replaceAll('__SITE_URL__', SITE_URL).replaceAll('__BASE_PATH__', BASE_PATH);
        // Preload the Latin Inter font so text renders in the final font on first paint
        const font = ctx.bundle && Object.keys(ctx.bundle).find((f) => /inter-latin-wght-normal-.*\.woff2$/.test(f));
        if (font) {
          html = html.replace('</title>', `</title>\n    <link rel="preload" href="${BASE}${font}" as="font" type="font/woff2" crossorigin />`);
        }
        return html;
      }
    },

    // Serve the SEO-named image copies during `vite dev`
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url || '').split('?')[0]);
        const key = url.startsWith(BASE) ? url.slice(BASE.length) : null;
        const source = key && seoImageMap[key];
        if (!source) return next();
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(PUBLIC_DIR, source)).pipe(res);
      });
    },

    generateBundle() {
      for (const [target, source] of Object.entries(seoImageMap)) {
        this.emitFile({ type: 'asset', fileName: target, source: fs.readFileSync(path.join(PUBLIC_DIR, source)) });
      }
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(SITE_URL) });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(SITE_URL) });
      this.emitFile({ type: 'asset', fileName: 'llms-full.txt', source: llmsFullTxt(SITE_URL) });
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: fillTemplate('llms.txt') });
      this.emitFile({ type: 'asset', fileName: '404.html', source: fillTemplate('404.html') });
    },

    closeBundle() {
      const distDir = outDir;
      if (!fs.existsSync(path.join(distDir, 'index.html'))) return;
      const pages = prerenderAll({ distDir, publicDir: PUBLIC_DIR, siteUrl: SITE_URL });
      console.log(`seo-files: pre-rendered ${pages} pages, ${Object.keys(seoImageMap).length} SEO image names`);
    }
  };
}

// The scraped dataset stays verbatim on disk, but the browser bundle only gets what the
// UI reads: no raw HTML, no mirrored pages, and category product lists rebuilt by reference.
// Roughly halves the JS download, which helps page speed (a Google ranking signal).
function slimDataset() {
  const file = path.resolve('alfa_hardware_data.js');
  return {
    name: 'slim-dataset',
    async load(id) {
      if (path.resolve(id.split('?')[0]) !== file) return null;
      const { alfaHardwareData: d } = await import('./alfa_hardware_data.js');
      const slim = {
        meta: d.meta,
        products: d.products.map(({ rawHtml, ...p }) => p),
        categories: d.categories.map(({ products, ...c }) => c),
        pages: { 'download.html': d.pages['download.html'] }
      };
      const source = fs.readFileSync(file, 'utf-8');
      const api = source.slice(source.indexOf('const AlfaHardwareAPI'), source.indexOf('// Universal export'));
      return `const alfaHardwareData = ${JSON.stringify(slim)};
alfaHardwareData.categories.forEach((c) => { c.products = alfaHardwareData.products.filter((p) => p.categoryId === c.id); });
${api}
export default alfaHardwareData;
export { alfaHardwareData, AlfaHardwareAPI };
`;
    }
  };
}

export default defineConfig({
  base: BASE,
  plugins: [react(), seoFiles(), slimDataset()],
  server: {
    port: 3000,
    open: false
  }
});
