import { AlfaHardwareAPI } from './alfaData';

// UI-side content layer. The scraped dataset is kept verbatim; everything the
// site needs on top of it (descriptions, cleaned copy, helpers) lives here.

export const COMPANY = {
  name: 'Alfa Industries',
  brand: 'HART',
  certification: 'ISO 9001:2008',
  phone: '0091 2827 253904',
  phoneHref: 'tel:+912827253904',
  email: 'info@alfahardware.com',
  website: 'www.alfahardware.com',
  whatsapp: '919879252904',
  addressLines: [
    'Survey No. 257, Plot No. 1-A,',
    'Opp. Supreme Polymers, B/h. Maruti Petrol Pump,',
    'Shapar (Veraval) 360024, Dist. Rajkot, Gujarat, India'
  ],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Shapar+Veraval+Rajkot+Gujarat+360024',
  contacts: [
    { name: 'Mr. Haresh Patel', phone: '098792 52904', tel: '+919879252904' },
    { name: 'Mr. Bhavesh Patel', phone: '099255 07880', tel: '+919925507880' }
  ]
};

export const CATEGORY_META = {
  'spider-fittings': {
    short: 'Spider Fittings',
    description: 'Point-fixed spiders, routels, fin and splice plates for structural glass facades and curtain walls.'
  },
  'canopy-fittings': {
    short: 'Canopy Fittings',
    description: 'Wall brackets and rod or cable connectors for suspended glass canopies over entrances.'
  },
  'glass-door-sliding-folding-system': {
    short: 'Sliding & Folding Systems',
    description: 'Rollers, top tracks, hinges, stoppers and floor guides for sliding and folding glass doors.'
  },
  'shower-glass-fittings': {
    short: 'Shower & Railing Fittings',
    description: 'Sliding door handles, knobs, rod connectors, tracks and railing fittings for shower enclosures.'
  },
  'patch-fittings': {
    short: 'Patch Fittings',
    description: 'Top, bottom and over-panel patches, pivots and patch locks for frameless glass doors.'
  },
  'mortise-handles': {
    short: 'Mortise Handles',
    description: 'Lever handles on rose and plate, mortise locks, cylinders and key holes for timber doors.'
  },
  'glass-door-handles': {
    short: 'Glass Door Handles',
    description: 'H, D, S and C-type pull handles in round and square profiles, including timber-inlay designs.'
  },
  'glass-connectors': {
    short: 'Glass Connectors',
    description: 'Cast and sheet-metal glass-to-glass and wall-to-glass connectors, floor mounts and glass hinges.'
  },
  'floor-spring-and-door-closer': {
    short: 'Floor Springs & Closers',
    description: 'Hydraulic floor spring and door closer tested to 5,00,000 cycles, with top pivots and bottom strips.'
  }
};

export const APPLICATIONS = [
  { title: 'Structural glazing & facades', image: 'assets/images/slider001.jpg', categoryId: 'spider-fittings' },
  { title: 'Glass canopies', image: 'assets/images/slider002.jpg', categoryId: 'canopy-fittings' },
  { title: 'Frameless glass entrances', image: 'assets/images/slider007.jpg', categoryId: 'patch-fittings' },
  { title: 'Sliding & folding glass doors', image: 'assets/images/slider003.jpg', categoryId: 'glass-door-sliding-folding-system' },
  { title: 'Timber & interior doors', image: 'assets/images/slider006.jpg', categoryId: 'mortise-handles' },
  { title: 'Balustrades & partitions', image: 'assets/images/slider010.jpg', categoryId: 'glass-connectors' }
];

export const HERO_IMAGES = [
  { src: 'assets/images/slider001.jpg', label: 'Structural glazing with HART spider fittings' },
  { src: 'assets/images/slider005.jpg', label: 'HART patch fittings and patch lock' },
  { src: 'assets/images/slider007.jpg', label: 'Frameless glass entrance hardware' },
  { src: 'assets/images/slider008.jpg', label: 'HART glass-to-glass connectors' },
  { src: 'assets/images/slider003.jpg', label: 'Folding glass door system' },
  { src: 'assets/images/slider010.jpg', label: 'Point-fixed glass balustrade' }
];

export const FEATURED_CODES = ['ASF-01', 'APF-08', 'AFS-01', 'AGSF-R-1', 'APH-02', 'AMH-01-P', 'AGC-03', 'ACF-01'];

// Copy edited from the original website text (spelling and grammar only).
export const COPY = {
  about: [
    'Alfa Industries is a leading manufacturer of corrosion-resistant, high-grade AISI 316 / 304 stainless steel architectural hardware fittings. Our products are manufactured under the brand name HART.',
    'Our product portfolio is in demand for its design, polish and finish, dimensional accuracy and durability.',
    'HART products are used worldwide in commercial, industrial, domestic and international projects.',
    'Our organisation is backed by an experienced team that helps clients understand their requirements and recommends the right products accordingly.'
  ],
  welcome:
    'Some of our products are proven over years of use; others are freshly developed. If you need a customised design, just drop us a word and we will cater to your requirement promptly.',
  infrastructure:
    'Our plant is equipped with modern machinery including VMC, CNC, hydraulic bending machine, power press, buffing machine, cutting machine, hydraulic press, manual batch grinder, lathe, threading machine, drill, surface batch grinding and round pipe grinding machines, and TIG welding. This allows better quality and bulk production, with our entire production done in-house.',
  quality:
    'All of our products are manufactured under one roof following ISO 9001:2008 quality standards. We use superior raw material sourced from reliable vendors, and raw materials are tested on physical and chemical parameters to ensure their quality. Modern machinery converts raw material into finished goods, and we take care at every stage so the product is at its best when the process ends. We give equal importance to production, expansion, and pre- and post-sales service.',
  mission:
    'Our mission is to provide high-quality products at reasonable rates, with the best customer service and a product guarantee. We aim to satisfy each and every customer and to dispatch as committed.',
  methodology:
    'We believe in strong research and development before launching products in the market. We also take valuable input from architects and interior designers for better look, comfort and style.',
  vision:
    'Over the years we have introduced a high-quality, up-to-date product range to stay ahead of the competition. We continuously adapt to market demand and client-specified requirements.'
};

export const MACHINES = [
  { name: 'VMC', desc: 'Vertical machining centre for spider arms, connectors and precision 3D profiles.' },
  { name: 'CNC turning', desc: 'Close-tolerance turned components, bolts and routel bodies.' },
  { name: 'Hydraulic bending', desc: 'Uniform bending of stainless steel plate and tubular profiles.' },
  { name: 'Power press', desc: 'Stamping, blanking and forming of sheet-metal parts.' },
  { name: 'Hydraulic press', desc: 'Deep drawing and heavy presswork.' },
  { name: 'Cutting', desc: 'High-speed cutting of bar, tube and sections.' },
  { name: 'Lathe', desc: 'Turning, facing, boring and threading of round fittings.' },
  { name: 'Threading', desc: 'Internal and external metric threads for fasteners and rods.' },
  { name: 'Drilling', desc: 'Drilling, reaming and countersinking.' },
  { name: 'Surface batch grinding', desc: 'Flat surface levelling and consistent grain.' },
  { name: 'Round pipe grinding', desc: 'Seamless finish on tubular handles and rods.' },
  { name: 'Manual batch grinding', desc: 'Edge profiling, deburring and detailed contours.' },
  { name: 'Buffing', desc: 'Mirror (glossy) polish and satin grain finishing.' },
  { name: 'TIG welding', desc: 'Clean, high-integrity stainless steel joints.' }
];

export const PROCESS = [
  { title: 'Material testing', text: 'AISI 316 / 304 stock from reliable vendors, tested on physical and chemical parameters.' },
  { title: 'Machining', text: 'VMC, CNC and lathe operations for accurate, repeatable components.' },
  { title: 'Forming & welding', text: 'Pressing, bending and TIG welding of plate and tube.' },
  { title: 'Grinding & finishing', text: 'Grinding and buffing to satin, glossy or combination finishes.' },
  { title: 'Inspection & dispatch', text: 'Checked against ISO 9001:2008 procedures and dispatched as committed.' }
];

export const MATERIAL_FILTERS = [
  { id: 'ss316', label: 'Stainless steel 316' },
  { id: 'ss304', label: 'Stainless steel 304' },
  { id: 'aluminium', label: 'Aluminium' },
  { id: 'other', label: 'Other / composite' }
];

export const FINISH_FILTERS = [
  { id: 'satin', label: 'Satin' },
  { id: 'glossy', label: 'Glossy' },
  { id: 'combi', label: 'Combi' },
  { id: 'black', label: 'Black' }
];

const ENTITIES = { '&ldquo;': '“', '&rdquo;': '”', '&amp;': '&', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
export const decode = (s = '') =>
  s
    .replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m] ?? m)
    .replace(/,\s*-\s*/g, ' – ')
    .replace(/\s+-\s+(?=\d)/g, ' ')
    .replace(/\.$/, '');

export const asset = (path) => (path ? `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}` : '');

export function productImage(product, size = 'full') {
  const { images } = product;
  if (size === 'thumb') return asset(images.thumbnailLocal || images.fullLocal) || images.thumbnailOnline;
  return asset(images.fullLocal || images.thumbnailLocal) || images.fullOnline;
}

export function onImageError(product) {
  return (e) => {
    const fallback = product.images.fullOnline;
    if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
  };
}

export function materialGroup(product) {
  const m = (product.specifications?.Material || '').toLowerCase();
  if (m.includes('316')) return 'ss316';
  if (/^stainless steel 304 grade$/.test(m)) return 'ss304';
  if (m.startsWith('aluminium')) return 'aluminium';
  return 'other';
}

export function hasFinish(product, finishId) {
  return (product.specifications?.Finish || '').toLowerCase().includes(finishId);
}

export function shortMaterial(product) {
  const m = product.specifications?.Material || '';
  return m.replace(/stainless steel/i, 'SS').replace(/\s*grade/i, '');
}

export const categoryName = (id) => CATEGORY_META[id]?.short || AlfaHardwareAPI.getCategory(id)?.name || id;

export function getCategories() {
  return AlfaHardwareAPI.getCategories().map((c) => ({
    ...c,
    shortName: CATEGORY_META[c.id]?.short || c.name,
    description: CATEGORY_META[c.id]?.description || '',
    cover: c.products[0]
  }));
}

export function getProducts() {
  return AlfaHardwareAPI.getAllProducts();
}

export function getProduct(code) {
  return AlfaHardwareAPI.getProductByCode(code);
}

export function searchProducts(query) {
  return AlfaHardwareAPI.searchProducts(query);
}

export function getCatalogues() {
  const cats = AlfaHardwareAPI.getCategories();
  return AlfaHardwareAPI.getDownloads().map((d) => {
    const cat = cats.find((c) => c.catalogPdfLocal === d.pdfLocalPath);
    return { ...d, category: cat || null };
  });
}

export const TOTAL_PRODUCTS = AlfaHardwareAPI.getAllProducts().length;
export const TOTAL_CATEGORIES = AlfaHardwareAPI.getCategories().length;
