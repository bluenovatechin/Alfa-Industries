import React from 'react';
import { Building2, Factory, Home, Globe2, Phone, ArrowRight } from 'lucide-react';
import { href } from '../lib/router';
import { COPY, COMPANY, MACHINES, PROCESS, asset, TOTAL_PRODUCTS, TOTAL_CATEGORIES } from '../data/catalog';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';

const SECTORS = [
  { icon: Building2, title: 'Commercial', text: 'Offices, retail, hospitality and public buildings.' },
  { icon: Factory, title: 'Industrial', text: 'Durable fittings for demanding environments.' },
  { icon: Home, title: 'Domestic', text: 'Residences, interiors and shower enclosures.' },
  { icon: Globe2, title: 'International', text: 'Supplied to projects outside India.' }
];

export default function CompanyPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Company' }]}
        eyebrow="About us"
        title="Alfa Industries, makers of HART architectural hardware"
        lead="A Rajkot-based manufacturer of corrosion-resistant AISI 316 / 304 stainless steel fittings for glass facades, doors and interiors."
      />

      <section className="section">
        <div className="container about-grid">
          <div className="prose">
            <h2 className="section-title section-title-sm">Who we are</h2>
            {COPY.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>{COPY.welcome}</p>
          </div>

          <aside className="fact-card">
            <img src={asset('assets/images/logo.png')} alt="HART – for life time steel" className="fact-logo" />
            <dl className="fact-list">
              <div><dt>Brand</dt><dd>HART</dd></div>
              <div><dt>Certification</dt><dd>{COMPANY.certification}</dd></div>
              <div><dt>Materials</dt><dd>AISI 316 &amp; 304 stainless steel</dd></div>
              <div><dt>Portfolio</dt><dd>{TOTAL_PRODUCTS} products · {TOTAL_CATEGORIES} ranges</dd></div>
              <div><dt>Production</dt><dd>100% in-house</dd></div>
              <div><dt>Plant</dt><dd>Shapar (Veraval), Rajkot, Gujarat</dd></div>
            </dl>
            <a href={href('/catalogues')} className="btn btn-dark btn-block">Download catalogues</a>
          </aside>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Markets</div>
              <h2 className="section-title">Trusted across project types</h2>
            </div>
          </div>
          <div className="sector-grid">
            {SECTORS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="sector">
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="infrastructure">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Infrastructure</div>
              <h2 className="section-title">A fully equipped, in-house production facility</h2>
              <p className="section-lead">{COPY.infrastructure}</p>
            </div>
          </div>

          <div className="machine-grid">
            {MACHINES.map((m, i) => (
              <div key={m.name} className="machine">
                <span className="machine-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{m.name}</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="subsection-title">Production process</h3>
          <ol className="process process-light">
            {PROCESS.map((step, i) => (
              <li key={step.title}>
                <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container team">
          <div>
            <div className="eyebrow">Management</div>
            <h2 className="section-title">Talk to the people who run the plant</h2>
            <p className="section-lead">
              Our experienced team helps you choose the right hardware for your project and can develop custom designs on request.
            </p>
            <a href={href('/contact')} className="text-link text-link-lg">
              Send an enquiry <ArrowRight size={16} />
            </a>
          </div>
          <div className="team-cards">
            {COMPANY.contacts.map((c) => (
              <div key={c.name} className="team-card">
                <div className="team-avatar" aria-hidden="true">
                  {c.name.replace('Mr. ', '').split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3>{c.name}</h3>
                  <a href={`tel:${c.tel}`} className="team-phone">
                    <Phone size={14} /> {c.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
