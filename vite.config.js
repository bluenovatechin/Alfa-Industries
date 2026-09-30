import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { alfaHardwareData } from './alfa_hardware_data.js';

// Public address of the live site (no trailing slash). Change this when moving to a custom domain.
const SITE_URL = process.env.SITE_URL || 'https://bluenovatechin.github.io/Alfa-Industries';

const HTML_ENTITIES = { '&ldquo;': '“', '&rdquo;': '”', '&amp;': '&', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
const xml = (s) => String(s).replace(/&[a-z#0-9]+;/gi, (m) => HTML_ENTITIES[m] ?? m).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function sitemapEntry(path, images = []) {
  const imageTags = images
    .map(({ src, caption }) => `    <image:image><image:loc>${xml(`${SITE_URL}/${src}`)}</image:loc><image:caption>${xml(caption)}</image:caption></image:image>`)
    .join('\n');
  return `  <url>\n    <loc>${xml(SITE_URL + path)}</loc>\n${imageTags ? imageTags + '\n' : ''}  </url>`;
}

// Generates sitemap.xml (with image entries) and robots.txt at build time
function seoFiles() {
  return {
    name: 'seo-files',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', SITE_URL),
    generateBundle() {
      const { categories, products } = alfaHardwareData;
      const image = (p) => ({
        src: p.images.fullLocal || p.images.thumbnailLocal,
        caption: `HART ${p.code} ${p.title}${p.specifications?.Material ? ' – ' + p.specifications.Material : ''}`
      });
      const withImage = (p) => p.images?.fullLocal || p.images?.thumbnailLocal;

      const entries = [
        sitemapEntry('/', [{ src: 'assets/images/slider001.jpg', caption: 'Structural glazing with HART spider fittings' }]),
        sitemapEntry('/products'),
        ...categories.map((c) =>
          sitemapEntry(`/products/${c.id}`, products.filter((p) => p.categoryId === c.id && withImage(p)).map(image))
        ),
        ...products.map((p) =>
          sitemapEntry(`/products/${p.categoryId}?p=${encodeURIComponent(p.code)}`, withImage(p) ? [image(p)] : [])
        ),
        sitemapEntry('/company'),
        sitemapEntry('/quality'),
        sitemapEntry('/contact')
      ];

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
      });
    }
  };
}

export default defineConfig({
  base: '/Alfa-Industries/',
  plugins: [react(), seoFiles()],
  server: {
    port: 3000,
    open: false
  }
});
