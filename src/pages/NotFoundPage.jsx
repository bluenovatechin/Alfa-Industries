import React from 'react';
import { href } from '../lib/router';

export default function NotFoundPage() {
  return (
    <section className="section not-found">
      <div className="container">
        <div className="eyebrow">404</div>
        <h1 className="page-title">We couldn’t find that page</h1>
        <p className="page-lead">The link may be outdated. Try the product catalogue or go back to the home page.</p>
        <div className="empty-actions">
          <a href={href('/products')} className="btn btn-dark">Browse products</a>
          <a href={href('/')} className="btn btn-outline">Home</a>
        </div>
      </div>
    </section>
  );
}
