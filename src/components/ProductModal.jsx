import React, { useEffect, useRef, useState } from 'react';
import { X, Check, Plus, Download, Send, ChevronLeft, ChevronRight, Link2, ShieldCheck } from 'lucide-react';
import { AlfaHardwareAPI } from '../data/alfaData';
import { href } from '../lib/router';
import { decode, productImage, onImageError, categoryName } from '../data/catalog';

export default function ProductModal({ product, onClose, onSwitch, isInEnquiry, onToggleEnquiry }) {
  const closeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const siblings = product ? AlfaHardwareAPI.getProductsByCategory(product.categoryId) : [];
  const index = product ? siblings.findIndex((p) => p.code === product.code) : -1;
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  useEffect(() => {
    if (!product) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prev) onSwitch(prev.code);
      if (e.key === 'ArrowRight' && next) onSwitch(next.code);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, prev, next, onClose, onSwitch]);

  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  useEffect(() => setCopied(false), [product]);

  if (!product) return null;

  const category = AlfaHardwareAPI.getCategory(product.categoryId);
  const specs = Object.entries(product.specifications || {});
  const extra = (product.subtitles || []).slice(1).map(decode);
  const title = decode(product.title);
  const related = siblings.filter((p) => p.code !== product.code).slice(Math.max(0, index - 2), Math.max(0, index - 2) + 4);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-topbar">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href={href('/products')}>Products</a>
            <span>/</span>
            <a href={href('/products/' + product.categoryId)}>{categoryName(product.categoryId)}</a>
            <span>/</span>
            <span className="code">{product.code}</span>
          </nav>
          <div className="modal-topbar-actions">
            <span className="modal-position">
              {index + 1} of {siblings.length}
            </span>
            <button className="icon-btn" onClick={() => prev && onSwitch(prev.code)} disabled={!prev} aria-label="Previous product">
              <ChevronLeft size={18} />
            </button>
            <button className="icon-btn" onClick={() => next && onSwitch(next.code)} disabled={!next} aria-label="Next product">
              <ChevronRight size={18} />
            </button>
            <button ref={closeRef} className="icon-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="product-modal-grid">
          <div className="product-modal-media">
            <img src={productImage(product)} alt={`${product.code} ${title}`} onError={onImageError(product)} />
            <p className="media-note">Refer to the range catalogue for complete technical drawings.</p>
          </div>

          <div className="product-modal-info">
            <div className="code code-lg">{product.code}</div>
            <h2 id="product-modal-title" className="product-modal-title">{title}</h2>
            {extra.length > 0 && <p className="product-modal-sub">{extra.join(' · ')}</p>}

            <h3 className="spec-heading">Specifications</h3>
            {specs.length > 0 ? (
              <dl className="spec-table">
                <div>
                  <dt>Item code</dt>
                  <dd className="code">{product.code}</dd>
                </div>
                {specs.map(([key, val]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{val}</dd>
                  </div>
                ))}
                <div>
                  <dt>Range</dt>
                  <dd>{category?.name}</dd>
                </div>
              </dl>
            ) : (
              <p className="muted">Specifications are listed in the {category?.name} catalogue.</p>
            )}

            <div className="assurance">
              <ShieldCheck size={16} />
              Manufactured in-house to ISO 9001:2008 quality procedures
            </div>

            <div className="product-modal-actions">
              <button
                className={`btn btn-block ${isInEnquiry ? 'btn-success' : 'btn-brand'}`}
                onClick={() => onToggleEnquiry(product)}
                aria-pressed={isInEnquiry}
              >
                {isInEnquiry ? <Check size={17} /> : <Plus size={17} />}
                {isInEnquiry ? 'Added to enquiry list' : 'Add to enquiry list'}
              </button>
              <a href={href('/contact', { ref: product.code })} className="btn btn-outline btn-block">
                <Send size={16} /> Enquire about this product
              </a>
            </div>

            <div className="product-modal-links">
              {category?.catalogPdfLocal && (
                <a href={`/${category.catalogPdfLocal}`} target="_blank" rel="noreferrer" className="text-link">
                  <Download size={15} /> {category.name} catalogue (PDF)
                </a>
              )}
              <button className="text-link" onClick={copyLink}>
                {copied ? <Check size={15} /> : <Link2 size={15} />} {copied ? 'Link copied' : 'Copy product link'}
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="related">
            <h3 className="spec-heading">More in {categoryName(product.categoryId)}</h3>
            <div className="related-grid">
              {related.map((p) => (
                <button key={p.code} className="related-item" onClick={() => onSwitch(p.code)}>
                  <span className="related-thumb">
                    <img src={productImage(p, 'thumb')} alt="" loading="lazy" onError={onImageError(p)} />
                  </span>
                  <span className="code">{p.code}</span>
                  <span className="related-title">{decode(p.title)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
