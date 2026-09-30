import React from 'react';
import { href } from '../lib/router';

export default function PageHeader({ crumbs = [], eyebrow, title, lead, aside, children }) {
  return (
    <section className="page-header">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href={href('/')} itemProp="item">
              <span itemProp="name">Home</span>
            </a>
            <meta itemProp="position" content="1" />
          </span>
          {crumbs.map((c, i) => (
            <React.Fragment key={c.label}>
              <span aria-hidden="true">/</span>
              <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                {c.path && i < crumbs.length - 1 ? (
                  <a href={href(c.path)} itemProp="item">
                    <span itemProp="name">{c.label}</span>
                  </a>
                ) : (
                  <span aria-current="page" itemProp="name">{c.label}</span>
                )}
                <meta itemProp="position" content={String(i + 2)} />
              </span>
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
