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

import { useRoute, href, navigate } from './lib/router';
import { getProduct, categoryName, productAlt, CATEGORY_META, asset } from './data/catalog';

const STORAGE_KEY = 'alfa-enquiry-v1';

function loadEnquiry() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((i) => getProduct(i.code)) : [];
  } catch {
    return [];
  }
}

const PAGE_TITLES = {
  '': 'Stainless Steel Architectural Hardware',
  products: 'Products Catalog',
  company: 'About Alfa Industries',
  quality: 'Quality Standards & Testing',
  contact: 'Contact & Quotation Enquiry'
};

const PAGE_DESCRIPTIONS = {
  '': 'Alfa Industries, Rajkot, manufactures HART architectural hardware in AISI 316 / 304 stainless steel: spider and patch fittings, glass connectors, door handles, sliding systems and floor springs. ISO 9001:2008 certified.',
  products: 'Browse 185 HART stainless steel architectural hardware products: spider fittings, canopy fittings, patch fittings, glass connectors, glass door handles, mortise handles, sliding systems and floor springs.',
  company: 'Alfa Industries, Rajkot: in-house manufacturer of HART stainless steel architectural hardware with VMC, CNC, pressing, grinding and TIG welding facilities.',
  quality: 'HART hardware is manufactured under one roof to ISO 9001:2008 quality standards, from tested AISI 316 / 304 stainless steel.',
  contact: 'Contact Alfa Industries, Shapar (Veraval), Rajkot, Gujarat, for HART stainless steel architectural hardware enquiries and quotations.'
};

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

  const activeProduct = route.query.p ? getProduct(route.query.p) : null;

  useEffect(() => {
    if (!route.query.p) openedInApp.current = false;
  }, [route.query.p]);

  useEffect(() => {
    let title = PAGE_TITLES[page] ?? 'Page not found';
    let description = PAGE_DESCRIPTIONS[page] ?? PAGE_DESCRIPTIONS[''];
    let imageUrl = '';

    if (page === 'products' && route.segments[1]) {
      title = categoryName(route.segments[1]);
      description = `HART ${title} by Alfa Industries, Rajkot. ${CATEGORY_META[route.segments[1]]?.description || ''}`.trim();
    }
    if (activeProduct) {
      title = `${activeProduct.code} ${activeProduct.title}`;
      description = `${productAlt(activeProduct)}. Manufactured by Alfa Industries, Rajkot, India.`;
      const imgPath = activeProduct.images?.fullLocal || activeProduct.images?.thumbnailLocal;
      if (imgPath) {
        imageUrl = window.location.origin + asset(imgPath);
      }
    }

    const fullTitle = `${title} | HART by Alfa Industries`;
    document.title = fullTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);

    // Dynamic canonical URL
    const canonical = window.location.origin + window.location.pathname + (route.query.p ? `?p=${encodeURIComponent(route.query.p)}` : '');
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);

    // Dynamic Open Graph & Twitter Cards
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', fullTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
    if (imageUrl) {
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', imageUrl);
      document.querySelector('meta[property="og:image:secure_url"]')?.setAttribute('content', imageUrl);
      document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', imageUrl);
    }
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', fullTitle);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);

    // Dynamic Schema.org JSON-LD for rich snippets
    let dynamicLd = null;
    if (activeProduct) {
      dynamicLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `HART ${activeProduct.code} ${activeProduct.title}`,
        sku: activeProduct.code,
        mpn: activeProduct.code,
        image: imageUrl || undefined,
        description,
        brand: { '@type': 'Brand', name: 'HART' },
        manufacturer: {
          '@type': 'Organization',
          name: 'Alfa Industries',
          url: window.location.origin + href('/')
        },
        category: categoryName(activeProduct.categoryId),
        material: activeProduct.specifications?.Material || 'AISI 304 / 316 Stainless Steel',
        offers: {
          '@type': 'Offer',
          url: canonical,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition'
        }
      };
    } else if (page === 'products' && route.segments[1]) {
      const catName = categoryName(route.segments[1]);
      dynamicLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin + href('/') },
          { '@type': 'ListItem', position: 2, name: 'Products', item: window.location.origin + href('/products') },
          { '@type': 'ListItem', position: 3, name: catName, item: canonical }
        ]
      };
    }

    let script = document.getElementById('dynamic-page-jsonld');
    if (dynamicLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = 'dynamic-page-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(dynamicLd);
    } else if (script) {
      script.remove();
    }
  }, [page, route.segments, route.query.p, activeProduct]);

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
      navigate(route.path, { ...route.query, p: code });
    },
    [route]
  );

  const closeProduct = useCallback(() => {
    if (openedInApp.current) {
      openedInApp.current = false;
      window.history.back();
    } else {
      const { p, ...rest } = route.query;
      navigate(route.path, rest);
    }
  }, [route]);

  // Switching between products inside the modal should not stack history entries
  const switchProduct = useCallback(
    (code) => {
      const next = { ...route.query, p: code };
      window.history.replaceState(null, '', href(route.path, next));
      window.dispatchEvent(new PopStateEvent('popstate'));
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
