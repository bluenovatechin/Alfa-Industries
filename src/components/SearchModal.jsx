import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { href } from '../lib/router';
import { decode, productImage, onImageError, categoryName, searchProducts, getCategories } from '../data/catalog';

const SUGGESTIONS = ['ASF-01', 'Floor spring', 'Patch lock', 'Roller', 'H-type', 'Routel'];
const MAX_RESULTS = 12;

export default function SearchModal({ isOpen, onClose, onSelectProduct }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 20);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => setActive(0), [query]);

  if (!isOpen) return null;

  const q = query.trim();
  const results = q ? searchProducts(q) : [];
  const categoryHits = q
    ? getCategories().filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.shortName.toLowerCase().includes(q.toLowerCase()))
    : [];
  const shown = results.slice(0, MAX_RESULTS);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, shown.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === 'Enter' && shown[active]) onSelectProduct(shown[active].code);
  };

  return (
    <div className="modal-backdrop search-backdrop" onClick={onClose}>
      <div className="modal search-modal" role="dialog" aria-modal="true" aria-label="Search products" onClick={(e) => e.stopPropagation()}>
        <div className="search-bar">
          <Search size={20} />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search by item code or product name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            aria-controls="search-results"
          />
          <button className="icon-btn icon-btn-sm" onClick={onClose} aria-label="Close search">
            <X size={16} />
          </button>
        </div>

        <div className="search-body" id="search-results">
          {!q ? (
            <div className="search-hint">
              <div className="eyebrow">Try</div>
              <div className="chip-row">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="chip" onClick={() => setQuery(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {categoryHits.length > 0 && (
                <div className="search-group">
                  <div className="eyebrow">Ranges</div>
                  {categoryHits.map((c) => (
                    <a key={c.id} href={href('/products/' + c.id)} className="search-cat" onClick={onClose}>
                      {c.name} <span>{c.productCount} products</span>
                    </a>
                  ))}
                </div>
              )}

              {shown.length === 0 && categoryHits.length === 0 ? (
                <div className="search-empty">
                  No products match “{q}”. Check the item code, or{' '}
                  <a href={href('/contact', { msg: `Looking for: ${q}` })} onClick={onClose}>
                    ask our team
                  </a>
                  .
                </div>
              ) : (
                shown.length > 0 && (
                  <div className="search-group">
                    <div className="eyebrow">
                      Products · {results.length} {results.length === 1 ? 'match' : 'matches'}
                    </div>
                    <ul className="search-results">
                      {shown.map((p, i) => (
                        <li key={p.code}>
                          <button
                            className={`search-result ${i === active ? 'active' : ''}`}
                            onMouseEnter={() => setActive(i)}
                            onClick={() => onSelectProduct(p.code)}
                          >
                            <span className="search-thumb">
                              <img src={productImage(p, 'thumb')} alt="" onError={onImageError(p)} />
                            </span>
                            <span className="search-text">
                              <span className="code">{p.code}</span>
                              <span className="search-title">{decode(p.title)}</span>
                            </span>
                            <span className="search-cat-label">{categoryName(p.categoryId)}</span>
                            {i === active && <CornerDownLeft size={14} className="search-enter" />}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {results.length > MAX_RESULTS && (
                      <a href={href('/products', { q })} className="search-all" onClick={onClose}>
                        See all {results.length} results in the catalogue
                      </a>
                    )}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
