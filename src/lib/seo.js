// Single source of truth for per-route SEO: <title>, meta description, canonical
// URL, social image and JSON-LD. Used in the browser (App.jsx) and at build time
// (vite.config.js) to pre-render every route, so both always agree.
//
// Keep this file free of import.meta.env / DOM access: it also runs in Node.

import { AlfaHardwareAPI } from '../data/alfaData';
import {
  COMPANY, CATEGORY_META, FAQS, MACHINES, INDUSTRIES, decode, productSlug, productPath,
  productSeoImagePath, productAlt, productDescription, categoryName
} from '../data/catalog';

const BRAND = 'HART by Alfa Industries';
const DEFAULT_IMAGE = 'assets/images/slider001.jpg';

const clip = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');

export const orgRef = (siteUrl) => ({ '@id': `${siteUrl}/#organization` });

function breadcrumbs(siteUrl, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: siteUrl + c.path
    }))
  };
}

export function imageObject(siteUrl, product) {
  const path = productSeoImagePath(product);
  return {
    '@type': 'ImageObject',
    contentUrl: `${siteUrl}/${path}`,
    url: `${siteUrl}/${path}`,
    name: `HART ${product.code} ${decode(product.title)}`,
    caption: productAlt(product),
    creditText: 'Alfa Industries (HART)',
    creator: { '@type': 'Organization', name: 'Alfa Industries' },
    copyrightNotice: '© Alfa Industries, Rajkot'
  };
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
}

export function findProduct(segments, query = {}) {
  if (segments[0] !== 'products') return null;
  const key = segments[2] || query.p;
  if (!key) return null;
  const k = String(key).toLowerCase();
  return AlfaHardwareAPI.getAllProducts().find((p) => productSlug(p) === k || p.code.toLowerCase() === k) || null;
}

/**
 * Returns { title, description, path, image, imageAlt, jsonLd } for a route,
 * or null for unknown routes. `siteUrl` has no trailing slash.
 */
export function routeSeo(segments = [], query = {}, siteUrl = '') {
  const page = segments[0] || '';
  const categories = AlfaHardwareAPI.getCategories();
  const webPage = (type, path, name, description, extra = {}) => ({
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${siteUrl}${path}#webpage`,
    url: siteUrl + path,
    name,
    description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: orgRef(siteUrl),
    ...extra
  });

  if (page === '') {
    const title = 'HART Stainless Steel Architectural Hardware Manufacturer | Alfa Industries, Rajkot';
    const description = `Alfa Industries, Shapar (Veraval), Rajkot makes ${AlfaHardwareAPI.getAllProducts().length} HART architectural hardware fittings in SS 316 / 304: glass spider fittings, patch fittings, glass connectors, door handles, sliding systems and floor springs. ISO 9001:2008.`;
    return {
      title, description, path: '/', image: DEFAULT_IMAGE,
      imageAlt: 'Structural glazing with HART stainless steel spider fittings by Alfa Industries',
      jsonLd: [webPage('WebPage', '/', title, description, {
        primaryImageOfPage: { '@type': 'ImageObject', url: `${siteUrl}/${DEFAULT_IMAGE}` },
        mainEntity: {
          '@type': 'ItemList',
          name: 'HART architectural hardware ranges',
          itemListElement: categories.map((c, i) => ({
            '@type': 'ListItem', position: i + 1, name: CATEGORY_META[c.id]?.seoTitle || c.name, url: `${siteUrl}/products/${c.id}/`
          }))
        }
      })]
    };
  }

  if (page === 'products') {
    const product = findProduct(segments, query);
    if (product) {
      const cat = categories.find((c) => c.id === product.categoryId);
      const catName = categoryName(product.categoryId);
      const name = `HART ${product.code} ${decode(product.title)}`;
      const path = productPath(product);
      const description = clip(productDescription(product), 300);
      const specs = product.specifications || {};
      return {
        title: clip(`${name}${specs.Material ? ' – ' + specs.Material.replace(/stainless steel/i, 'SS').replace(/\s*grade/i, '') : ''} | Alfa Industries`, 95),
        description: clip(description, 160),
        path,
        image: productSeoImagePath(product) || DEFAULT_IMAGE,
        imageAlt: productAlt(product),
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            '@id': `${siteUrl}${path}#product`,
            name,
            alternateName: [product.code, `HART ${product.code}`, decode(product.title)],
            sku: product.code,
            mpn: product.code,
            productID: product.code,
            url: siteUrl + path,
            image: imageObject(siteUrl, product),
            description,
            brand: { '@type': 'Brand', name: 'HART' },
            manufacturer: orgRef(siteUrl),
            countryOfOrigin: { '@type': 'Country', name: 'India' },
            category: `Architectural Hardware > ${cat?.name || catName}`,
            ...(specs.Material && { material: specs.Material }),
            additionalProperty: Object.entries(specs).map(([key, value]) => ({
              '@type': 'PropertyValue', name: key, value: String(value)
            })),
            ...(cat?.catalogPdfLocal && {
              subjectOf: {
                '@type': 'DigitalDocument',
                name: `HART ${cat.name} catalogue (PDF)`,
                encodingFormat: 'application/pdf',
                url: `${siteUrl}/${cat.catalogPdfLocal}`
              }
            })
          },
          breadcrumbs(siteUrl, [
            { name: 'Products', path: '/products/' },
            { name: catName, path: `/products/${product.categoryId}/` },
            { name: product.code, path }
          ])
        ]
      };
    }

    const cat = categories.find((c) => c.id === segments[1]);
    if (cat) {
      const meta = CATEGORY_META[cat.id] || {};
      const items = AlfaHardwareAPI.getProductsByCategory(cat.id);
      const path = `/products/${cat.id}/`;
      const title = `${meta.seoTitle || cat.name} | HART – Alfa Industries, Rajkot`;
      const codes = items.slice(0, 6).map((p) => p.code).join(', ');
      const description = clip(`${items.length} HART ${meta.short || cat.name} (${codes}…) in SS 316 / 304 by Alfa Industries, Rajkot. ${meta.description || ''}`, 160);
      return {
        title, description, path,
        image: items[0] ? productSeoImagePath(items[0]) : DEFAULT_IMAGE,
        imageAlt: `HART ${meta.short || cat.name} by Alfa Industries`,
        jsonLd: [
          webPage('CollectionPage', path, title, description, {
            mainEntity: {
              '@type': 'ItemList',
              name: `HART ${cat.name}`,
              numberOfItems: items.length,
              itemListElement: items.map((p, i) => ({
                '@type': 'ListItem', position: i + 1, url: siteUrl + productPath(p),
                name: `HART ${p.code} ${decode(p.title)}`,
                image: `${siteUrl}/${productSeoImagePath(p)}`
              }))
            }
          }),
          breadcrumbs(siteUrl, [{ name: 'Products', path: '/products/' }, { name: meta.short || cat.name, path }])
        ]
      };
    }

    if (segments.length > 1) return null;
    const total = AlfaHardwareAPI.getAllProducts().length;
    const title = `Architectural Hardware Catalogue – ${total} HART Products | Alfa Industries`;
    const description = `Complete HART catalogue: ${total} stainless steel architectural hardware products in ${categories.length} ranges – spider, canopy and patch fittings, glass connectors, glass door and mortise handles, sliding systems, floor springs.`;
    return {
      title, description, path: '/products/', image: DEFAULT_IMAGE,
      imageAlt: 'HART architectural hardware catalogue',
      jsonLd: [
        webPage('CollectionPage', '/products/', title, description, {
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: categories.map((c, i) => ({
              '@type': 'ListItem', position: i + 1, name: c.name, url: `${siteUrl}/products/${c.id}/`
            }))
          }
        }),
        breadcrumbs(siteUrl, [{ name: 'Products', path: '/products/' }])
      ]
    };
  }

  if (page === 'company' && segments.length === 1) {
    const title = 'About Alfa Industries – Plant & Machinery in Shapar, Rajkot | HART';
    const description = 'Alfa Industries, Shapar (Veraval), Rajkot: in-house HART hardware plant with 4-axis VMC, CNC turning, 200T hydraulic press, bending, power press, grinding, mirror buffing and TIG welding.';
    return {
      title, description, path: '/company/', image: DEFAULT_IMAGE,
      imageAlt: 'Alfa Industries plant, Shapar (Veraval), Rajkot',
      jsonLd: [
        webPage('AboutPage', '/company/', title, description, {
          mentions: MACHINES.map((m) => ({ '@type': 'Thing', name: m.name, description: `${m.spec}. ${m.capacity}. ${m.desc}` })),
          keywords: [...INDUSTRIES, ...MACHINES.map((m) => m.name)].join(', ')
        }),
        breadcrumbs(siteUrl, [{ name: 'Company', path: '/company/' }]),
        faqSchema()
      ]
    };
  }

  if (page === 'quality' && segments.length === 1) {
    const title = 'Quality & Testing – ISO 9001:2008 Certified | HART by Alfa Industries';
    const description = 'HART hardware is made under one roof to ISO 9001:2008: spectrometer-tested SS 316 / 304, tensile load checks, salt spray tests and 5,00,000-cycle floor spring endurance testing.';
    return {
      title, description, path: '/quality/', image: DEFAULT_IMAGE, imageAlt: BRAND,
      jsonLd: [webPage('WebPage', '/quality/', title, description), breadcrumbs(siteUrl, [{ name: 'Quality', path: '/quality/' }])]
    };
  }

  if (page === 'contact' && segments.length === 1) {
    const title = 'Contact Alfa Industries – Shapar (Veraval), Rajkot, Gujarat | HART';
    const description = `Contact Alfa Industries for HART architectural hardware quotations: ${COMPANY.addressLines.join(' ')} Phone ${COMPANY.contacts.map((c) => c.phone).join(' / ')}, ${COMPANY.email}.`;
    return {
      title, description: clip(description, 160), path: '/contact/', image: DEFAULT_IMAGE, imageAlt: BRAND,
      jsonLd: [webPage('ContactPage', '/contact/', title, description), breadcrumbs(siteUrl, [{ name: 'Contact', path: '/contact/' }])]
    };
  }

  return null;
}

// Safe to drop inside <script type="application/ld+json">
export const jsonLdText = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
