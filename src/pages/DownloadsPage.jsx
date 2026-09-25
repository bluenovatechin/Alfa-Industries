import React from 'react';
import { Download, ArrowRight, FileText } from 'lucide-react';
import { href } from '../lib/router';
import { getCatalogues, productImage, onImageError, asset, CATEGORY_META } from '../data/catalog';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';

export default function DownloadsPage() {
  const catalogues = getCatalogues();

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Catalogues' }]}
        eyebrow="Downloads"
        title="Product catalogues"
        lead="Technical catalogues with item codes, drawings and specifications for each HART product range, as PDF files."
      />

      <section className="section">
        <div className="container">
          <ul className="catalogue-list">
            {catalogues.map((c) => {
              const cat = c.category;
              const cover = cat?.products?.[0];
              return (
                <li key={c.pdfLocalPath} className="catalogue-row">
                  <span className="catalogue-thumb">
                    {cover ? <img src={productImage(cover, 'thumb')} alt="" loading="lazy" onError={onImageError(cover)} /> : <FileText size={24} />}
                  </span>
                  <div className="catalogue-info">
                    <h2>{c.title}</h2>
                    <p>{cat ? CATEGORY_META[cat.id]?.description : 'HART architectural hardware catalogue'}</p>
                    <div className="catalogue-meta">
                      <span>PDF</span>
                      <span>{c.filesizeFormatted}</span>
                      {cat && <span>{cat.productCount} products</span>}
                    </div>
                  </div>
                  <div className="catalogue-actions">
                    {cat && (
                      <a href={href('/products/' + cat.id)} className="btn btn-outline">
                        View products <ArrowRight size={15} />
                      </a>
                    )}
                    <a href={asset(c.pdfLocalPath)} target="_blank" rel="noreferrer" className="btn btn-dark" download>
                      <Download size={15} /> Download
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Need a printed catalogue or product samples?"
        text="Tell us about your project and we will arrange catalogues and samples for architects, dealers and contractors."
      />
    </>
  );
}
