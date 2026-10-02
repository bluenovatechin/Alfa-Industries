import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import QuoteDrawer from './components/QuoteDrawer';
import SearchModal from './components/SearchModal';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CompanyPage from './pages/CompanyPage';
import QualityPage from './pages/QualityPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

import { useRoute, href, navigate, BASE_PATH } from './lib/router';
import { routeSeo, jsonLdText } from './lib/seo';
import { getProduct, productPath } from './data/catalog';

const STORAGE_KEY = 'alfa-enquiry-v1';

function loadEnquiry() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((i) => getProduct(i.code)) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const route = useRoute();
  const page = route.segments[0] || '';

  const [enquiry, setEnquiry] = useState(loadEnquiry);
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const openedInApp = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiry));
    } catch {
      /* storage unavailable: list lives for this session only */
    }
  }, [enquiry]);

  // Scroll to top when the page (not the query) changes
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route.path]);

  const productSegmentCode = (route.segments[0] === 'products' && route.segments[1] && route.segments[2])
    ? route.segments[2]
    : null;
  const activeProduct = productSegmentCode
    ? getProduct(productSegmentCode)
    : (route.query.p ? getProduct(route.query.p) : null);

  useEffect(() => {
    if (!activeProduct) openedInApp.current = false;
  }, [activeProduct]);

  // Per-route <title>, meta, canonical and JSON-LD (same builder the build uses to pre-render)
  useEffect(() => {
    const siteUrl = window.location.origin + BASE_PATH;
    const seo = routeSeo(route.segments, route.query, siteUrl);
    const title = seo ? seo.title : 'Page not found | HART by Alfa Industries';
    const description = seo?.description || '';
    const canonical = seo ? siteUrl + seo.path : '';
    const image = seo?.image ? `${siteUrl}/${seo.image}` : '';

    document.title = title;
    const set = (selector, value) => value && document.querySelector(selector)?.setAttribute('content', value);
    set('meta[name="description"]', description);
    set('meta[property="og:title"]', title);
    set('meta[name="twitter:title"]', title);
    set('meta[property="og:description"]', description);
    set('meta[name="twitter:description"]', description);
    set('meta[property="og:url"]', canonical);
    set('meta[property="og:image"]', image);
    set('meta[property="og:image:secure_url"]', image);
    set('meta[name="twitter:image"]', image);
    set('meta[property="og:image:alt"]', seo?.imageAlt);
    set('meta[name="twitter:image:alt"]', seo?.imageAlt);
    if (canonical) document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
    document.querySelector('meta[name="robots"]')?.setAttribute('content', seo ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, follow');

    // The first page view already carries pre-rendered JSON-LD; replace it only after in-app navigation
    const prerendered = document.querySelectorAll('script[data-route-ld]');
    if (prerendered.length && prerendered[0].dataset.routeLd === seo?.path) return;
    prerendered.forEach((s) => s.remove());
    (seo?.jsonLd || []).forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.routeLd = seo.path;
      script.textContent = jsonLdText(schema);
      document.head.appendChild(script);
    });
  }, [route]);

  // "/" opens search
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === '/' && !isSearchOpen && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen]);

  const showToast = useCallback((message, action) => {
    clearTimeout(toastTimer.current);
    setToast({ message, action });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const openProduct = useCallback(
    (code) => {
      openedInApp.current = true;
      const target = getProduct(code);
      if (target) {
        navigate(productPath(target));
      } else {
        navigate(route.path, { ...route.query, p: code });
      }
    },
    [route]
  );

  const closeProduct = useCallback(() => {
    if (openedInApp.current) {
      openedInApp.current = false;
      window.history.back();
    } else if (route.segments[0] === 'products' && route.segments[1] && route.segments[2]) {
      navigate(`/products/${route.segments[1]}`);
    } else {
      const { p, ...rest } = route.query;
      navigate(route.path, rest);
    }
  }, [route]);

  // Switching between products inside the modal should not stack history entries
  const switchProduct = useCallback(
    (code) => {
      const target = getProduct(code);
      if (target) {
        window.history.replaceState(null, '', href(productPath(target)));
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        const next = { ...route.query, p: code };
        window.history.replaceState(null, '', href(route.path, next));
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    },
    [route]
  );

  const isInEnquiry = useCallback((code) => enquiry.some((i) => i.code === code), [enquiry]);

  const toggleEnquiry = useCallback(
    (product) => {
      if (enquiry.some((i) => i.code === product.code)) {
        setEnquiry((prev) => prev.filter((i) => i.code !== product.code));
        showToast(`${product.code} removed from your enquiry list`);
      } else {
        setEnquiry((prev) => [...prev, { code: product.code, qty: 1 }]);
        showToast(`${product.code} added to your enquiry list`, {
          label: 'View list',
          onClick: () => setIsQuoteDrawerOpen(true)
        });
      }
    },
    [enquiry, showToast]
  );

  const setQty = useCallback((code, qty) => {
    setEnquiry((prev) => prev.map((i) => (i.code === code ? { ...i, qty: Math.max(1, qty || 1) } : i)));
  }, []);

  const removeItem = useCallback((code) => setEnquiry((prev) => prev.filter((i) => i.code !== code)), []);
  const clearEnquiry = useCallback(() => setEnquiry([]), []);

  const enquiryItems = useMemo(
    () => enquiry.map((i) => ({ ...i, product: getProduct(i.code) })).filter((i) => i.product),
    [enquiry]
  );

  const shared = { openProduct, isInEnquiry, toggleEnquiry };

  let content;
  switch (page) {
    case '':
      content = <HomePage {...shared} />;
      break;
    case 'products':
      content = <ProductsPage {...shared} route={route} />;
      break;
    case 'company':
      content = <CompanyPage />;
      break;
    case 'quality':
      content = <QualityPage />;
      break;
    case 'contact':
      content = (
        <ContactPage
          route={route}
          enquiryItems={enquiryItems}
          onSetQty={setQty}
          onRemoveItem={removeItem}
          onClearEnquiry={clearEnquiry}
          openProduct={openProduct}
        />
      );
      break;
    default:
      content = <NotFoundPage />;
  }

  return (
    <div className="app">
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to content
      </a>

      <Navbar
        page={page}
        activeCategory={page === 'products' ? route.segments[1] : null}
        onOpenSearch={() => setIsSearchOpen(true)}
        enquiryCount={enquiry.length}
        onOpenQuote={() => setIsQuoteDrawerOpen(true)}
      />

      <main id="main" tabIndex={-1} className="main">
        {content}
      </main>

      <Footer />

      <ProductModal
        product={activeProduct}
        onClose={closeProduct}
        onSwitch={switchProduct}
        isInEnquiry={activeProduct ? isInEnquiry(activeProduct.code) : false}
        onToggleEnquiry={toggleEnquiry}
      />

      <QuoteDrawer
        isOpen={isQuoteDrawerOpen}
        onClose={() => setIsQuoteDrawerOpen(false)}
        items={enquiryItems}
        onSetQty={setQty}
        onRemoveItem={removeItem}
        onClear={clearEnquiry}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(code) => {
          setIsSearchOpen(false);
          openProduct(code);
        }}
      />

      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast">
            <span>{toast.message}</span>
            {toast.action && (
              <button
                className="toast-action"
                onClick={() => {
                  toast.action.onClick();
                  setToast(null);
                }}
              >
                {toast.action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
