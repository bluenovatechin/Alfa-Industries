// Build-time SEO: pre-rendered HTML for every route, SEO-named product images,
// sitemap.xml (with image extension), robots.txt and llms-full.txt.
// Wired into Vite by vite.config.js.

import fs from 'node:fs';
import path from 'node:path';
import { alfaHardwareData } from '../alfa_hardware_data.js';
import { routeSeo, jsonLdText } from '../src/lib/seo.js';
import {
  COMPANY, COPY, CATEGORY_META, FAQS, MACHINES, PROCESS, INDUSTRIES, decode,
  productPath, productSeoImagePath, productAlt, productDescription, categoryName
} from '../src/data/catalog.js';

const { categories, products } = alfaHardwareData;
const TODAY = new Date().toISOString().split('T')[0];

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// --- Image helpers --------------------------------------------------------------

// Every product photo is also published under a descriptive name: { 'assets/products/hart-…jpg': 'assets/spider-fittings/asf-01.jpg' }
export const seoImageMap = Object.fromEntries(
  products
    .filter((p) => p.images?.fullLocal || p.images?.thumbnailLocal)
    .map((p) => [productSeoImagePath(p), p.images.fullLocal || p.images.thumbnailLocal])
);

function jpegSize(file) {
  try {
    const b = fs.readFileSync(file);
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xc2) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  } catch { /* unknown size */ }
  return null;
}

const imageSize = (publicDir, assetPath) => {
  const source = seoImageMap[assetPath] || assetPath;
  return jpegSize(path.join(publicDir, source));
};

// --- Pre-rendered page bodies ---------------------------------------------------
// Real, visible HTML for crawlers that do not run JavaScript (Bing, AI search bots,
// social previews) and for Google's first indexing pass. React replaces it on load.

function shell(siteUrl, crumbs, main) {
  const link = (p, label) => `<a href="${siteUrl}${p}">${esc(label)}</a>`;
  const crumbHtml = crumbs.length
    ? `<nav aria-label="Breadcrumb">${[link('/', 'Home'), ...crumbs.map((c, i) => (i < crumbs.length - 1 ? link(c.path, c.name) : `<span>${esc(c.name)}</span>`))].join(' › ')}</nav>`
    : '';
  return `
<div class="seo-static" style="max-width:1100px;margin:0 auto;padding:24px 16px;font-family:system-ui,sans-serif;line-height:1.6;color:#0f1419">
  <header>
    <a href="${siteUrl}/"><img src="${siteUrl}/assets/images/logo.png" alt="HART by Alfa Industries logo" width="180" height="60" /></a>
    <nav aria-label="Main">
      ${link('/', 'Home')} · ${link('/products/', 'Products')} · ${link('/company/', 'Company & Plant')} · ${link('/quality/', 'Quality')} · ${link('/contact/', 'Contact')}
    </nav>
    <nav aria-label="Product ranges">
      ${categories.map((c) => link(`/products/${c.id}/`, CATEGORY_META[c.id]?.short || c.name)).join(' · ')}
    </nav>
  </header>
  ${crumbHtml}
  <main>
${main}
  </main>
  <footer>
    <h2>Alfa Industries – HART architectural hardware</h2>
    <address>
      ${esc(COMPANY.addressLines.join(' '))}<br />
      Phone: <a href="${COMPANY.phoneHref}">${esc(COMPANY.phone)}</a> ·
      ${COMPANY.contacts.map((c) => `${esc(c.name)}: <a href="tel:${c.tel}">${esc(c.phone)}</a>`).join(' · ')}<br />
      Email: <a href="mailto:${COMPANY.email}">${esc(COMPANY.email)}</a>
    </address>
    <p>${esc(COMPANY.certification)} certified manufacturer of stainless steel architectural hardware, Shapar (Veraval), Rajkot, Gujarat, India.</p>
  </footer>
</div>`;
}

function productFigure(siteUrl, p, { heading = 'h3', lazy = true } = {}) {
  const specs = p.specifications || {};
  return `<article>
      <a href="${siteUrl}${productPath(p)}">
        <figure>
          <img src="${siteUrl}/${productSeoImagePath(p)}" alt="${esc(productAlt(p))}" title="HART ${esc(p.code)} ${esc(decode(p.title))}"${lazy ? ' loading="lazy"' : ''} />
          <figcaption>${esc(productAlt(p))}</figcaption>
        </figure>
      </a>
      <${heading}><a href="${siteUrl}${productPath(p)}">HART ${esc(p.code)} – ${esc(decode(p.title))}</a></${heading}>
      <p>${[specs.Material && `Material: ${esc(specs.Material)}`, specs.Finish && `Finish: ${esc(specs.Finish)}`, specs.Tested && `Tested: ${esc(specs.Tested)}`].filter(Boolean).join(' · ')}</p>
    </article>`;
}

const categoryBlurb = (siteUrl, c) => {
  const meta = CATEGORY_META[c.id] || {};
  return `<li><h3><a href="${siteUrl}/products/${c.id}/">${esc(meta.seoTitle || c.name)}</a></h3>
      <p>${esc(meta.description || '')} ${esc(meta.uses || '')} (${c.productCount} products)</p></li>`;
};

const machineList = (headingTag = 'h3') =>
  MACHINES.map((m) => `<li><${headingTag}>${esc(m.name)}</${headingTag}>
      <p><strong>${esc(m.categoryLabel)}</strong> · ${esc(m.spec)} · ${esc(m.capacity)}</p>
      <p>${esc(m.desc)}</p>
      ${m.outputParts ? `<p>Hardware made on this machine: ${esc(m.outputParts)}</p>` : ''}</li>`).join('\n');

const faqHtml = () =>
  FAQS.map((f) => `<section><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></section>`).join('\n');

function bodyFor(siteUrl, segments) {
  const [page, catId, slug] = segments;

  if (!page) {
    return shell(siteUrl, [], `
    <h1>HART stainless steel architectural hardware by Alfa Industries, Rajkot</h1>
    <p>${esc(COPY.about.join(' '))}</p>
    <p>We design and manufacture ${products.length} architectural fittings in AISI 316 and 304 stainless steel across ${categories.length} ranges, made 100% in-house at our plant in Shapar (Veraval), Rajkot, Gujarat, India, under ISO 9001:2008 procedures.</p>
    <img src="${siteUrl}/assets/images/slider001.jpg" alt="Structural glazing with HART stainless steel spider fittings by Alfa Industries" width="972" height="462" />
    <h2>Product ranges</h2>
    <ul>${categories.map((c) => categoryBlurb(siteUrl, c)).join('\n')}</ul>
    <h2>Industries and projects we supply</h2>
    <ul>${INDUSTRIES.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    <h2>Manufacturing plant and machinery</h2>
    <p>${esc(COPY.infrastructure)}</p>
    <ul>${MACHINES.map((m) => `<li>${esc(m.name)} – ${esc(m.capacity)}</li>`).join('')}</ul>
    <p><a href="${siteUrl}/company/">See our plant and machinery in detail</a></p>
    <h2>Download PDF catalogues</h2>
    <ul>${categories.filter((c) => c.catalogPdfLocal).map((c) => `<li><a href="${siteUrl}/${c.catalogPdfLocal}">HART ${esc(c.name)} catalogue (PDF)</a></li>`).join('')}</ul>`);
  }

  if (page === 'products') {
    const product = slug && products.find((p) => productPath(p) === `/products/${catId}/${slug}/`);
    if (product) {
      const cat = categories.find((c) => c.id === product.categoryId);
      const siblings = products.filter((p) => p.categoryId === product.categoryId && p !== product);
      const specs = Object.entries(product.specifications || {});
      return shell(siteUrl, [
        { name: 'Products', path: '/products/' },
        { name: categoryName(product.categoryId), path: `/products/${product.categoryId}/` },
        { name: product.code, path: productPath(product) }
      ], `
    <article>
      <h1>HART ${esc(product.code)} – ${esc(decode(product.title))}</h1>
      <figure>
        <img src="${siteUrl}/${productSeoImagePath(product)}" alt="${esc(productAlt(product))}" title="HART ${esc(product.code)} ${esc(decode(product.title))}" />
        <figcaption>${esc(productAlt(product))} – manufactured by Alfa Industries, Rajkot, India</figcaption>
      </figure>
      <p>${esc(productDescription(product))}</p>
      <h2>Specifications</h2>
      <dl>
        <dt>Item code</dt><dd>${esc(product.code)}</dd>
        <dt>Brand</dt><dd>HART (Alfa Industries)</dd>
        <dt>Range</dt><dd><a href="${siteUrl}/products/${product.categoryId}/">${esc(cat?.name || '')}</a></dd>
        ${specs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('\n        ')}
        <dt>Made in</dt><dd>Shapar (Veraval), Rajkot, Gujarat, India</dd>
      </dl>
      ${cat?.catalogPdfLocal ? `<p><a href="${siteUrl}/${cat.catalogPdfLocal}">Download the HART ${esc(cat.name)} catalogue (PDF)</a></p>` : ''}
      <p><a href="${siteUrl}/contact/?ref=${encodeURIComponent(product.code)}">Request a quotation for ${esc(product.code)}</a></p>
    </article>
    <h2>More ${esc(categoryName(product.categoryId))}</h2>
    <ul>${siblings.map((p) => `<li><a href="${siteUrl}${productPath(p)}">HART ${esc(p.code)} – ${esc(decode(p.title))}</a></li>`).join('')}</ul>`);
    }

    const cat = catId && categories.find((c) => c.id === catId);
    if (cat) {
      const meta = CATEGORY_META[cat.id] || {};
      const items = products.filter((p) => p.categoryId === cat.id);
      return shell(siteUrl, [{ name: 'Products', path: '/products/' }, { name: meta.short || cat.name, path: `/products/${cat.id}/` }], `
    <h1>HART ${esc(meta.seoTitle || cat.name)}</h1>
    <p>${esc(meta.description || '')} ${items.length} products manufactured by Alfa Industries, Rajkot in AISI 316 / 304 stainless steel.</p>
    ${meta.uses ? `<p><strong>Applications:</strong> ${esc(meta.uses)}</p>` : ''}
    ${meta.aka ? `<p><strong>Also searched as:</strong> ${esc(meta.aka.join(', '))}</p>` : ''}
    ${cat.catalogPdfLocal ? `<p><a href="${siteUrl}/${cat.catalogPdfLocal}">Download the ${esc(cat.name)} catalogue (PDF)</a></p>` : ''}
    <h2>${esc(cat.name)} – all ${items.length} item codes</h2>
    ${items.map((p, i) => productFigure(siteUrl, p, { lazy: i > 3 })).join('\n')}`);
    }

    return shell(siteUrl, [{ name: 'Products', path: '/products/' }], `
    <h1>HART architectural hardware catalogue – ${products.length} products</h1>
    <p>The complete HART range of stainless steel architectural hardware by Alfa Industries, Rajkot: ${categories.length} ranges for glass facades, canopies, frameless glass doors, shower enclosures, partitions and timber doors.</p>
    ${categories.map((c) => {
      const meta = CATEGORY_META[c.id] || {};
      return `<section>
      <h2><a href="${siteUrl}/products/${c.id}/">${esc(meta.seoTitle || c.name)}</a></h2>
      <p>${esc(meta.description || '')}</p>
      <ul>${products.filter((p) => p.categoryId === c.id).map((p) => `<li><a href="${siteUrl}${productPath(p)}">${esc(p.code)} – ${esc(decode(p.title))}</a></li>`).join('')}</ul>
    </section>`;
    }).join('\n')}`);
  }

  if (page === 'company') {
    return shell(siteUrl, [{ name: 'Company', path: '/company/' }], `
    <h1>Alfa Industries – makers of HART architectural hardware, Rajkot</h1>
    ${COPY.about.map((p) => `<p>${esc(p)}</p>`).join('\n')}
    <p>${esc(COPY.welcome)}</p>
    <dl>
      <dt>Company</dt><dd>Alfa Industries</dd>
      <dt>Brand</dt><dd>HART – “For Life Time Steel”</dd>
      <dt>Certification</dt><dd>${esc(COMPANY.certification)}</dd>
      <dt>Materials</dt><dd>AISI 316 and AISI 304 stainless steel</dd>
      <dt>Portfolio</dt><dd>${products.length} products in ${categories.length} ranges</dd>
      <dt>Plant location</dt><dd>${esc(COMPANY.addressLines.join(' '))}</dd>
      <dt>Contact persons</dt><dd>${COMPANY.contacts.map((c) => `${esc(c.name)} (${esc(c.phone)})`).join(', ')}</dd>
    </dl>
    <h2>Industries we serve</h2>
    <ul>${INDUSTRIES.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    <h2>Manufacturing plant and machinery in Shapar (Veraval), Rajkot</h2>
    <p>${esc(COPY.infrastructure)}</p>
    <ul>${machineList()}</ul>
    <h2>In-house production process</h2>
    <ol>${PROCESS.map((s) => `<li><strong>${esc(s.title)}</strong> – ${esc(s.text)}</li>`).join('')}</ol>
    <h2>Frequently asked questions</h2>
    ${faqHtml()}`);
  }

  if (page === 'quality') {
    return shell(siteUrl, [{ name: 'Quality', path: '/quality/' }], `
    <h1>Quality standards and testing – ISO 9001:2008 certified HART hardware</h1>
    <p>${esc(COPY.quality)}</p>
    <h2>Testing</h2>
    <ul>
      <li>Chemical spectrometer analysis of AISI 316 / 304 stainless steel (ASTM A240 / A276)</li>
      <li>5,00,000-cycle hydraulic endurance testing of the AFS-01 floor spring and ADC-01 door closer</li>
      <li>Tensile and load-bearing verification of spider arms and routel bolts</li>
      <li>Surface roughness (Ra &lt; 0.2µm) and neutral salt spray resistance (ASTM B117)</li>
    </ul>
    <h2>Mission</h2><p>${esc(COPY.mission)}</p>
    <h2>Methodology</h2><p>${esc(COPY.methodology)}</p>
    <h2>Vision</h2><p>${esc(COPY.vision)}</p>`);
  }

  if (page === 'contact') {
    return shell(siteUrl, [{ name: 'Contact', path: '/contact/' }], `
    <h1>Contact Alfa Industries, Shapar (Veraval), Rajkot</h1>
    <p>For HART architectural hardware quotations, dealer enquiries, custom fabrication and OEM orders, contact our plant directly.</p>
    <h2>Plant address</h2>
    <address>${COMPANY.addressLines.map(esc).join('<br />')}</address>
    <p><a href="${COMPANY.mapsUrl}">Open in Google Maps</a></p>
    <h2>Contact persons</h2>
    <ul>${COMPANY.contacts.map((c) => `<li>${esc(c.name)} – <a href="tel:${c.tel}">${esc(c.phone)}</a></li>`).join('')}</ul>
    <p>Office: <a href="${COMPANY.phoneHref}">${esc(COMPANY.phone)}</a> · Email: <a href="mailto:${COMPANY.email}">${esc(COMPANY.email)}</a> · WhatsApp: <a href="https://wa.me/${COMPANY.whatsapp}">+${esc(COMPANY.whatsapp)}</a></p>`);
  }

  return '';
}

// --- HTML head rewriting ---------------------------------------------------------

function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${key.replace(/[:.]/g, '\\$&')}"\\s+content=")[^"]*(")`, 'i');
  return html.replace(re, (_, a, b) => `${a}${esc(value)}${b}`);
}

function renderRoute(baseHtml, siteUrl, publicDir, segments) {
  const seo = routeSeo(segments, {}, siteUrl);
  if (!seo) return null;
  const canonical = siteUrl + seo.path;
  const image = `${siteUrl}/${seo.image}`;
  const size = imageSize(publicDir, seo.image);

  let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(seo.title)}</title>`);
  for (const [attr, key, value] of [
    ['name', 'description', seo.description],
    ['property', 'og:title', seo.title],
    ['name', 'twitter:title', seo.title],
    ['property', 'og:description', seo.description],
    ['name', 'twitter:description', seo.description],
    ['property', 'og:url', canonical],
    ['property', 'og:image', image],
    ['property', 'og:image:secure_url', image],
    ['name', 'twitter:image', image],
    ['property', 'og:image:alt', seo.imageAlt],
    ['name', 'twitter:image:alt', seo.imageAlt],
    ...(size ? [['property', 'og:image:width', String(size.width)], ['property', 'og:image:height', String(size.height)]] : [])
  ]) {
    html = setMeta(html, attr, key, value);
  }
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${esc(canonical)}$2`);

  const scripts = seo.jsonLd
    .map((s) => `<script type="application/ld+json" data-route-ld="${esc(seo.path)}">${jsonLdText(s)}</script>`)
    .join('\n    ');
  html = html.replace('</head>', `    ${scripts}\n  </head>`);
  html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${bodyFor(siteUrl, segments)}</div>`);
  return html;
}

export function allRoutes() {
  return [
    [],
    ['products'],
    ...categories.map((c) => ['products', c.id]),
    ...products.map((p) => productPath(p).split('/').filter(Boolean)),
    ['company'],
    ['quality'],
    ['contact']
  ];
}

export function prerenderAll({ distDir, publicDir, siteUrl }) {
  const indexFile = path.join(distDir, 'index.html');
  const baseHtml = fs.readFileSync(indexFile, 'utf-8');
  let count = 0;
  for (const segments of allRoutes()) {
    const html = renderRoute(baseHtml, siteUrl, publicDir, segments);
    if (!html) continue;
    const target = path.join(distDir, ...segments, 'index.html');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html, 'utf-8');
    count++;
  }
  return count;
}

// --- sitemap.xml / robots.txt / llms-full.txt -------------------------------------

export function sitemapXml(siteUrl) {
  const img = (p) => `
    <image:image>
      <image:loc>${esc(`${siteUrl}/${productSeoImagePath(p)}`)}</image:loc>
      <image:title>${esc(`HART ${p.code} ${decode(p.title)}`)}</image:title>
      <image:caption>${esc(`${productAlt(p)} – Alfa Industries, Rajkot`)}</image:caption>
    </image:image>`;
  const url = (routePath, images = '') => `  <url>
    <loc>${esc(siteUrl + routePath)}</loc>
    <lastmod>${TODAY}</lastmod>${images}
  </url>`;

  const entries = [
    url('/', `
    <image:image>
      <image:loc>${esc(`${siteUrl}/assets/images/slider001.jpg`)}</image:loc>
      <image:caption>Structural glazing with HART spider fittings by Alfa Industries, Rajkot</image:caption>
    </image:image>`),
    url('/products/'),
    ...categories.map((c) => url(`/products/${c.id}/`, products.filter((p) => p.categoryId === c.id).map(img).join(''))),
    ...products.map((p) => url(productPath(p), img(p))),
    url('/company/'),
    url('/quality/'),
    url('/contact/')
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`;
}

export function robotsTxt(siteUrl) {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

export function llmsFullTxt(siteUrl) {
  return `# HART by Alfa Industries – complete product and plant reference

> Alfa Industries (brand HART) is an ISO 9001:2008 certified manufacturer of AISI 316 / 304 stainless steel architectural hardware.
> Plant: ${COMPANY.addressLines.join(' ')}
> Contacts: ${COMPANY.contacts.map((c) => `${c.name} ${c.phone}`).join(', ')} · Office ${COMPANY.phone} · ${COMPANY.email}
> Website: ${siteUrl}/

## Industries served
${INDUSTRIES.map((i) => `- ${i}`).join('\n')}

## Plant machinery
${MACHINES.map((m) => `- **${m.name}** (${m.categoryLabel}): ${m.spec}; ${m.capacity}. ${m.desc} Makes: ${m.outputParts}.`).join('\n')}

## Products (${products.length} item codes)
${categories.map((c) => {
    const meta = CATEGORY_META[c.id] || {};
    return `### ${c.name}
${meta.description || ''} Applications: ${meta.uses || ''}
Also known as: ${(meta.aka || []).join(', ')}
Catalogue PDF: ${c.catalogPdfLocal ? `${siteUrl}/${c.catalogPdfLocal}` : 'n/a'}

${products.filter((p) => p.categoryId === c.id).map((p) => {
      const s = p.specifications || {};
      return `- ${p.code} – ${decode(p.title)}${s.Material ? ` | ${s.Material}` : ''}${s.Finish ? ` | Finish: ${s.Finish}` : ''}${s.Tested ? ` | Tested: ${s.Tested}` : ''} | ${siteUrl}${productPath(p)} | Image: ${siteUrl}/${productSeoImagePath(p)}`;
    }).join('\n')}`;
  }).join('\n\n')}

## FAQ
${FAQS.map((f) => `**${f.q}**\n${f.a}`).join('\n\n')}
`;
}
