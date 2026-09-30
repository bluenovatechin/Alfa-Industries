import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, LayoutGrid, List, Download, X, SlidersHorizontal, Plus, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { href } from '../lib/router';
import {
  getCategories, getProducts, decode, productImage, productAlt, onImageError, shortMaterial, categoryName,
  materialGroup, hasFinish, MATERIAL_FILTERS, FINISH_FILTERS, TOTAL_PRODUCTS, asset
} from '../data/catalog';
import ProductCard from '../components/ProductCard';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';

const SORTS = {
  catalogue: { label: 'Default', fn: null },
  code: { label: 'Item code', fn: (a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }) },
  name: { label: 'Name A–Z', fn: (a, b) => decode(a.title).localeCompare(decode(b.title)) }
};

// Matches the breakpoint where the filter sidebar collapses into a drawer
const COMPACT_QUERY = '(max-width: 1024px)';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

function toggleInSet(set, value) {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
}

export default function ProductsPage({ route, openProduct, isInEnquiry, toggleEnquiry }) {
  const categories = getCategories();
  const allProducts = getProducts();
  const category = categories.find((c) => c.id === route.segments[1]) || null;

  const [search, setSearch] = useState(route.query.q || '');
  const [materials, setMaterials] = useState(new Set());
  const [finishes, setFinishes] = useState(new Set());
  const [sort, setSort] = useState('catalogue');
  const [view, setView] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isCompact = useMediaQuery(COMPACT_QUERY);
  const sectionRef = useRef(null);
  const switcherRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (route.query.q !== undefined) setSearch(route.query.q);
  }, [route.query.q]);

  const inScope = useMemo(
    () => (category ? allProducts.filter((p) => p.categoryId === category.id) : allProducts),
    [allProducts, category]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = inScope.filter((p) => {
      if (q) {
        const hay = [p.code, decode(p.title), p.categoryName, ...Object.values(p.specifications || {})].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (materials.size && !materials.has(materialGroup(p))) return false;
      if (finishes.size && ![...finishes].some((f) => hasFinish(p, f))) return false;
      return true;
    });
    return SORTS[sort].fn ? [...list].sort(SORTS[sort].fn) : list;
  }, [inScope, search, materials, finishes, sort]);

  // On phones and tablets, /products starts with a guide to the ranges instead
  // of every product at once. "?all=1" or any search/filter shows the full list.
  const isFiltering = Boolean(search.trim() || materials.size || finishes.size);
  const showRangeOverview = isCompact && !category && !isFiltering && route.query.all !== '1';

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (route.query.all === '1') sectionRef.current?.scrollIntoView({ block: 'start' });
  }, [route.query.all]);

  // Keep the current range's chip visible in the horizontally scrolling switcher
  useEffect(() => {
    const strip = switcherRef.current;
    const chip = strip?.querySelector('.range-chip.active');
    if (chip) strip.scrollLeft = chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2;
  }, [category?.id]);

  const countFor = (predicate) => inScope.filter(predicate).length;

  const activeChips = [
    ...(search.trim() ? [{ key: 'q', label: `“${search.trim()}”`, clear: () => setSearch('') }] : []),
    ...[...materials].map((m) => ({
      key: m,
      label: MATERIAL_FILTERS.find((f) => f.id === m).label,
      clear: () => setMaterials((s) => toggleInSet(s, m))
    })),
    ...[...finishes].map((f) => ({
      key: f,
      label: FINISH_FILTERS.find((x) => x.id === f).label + ' finish',
      clear: () => setFinishes((s) => toggleInSet(s, f))
    }))
  ];

  const clearAll = () => {
    setSearch('');
    setMaterials(new Set());
    setFinishes(new Set());
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Products', path: '/products' }, ...(category ? [{ label: category.shortName }] : [])]}
        eyebrow={category ? `${category.productCount} products` : `${TOTAL_PRODUCTS} products · ${categories.length} ranges`}
        title={category ? category.name : 'Product catalogue'}
        lead={
          category
            ? category.description
            : 'Browse the complete HART range of stainless steel architectural hardware. Add products to your enquiry list to request a quotation.'
        }
        aside={
          category?.catalogPdfLocal && (
            <a href={asset(category.catalogPdfLocal)} target="_blank" rel="noreferrer" className="btn btn-outline">
              <Download size={16} /> Range catalogue (PDF)
            </a>
          )
        }
      />

      <section className="section section-catalogue" ref={sectionRef}>
        <div className="container catalogue-layout">
          <aside className={`filters ${filtersOpen ? 'open' : ''}`} aria-label="Filters">
            <div className="filters-mobile-head">
              <strong>Filters</strong>
              <button className="icon-btn icon-btn-sm" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X size={16} />
              </button>
            </div>

            <div className="filter-group">
              <h2 className="filter-title">Range</h2>
              <ul className="filter-ranges">
                <li>
                  <a href={href('/products', { all: '1', q: search || undefined })} className={!category ? 'active' : ''} onClick={() => setFiltersOpen(false)}>
                    All products <span>{allProducts.length}</span>
                  </a>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <a
                      href={href('/products/' + c.id, search ? { q: search } : {})}
                      className={category?.id === c.id ? 'active' : ''}
                      aria-current={category?.id === c.id ? 'page' : undefined}
                      onClick={() => setFiltersOpen(false)}
                    >
                      {c.shortName} <span>{c.productCount}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h2 className="filter-title">Material</h2>
              {MATERIAL_FILTERS.map((f) => {
                const n = countFor((p) => materialGroup(p) === f.id);
                return (
                  <label key={f.id} className={`check ${n === 0 ? 'disabled' : ''}`}>
                    <input
                      type="checkbox"
                      checked={materials.has(f.id)}
                      disabled={n === 0 && !materials.has(f.id)}
                      onChange={() => setMaterials((s) => toggleInSet(s, f.id))}
                    />
                    <span>{f.label}</span>
                    <span className="check-count">{n}</span>
                  </label>
                );
              })}
            </div>

            <div className="filter-group">
              <h2 className="filter-title">Finish</h2>
              {FINISH_FILTERS.map((f) => {
                const n = countFor((p) => hasFinish(p, f.id));
                return (
                  <label key={f.id} className={`check ${n === 0 ? 'disabled' : ''}`}>
                    <input
                      type="checkbox"
                      checked={finishes.has(f.id)}
                      disabled={n === 0 && !finishes.has(f.id)}
                      onChange={() => setFinishes((s) => toggleInSet(s, f.id))}
                    />
                    <span>{f.label}</span>
                    <span className="check-count">{n}</span>
                  </label>
                );
              })}
            </div>

            <div className="filters-help">
              <strong>Need a custom finish or size?</strong>
              <p>We manufacture to architect and client specifications.</p>
              <a href={href('/contact')} className="text-link">Talk to our team</a>
            </div>
          </aside>

          <div className="catalogue-main">
            {!showRangeOverview && (
              <nav className="range-switcher" aria-label="Product ranges" ref={switcherRef}>
                <a href={href('/products')} className="range-chip range-chip-back">
                  <ArrowLeft size={14} /> All ranges
                </a>
                {categories.map((c) => (
                  <a
                    key={c.id}
                    href={href('/products/' + c.id)}
                    className={`range-chip ${category?.id === c.id ? 'active' : ''}`}
                    aria-current={category?.id === c.id ? 'page' : undefined}
                  >
                    {c.shortName}
                  </a>
                ))}
              </nav>
            )}

            <div className="toolbar">
              <div className="toolbar-search">
                <Search size={17} aria-hidden="true" />
                <label htmlFor="catalogue-q" className="sr-only">Search within results</label>
                <input
                  id="catalogue-q"
                  type="search"
                  placeholder={category ? `Search ${category.shortName.toLowerCase()}` : 'Search code, name or specification'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {!showRangeOverview && (<>
              <button className="btn btn-outline filters-toggle" onClick={() => setFiltersOpen(true)}>
                <SlidersHorizontal size={16} /> Filters
                {materials.size + finishes.size > 0 && <span className="count-badge static">{materials.size + finishes.size}</span>}
              </button>

              <label className="toolbar-sort">
                <span className="sr-only">Sort by</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {Object.entries(SORTS).map(([id, s]) => (
                    <option key={id} value={id}>{s.label}</option>
                  ))}
                </select>
              </label>

              <div className="segmented" role="group" aria-label="View">
                <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-pressed={view === 'grid'} aria-label="Grid view">
                  <LayoutGrid size={16} />
                </button>
                <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-pressed={view === 'list'} aria-label="List view">
                  <List size={16} />
                </button>
              </div>
              </>)}
            </div>

            {showRangeOverview ? (
              <div className="range-overview">
                <div className="range-overview-head">
                  <h2>Choose a product range</h2>
                  <p>
                    Our {allProducts.length} products are grouped into {categories.length} ranges. Tap a range to see
                    what it includes, or search above by item code or name.
                  </p>
                </div>
                <ul className="range-list">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <a href={href('/products/' + c.id)} className="range-row">
                        <span className="range-row-media">
                          {c.cover && <img src={productImage(c.cover, 'thumb')} alt="" loading="lazy" onError={onImageError(c.cover)} />}
                        </span>
                        <span className="range-row-body">
                          <strong>{c.shortName}</strong>
                          <span className="range-row-desc">{c.description}</span>
                          <span className="range-row-count">View {c.productCount} products</span>
                        </span>
                        <ChevronRight size={18} className="range-row-arrow" />
                      </a>
                    </li>
                  ))}
                </ul>
                <a href={href('/products', { all: '1' })} className="btn btn-outline btn-block">
                  <LayoutGrid size={16} /> Show all {allProducts.length} products in one list
                </a>
              </div>
            ) : (<>

            <div className="results-bar">
              <span className="results-count" aria-live="polite">
                Showing <strong>{filtered.length}</strong> of {inScope.length} products
              </span>
              {activeChips.length > 0 && (
                <div className="active-chips">
                  {activeChips.map((c) => (
                    <button key={c.key} className="chip chip-active" onClick={c.clear}>
                      {c.label} <X size={13} />
                    </button>
                  ))}
                  <button className="text-btn" onClick={clearAll}>Clear all</button>
                </div>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state boxed">
                <SlidersHorizontal size={32} />
                <h3>No products match these filters</h3>
                <p>Try removing a filter or searching all ranges. If you can’t find what you need, we can manufacture to your specification.</p>
                <div className="empty-actions">
                  <button className="btn btn-dark" onClick={clearAll}>Clear filters</button>
                  <a href={href('/contact', search ? { msg: `Looking for: ${search}` } : {})} className="btn btn-outline">Ask our team</a>
                </div>
              </div>
            ) : view === 'grid' ? (
              <div className="product-grid product-grid-3">
                {filtered.map((p) => (
                  <ProductCard
                    key={p.code}
                    product={p}
                    onOpen={openProduct}
                    inEnquiry={isInEnquiry(p.code)}
                    onToggleEnquiry={toggleEnquiry}
                    showCategory={!category}
                  />
                ))}
              </div>
            ) : (
              <div className="table-wrap">
                <table className="product-table">
                  <thead>
                    <tr>
                      <th scope="col"><span className="sr-only">Image</span></th>
                      <th scope="col">Code</th>
                      <th scope="col">Product</th>
                      {!category && <th scope="col">Range</th>}
                      <th scope="col">Material</th>
                      <th scope="col">Finish</th>
                      <th scope="col"><span className="sr-only">Enquiry</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      const added = isInEnquiry(p.code);
                      return (
                        <tr key={p.code}>
                          <td className="td-thumb">
                            <button className="table-thumb" onClick={() => openProduct(p.code)} aria-label={`View ${p.code}`}>
                              <img src={productImage(p, 'thumb')} alt={productAlt(p)} loading="lazy" onError={onImageError(p)} />
                            </button>
                          </td>
                          <td className="code">{p.code}</td>
                          <td className="td-title">
                            <button className="table-link" onClick={() => openProduct(p.code)}>{decode(p.title)}</button>
                          </td>
                          {!category && <td className="muted td-meta" data-label="Range">{categoryName(p.categoryId)}</td>}
                          <td className="muted td-meta" data-label="Material">{shortMaterial(p) || '—'}</td>
                          <td className="muted td-meta" data-label="Finish">{p.specifications?.Finish || '—'}</td>
                          <td className="align-right td-action">
                            <button
                              className={`enquiry-toggle compact ${added ? 'added' : ''}`}
                              onClick={() => toggleEnquiry(p)}
                              aria-pressed={added}
                              aria-label={added ? `Remove ${p.code} from enquiry` : `Add ${p.code} to enquiry`}
                            >
                              {added ? <Check size={15} /> : <Plus size={15} />}
                              <span>{added ? 'Added' : 'Add'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            </>)}
          </div>
        </div>
        {filtersOpen && <div className="filters-scrim" onClick={() => setFiltersOpen(false)} />}
      </section>

      <CtaBand
        title="Can’t find the exact fitting?"
        text="Send us a drawing or reference. We develop custom hardware to architect and client specifications."
      />
    </>
  );
}
