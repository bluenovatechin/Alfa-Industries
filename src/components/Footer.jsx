import React from 'react';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { href } from '../lib/router';
import { COMPANY, getCategories } from '../data/catalog';
import { BrandMark } from './Navbar';

export default function Footer() {
  const categories = getCategories();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <BrandMark inverted />
            <p>
              Manufacturer of HART architectural hardware in AISI 316 and 304 stainless steel: spider and patch
              fittings, glass connectors, handles, sliding systems and floor springs.
            </p>
            <div className="footer-cert">{COMPANY.certification} certified</div>
          </div>

          <div>
            <h2 className="footer-heading">Products</h2>
            <ul className="footer-links">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a href={href('/products/' + cat.id)}>{cat.shortName}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer-heading">Company</h2>
            <ul className="footer-links">
              <li><a href={href('/company')}>About & infrastructure</a></li>
              <li><a href={href('/quality')}>Quality & mission</a></li>
              <li><a href={href('/catalogues')}>Download catalogues</a></li>
              <li><a href={href('/contact')}>Request a quote</a></li>
            </ul>
          </div>

          <div>
            <h2 className="footer-heading">Contact</h2>
            <ul className="footer-contact">
              <li>
                <MapPin size={16} />
                <a href={COMPANY.mapsUrl} target="_blank" rel="noreferrer">
                  {COMPANY.addressLines.join(' ')}
                </a>
              </li>
              <li>
                <Phone size={16} />
                <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
              </li>
              {COMPANY.contacts.map((c) => (
                <li key={c.name}>
                  <Phone size={16} />
                  <span>
                    <a href={`tel:${c.tel}`}>{c.phone}</a> <span className="muted">· {c.name}</span>
                  </span>
                </li>
              ))}
              <li>
                <Mail size={16} />
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Alfa Industries, Rajkot, Gujarat. HART is a brand of Alfa Industries.</span>
          <a href={href('/contact')} className="footer-bottom-link">
            Become a dealer <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
