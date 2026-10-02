import { useEffect, useState } from 'react';

// Get base URL configured by Vite (e.g. '/Alfa-Industries/' or '/')
const rawBase = import.meta.env.BASE_URL || '/';
export const BASE_PATH = rawBase.replace(/\/+$/, ''); // e.g. '/Alfa-Industries' or ''

// Parse current URL into clean { path, segments, query } without '#'
export function parsePath(pathname = window.location.pathname, search = window.location.search) {
  let clean = pathname || '/';
  if (BASE_PATH && clean.startsWith(BASE_PATH)) {
    clean = clean.slice(BASE_PATH.length);
  }
  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }

  // Gracefully handle any legacy hash links (e.g. #/products) if encountered
  if (window.location.hash.startsWith('#/')) {
    const hashContent = window.location.hash.slice(1);
    const [hPath, hQs] = hashContent.split('?');
    if (hPath) clean = hPath.startsWith('/') ? hPath : '/' + hPath;
    if (hQs && !search) {
      search = '?' + hQs;
    }
  }

  const [pathOnly] = clean.split('?');
  const segments = pathOnly.split('/').filter(Boolean).map(decodeURIComponent);
  const query = Object.fromEntries(new URLSearchParams(search));

  return {
    path: '/' + segments.join('/'),
    segments,
    query
  };
}

// Generate a clean URL without '#'. Paths always end in '/' so links match the
// pre-rendered folders (products/spider-fittings/index.html) and canonical URLs,
// instead of bouncing through a GitHub Pages redirect.
export function href(path, query = {}) {
  let cleanPath = path ? (path.startsWith('/') ? path : '/' + path) : '/';
  if (!cleanPath.endsWith('/')) cleanPath += '/';
  const fullPath = (BASE_PATH + cleanPath) || '/';

  const qs = new URLSearchParams(
    Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();

  return fullPath + (qs ? '?' + qs : '');
}

// Programmatic navigation without '#'
export function navigate(path, query) {
  const targetUrl = href(path, query);
  const currentUrl = window.location.pathname + window.location.search;
  if (targetUrl !== currentUrl) {
    window.history.pushState(null, '', targetUrl);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

// Update current query string without adding extra history entries
export function replaceQuery(query) {
  const { path } = parsePath();
  const url = href(path, query);
  window.history.replaceState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// Delegate internal <a> clicks for seamless client-side SPA navigation
if (typeof window !== 'undefined') {
  document.addEventListener('click', (e) => {
    // Only intercept primary left clicks without modifier keys
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
      return;
    }

    const anchor = e.target.closest('a');
    if (!anchor || !anchor.href) return;

    // Skip external links, new tabs, downloads, email, phone
    if (anchor.target && anchor.target !== '_self') return;
    if (anchor.hasAttribute('download')) return;
    if (anchor.getAttribute('rel')?.includes('external')) return;
    if (
      anchor.href.startsWith('mailto:') ||
      anchor.href.startsWith('tel:') ||
      anchor.href.startsWith('javascript:')
    ) {
      return;
    }

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return;

    // Check if the link matches our base path
    if (BASE_PATH && !url.pathname.startsWith(BASE_PATH)) return;

    e.preventDefault();
    if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
      window.history.pushState(null, '', url.pathname + url.search + url.hash);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else if (url.hash && url.hash !== window.location.hash) {
      window.location.hash = url.hash;
    }
  });
}

// Hook that listens to route changes
export function useRoute() {
  const [route, setRoute] = useState(() => parsePath());

  useEffect(() => {
    const onChange = () => setRoute(parsePath());
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);

  return route;
}

// Backward-compatibility aliases
export const useHashRoute = useRoute;
export const parseHash = parsePath;
