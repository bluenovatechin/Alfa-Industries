import React, { useEffect } from 'react';
import { X, Trash2, ClipboardList, Minus, Plus, ArrowRight, MessageCircle, Mail } from 'lucide-react';
import { href } from '../lib/router';
import { quickEnquiryText, mailtoHref, whatsappHref } from '../lib/enquiry';
import { decode, productImage, onImageError, categoryName } from '../data/catalog';

export function QtyStepper({ value, onChange, label }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus size={13} />
      </button>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        aria-label="Quantity"
      />
      <button onClick={() => onChange(value + 1)} aria-label="Increase quantity">
        <Plus size={13} />
      </button>
    </div>
  );
}

export default function QuoteDrawer({ isOpen, onClose, items, onSetQty, onRemoveItem, onClear }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const text = quickEnquiryText(items);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
        <div className="drawer-header">
          <div>
            <h2 id="enquiry-title" className="drawer-title">Enquiry list</h2>
            <p className="drawer-sub">
              {items.length === 0 ? 'No products added yet' : `${items.length} products · ${totalQty} units`}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close enquiry list">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={36} />
              <h3>Build a list for your quotation</h3>
              <p>Add products from the catalogue, set quantities, and send the list to our sales team in one step.</p>
              <a href={href('/products')} className="btn btn-dark" onClick={onClose}>
                Browse products
              </a>
            </div>
          ) : (
            <>
              <ul className="enquiry-items">
                {items.map(({ product, qty }) => (
                  <li key={product.code} className="enquiry-item">
                    <span className="enquiry-thumb">
                      <img src={productImage(product, 'thumb')} alt="" onError={onImageError(product)} />
                    </span>
                    <div className="enquiry-info">
                      <span className="code">{product.code}</span>
                      <span className="enquiry-title">{decode(product.title)}</span>
                      <span className="enquiry-cat">{categoryName(product.categoryId)}</span>
                    </div>
                    <div className="enquiry-controls">
                      <QtyStepper value={qty} onChange={(v) => onSetQty(product.code, v)} label={`Quantity for ${product.code}`} />
                      <button className="text-btn danger" onClick={() => onRemoveItem(product.code)}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="text-btn danger clear-all" onClick={onClear}>
                <Trash2 size={14} /> Clear list
              </button>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-footer">
            <a href={href('/contact')} className="btn btn-brand btn-block" onClick={onClose}>
              Continue to quote request <ArrowRight size={16} />
            </a>
            <div className="drawer-alt">
              <span>or send the list directly</span>
              <div className="drawer-alt-buttons">
                <a href={whatsappHref(text)} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                  <MessageCircle size={15} /> WhatsApp
                </a>
                <a href={mailtoHref(`Quotation request - ${items.length} HART products`, text)} className="btn btn-outline btn-sm">
                  <Mail size={15} /> Email
                </a>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
