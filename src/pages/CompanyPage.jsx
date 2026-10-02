import React, { useState, useMemo } from 'react';
import { Building2, Factory, Home, Globe2, ArrowRight, Cog, Cpu, Wrench, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { PhoneIcon } from '../components/ContactIcons';
import { href } from '../lib/router';
import {
  COPY, COMPANY, MACHINES, MACHINE_CATEGORIES, PROCESS, asset,
  TOTAL_PRODUCTS, TOTAL_CATEGORIES
} from '../data/catalog';
import PageHeader from '../components/PageHeader';
import FaqSection from '../components/FaqSection';
import CtaBand from '../components/CtaBand';

const SECTORS = [
  { icon: Building2, title: 'Commercial', text: 'Offices, retail complexes, hospitality, airports and public glass facades.' },
  { icon: Factory, title: 'Industrial', text: 'Durable, corrosion-resistant AISI 316 fittings for demanding plant environments.' },
  { icon: Home, title: 'Domestic', text: 'Luxury residences, frameless glass interiors, and custom shower enclosures.' },
  { icon: Globe2, title: 'International', text: 'Engineered hardware supplied to architectural projects globally outside India.' }
];

export default function CompanyPage() {
  const [machineCat, setMachineCat] = useState('all');

  const filteredMachines = useMemo(() => {
    if (machineCat === 'all') return MACHINES;
    return MACHINES.filter((m) => m.category === machineCat);
  }, [machineCat]);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Company' }]}
        eyebrow="About us"
        title="Alfa Industries, makers of HART architectural hardware"
        lead="An ISO 9001:2008 certified Rajkot manufacturer of high-precision AISI 316 / 304 stainless steel fittings for glass facades, canopies, doors and interior systems."
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
              <div><dt>Plant location</dt><dd>Shapar (Veraval), Rajkot, Gujarat</dd></div>
              <div><dt>Export &amp; OEM</dt><dd>Worldwide delivery &amp; custom tooling</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Markets &amp; Applications</div>
              <h2 className="section-title">Trusted across structural and interior project types</h2>
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

      {/* Machinery & Infrastructure */}
      <section className="section" id="infrastructure">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Manufacturing Plant &amp; Machinery</div>
              <h2 className="section-title">A fully integrated, in-house production facility in Rajkot</h2>
              <p className="section-lead">{COPY.infrastructure}</p>
            </div>
          </div>

          {/* Machine Category Filter Tabs */}
          <div className="machine-cat-filters">
            {MACHINE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`range-chip ${machineCat === cat.id ? 'active' : ''}`}
                onClick={() => setMachineCat(cat.id)}
              >
                {cat.label} {cat.id !== 'all' && `(${MACHINES.filter(m => m.category === cat.id).length})`}
              </button>
            ))}
          </div>

          {/* Machine Cards */}
          <div className="machine-enhanced-grid">
            {filteredMachines.map((m, i) => (
              <div key={m.id} className="machine-card">
                <div className="machine-card-head">
                  <span className="machine-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="machine-badge">{m.categoryLabel}</span>
                </div>
                <h3 className="machine-name">{m.name}</h3>
                <div className="machine-spec-highlight">{m.spec}</div>
                <div className="machine-capacity-line">
                  <strong>Capacity / Spec:</strong> {m.capacity}
                </div>
                <p className="machine-desc">{m.desc}</p>
                {m.outputParts && (
                  <div className="machine-parts-box">
                    <span className="parts-label">Hardware manufactured:</span>
                    <span className="parts-list">{m.outputParts}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Custom OEM & Tooling Callout */}
          <div className="custom-oem-banner">
            <div className="custom-oem-content">
              <span className="custom-oem-tag">Bespoke Architectural Engineering</span>
              <h3>Need Custom Machining, Non-Standard Spiders, or OEM Hardware?</h3>
              <p>
                With 4-Axis VMC milling, multi-axis CNC turning, and precision press tooling under one roof, Alfa Industries designs and fabricates customized architectural hardware based on CAD drawings and project-specific glass engineering requirements.
              </p>
            </div>
            <div className="custom-oem-action">
              <a href={href('/contact')} className="btn btn-brand">
                Request Custom Fabrication <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <h3 className="subsection-title" style={{ marginTop: '56px' }}>5-Stage In-House Quality Process</h3>
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

      {/* Leadership & Plant Management */}
      <section className="section section-tint">
        <div className="container team">
          <div>
            <div className="eyebrow">Plant Management &amp; Technical Sales</div>
            <h2 className="section-title">Direct contact with the leaders who run the plant</h2>
            <p className="section-lead">
              Our engineering team helps architects, facade consultants, and builders select the right hardware specifications and coordinates custom tooling from start to dispatch.
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
                    <PhoneIcon size={14} /> {c.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured SEO / ACO FAQ Section */}
      <FaqSection
        defaultCategory="all"
        title="Frequently asked questions about Alfa Industries &amp; the plant"
        lead="Key details on factory infrastructure in Rajkot, machine capabilities, AISI 316 vs 304 material grades, and quotation procedures."
      />

      <CtaBand />
    </>
  );
}

