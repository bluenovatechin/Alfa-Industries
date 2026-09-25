import React from 'react';
import { href } from '../lib/router';

export default function PageHeader({ crumbs = [], eyebrow, title, lead, aside, children }) {
  return (
    <section className="page-header">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href={href('/')}>Home</a>
          {crumbs.map((c, i) => (
            <React.Fragment key={c.label}>
              <span aria-hidden="true">/</span>
              {c.path && i < crumbs.length - 1 ? <a href={href(c.path)}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
            </React.Fragment>
          ))}
        </nav>
        <div className="page-header-row">
          <div className="page-header-text">
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            <h1 className="page-title">{title}</h1>
            {lead && <p className="page-lead">{lead}</p>}
            {children}
          </div>
          {aside && <div className="page-header-aside">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
