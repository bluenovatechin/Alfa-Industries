import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowRight, Search, Download, ShieldCheck, Layers, Factory, Gem,
  ChevronLeft, ChevronRight, Pause, Play, Sparkles
} from 'lucide-react';
import { href, navigate } from '../lib/router';
import {
  COPY, APPLICATIONS, HERO_IMAGES, FEATURED_CODES, PROCESS, MACHINES,
  getCategories, getProduct, productImage, onImageError, asset, TOTAL_PRODUCTS, TOTAL_CATEGORIES, getCatalogues
} from '../data/catalog';
import ProductCard from '../components/ProductCard';
import CtaBand from '../components/CtaBand';

const SLIDE_MS = 6000;

export default function HomePage({ openProduct, isInEnquiry, toggleEnquiry }) {
  const categories = getCategories();
  const featured = FEATURED_CODES.map(getProduct).filter(Boolean);
  const catalogues = getCatalogues();
  const [query, setQuery] = useState('');

  // Hero slide state synchronized across background and gallery
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setSlideIndex((i) => (i + 1) % HERO_IMAGES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setSlideIndex((i) => (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (isPaused || reduced) return;
    const t = setTimeout(nextSlide, SLIDE_MS);
    return () => clearTimeout(t);
  }, [slideIndex, isPaused, nextSlide]);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate('/products', { q: query.trim() });
  };

  const currentHeroImg = HERO_IMAGES[slideIndex];

  return (
    <>
      <section
        className="hero"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Full-bleed background slideshow: stacked slides crossfade with a slow zoom */}
        <div className="hero-bg-slider" aria-hidden="true">
          {HERO_IMAGES.map((img, i) => (
            <div key={img.src} className={`hero-bg-slide-item ${i === slideIndex ? 'active' : ''}`}>
              <img
                src={asset(img.src)}
                alt=""
                className="hero-bg-full-img"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Gradient overlay keeping the copy readable */}
          <div className="hero-bg-overlay" />
          {/* Soft ambient brand glow */}
          <div className="hero-bg-glow" />
        </div>

        {/* Global Edge Navigation Arrows for Background Slider */}
        <button
          type="button"
          className="hero-edge-nav hero-edge-prev"
          onClick={prevSlide}
          aria-label="Previous background slide"
          title="Previous background slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          className="hero-edge-nav hero-edge-next"
          onClick={nextSlide}
          aria-label="Next background slide"
          title="Next background slide"
        >
          <ChevronRight size={24} />
        </button>

        <div className="container hero-grid">
          {/* Left Column: Brand Copy & Actions */}
          <div className="hero-copy">
            <div className="eyebrow eyebrow-light hero-eyebrow-animated">
              <span className="hero-pulse-dot" />
              <span>HART by Alfa Industries · Rajkot, India</span>
            </div>
            <h1 className="hero-title">
              Stainless steel hardware for glass&nbsp;facades, doors and&nbsp;interiors.
            </h1>
            <p className="hero-lead">
              We design and manufacture {TOTAL_PRODUCTS} architectural fittings in AISI 316 and 304 stainless steel,
              from spider and patch fittings to handles and floor springs. Everything is made in-house under
              ISO 9001:2008 procedures.
            </p>

            <form className="hero-search" onSubmit={submitSearch} role="search">
              <Search size={18} aria-hidden="true" />
              <label htmlFor="hero-q" className="sr-only">Search products</label>
              <input
                id="hero-q"
                type="search"
                placeholder="Search by item code or product, e.g. ASF-01, patch lock"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-brand">Search</button>
            </form>

            <div className="hero-actions">
              <a href={href('/products')} className="btn btn-light btn-lg">
                Explore products <ArrowRight size={17} />
              </a>
              <a href={href('/catalogues')} className="btn btn-ghost-light btn-lg">
                <Download size={17} /> Download catalogues
              </a>
            </div>
          </div>

          {/* Right Column: Floating Glassmorphic Slide Controller & Project Spotlight (Not a separate image box) */}
          {/* <div className="hero-spotlight-card">
            <div className="hero-spotlight-top">
              <span className="hero-spotlight-badge">
                <span className="hero-spotlight-dot" />
                BACKGROUND PROJECT · {String(slideIndex + 1).padStart(2, '0')} / {String(HERO_IMAGES.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                className="hero-spotlight-ctrl-btn"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
                title={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
              >
                {isPaused ? <Play size={13} /> : <Pause size={13} />}
              </button>
            </div>

            <div className="hero-spotlight-content">
              <h2 className="hero-spotlight-title">{currentHeroImg.label}</h2>
              <p className="hero-spotlight-desc">
                Precision point-fixed structural glazing & architectural fittings manufactured under ISO 9001:2008 procedures.
              </p>
            </div>

            <div className="hero-spotlight-footer">
              <div className="hero-dots" role="tablist" aria-label="Project images">
                {HERO_IMAGES.map((img, i) => (
                  <button
                    key={img.src}
                    role="tab"
                    aria-selected={i === slideIndex}
                    aria-label={img.label}
                    className={i === slideIndex ? 'active' : ''}
                    onClick={() => setSlideIndex(i)}
                  >
                    <span style={i === slideIndex && !isPaused ? { animationDuration: `${SLIDE_MS}ms` } : undefined} />
                  </button>
                ))}
              </div>

              <div className="hero-spotlight-arrows">
                <button
                  type="button"
                  className="hero-spotlight-arrow"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  title="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="hero-spotlight-arrow"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  title="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div> */}
        </div>

        {/* Credentials Strip with Translucent Glassmorphic Backdrop */}
        <div className="container">
          <ul className="credentials hero-credentials-glass">
            <li>
              <ShieldCheck size={22} className="cred-icon" />
              <div><strong>ISO 9001:2008</strong><span>Certified quality system</span></div>
            </li>
            <li>
              <Gem size={22} className="cred-icon" />
              <div><strong>AISI 316 / 304</strong><span>Corrosion-resistant stainless steel</span></div>
            </li>
            <li>
              <Layers size={22} className="cred-icon" />
              <div><strong>{TOTAL_PRODUCTS} products</strong><span>Across {TOTAL_CATEGORIES} hardware ranges</span></div>
            </li>
            <li>
              <Factory size={22} className="cred-icon" />
              <div><strong>100% in-house</strong><span>Machining to finishing under one roof</span></div>
            </li>
          </ul>
        </div>
      </section>

      {/* Product ranges */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Product ranges</div>
              <h2 className="section-title">Hardware for every glass and door application</h2>
            </div>
            <a href={href('/products')} className="text-link text-link-lg">
              View all {TOTAL_PRODUCTS} products <ArrowRight size={16} />
            </a>
          </div>

          <div className="range-grid">
            {categories.map((cat) => (
              <a key={cat.id} href={href('/products/' + cat.id)} className="range-card">
                <span className="range-media">
                  {cat.cover && <img src={productImage(cat.cover)} alt="" loading="lazy" onError={onImageError(cat.cover)} />}
                </span>
                <span className="range-body">
                  <span className="range-top">
                    <span className="range-name">{cat.shortName}</span>
                    <span className="range-count">{cat.productCount}</span>
                  </span>
                  <span className="range-desc">{cat.description}</span>
                  <span className="range-link">
                    View range <ArrowRight size={15} />
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Applications</div>
              <h2 className="section-title">Where HART hardware is specified</h2>
              <p className="section-lead">
                Used in commercial, industrial, domestic and international projects by architects, glazing contractors and fabricators.
              </p>
            </div>
          </div>

          <div className="application-grid">
            {APPLICATIONS.map((app) => (
              <a key={app.title} href={href('/products/' + app.categoryId)} className="application-card">
                <img src={asset(app.image)} alt="" loading="lazy" />
                <span className="application-label">
                  {app.title}
                  <ArrowRight size={16} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Featured products</div>
              <h2 className="section-title">Selected from the HART catalogue</h2>
            </div>
            <a href={href('/products')} className="text-link text-link-lg">
              Browse the full catalogue <ArrowRight size={16} />
            </a>
          </div>

          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard
                key={p.code}
                product={p}
                onOpen={openProduct}
                inEnquiry={isInEnquiry(p.code)}
                onToggleEnquiry={toggleEnquiry}
                showCategory
              />
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing */}
      <section className="section section-dark">
        <div className="container">
          <div className="manufacturing">
            <div>
              <div className="eyebrow eyebrow-light">Manufacturing</div>
              <h2 className="section-title">Made under one roof, from raw stock to finished fitting</h2>
              <p className="section-lead">{COPY.infrastructure}</p>
              <a href={href('/company')} className="btn btn-ghost-light">
                About our infrastructure <ArrowRight size={16} />
              </a>
            </div>
            <div className="machine-list">
              <div className="machine-list-head">
                <span>In-house machinery</span>
                <span>{MACHINES.length} processes</span>
              </div>
              <ul>
                {MACHINES.map((m) => (
                  <li key={m.name}>{m.name}</li>
                ))}
              </ul>
            </div>
          </div>

          <ol className="process">
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

      {/* Principles */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Why Alfa Industries</div>
              <h2 className="section-title">Quality, service and continuous development</h2>
            </div>
            <a href={href('/quality')} className="text-link text-link-lg">
              Our quality approach <ArrowRight size={16} />
            </a>
          </div>
          <div className="pillars">
            <div className="pillar">
              <h3>Quality</h3>
              <p>Raw material from reliable vendors, tested on physical and chemical parameters, and manufactured to ISO 9001:2008 standards.</p>
            </div>
            <div className="pillar">
              <h3>Mission</h3>
              <p>{COPY.mission}</p>
            </div>
            <div className="pillar">
              <h3>Methodology</h3>
              <p>{COPY.methodology}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue strip */}
      <section className="section section-tint section-tight">
        <div className="container catalogue-strip">
          <div>
            <div className="eyebrow">Technical catalogues</div>
            <h2 className="section-title section-title-sm">Download PDF catalogues for all {catalogues.length} ranges</h2>
          </div>
          <div className="catalogue-chips">
            {catalogues.map((c) => (
              <a key={c.pdfLocalPath} href={asset(c.pdfLocalPath)} target="_blank" rel="noreferrer" className="catalogue-chip">
                <Download size={14} /> {c.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
