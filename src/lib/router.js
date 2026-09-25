import { useEffect, useState } from 'react';

// Minimal hash router: "#/products/spider-fittings?p=ASF-01&q=roller"
export function parseHash(hash) {
  const raw = (hash || '').replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  const segments = path.split('/').filter(Boolean).map(decodeURIComponent);
  return {
    path: '/' + segments.join('/'),
    segments,
    query: Object.fromEntries(new URLSearchParams(qs))
  };
}

export function href(path, query = {}) {
  const qs = new URLSearchParams(
    Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();
  return '#' + path + (qs ? '?' + qs : '');
}

export function navigate(path, query) {
  window.location.hash = href(path, query);
}

// Update the query of the current route without adding a history entry.
export function replaceQuery(query) {
  const { path } = parseHash(window.location.hash);
  window.history.replaceState(null, '', href(path, query));
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
