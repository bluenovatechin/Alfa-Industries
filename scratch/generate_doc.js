import fs from 'node:fs';
import path from 'node:path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType
} from 'docx';

// Colors
const PRIMARY = '1A365D'; // Deep Navy
const SECONDARY = '2B6CB0'; // Slate Blue
const ACCENT = 'D69E2E'; // Gold / Warm Amber
const TEXT_DARK = '2D3748'; // Charcoal body
const BG_LIGHT = 'F7FAFC'; // Light grey/blue background
const BORDER_COLOR = 'E2E8F0';

function titlePara(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.TITLE,
    spacing: { before: 240, after: 120 },
    alignment: AlignmentType.CENTER
  });
}

function h1Para(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32, // 16pt
        color: PRIMARY,
        font: 'Segoe UI'
      })
    ],
    spacing: { before: 360, after: 140 }
  });
}

function h2Para(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26, // 13pt
        color: SECONDARY,
        font: 'Segoe UI'
      })
    ],
    spacing: { before: 240, after: 100 }
  });
}

function h3Para(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22, // 11pt
        color: TEXT_DARK,
        font: 'Segoe UI'
      })
    ],
    spacing: { before: 180, after: 80 }
  });
}

function bodyPara(text, options = {}) {
  const { bold = false, italic = false, color = TEXT_DARK } = options;
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold,
        italic,
        size: 20, // 10pt
        color,
        font: 'Segoe UI'
      })
    ],
    spacing: { before: 60, after: 100 },
    alignment: options.alignment || AlignmentType.LEFT
  });
}

function bulletPara(boldPrefix, text) {
  return new Paragraph({
    bullet: { level: 0 },
    children: [
      new TextRun({ text: boldPrefix + ' ', bold: true, size: 20, color: PRIMARY, font: 'Segoe UI' }),
      new TextRun({ text, size: 20, color: TEXT_DARK, font: 'Segoe UI' })
    ],
    spacing: { before: 40, after: 60 }
  });
}

function codeBlock(codeText) {
  const lines = codeText.split('\n');
  return lines.map(line =>
    new Paragraph({
      children: [
        new TextRun({
          text: line || ' ',
          font: 'Consolas',
          size: 18,
          color: '2C5282'
        })
      ],
      spacing: { before: 20, after: 20 },
      shading: {
        type: ShadingType.CLEAR,
        fill: 'EDF2F7'
      }
    })
  );
}

function createTable(headers, rows) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(h =>
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 20, font: 'Segoe UI' })],
            alignment: AlignmentType.CENTER
          })
        ],
        shading: { type: ShadingType.CLEAR, fill: PRIMARY },
        margins: { top: 120, bottom: 120, left: 140, right: 140 }
      })
    )
  });

  const bodyRows = rows.map((r, rowIndex) =>
    new TableRow({
      children: r.map((cellText, cellIndex) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cellText,
                  size: 19,
                  color: TEXT_DARK,
                  font: 'Segoe UI',
                  bold: cellIndex === 0
                })
              ]
            })
          ],
          shading: {
            type: ShadingType.CLEAR,
            fill: rowIndex % 2 === 0 ? 'FFFFFF' : BG_LIGHT
          },
          margins: { top: 100, bottom: 100, left: 140, right: 140 }
        })
      )
    })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: BORDER_COLOR },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: BORDER_COLOR }
    },
    rows: [headerRow, ...bodyRows]
  });
}

async function buildDoc() {
  const doc = new Document({
    creator: 'Antigravity SEO Systems',
    title: 'The Complete SEO Mastery Playbook: The Universal Formula for #1 Google & Google Lens Rankings',
    description: 'Comprehensive beginner-to-advanced SEO guide with technical templates, code patterns, and content formulas.',
    sections: [
      {
        properties: {},
        children: [
          // Header / Title
          new Paragraph({
            children: [
              new TextRun({
                text: 'THE COMPLETE SEO MASTERY PLAYBOOK',
                bold: true,
                size: 40,
                color: PRIMARY,
                font: 'Segoe UI'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 60 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'The Universal Engineering & Content Formula for #1 Rankings on Google Search and Google Lens',
                size: 24,
                italic: true,
                color: SECONDARY,
                font: 'Segoe UI'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Applicable to any project: E-Commerce, Catalogs, Portfolios, SaaS, and B2B Industrial Websites',
                bold: true,
                size: 20,
                color: ACCENT,
                font: 'Segoe UI'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 300 }
          }),

          // Chapter 1
          h1Para('1. Executive Overview & The Universal SEO Formula'),
          bodyPara(
            'Search Engine Optimization (SEO) is not a guessing game or magic tricks. Google is a mathematical ranking engine powered by neural networks, natural language processing, and computer vision. To rank #1 on Google, your website must satisfy four pillars:'
          ),
          createTable(
            ['Pillar', 'What It Means', 'How Google Measures It'],
            [
              ['1. Crawlability & Indexing', 'Can Googlebot discover and parse your pages without errors?', 'HTTP 200 OK responses, sitemap.xml, robots.txt, fast server response.'],
              ['2. Topical Relevance', 'Does your content directly and comprehensively answer what the user searched for?', 'Keywords in Title, H1, URLs, natural synonyms, semantic depth.'],
              ['3. Technical & Structured Data', 'Does Google machine-understand your products, address, ratings, and breadcrumbs?', 'Schema.org JSON-LD (Product, Organization, BreadcrumbList, LocalBusiness).'],
              ['4. Visual Authority & Google Lens', 'Can Google Lens match physical photos and search queries to your product images?', 'Image Sitemaps, descriptive alt text, high-contrast studio photos, clean filenames.']
            ]
          ),
          bodyPara(
            'The Universal Ranking Formula: Discoverability + Relevance + Technical Authority + User Experience = #1 Ranking.',
            { bold: true, color: PRIMARY }
          ),

          // Chapter 2
          h1Para('2. How Google Search & Google Lens Actually Work'),
          bodyPara(
            'Before editing any code or text, you must understand the four distinct phases Google goes through for every single page:'
          ),
          bulletPara('Phase 1: Crawling (Discovery)', 'Googlebot reads your sitemap.xml and follows links across the web. If a page has no links pointing to it and is not in sitemap.xml, Google does not know it exists.'),
          bulletPara('Phase 2: Rendering (The JavaScript Trap)', 'Modern websites built with React, Vue, or Angular render on the user’s browser. Googlebot crawls with a headless Chromium browser, but if your server returns a 404 or an empty shell before JavaScript runs, Google will drop the page. Pre-rendering solves this!'),
          bulletPara('Phase 3: Indexing & Vectorization', 'Google converts your words and images into mathematical embeddings (vectors). It categorizes what entity your page represents (e.g., "Stainless Steel Spider Fitting Manufacturer in Rajkot, India").'),
          bulletPara('Phase 4: Ranking & Re-ranking', 'When a user searches, Google compares their query vector with indexed page vectors, ranking the best matches based on click-through rates (CTR), page load speed, and domain trust.'),

          // Chapter 3
          h1Para('3. The Universal Keyword Generation Formula'),
          bodyPara(
            'Never guess what people search. Follow this exact formula to generate 50+ high-ranking keywords for any product or service:'
          ),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Formula: [Brand] + [Model / Code] + [Core Category Name] + [Material / Technical Spec] + [Application / Use-Case] + [Location / Manufacturer]',
                bold: true,
                size: 21,
                color: PRIMARY,
                font: 'Consolas'
              })
            ],
            spacing: { before: 100, after: 120 }
          }),
          bodyPara('Here is how that formula translates into real search queries for an architectural hardware fitting:'),
          bulletPara('Exact Product Query:', '“HART ASF-01 4 way fin spider fitting”'),
          bulletPara('Technical Specification Query:', '“AISI 316 stainless steel spider glass fitting”'),
          bulletPara('Application Query:', '“point fixed spider glass fittings for facade curtain wall”'),
          bulletPara('B2B / Manufacturer Query:', '“stainless steel architectural hardware manufacturer Rajkot Gujarat India”'),

          h2Para('The Keyword Placement Hierarchy (Where to Put Keywords)'),
          bodyPara('Google weighs words differently depending on where they appear in your HTML:'),
          createTable(
            ['HTML Location', 'SEO Weight', 'Best Practice Example'],
            [
              ['<title>', 'CRITICAL (Highest)', 'HART ASF-01 Four Way Fin Spider Fitting | AISI 316 SS'],
              ['URL Path', 'VERY HIGH', '/products/spider-fittings/asf-01/ (keep it clean, lowercase, hyphens)'],
              ['<h1> Heading', 'VERY HIGH', 'Only one H1 per page matching the main topic exactly.'],
              ['First 100 Words', 'HIGH', 'Include the primary keyword naturally in the opening paragraph.'],
              ['<meta name="description">', 'HIGH (Drives Click-Through)', '150-160 characters summary with clear call to action and specifications.'],
              ['<h2> and <h3> Subheadings', 'MEDIUM-HIGH', 'Break topics into features, specifications, and applications.'],
              ['Image Alt Text', 'CRITICAL for Lens & Images', 'Descriptive technical text explaining the exact item in the photo.']
            ]
          ),

          // Chapter 4
          h1Para('4. Technical SEO Code Blueprint (Copy-Paste Starter for Any Site)'),
          bodyPara(
            'Below is the gold-standard <head> configuration that every production website should implement:'
          ),
          ...codeBlock(
`<!-- Essential Meta Tags -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Product Name | Core Feature | Brand</title>
<meta name="description" content="150-160 character description including primary keywords, material, and value proposition." />
<meta name="keywords" content="keyword 1, keyword 2, keyword 3, location, manufacturer" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

<!-- Google Verification & Local SEO -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
<meta name="geo.region" content="IN-GJ" />
<meta name="geo.placename" content="City, State, Country" />
<meta name="geo.position" content="LATITUDE;LONGITUDE" />
<meta name="ICBM" content="LATITUDE, LONGITUDE" />

<!-- Canonical URL (Prevents duplicate content penalty) -->
<link rel="canonical" href="https://example.com/current-clean-url/" />

<!-- Open Graph (WhatsApp, LinkedIn, Facebook preview) -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Brand Name" />
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Page Summary" />
<meta property="og:url" content="https://example.com/current-clean-url/" />
<meta property="og:image" content="https://example.com/assets/images/preview.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title" />
<meta name="twitter:description" content="Page Summary" />
<meta name="twitter:image" content="https://example.com/assets/images/preview.jpg" />`
          ),

          // Chapter 5
          h1Para('5. Rich Schema.org Structured Data (JSON-LD)'),
          bodyPara(
            'Search engines do not just read text; they parse JSON-LD structured data. Adding structured data enables Google Rich Snippets: star ratings, product pricing, stock availability, breadcrumbs, and Knowledge Panels.'
          ),
          h2Para('A. Product Schema Template (For E-Commerce & Catalogs)'),
          ...codeBlock(
`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "HART ASF-01 Four Way Fin Type Spider",
  "image": "https://example.com/assets/spider-fittings/asf-01.jpg",
  "description": "High performance 4-way fin spider fitting manufactured from AISI 316 stainless steel for structural glass facades.",
  "sku": "ASF-01",
  "mpn": "ASF-01",
  "brand": {
    "@type": "Brand",
    "name": "HART"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Alfa Industries",
    "url": "https://example.com/"
  },
  "material": "Stainless Steel 316 Grade",
  "category": "Spider Fittings",
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/spider-fittings/?p=ASF-01",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
</script>`
          ),

          h2Para('B. BreadcrumbList Schema (Shows Navigation in Search Results)'),
          ...codeBlock(
`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://example.com/products/" },
    { "@type": "ListItem", "position": 3, "name": "Spider Fittings", "item": "https://example.com/products/spider-fittings/" }
  ]
}
</script>`
          ),

          h2Para('C. Google Sitelinks SearchBox Schema'),
          ...codeBlock(
`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://example.com/",
  "name": "Brand Name",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/products?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
</script>`
          ),

          // Chapter 6
          h1Para('6. Google Lens & Image SEO Masterclass'),
          bodyPara(
            'Google Lens is now one of the primary discovery channels on mobile. When a contractor, architect, or customer takes a photo of a fitting, how do you make sure your website shows up first?'
          ),
          bulletPara('Rule 1: Studio Clean Photography', 'Photos on white, grey, or neutral backgrounds with crisp shadows allow Google’s computer vision algorithms to isolate the edge contours and geometry cleanly.'),
          bulletPara('Rule 2: Filename Keyword Formula', 'Never upload photos named IMG_0492.jpg. Always rename them with hyphens: brand-code-keyword-material.jpg (e.g., hart-asf-01-spider-fitting-ss316.jpg).'),
          bulletPara('Rule 3: Technical Alt Text', 'Write alt text as a human would describe it to an architect: alt="HART ASF-01 four way fin type spider fitting in AISI 316 stainless steel for structural glass facades".'),
          bulletPara('Rule 4: Google Image Sitemaps', 'Include <image:image> tags inside your sitemap.xml with <image:loc>, <image:title>, and <image:caption>. This tells Googlebot where to find your high-res photos immediately.'),
          bulletPara('Rule 5: Image Dimensions and Modern Formats', 'Always specify width and height on img tags to avoid Cumulative Layout Shift (CLS) penalties. Use modern WebP or optimized JPGs under 150KB for rapid mobile loading.'),

          // Chapter 7
          h1Para('7. Content Rewriting: Turning Weak Text into High-Ranking Text'),
          bodyPara('Here is a direct Before & After demonstration of how to rewrite product copy:'),
          createTable(
            ['Element', 'Weak / Low-Ranking Content', 'High-Ranking Optimized Content'],
            [
              ['Title', 'ASF-01 Fitting', 'HART ASF-01 Four Way Fin Spider Fitting | AISI 316 Stainless Steel'],
              ['Description', 'We sell spider fittings for glass. Contact us for price.', 'Alfa Industries manufactures the HART ASF-01 four-way fin spider fitting in AISI 316 stainless steel. Ideal for structural glazing, glass curtain walls, and exterior canopies. ISO 9001 certified. Request an instant quote.'],
              ['Specs Table', 'SS, 4 holes, heavy', 'Material: Tested AISI 316 / 304 Grade Stainless Steel | Finish: Satin / Mirror Buffed | Testing: Salt spray tested, load tested | Application: Heavy-duty frameless facades.'],
              ['Image Alt', 'photo.jpg', 'alt="HART ASF-01 4-way fin type stainless steel spider fitting for glass facade"']
            ]
          ),

          // Chapter 8
          h1Para('8. The 10-Minute Pre-Launch Checklist for ANY Future Project'),
          bulletPara('[ ] 1. Google Verification Tag:', 'Place verification HTML file in public/ and meta tag in index.html head.'),
          bulletPara('[ ] 2. Static Pre-Rendering (if SPA):', 'Ensure all main category and content URLs return HTTP 200 OK directly, not 404.'),
          bulletPara('[ ] 3. Single H1 on Each Page:', 'Verify that each page has exactly one <h1> that includes the main target search phrase.'),
          bulletPara('[ ] 4. XML Sitemap with Images:', 'Verify sitemap.xml exists, is valid XML, and links all images with title and caption.'),
          bulletPara('[ ] 5. robots.txt:', 'Allow all search engines (Allow: /) and reference Sitemap URL.'),
          bulletPara('[ ] 6. Canonical URLs:', 'Each page has a <link rel="canonical"> pointing to its preferred clean URL.'),
          bulletPara('[ ] 7. Schema.org JSON-LD:', 'Validate structured data using Google Rich Results Test (https://search.google.com/test/rich-results).'),
          bulletPara('[ ] 8. Responsive & Fast:', 'Check Google PageSpeed Insights (https://pagespeed.web.dev/) to ensure Core Web Vitals pass.'),
          bulletPara('[ ] 9. Submit to Search Console:', 'Submit sitemap.xml and request manual indexing for homepage and core categories.'),
          bulletPara('[ ] 10. Check Index Status:', 'Monitor site:yourdomain.com in Google search weekly to verify index growth.')
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.resolve('Complete_SEO_Mastery_Guide.docx');
  fs.writeFileSync(outPath, buffer);
  console.log(`Document successfully written to ${outPath} (${buffer.length} bytes)`);
}

buildDoc().catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});
