import React, { useState, useEffect, useRef } from 'react';
import {
  Search, ClipboardList, Menu, X, ChevronDown, ChevronRight, ArrowRight, ShieldCheck, Home, Package, Building2, MessageSquareText
} from 'lucide-react';
import { PhoneIcon, WhatsAppIcon } from './ContactIcons';
import { whatsappHref } from '../lib/enquiry';
import { href } from '../lib/router';
import { COMPANY, getCategories, productImage, TOTAL_PRODUCTS } from '../data/catalog';

const LINKS = [
  { id: 'company', label: 'Company', icon: Building2, hint: 'About us, factory & machinery' },
  { id: 'quality', label: 'Quality', icon: ShieldCheck, hint: 'ISO 9001 certification & testing' },
  { id: 'contact', label: 'Contact', icon: MessageSquareText, hint: 'Request a quote, address & phone' }
];

export function BrandMark({ inverted = false }) {
  return (
    <span className={`brand ${inverted ? 'brand-inverted' : ''}`}>
      <span className="brand-logo">
        <img src={`${import.meta.env.BASE_URL}assets/images/logo.png`} alt="HART" />
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
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef(null);
  const megaRef = useRef(null);
  const categories = getCategories();

  // Shrinking the header changes page height, which nudges scrollY. Separate
  // enter/exit thresholds (gap larger than the shrink) stop it flickering at the
  // boundary, and rAF limits the check to once per frame.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 4 : y > 32));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

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
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>

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
              onClick={() => {
                setMobileProductsOpen(page === 'products');
                setMobileOpen(true);
              }}
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
              <button
                type="button"
                className="mnav-search"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenSearch();
                }}
              >
                <Search size={17} /> Search by product name or code
              </button>

              <nav className="mnav" aria-label="Mobile">
                <a href={href('/')} className={`mnav-link ${page === '' ? 'active' : ''}`} aria-current={page === '' ? 'page' : undefined}>
                  <span className="mnav-icon"><Home size={19} /></span>
                  <span className="mnav-text">
                    <strong>Home</strong>
                    <small>Start page & featured products</small>
                  </span>
                  <ChevronRight size={18} className="mnav-arrow" />
                </a>

                <button
                  type="button"
                  className={`mnav-link ${page === 'products' ? 'active' : ''}`}
                  aria-expanded={mobileProductsOpen}
                  aria-controls="mnav-products"
                  onClick={() => setMobileProductsOpen((o) => !o)}
                >
                  <span className="mnav-icon"><Package size={19} /></span>
                  <span className="mnav-text">
                    <strong>Products</strong>
                    <small>{TOTAL_PRODUCTS} products in {categories.length} ranges</small>
                  </span>
                  <ChevronDown size={18} className={`mnav-arrow chevron ${mobileProductsOpen ? 'open' : ''}`} />
                </button>

                {mobileProductsOpen && (
                  <div id="mnav-products" className="mnav-sub">
                    <a href={href('/products')} className="mnav-sublink mnav-sublink-all">
                      Browse all ranges <ArrowRight size={15} />
                    </a>
                    {categories.map((cat) => (
                      <a
                        key={cat.id}
                        href={href('/products/' + cat.id)}
                        className={`mnav-sublink ${activeCategory === cat.id ? 'active' : ''}`}
                        aria-current={activeCategory === cat.id ? 'page' : undefined}
                      >
                        <span className="mnav-thumb">
                          {cat.cover && <img src={productImage(cat.cover, 'thumb')} alt="" loading="lazy" />}
                        </span>
                        <span className="mnav-subname">{cat.shortName}</span>
                        <span className="mnav-count">{cat.productCount}</span>
                      </a>
                    ))}
                  </div>
                )}

                {LINKS.map((l) => (
                  <a
                    key={l.id}
                    href={href('/' + l.id)}
                    className={`mnav-link ${page === l.id ? 'active' : ''}`}
                    aria-current={page === l.id ? 'page' : undefined}
                  >
                    <span className="mnav-icon"><l.icon size={19} /></span>
                    <span className="mnav-text">
                      <strong>{l.label}</strong>
                      <small>{l.hint}</small>
                    </span>
                    <ChevronRight size={18} className="mnav-arrow" />
                  </a>
                ))}

                <button
                  type="button"
                  className="mnav-link"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenQuote();
                  }}
                >
                  <span className="mnav-icon"><ClipboardList size={19} /></span>
                  <span className="mnav-text">
                    <strong>Enquiry list</strong>
                    <small>{enquiryCount > 0 ? `${enquiryCount} products saved for your quote` : 'Products you save for a quote'}</small>
                  </span>
                  {enquiryCount > 0 ? <span className="count-badge static">{enquiryCount}</span> : <ChevronRight size={18} className="mnav-arrow" />}
                </button>
              </nav>
            </div>

            <div className="drawer-footer">
              <a href={href('/contact')} className="btn btn-brand btn-block">
                Request a quote <ArrowRight size={16} />
              </a>
              <div className="mnav-contact">
                <a href={COMPANY.phoneHref} className="btn btn-outline">
                  <PhoneIcon size={16} /> Call us
                </a>
                <a
                  href={whatsappHref('Hello Alfa Industries, I have an enquiry about HART hardware.')}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline mnav-whatsapp"
                >
                  <WhatsAppIcon size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
