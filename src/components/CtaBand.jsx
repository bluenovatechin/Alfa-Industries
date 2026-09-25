import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { href } from '../lib/router';
import { COMPANY } from '../data/catalog';

export default function CtaBand({
  title = 'Planning a project? Send us your hardware schedule.',
  text = 'Share product codes, quantities and glass thickness, and our team will come back with a quotation and dispatch timeline.'
}) {
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <h2 className="cta-title">{title}</h2>
          <p className="cta-text">{text}</p>
        </div>
        <div className="cta-actions">
          <a href={href('/contact')} className="btn btn-brand btn-lg">
            Request a quote <ArrowRight size={17} />
          </a>
          <a href={COMPANY.phoneHref} className="btn btn-ghost-light btn-lg">
            <Phone size={17} /> {COMPANY.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
