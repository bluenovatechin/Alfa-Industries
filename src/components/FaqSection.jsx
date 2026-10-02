import React, { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2, Search } from 'lucide-react';
import { FAQS } from '../data/catalog';

export default function FaqSection({ defaultCategory = 'all', title = 'Frequently asked questions', lead = 'Everything you need to know about Alfa Industries, HART architectural hardware, in-house machinery, and custom fabrication.' }) {
  const [selectedCat, setSelectedCat] = useState(defaultCategory);
  const [openIndexes, setOpenIndexes] = useState(new Set([0])); // First item open by default
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => {
    const set = new Set(FAQS.map((f) => f.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((f) => {
      if (selectedCat !== 'all' && f.category !== selectedCat) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCat, searchTerm]);

  const toggleIndex = (idx) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <HelpCircle size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Knowledge Base &amp; FAQ
            </div>
            <h2 className="section-title">{title}</h2>
            {lead && <p className="section-lead">{lead}</p>}
          </div>
        </div>

        {/* Filter chips & Search */}
        <div className="faq-controls">
          <div className="faq-categories">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`range-chip ${selectedCat === c ? 'active' : ''}`}
                onClick={() => setSelectedCat(c)}
              >
                {c === 'all' ? 'All Questions' : c}
              </button>
            ))}
          </div>

          <div className="faq-search-box">
            <Search size={16} className="faq-search-icon" />
            <input
              type="text"
              placeholder="Search plant, hardware, Google Lens or testing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search questions"
            />
          </div>
        </div>

        {/* Accordion list */}
        <div className="faq-accordion">
          {filteredFaqs.length === 0 ? (
            <div className="faq-empty">No matching questions found for "{searchTerm}".</div>
          ) : (
            filteredFaqs.map((faq, i) => {
              const isOpen = openIndexes.has(i);
              return (
                <article key={faq.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleIndex(i)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-cat-tag">{faq.category}</span>
                    <span className="faq-q-text">{faq.q}</span>
                    <span className={`faq-chevron ${isOpen ? 'rotated' : ''}`} aria-hidden="true">
                      <ChevronDown size={18} />
                    </span>
                  </button>
                  {/* Kept in the DOM when collapsed so crawlers can read every answer */}
                  <div className="faq-answer" hidden={!isOpen}>
                    <p>{faq.a}</p>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
