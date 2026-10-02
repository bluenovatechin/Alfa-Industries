import React from 'react';
import { ShieldCheck, FlaskConical, Wrench, Handshake, Target, Compass, Eye, ArrowRight, CheckCircle2, Award, Gauge } from 'lucide-react';
import { href } from '../lib/router';
import { COPY, getProduct } from '../data/catalog';
import PageHeader from '../components/PageHeader';
import FaqSection from '../components/FaqSection';
import CtaBand from '../components/CtaBand';

const CHECKS = [
  { icon: FlaskConical, title: 'Spectrometer material testing', text: 'Every heat of AISI 316 and 304 stainless steel is tested for nickel, chromium, and molybdenum content before machining.' },
  { icon: Wrench, title: 'In-house controlled production', text: '4-Axis VMC milling and CNC turning with in-process dimensional gauges and coordinate measurement verification.' },
  { icon: ShieldCheck, title: '5,00,000 Cycle endurance testing', text: 'Hydraulic floor springs (AFS-01) and door closers (ADC-01) are continuously cycle-tested for zero leakage and steady latch speed.' },
  { icon: Handshake, title: 'Pre- & post-sales technical support', text: 'Our engineers verify load calculations, glass thickness compatibility, and wind-load recommendations for facades.' }
];

const DETAILED_TESTS = [
  {
    title: 'Chemical Spectrometer Analysis',
    standard: 'ASTM A240 / A276',
    desc: 'Incoming raw steel billets and plates are analyzed to ensure minimum 10% Nickel and 16-18% Chromium for 304, plus 2-3% Molybdenum for 316 marine-grade resistance.'
  },
  {
    title: '5,00,000 Cycle Hydraulic Durability',
    standard: 'EN 1154 / ISO Standards',
    desc: 'High-pressure internal seals and precision-ground valves in HART floor springs are subjected to continuous robotic open/close cycles under load.'
  },
  {
    title: 'Tensile & Load-Bearing Verification',
    standard: 'Proof load testing',
    desc: 'Point-fixed spider arms and heavy routel bolts undergo tensile stress testing to withstand positive and negative architectural wind loads.'
  },
  {
    title: 'Surface Roughness & Salt Spray Resistance',
    standard: 'Ra < 0.2µm / ASTM B117',
    desc: 'Mirror and satin finishes are measured with surface profilometers and subjected to neutral salt spray to ensure lifetime resistance to pitting corrosion.'
  }
];

export default function QualityPage() {
  const tested = ['AFS-01', 'ADC-01'].map(getProduct).filter(Boolean);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Quality' }]}
        eyebrow="Quality assurance"
        title="Built to ISO 9001:2008 quality standards"
        lead="Every HART product is manufactured under one roof in Rajkot, so we control the quality of each fitting from raw material verification to final dispatch."
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
            <p>Certified quality management system covering material verification, precision machining, surface finishing, assembly, and dispatch.</p>
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
          <div className="section-head">
            <div>
              <div className="eyebrow">Quality Pillars</div>
              <h2 className="section-title">Strict quality protocols at every production stage</h2>
            </div>
          </div>
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

      {/* Detailed Testing Standards Grid */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Verification Protocols</div>
              <h2 className="section-title">Laboratory &amp; mechanical testing specifications</h2>
            </div>
          </div>
          <div className="sector-grid">
            {DETAILED_TESTS.map((t) => (
              <div key={t.title} className="sector">
                <Gauge size={22} />
                <span className="machine-num" style={{ marginTop: '8px' }}>{t.standard}</span>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
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

      {/* Structured SEO / ACO FAQ Section */}
      <FaqSection
        defaultCategory="Quality & Testing"
        title="Questions regarding quality standards &amp; material grades"
        lead="Learn about our endurance cycle testing, AISI 316 vs AISI 304 alloy certification, and architectural warranty."
      />

      <CtaBand />
    </>
  );
}

