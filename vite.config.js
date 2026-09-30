import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { alfaHardwareData } from './alfa_hardware_data.js';

// Public address of the live site (no trailing slash). Change this when moving to a custom domain.
const SITE_URL = process.env.SITE_URL || 'https://bluenovatechin.github.io/Alfa-Industries';

const HTML_ENTITIES = { '&ldquo;': '“', '&rdquo;': '”', '&amp;': '&', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
const xml = (s) => String(s).replace(/&[a-z#0-9]+;/gi, (m) => HTML_ENTITIES[m] ?? m).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const TODAY = new Date().toISOString().split('T')[0];

function sitemapEntry(path, options = {}) {
  const {
    images = [],
    changefreq = 'weekly',
    priority = '0.8',
    lastmod = TODAY
  } = options;

  const imageTags = images
    .map(({ src, caption, title }) => {
      const locTag = `<image:loc>${xml(`${SITE_URL}/${src.replace(/^\//, '')}`)}</image:loc>`;
      const captionTag = caption ? `<image:caption>${xml(caption)}</image:caption>` : '';
      const titleTag = title ? `<image:title>${xml(title)}</image:title>` : '';
      return `    <image:image>\n      ${locTag}${titleTag ? '\n      ' + titleTag : ''}${captionTag ? '\n      ' + captionTag : ''}\n    </image:image>`;
    })
    .join('\n');

  return `  <url>
    <loc>${xml(SITE_URL + path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${imageTags ? imageTags + '\n' : ''}  </url>`;
}

function prerenderHtml(baseHtml, { title, description, canonicalUrl, ogImage, breadcrumbs }) {
  let html = baseHtml;
  if (title) {
    html = html.replace(/<title>.*?<\/title>/i, `<title>${xml(title)}</title>`);
    html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/i, `$1${xml(title)}$2`);
    html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/i, `$1${xml(title)}$2`);
  }
  if (description) {
    html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/i, `$1${xml(description)}$2`);
    html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/i, `$1${xml(description)}$2`);
    html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/i, `$1${xml(description)}$2`);
  }
  if (canonicalUrl) {
    html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${xml(canonicalUrl)}$2`);
    html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/i, `$1${xml(canonicalUrl)}$2`);
  }
  if (ogImage) {
    html = html.replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/i, `$1${xml(ogImage)}$2`);
    html = html.replace(/(<meta\s+property="og:image:secure_url"\s+content=")[^"]*(")/i, `$1${xml(ogImage)}$2`);
    html = html.replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/i, `$1${xml(ogImage)}$2`);
  }
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: b.url
      }))
    };
    const breadcrumbScript = `<script type="application/ld+json">\n${JSON.stringify(breadcrumbLd, null, 2)}\n</script>`;
    html = html.replace('</head>', `  ${breadcrumbScript}\n  </head>`);
  }
  return html;
}

// Generates sitemap.xml, robots.txt, and pre-rendered static route HTML files for 200 OK search engine indexing
function seoFiles() {
  return {
    name: 'seo-files',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', SITE_URL),
    generateBundle(options, bundle) {
      const { categories, products } = alfaHardwareData;
      const image = (p) => ({
        src: p.images.fullLocal || p.images.thumbnailLocal,
        title: `HART ${p.code} ${p.title}`,
        caption: `HART ${p.code} ${p.title}${p.specifications?.Material ? ' – ' + p.specifications.Material : ''}`
      });
      const withImage = (p) => p.images?.fullLocal || p.images?.thumbnailLocal;

      const entries = [
        sitemapEntry('/', {
          images: [{ src: 'assets/images/slider001.jpg', title: 'HART Architectural Hardware', caption: 'Structural glazing with HART spider fittings' }],
          priority: '1.0',
          changefreq: 'weekly'
        }),
        sitemapEntry('/products/', { priority: '0.9', changefreq: 'weekly' }),
        ...categories.map((c) =>
          sitemapEntry(`/products/${c.id}/`, {
            images: products.filter((p) => p.categoryId === c.id && withImage(p)).map(image),
            priority: '0.9',
            changefreq: 'weekly'
          })
        ),
        ...products.map((p) =>
          sitemapEntry(`/products/${p.categoryId}/?p=${encodeURIComponent(p.code)}`, {
            images: withImage(p) ? [image(p)] : [],
            priority: '0.8',
            changefreq: 'weekly'
          })
        ),
        sitemapEntry('/company/', { priority: '0.7', changefreq: 'monthly' }),
        sitemapEntry('/quality/', { priority: '0.7', changefreq: 'monthly' }),
        sitemapEntry('/contact/', { priority: '0.7', changefreq: 'monthly' })
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
        source: `User-agent: *
Allow: /

# Prevent crawl budget waste on internal filter combinations
Disallow: /*?q=*

Sitemap: ${SITE_URL}/sitemap.xml
`
      });

    },
    closeBundle() {
      const { categories } = alfaHardwareData;
      const distDir = path.resolve('dist');
      const indexFile = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexFile)) return;

      const mainHtml = fs.readFileSync(indexFile, 'utf-8');

      const staticPages = [
        {
          path: 'products/index.html',
          title: 'Products & Architectural Hardware Catalog | HART by Alfa Industries',
          description: 'Browse 185 HART stainless steel architectural hardware products: spider fittings, canopy fittings, patch fittings, glass connectors, door handles, sliding systems and floor springs.',
          canonicalUrl: `${SITE_URL}/products/`,
          breadcrumbs: [
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Products', url: `${SITE_URL}/products/` }
          ]
        },
        {
          path: 'company/index.html',
          title: 'About Alfa Industries | In-House Stainless Steel Hardware Manufacturer Rajkot',
          description: 'Alfa Industries, Rajkot: in-house manufacturer of HART stainless steel architectural hardware with VMC, CNC, pressing, grinding and TIG welding facilities.',
          canonicalUrl: `${SITE_URL}/company/`,
          breadcrumbs: [
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Company', url: `${SITE_URL}/company/` }
          ]
        },
        {
          path: 'quality/index.html',
          title: 'Quality & Testing Standards | ISO 9001:2008 Certified HART Hardware',
          description: 'HART hardware is manufactured under one roof to ISO 9001:2008 quality standards, from tested AISI 316 / 304 stainless steel.',
          canonicalUrl: `${SITE_URL}/quality/`,
          breadcrumbs: [
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Quality', url: `${SITE_URL}/quality/` }
          ]
        },
        {
          path: 'contact/index.html',
          title: 'Contact Alfa Industries | Hardware Enquiries, Factory Location Rajkot',
          description: 'Contact Alfa Industries, Shapar (Veraval), Rajkot, Gujarat, for HART stainless steel architectural hardware enquiries, technical support and quotations.',
          canonicalUrl: `${SITE_URL}/contact/`,
          breadcrumbs: [
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Contact', url: `${SITE_URL}/contact/` }
          ]
        },
        ...categories.map((c) => ({
          path: `products/${c.id}/index.html`,
          title: `${c.name} | HART Architectural Hardware by Alfa Industries`,
          description: `HART ${c.name} by Alfa Industries, Rajkot. In-house precision manufactured in AISI 316 and 304 stainless steel for glass facades and architectural fittings.`,
          canonicalUrl: `${SITE_URL}/products/${c.id}/`,
          breadcrumbs: [
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Products', url: `${SITE_URL}/products/` },
            { name: c.name, url: `${SITE_URL}/products/${c.id}/` }
          ]
        }))
      ];

      for (const p of staticPages) {
        const targetFile = path.join(distDir, p.path);
        fs.mkdirSync(path.dirname(targetFile), { recursive: true });
        fs.writeFileSync(targetFile, prerenderHtml(mainHtml, p), 'utf-8');
      }
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
