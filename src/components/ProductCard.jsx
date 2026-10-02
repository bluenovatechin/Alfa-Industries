import React from 'react';
import { Plus, Check } from 'lucide-react';
import { href } from '../lib/router';
import { decode, productPath, productImage, productAlt, onImageError, shortMaterial, categoryName } from '../data/catalog';

export default function ProductCard({ product, onOpen, inEnquiry, onToggleEnquiry, showCategory = false }) {
  const specs = product.specifications || {};
  const material = shortMaterial(product);
  const finish = specs.Finish;
  const title = decode(product.title);
  const productUrl = href(productPath(product));

  const handleOpen = (e) => {
    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      onOpen(product.code);
    }
  };

  return (
    <article className="product-card" id={`product-${product.code.toLowerCase()}`}>
      <a
        href={productUrl}
        className="product-card-media"
        onClick={handleOpen}
      >
        <img
          src={productImage(product)}
          srcSet={`${productImage(product, 'thumb')} 450w, ${productImage(product)} 800w`}
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw"
          alt={productAlt(product)}
          loading="lazy"
          decoding="async"
          onError={onImageError(product)}
          width="450"
          height="311"
        />
      </a>

      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="code">{product.code}</span>
          {showCategory && <span className="product-card-cat">{categoryName(product.categoryId)}</span>}
        </div>

        <h3 className="product-card-title">
          <a href={productUrl} onClick={handleOpen}>{title}</a>
        </h3>

        <dl className="product-card-specs">
          {material && (
            <div>
              <dt>Material</dt>
              <dd>{material}</dd>
            </div>
          )}
          {finish && (
            <div>
              <dt>Finish</dt>
              <dd>{finish}</dd>
            </div>
          )}
          {specs.Tested && (
            <div>
              <dt>Tested</dt>
              <dd>{specs.Tested}</dd>
            </div>
          )}
        </dl>

        <button
          className={`enquiry-toggle ${inEnquiry ? 'added' : ''}`}
          onClick={() => onToggleEnquiry(product)}
          aria-pressed={inEnquiry}
        >
          {inEnquiry ? <Check size={15} /> : <Plus size={15} />}
          {inEnquiry ? 'In enquiry list' : 'Add to enquiry'}
        </button>
      </div>
    </article>
  );
}
