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
  // Links with an empty url are hidden until one is added
  social: [
    { id: 'instagram', label: 'Instagram', handle: '@_alfa_hardware_industries', url: 'https://www.instagram.com/_alfa_hardware_industries/' },
    { id: 'facebook', label: 'Facebook', handle: 'HART by Alfa Hardware Industries', url: 'https://www.facebook.com/hart.alfahardware/' }
  ],
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

// `seoTitle` / `aka` / `uses` are the search phrases buyers actually type for each range;
// they are rendered as visible copy on the range page and in the pre-rendered HTML.
export const CATEGORY_META = {
  'spider-fittings': {
    short: 'Spider Fittings',
    seoTitle: 'Stainless Steel Glass Spider Fittings & Routels',
    description: 'Point-fixed spiders, routels, fin and splice plates for structural glass facades and curtain walls.',
    aka: ['glass spider fitting', 'spider clamp', 'point fixed glazing system', 'curtain wall spider', 'structural glazing spider', 'glass facade spider', '1 way / 2 way / 3 way / 4 way spider', 'fin type spider', 'point type spider', 'articulated routel', 'countersunk routel bolt', 'fin plate', 'splice plate'],
    uses: 'Structural glass facades, curtain walls, glass walls, skylights, atriums, showroom fronts and point-fixed glazing.'
  },
  'canopy-fittings': {
    short: 'Canopy Fittings',
    seoTitle: 'Glass Canopy Fittings & Wall Brackets',
    description: 'Wall brackets and rod or cable connectors for suspended glass canopies over entrances.',
    aka: ['glass canopy hardware', 'canopy bracket', 'canopy wall bracket', 'tie rod connector', 'canopy rod fitting', 'cable canopy fitting', 'suspended glass canopy', 'entrance canopy fittings'],
    uses: 'Suspended glass canopies over building entrances, porches, walkways, balconies and shopfronts.'
  },
  'glass-door-sliding-folding-system': {
    short: 'Sliding & Folding Systems',
    seoTitle: 'Glass Sliding & Folding Door Systems, Rollers & Tracks',
    description: 'Rollers, top tracks, hinges, stoppers and floor guides for sliding and folding glass doors.',
    aka: ['sliding glass door roller', 'glass door sliding system', 'folding glass door hardware', 'glass sliding track', 'top hung sliding system', 'glass door floor guide', 'sliding door stopper', 'frameless sliding door kit'],
    uses: 'Frameless sliding and folding glass doors, glass partitions, office cabins, movable glass walls and shopfronts.'
  },
  'shower-glass-fittings': {
    short: 'Shower & Railing Fittings',
    seoTitle: 'Shower Glass Fittings, Sliding Door Handles & Railing Fittings',
    description: 'Sliding door handles, knobs, rod connectors, tracks and railing fittings for shower enclosures.',
    aka: ['shower cubicle fittings', 'shower enclosure hardware', 'shower glass handle', 'shower door knob', 'shower sliding kit', 'glass to wall rod connector', 'support bar connector', 'railing fittings'],
    uses: 'Frameless shower cubicles and enclosures, bathroom glass partitions and glass railings.'
  },
  'patch-fittings': {
    short: 'Patch Fittings',
    seoTitle: 'Glass Door Patch Fittings & Patch Locks',
    description: 'Top, bottom and over-panel patches, pivots and patch locks for frameless glass doors.',
    aka: ['glass door patch fitting', 'top patch', 'bottom patch', 'over panel patch', 'patch lock', 'corner patch', 'frameless glass door fittings', 'toughened glass door fittings', 'glass door pivot'],
    uses: 'Frameless toughened glass entrance doors with floor springs, shopfronts, offices and showrooms.'
  },
  'mortise-handles': {
    short: 'Mortise Handles',
    seoTitle: 'Stainless Steel Mortise Handles, Locks & Cylinders',
    description: 'Lever handles on rose and plate, mortise locks, cylinders and key holes for timber doors.',
    aka: ['mortise lever handle', 'door handle on rose', 'door handle on plate', 'mortise lock', 'mortise lock body', 'euro profile cylinder', 'key hole escutcheon', 'SS door handle', 'stainless steel lever handle'],
    uses: 'Timber and flush doors in homes, apartments, hotels, hospitals, offices and institutional buildings.'
  },
  'glass-door-handles': {
    short: 'Glass Door Handles',
    seoTitle: 'Stainless Steel Glass Door Pull Handles',
    description: 'H, D, S and C-type pull handles in round and square profiles, including timber-inlay designs.',
    aka: ['glass door pull handle', 'H type handle', 'D type handle', 'S type handle', 'C type handle', 'back to back pull handle', 'SS pipe handle', 'square pull handle', 'wooden inlay handle', 'entrance door handle'],
    uses: 'Frameless glass entrance doors, timber main doors, shopfronts, malls, hotels and corporate offices.'
  },
  'glass-connectors': {
    short: 'Glass Connectors',
    seoTitle: 'Glass Connectors, Glass Clamps & Glass Hinges',
    description: 'Cast and sheet-metal glass-to-glass and wall-to-glass connectors, floor mounts and glass hinges.',
    aka: ['glass clamp', 'glass to glass connector', 'glass to wall connector', '90 degree glass connector', '180 degree glass connector', '135 degree glass connector', 'shower glass hinge', 'glass partition connector', 'balustrade clamp', 'floor mount'],
    uses: 'Glass partitions, shower enclosures, balustrades, glass railings, office cabins and display enclosures.'
  },
  'floor-spring-and-door-closer': {
    short: 'Floor Springs & Closers',
    seoTitle: 'Hydraulic Floor Springs & Door Closers',
    description: 'Hydraulic floor spring and door closer tested to 5,00,000 cycles, with top pivots and bottom strips.',
    aka: ['hydraulic floor spring', 'floor spring for glass door', 'double action floor spring', 'overhead door closer', 'hydraulic door closer', 'top pivot set', 'bottom strip', 'glass door floor spring'],
    uses: 'Heavy frameless glass entrance doors and timber doors in commercial, retail and public buildings.'
  }
};

// Industries and building types that specify HART hardware
export const INDUSTRIES = [
  'Commercial buildings & corporate offices',
  'Hotels, hospitality & restaurants',
  'Shopping malls, retail & showrooms',
  'Airports, metro & public infrastructure',
  'Hospitals & institutional buildings',
  'Residential apartments & luxury villas',
  'Facade, glazing & aluminium fabricators',
  'Architects, interior designers & builders'
];

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

export const MACHINE_CATEGORIES = [
  { id: 'all', label: 'All machinery' },
  { id: 'cnc', label: 'CNC & Precision Machining' },
  { id: 'press', label: 'Pressing & Forming' },
  { id: 'finishing', label: 'Grinding & Finishing' },
  { id: 'fabrication', label: 'Fabrication & Welding' }
];

export const MACHINES = [
  {
    id: 'vmc',
    name: 'VMC (Vertical Machining Centre)',
    category: 'cnc',
    categoryLabel: 'CNC & Precision Machining',
    spec: '4-Axis Precision VMC · High Speed Spindle',
    capacity: 'Bed size up to 1000mm · Tolerance ±0.015mm',
    desc: 'Heavy-duty vertical machining centre for 3D profiling, precision arm milling, countersink holes, and solid stainless steel glass connector blocks.',
    outputParts: 'Spider fitting arms (ASF-01 to ASF-14), heavy fin brackets, splice plates, glass connector bodies'
  },
  {
    id: 'cnc-turning',
    name: 'CNC Turning Centre',
    category: 'cnc',
    categoryLabel: 'CNC & Precision Machining',
    spec: 'Close-tolerance CNC lathe with multi-tool turret',
    capacity: 'Turning diameter Ø10mm – Ø250mm · Accuracy ±0.01mm',
    desc: 'High-precision turning for round fittings, countersunk routel bolts, articulated ball joints, and threaded bushings.',
    outputParts: 'Routel bodies (ARF-01 to ARF-06), threaded studs, pivot pins, glass fixing bolts, bushes'
  },
  {
    id: 'lathe',
    name: 'Heavy Industrial Lathe',
    category: 'cnc',
    categoryLabel: 'CNC & Precision Machining',
    spec: 'Geared-head precision engine lathe',
    capacity: 'Turning length up to 1500mm',
    desc: 'Facing, boring, single-point threading, and custom machining of large round hardware components and solid bar stock.',
    outputParts: 'Solid pull handle standoffs, large diameter canopy brackets, custom shafts'
  },
  {
    id: 'hydraulic-press',
    name: 'Heavy Hydraulic Deep Drawing Press',
    category: 'press',
    categoryLabel: 'Pressing & Forming',
    spec: 'High-tonnage hydraulic deep drawing system',
    capacity: 'Tonnage up to 200 Tons · Uniform pressure distribution',
    desc: 'Deep drawing and heavy presswork for stainless steel covers, base plates, and structural patch housings without material fatigue.',
    outputParts: 'Floor spring cement boxes (AFS-01), patch fitting outer covers (APF-01 to APF-08), floor mount bases'
  },
  {
    id: 'hydraulic-bending',
    name: 'Hydraulic Sheet & Tube Bending Machine',
    category: 'press',
    categoryLabel: 'Pressing & Forming',
    spec: 'Multi-radius hydraulic plate and tubular bender',
    capacity: 'Plate thickness up to 12mm · Tube bending up to Ø50mm',
    desc: 'Uniform, wrinkle-free bending of stainless steel plate profiles and architectural tubular sections with consistent radius geometry.',
    outputParts: 'Canopy wall brackets (ACF-01), bent glass clamps, custom tubular handle offsets'
  },
  {
    id: 'power-press',
    name: 'Mechanical Power Press',
    category: 'press',
    categoryLabel: 'Pressing & Forming',
    spec: 'High-speed mechanical stamping press',
    capacity: 'Capacity 30T to 100T · Continuous blanking',
    desc: 'High-precision stamping, blanking, punching, and forming of sheet metal internal mechanisms and reinforcement plates.',
    outputParts: 'Internal patch plates, lock strike plates, gasket backing washers, handle roses'
  },
  {
    id: 'buffing',
    name: 'Multi-Stage Mirror Buffing Line',
    category: 'finishing',
    categoryLabel: 'Grinding & Finishing',
    spec: 'Automated spindle buffing with diamond compounds',
    capacity: 'Surface roughness Ra < 0.2µm (Super Mirror Finish)',
    desc: 'Precision rotary buffing wheels creating flawless, optical-grade mirror polish on AISI 316 / 304 hardware with zero orange-peel effect.',
    outputParts: 'Mirror finish spider fittings, pull handles, patch covers, mortise plates'
  },
  {
    id: 'surface-batch-grinding',
    name: 'Surface Batch Grinder',
    category: 'finishing',
    categoryLabel: 'Grinding & Finishing',
    spec: 'Magnetic chuck surface grinding machine',
    capacity: 'Flatness within 0.02mm · Uniform satin hairline grain',
    desc: 'Precision surface levelling for flat fittings, creating consistent architectural satin grain direction across all production batches.',
    outputParts: 'Mortise handle backplates (AMH series), flat glass connectors, patch sides'
  },
  {
    id: 'round-pipe-grinding',
    name: 'Centreless Round Pipe & Tube Grinder',
    category: 'finishing',
    categoryLabel: 'Grinding & Finishing',
    spec: 'Planetary abrasive belt pipe polishing machine',
    capacity: 'Diameters Ø19mm to Ø65mm · Lengths up to 3000mm',
    desc: 'Seamless circumferential satin and glossy finishing on tubular door handles, shower tracks, and architectural balustrade railings.',
    outputParts: 'H-type & D-type pull handles (APH-01 to APH-18), shower sliding top tracks'
  },
  {
    id: 'manual-batch-grinding',
    name: 'Contour & Edge Profiling Grinder',
    category: 'finishing',
    categoryLabel: 'Grinding & Finishing',
    spec: 'Variable-speed abrasive belt deburring station',
    capacity: 'Micro-radiused edge deburring',
    desc: 'Manual contour profiling, chamfering, and radiused edge blending so every hardware piece is smooth, burr-free, and safe for glass contact.',
    outputParts: 'Spider arm chamfers, glass clamp bevels, mortise lever edges'
  },
  {
    id: 'tig-welding',
    name: 'Argon Shielded TIG Welding Station',
    category: 'fabrication',
    categoryLabel: 'Fabrication & Welding',
    spec: 'Inverter-based AC/DC High Frequency TIG welder',
    capacity: '100% penetration · Argon inert gas back purging',
    desc: 'Clean, high-integrity stainless steel welds with zero oxidation or carbide precipitation, preserving full AISI 316 corrosion resistance.',
    outputParts: 'Heavy-duty canopy brackets, welded fin plates, composite glass clamps'
  },
  {
    id: 'cutting',
    name: 'High-Speed Precision Band Saw & Cut-off Machine',
    category: 'fabrication',
    categoryLabel: 'Fabrication & Welding',
    spec: 'Automatic hydraulic horizontal band saw',
    capacity: 'Bar stock cutting up to Ø300mm · 90° and 45° mitre cuts',
    desc: 'Clean, square cutting of raw solid stainless steel billets, square bars, and hollow sections ready for CNC and VMC machining.',
    outputParts: 'Raw stock billets, handle tubes, track sections'
  },
  {
    id: 'threading',
    name: 'Precision Threading & Tapping Machine',
    category: 'fabrication',
    categoryLabel: 'Fabrication & Welding',
    spec: 'Pitch-controlled automatic tapping unit',
    capacity: 'Metric threads M6 to M30 · Class 6H fit',
    desc: 'Precision pitch-controlled internal and external threading for architectural tension rods, routel threads, and fixing bolts.',
    outputParts: 'Tension rods, M12 / M14 routel bolt threads, connector lock screws'
  },
  {
    id: 'drilling',
    name: 'Heavy-Duty Geared Radial Drill',
    category: 'fabrication',
    categoryLabel: 'Fabrication & Welding',
    spec: 'Multi-speed industrial radial drilling machine',
    capacity: 'Drilling capacity up to Ø40mm · Countersinking & reaming',
    desc: 'Accurate hole drilling, countersinking for architectural flush-mount bolts, and precision reaming for pivot pin alignment.',
    outputParts: 'Mounting brackets, base plates, glass hinge plates'
  }
];

export const FAQS = [
  {
    category: 'Company & Plant',
    q: 'Who is Alfa Industries and what is the HART brand?',
    a: 'Alfa Industries is an ISO 9001:2008 certified Indian manufacturer based in Shapar (Veraval), Rajkot, Gujarat. We engineer and produce premium architectural hardware under the registered trademark brand HART, specializing in corrosion-resistant AISI 316 and AISI 304 stainless steel fittings for point-fixed glass facades, frameless glass doors, shower cubicles, sliding systems, and floor springs.'
  },
  {
    category: 'Company & Plant',
    q: 'Where is Alfa Industries manufacturing plant located?',
    a: 'Our plant is located at Survey No. 257, Plot No. 1-A, Opp. Supreme Polymers, Behind Maruti Petrol Pump, Shapar (Veraval) 360024, District Rajkot, Gujarat, India. All engineering, machining, pressing, welding, grinding, and surface buffing are carried out 100% in-house under one roof.'
  },
  {
    category: 'Company & Plant',
    q: 'What in-house machinery and production infrastructure does Alfa Industries operate?',
    a: 'Our facility is equipped with 4-Axis Vertical Machining Centers (VMC), CNC turning lathes, heavy hydraulic deep-drawing presses up to 200 Tons, hydraulic sheet and tube bending machines, power presses, surface batch grinders, centreless round pipe grinders, contour deburring grinders, precision threading & tapping machinery, heavy radial drills, high-speed cutting units, argon shielded TIG welding stations, and multi-stage mirror buffing lines.'
  },
  {
    category: 'Hardware & Materials',
    q: 'What stainless steel grades are used for HART architectural hardware?',
    a: 'We manufacture primarily in AISI 316 (marine-grade stainless steel with molybdenum for superior resistance against coastal salt spray, urban pollution, and harsh weather) and AISI 304 grade stainless steel for interior and standard architectural installations. Every incoming raw material batch is verified on physical tensile and chemical spectrometer parameters.'
  },
  {
    category: 'Hardware & Materials',
    q: 'What finishes are available across the HART product range?',
    a: 'We offer four primary finishes: Satin (hairline brushed stainless steel grain), Glossy (optically clear mirror buffing with surface roughness Ra < 0.2µm), Combi (a combination of satin and mirror polish on distinct faces of the same fitting), and PVD Black Matte coating for contemporary minimalist architecture.'
  },
  {
    category: 'Quality & Testing',
    q: 'What certifications and endurance testing standards does HART hardware satisfy?',
    a: 'Alfa Industries is certified under ISO 9001:2008 for quality management across all manufacturing stages. Our movement hardware—including the AFS-01 hydraulic floor spring and ADC-01 overhead door closer—is endurance tested to 5,00,000 continuous operating cycles without oil leakage or loss of damping control.'
  },
  {
    category: 'Customization & OEM',
    q: 'Does Alfa Industries manufacture custom hardware, bespoke fittings, or OEM components?',
    a: 'Yes. With our in-house VMC/CNC tooling and engineering team, we develop custom architectural hardware, customized spider arms, bespoke glass-to-wall brackets, and OEM components tailored to CAD drawings and structural specifications provided by architects and facade consultants.'
  },
  {
    category: 'Search & Google Lens',
    q: 'Can I search for HART hardware and machines using Google Lens or visual search?',
    a: 'Yes. All 185 HART products across 9 categories are indexed with high-resolution imagery, official item codes (e.g. ASF-01, APF-08, AFS-01, AGC-03), and technical specifications. Every product photo is published with its item code, name and material in the file name, alt text and structured data, so Google Lens and Google Images can match a photo of a HART fitting to its product page here.'
  },
  {
    category: 'Orders & Enquiries',
    q: 'How can architects, contractors, and dealers get quotations or technical catalogues?',
    a: 'You can create an enquiry directly via our online enquiry basket on this site, email your bill of quantities (BOQ) to info@alfahardware.com, or contact our sales heads Mr. Haresh Patel (+91 98792 52904) or Mr. Bhavesh Patel (+91 99255 07880). Full PDF catalogues for all 9 ranges are also available for free instant download.'
  }
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

const slugify = (s = '') =>
  decode(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// URL-safe product id: "ASF-01" -> "asf-01", "Top Pivot Set" -> "top-pivot-set"
export const productSlug = (product) => slugify(product.code);

export const productPath = (product) => `/products/${product.categoryId}/${productSlug(product)}/`;

// Descriptive image file name for Google Images / Lens, e.g.
// "assets/products/hart-asf-01-four-way-fin-type-spider.jpg". The build (vite.config.js)
// publishes a copy of each product photo under this name.
export function productSeoImagePath(product) {
  const source = product.images?.fullLocal || product.images?.thumbnailLocal;
  if (!source) return '';
  const ext = (source.match(/\.[a-z0-9]+$/i)?.[0] || '.jpg').toLowerCase();
  const name = `hart-${productSlug(product)}-${slugify(product.title)}`.slice(0, 90).replace(/-+$/, '');
  return `assets/products/${name}${ext}`;
}

export function productImage(product, size = 'full') {
  const { images } = product;
  if (size === 'thumb') return asset(images.thumbnailLocal || images.fullLocal) || images.thumbnailOnline;
  return asset(productSeoImagePath(product)) || images.fullOnline;
}

// Descriptive alt text so search engines (Google Images / Lens) know what each photo shows
export function productAlt(product) {
  const material = product.specifications?.Material;
  return [`HART ${product.code} ${decode(product.title)}`, material, categoryName(product.categoryId)]
    .filter(Boolean)
    .join(' – ');
}

// One-paragraph, human-readable product description used for meta tags, schema and page copy
export function productDescription(product) {
  const meta = CATEGORY_META[product.categoryId];
  const specs = product.specifications || {};
  const extra = (product.subtitles || []).slice(1).map(decode).join(' ');
  return [
    `HART ${product.code} ${decode(product.title)}${extra ? ' ' + extra : ''} by Alfa Industries, Rajkot, India.`,
    specs.Material && `Material: ${specs.Material}.`,
    specs.Finish && `Finish: ${specs.Finish}.`,
    specs.Tested && `Tested: ${specs.Tested}.`,
    meta && `Part of the ${meta.short} range, used for ${meta.uses.charAt(0).toLowerCase() + meta.uses.slice(1)}`
  ]
    .filter(Boolean)
    .join(' ');
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

// Accepts an item code ("ASF-01", "Top Pivot Set") or its URL slug ("top-pivot-set")
export function getProduct(code) {
  if (!code) return null;
  return AlfaHardwareAPI.getProductByCode(code) ||
    AlfaHardwareAPI.getAllProducts().find((p) => productSlug(p) === slugify(code)) ||
    null;
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
