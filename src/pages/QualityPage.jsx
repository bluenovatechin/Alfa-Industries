import React from 'react';
import { ShieldCheck, FlaskConical, Wrench, Handshake, Target, Compass, Eye, ArrowRight } from 'lucide-react';
import { href } from '../lib/router';
import { COPY, getProduct } from '../data/catalog';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';

const CHECKS = [
  { icon: FlaskConical, title: 'Tested raw material', text: 'Stainless steel from reliable vendors, tested on physical and chemical parameters before production.' },
  { icon: Wrench, title: 'Controlled production', text: 'Modern machinery and care at every stage, from machining to final finish.' },
  { icon: ShieldCheck, title: 'Endurance tested', text: 'Floor spring AFS-01 and door closer ADC-01 are tested to 5,00,000 cycles.' },
  { icon: Handshake, title: 'Pre- and post-sales service', text: 'Equal importance to production, expansion and customer support.' }
];

export default function QualityPage() {
  const tested = ['AFS-01', 'ADC-01'].map(getProduct).filter(Boolean);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Quality' }]}
        eyebrow="Quality assurance"
        title="Built to ISO 9001:2008 quality standards"
        lead="Every HART product is manufactured under one roof, so we control the quality of each fitting from raw material to dispatch."
      />

      <section className="section">
        <div className="container quality-intro">
          <div className="prose">
            <h2 className="section-title section-title-sm">Our quality commitment</h2>
            <p>{COPY.quality}</p>
          </div>
          <div className="iso-card">
            <ShieldCheck size={36} />
            <div className="iso-card-title">ISO 9001:2008</div>
            <p>Certified quality management system covering material verification, machining, finishing, assembly and dispatch.</p>
            {tested.length > 0 && (
              <div className="iso-card-stat">
                <strong>5,00,000 cycles</strong>
                <span>Endurance tested: {tested.map((p) => p.code).join(' & ')}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="check-grid">
            {CHECKS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="check-card">
                <Icon size={22} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">What drives us</div>
              <h2 className="section-title">Mission, methodology and vision</h2>
            </div>
          </div>
          <div className="pillars pillars-icons">
            <div className="pillar">
              <Target size={22} />
              <h3>Mission</h3>
              <p>{COPY.mission}</p>
            </div>
            <div className="pillar">
              <Compass size={22} />
              <h3>Methodology</h3>
              <p>{COPY.methodology}</p>
            </div>
            <div className="pillar">
              <Eye size={22} />
              <h3>Vision</h3>
              <p>{COPY.vision}</p>
            </div>
          </div>
          <div className="section-foot">
            <a href={href('/company')} className="text-link text-link-lg">
              See our manufacturing infrastructure <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
