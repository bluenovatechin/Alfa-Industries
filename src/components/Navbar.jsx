import React, { useState, useEffect, useRef } from 'react';
import { Search, ClipboardList, Menu, X, ChevronDown, Phone, Mail, ArrowRight, Download, ShieldCheck } from 'lucide-react';
import { href } from '../lib/router';
import { COMPANY, getCategories, productImage, TOTAL_PRODUCTS } from '../data/catalog';

const LINKS = [
  { id: 'company', label: 'Company' },
  { id: 'quality', label: 'Quality' },
  { id: 'catalogues', label: 'Catalogues' },
  { id: 'contact', label: 'Contact' }
];

export function BrandMark({ inverted = false }) {
  return (
    <span className={`brand ${inverted ? 'brand-inverted' : ''}`}>
      <span className="brand-logo">
        <img src="/assets/images/logo.png" alt="HART" />
      </span>
      <span className="brand-divider" aria-hidden="true" />
      <span className="brand-company">
        Alfa Industries
        <small>Architectural Hardware</small>
      </span>
    </span>
  );
}

export default function Navbar({ page, activeCategory, onOpenSearch, enquiryCount, onOpenQuote }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef(null);
  const megaRef = useRef(null);
  const categories = getCategories();

  // Close menus whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [page, activeCategory]);

  useEffect(() => {
    if (!megaOpen && !mobileOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e) => {
      if (megaOpen && megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [megaOpen, mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <span className="utility-item">
            <ShieldCheck size={14} /> {COMPANY.certification} certified manufacturer · Shapar, Rajkot, India
          </span>
          <div className="utility-links">
            <a href={COMPANY.phoneHref} className="utility-item">
              <Phone size={13} /> {COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="utility-item">
              <Mail size={13} /> {COMPANY.email}
            </a>
            <a href={href('/catalogues')} className="utility-item">
              <Download size={13} /> Catalogues
            </a>
          </div>
        </div>
      </div>

      <nav className="navbar" aria-label="Main">
        <div className="container nav-inner" ref={megaRef}>
          <a href={href('/')} className="brand-link" aria-label="Alfa Industries home">
            <BrandMark />
          </a>

          <ul className="nav-links">
            <li onMouseEnter={openMega} onMouseLeave={scheduleClose}>
              <button
                className={`nav-link ${page === 'products' ? 'active' : ''}`}
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                onClick={() => setMegaOpen((o) => !o)}
              >
                Products <ChevronDown size={15} className={`chevron ${megaOpen ? 'open' : ''}`} />
              </button>
            </li>
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={href('/' + l.id)}
                  className={`nav-link ${page === l.id ? 'active' : ''}`}
                  aria-current={page === l.id ? 'page' : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="nav-search" onClick={onOpenSearch} aria-label="Search products">
              <Search size={17} />
              <span className="nav-search-label">Search products</span>
              <kbd>/</kbd>
            </button>

            <button className="nav-enquiry" onClick={onOpenQuote} aria-label={`Enquiry list, ${enquiryCount} items`}>
              <ClipboardList size={18} />
              <span className="nav-enquiry-label">Enquiry</span>
              {enquiryCount > 0 && <span className="count-badge">{enquiryCount}</span>}
            </button>

            <a href={href('/contact')} className="btn btn-brand nav-cta">
              Request a quote
            </a>

            <button
              className="icon-btn mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={20} />
            </button>
          </div>

          <div
            id="mega-menu"
            className={`mega-menu ${megaOpen ? 'open' : ''}`}
            onMouseEnter={openMega}
            onMouseLeave={scheduleClose}
            onClick={(e) => {
              if (e.target.closest('a')) setMegaOpen(false);
            }}
          >
            <div className="mega-grid">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={href('/products/' + cat.id)}
                  className={`mega-item ${activeCategory === cat.id ? 'active' : ''}`}
                  tabIndex={megaOpen ? 0 : -1}
                >
                  <span className="mega-thumb">
                    {cat.cover && <img src={productImage(cat.cover, 'thumb')} alt="" loading="lazy" />}
                  </span>
                  <span className="mega-text">
                    <span className="mega-name">{cat.shortName}</span>
                    <span className="mega-count">{cat.productCount} products</span>
                  </span>
                </a>
              ))}
            </div>
            <div className="mega-aside">
              <div className="eyebrow">HART product ranges</div>
              <p>
                {TOTAL_PRODUCTS} products in AISI 316 / 304 stainless steel, manufactured in-house at our Rajkot plant.
              </p>
              <a href={href('/products')} className="btn btn-dark btn-block" tabIndex={megaOpen ? 0 : -1}>
                View all products <ArrowRight size={16} />
              </a>
              <a href={href('/catalogues')} className="text-link" tabIndex={megaOpen ? 0 : -1}>
                <Download size={14} /> Download PDF catalogues
              </a>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="drawer-backdrop" onClick={() => setMobileOpen(false)}>
          <aside
            className="drawer-panel"
            aria-label="Menu"
            onClick={(e) => {
              e.stopPropagation();
              if (e.target.closest('a')) setMobileOpen(false);
            }}
          >
            <div className="drawer-header">
              <BrandMark />
              <button className="icon-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              <div className="mobile-section-label">Products</div>
              <a href={href('/products')} className="mobile-link strong">
                All products <span>{TOTAL_PRODUCTS}</span>
              </a>
              {categories.map((cat) => (
                <a key={cat.id} href={href('/products/' + cat.id)} className="mobile-link">
                  {cat.shortName} <span>{cat.productCount}</span>
                </a>
              ))}

              <div className="mobile-section-label">Company</div>
              {LINKS.map((l) => (
                <a key={l.id} href={href('/' + l.id)} className={`mobile-link strong ${page === l.id ? 'active' : ''}`}>
                  {l.label}
                </a>
              ))}
            </div>

            <div className="drawer-footer">
              <a href={href('/contact')} className="btn btn-brand btn-block">
                Request a quote
              </a>
              <a href={COMPANY.phoneHref} className="btn btn-outline btn-block">
                <Phone size={16} /> {COMPANY.phone}
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
