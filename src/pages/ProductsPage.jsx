import React, { useState, useMemo, useEffect } from 'react';
import { Search, LayoutGrid, List, Download, X, SlidersHorizontal, Plus, Check } from 'lucide-react';
import { href } from '../lib/router';
import {
  getCategories, getProducts, decode, productImage, onImageError, shortMaterial, categoryName,
  materialGroup, hasFinish, MATERIAL_FILTERS, FINISH_FILTERS, TOTAL_PRODUCTS, asset
} from '../data/catalog';
import ProductCard from '../components/ProductCard';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';

const SORTS = {
  catalogue: { label: 'Catalogue order', fn: null },
  code: { label: 'Item code (A–Z)', fn: (a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }) },
  name: { label: 'Product name (A–Z)', fn: (a, b) => decode(a.title).localeCompare(decode(b.title)) }
};

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

      <section className="section section-catalogue">
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
                  <a href={href('/products', search ? { q: search } : {})} className={!category ? 'active' : ''} onClick={() => setFiltersOpen(false)}>
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
            </div>

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
                          <td>
                            <button className="table-thumb" onClick={() => openProduct(p.code)} aria-label={`View ${p.code}`}>
                              <img src={productImage(p, 'thumb')} alt="" loading="lazy" onError={onImageError(p)} />
                            </button>
                          </td>
                          <td className="code">{p.code}</td>
                          <td>
                            <button className="table-link" onClick={() => openProduct(p.code)}>{decode(p.title)}</button>
                          </td>
                          {!category && <td className="muted">{categoryName(p.categoryId)}</td>}
                          <td className="muted">{shortMaterial(p) || '—'}</td>
                          <td className="muted">{p.specifications?.Finish || '—'}</td>
                          <td className="align-right">
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
