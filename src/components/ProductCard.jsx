import React from 'react';
import { Plus, Check } from 'lucide-react';
import { decode, productImage, onImageError, shortMaterial, categoryName } from '../data/catalog';

export default function ProductCard({ product, onOpen, inEnquiry, onToggleEnquiry, showCategory = false }) {
  const specs = product.specifications || {};
  const material = shortMaterial(product);
  const finish = specs.Finish;
  const title = decode(product.title);

  return (
    <article className="product-card">
      <button className="product-card-media" onClick={() => onOpen(product.code)} aria-label={`View ${product.code} ${title}`}>
        <img
          src={productImage(product)}
          alt=""
          loading="lazy"
          onError={onImageError(product)}
        />
      </button>

      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="code">{product.code}</span>
          {showCategory && <span className="product-card-cat">{categoryName(product.categoryId)}</span>}
        </div>

        <h3 className="product-card-title">
          <button onClick={() => onOpen(product.code)}>{title}</button>
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
