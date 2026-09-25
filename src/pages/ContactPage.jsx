import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle, CheckCircle2, Navigation, ClipboardList } from 'lucide-react';
import { href } from '../lib/router';
import { itemsToLines, mailtoHref, whatsappHref } from '../lib/enquiry';
import { COMPANY, getProduct, decode, productImage, onImageError } from '../data/catalog';
import PageHeader from '../components/PageHeader';
import { QtyStepper } from '../components/QuoteDrawer';

const ENQUIRY_TYPES = ['Project quotation', 'Dealer / distributor enquiry', 'Export enquiry', 'Custom design', 'Technical question', 'Other'];

const EMPTY = { name: '', company: '', phone: '', email: '', city: '', type: ENQUIRY_TYPES[0], message: '' };

function validate(f) {
  const errors = {};
  if (!f.name.trim()) errors.name = 'Please enter your name.';
  if (!/^[+\d][\d\s-]{6,}$/.test(f.phone.trim())) errors.phone = 'Please enter a valid phone number.';
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) errors.email = 'Please enter a valid email address.';
  return errors;
}

export default function ContactPage({ route, enquiryItems, onSetQty, onRemoveItem, onClearEnquiry, openProduct }) {
  const refProduct = route.query.ref ? getProduct(route.query.ref) : null;

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);

  useEffect(() => {
    const prefill = route.query.msg || (refProduct ? `I would like a quotation for ${refProduct.code} (${decode(refProduct.title)}).\nQuantity: \nGlass thickness / door type: ` : '');
    if (prefill) setForm((f) => ({ ...f, message: prefill }));
  }, [route.query.msg, route.query.ref]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const buildBody = () =>
    [
      `Name: ${form.name}`,
      form.company && `Company: ${form.company}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      form.city && `City / Country: ${form.city}`,
      `Enquiry type: ${form.type}`,
      '',
      enquiryItems.length > 0 && `Products:\n${itemsToLines(enquiryItems)}\n`,
      form.message && `Message:\n${form.message}`
    ]
      .filter((l) => typeof l === 'string')
      .join('\n');

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    const subject = `${form.type}${form.company ? ` - ${form.company}` : ''} (website enquiry)`;
    const body = buildBody();
    setSent({ subject, body });
    window.location.href = mailtoHref(subject, body);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Contact' }]}
        eyebrow="Contact & quotations"
        title="Request a quote or talk to our team"
        lead="Send us product codes, quantities and project details. For urgent requirements, call or WhatsApp us directly."
      />

      <section className="section">
        <div className="container contact-grid">
          <div className="form-card">
            {sent ? (
              <div className="sent-state">
                <CheckCircle2 size={40} />
                <h2>Your enquiry is ready to send</h2>
                <p>
                  Your email app should have opened with the enquiry filled in. Press <strong>Send</strong> to deliver it to{' '}
                  {COMPANY.email}. If nothing opened, send it on WhatsApp instead.
                </p>
                <div className="sent-actions">
                  <a href={whatsappHref(sent.body)} target="_blank" rel="noreferrer" className="btn btn-brand">
                    <MessageCircle size={16} /> Send on WhatsApp
                  </a>
                  <a href={mailtoHref(sent.subject, sent.body)} className="btn btn-outline">
                    <Mail size={16} /> Open email again
                  </a>
                </div>
                <button className="text-btn" onClick={() => { setSent(null); setForm(EMPTY); }}>
                  Start a new enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <h2 className="form-title">Enquiry form</h2>
                <p className="form-note">Fields marked * are required.</p>

                <div className="form-row">
                  <Field id="name" label="Your name *" error={errors.name}>
                    <input id="name" value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />
                  </Field>
                  <Field id="company" label="Company">
                    <input id="company" value={form.company} onChange={set('company')} autoComplete="organization" />
                  </Field>
                </div>

                <div className="form-row">
                  <Field id="phone" label="Mobile / phone *" error={errors.phone}>
                    <input id="phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" aria-invalid={!!errors.phone} />
                  </Field>
                  <Field id="email" label="Email *" error={errors.email}>
                    <input id="email" type="email" value={form.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} />
                  </Field>
                </div>

                <div className="form-row">
                  <Field id="city" label="City / country">
                    <input id="city" value={form.city} onChange={set('city')} autoComplete="address-level2" />
                  </Field>
                  <Field id="type" label="Enquiry type">
                    <select id="type" value={form.type} onChange={set('type')}>
                      {ENQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="form-products">
                  <div className="form-products-head">
                    <span className="field-label">Products</span>
                    {enquiryItems.length > 0 && (
                      <button type="button" className="text-btn danger" onClick={onClearEnquiry}>Clear</button>
                    )}
                  </div>
                  {enquiryItems.length === 0 ? (
                    <div className="form-products-empty">
                      <ClipboardList size={18} />
                      <span>
                        No products in your enquiry list. <a href={href('/products')}>Browse the catalogue</a> and use
                        “Add to enquiry”, or list item codes in your message.
                      </span>
                    </div>
                  ) : (
                    <ul className="form-product-list">
                      {enquiryItems.map(({ product, qty }) => (
                        <li key={product.code}>
                          <button type="button" className="form-product-thumb" onClick={() => openProduct(product.code)} aria-label={`View ${product.code}`}>
                            <img src={productImage(product, 'thumb')} alt="" onError={onImageError(product)} />
                          </button>
                          <span className="form-product-name">
                            <span className="code">{product.code}</span>
                            <span>{decode(product.title)}</span>
                          </span>
                          <QtyStepper value={qty} onChange={(v) => onSetQty(product.code, v)} label={`Quantity for ${product.code}`} />
                          <button type="button" className="text-btn danger" onClick={() => onRemoveItem(product.code)}>Remove</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Field id="message" label="Message">
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Project name and location, glass thickness, finish, required delivery date…"
                  />
                </Field>

                <div className="form-submit">
                  <button type="submit" className="btn btn-brand btn-lg">
                    <Send size={17} /> Send enquiry
                  </button>
                  <span className="form-hint">Opens your email app with the enquiry filled in.</span>
                </div>
              </form>
            )}
          </div>

          <aside className="contact-aside">
            <div className="contact-card">
              <h2 className="contact-card-title">Alfa Industries</h2>
              <ul className="contact-list">
                <li>
                  <MapPin size={18} />
                  <div>
                    <span className="contact-label">Plant & office</span>
                    {COMPANY.addressLines.map((l) => <span key={l} className="block">{l}</span>)}
                    <a href={COMPANY.mapsUrl} target="_blank" rel="noreferrer" className="text-link">
                      <Navigation size={14} /> Get directions
                    </a>
                  </div>
                </li>
                <li>
                  <Phone size={18} />
                  <div>
                    <span className="contact-label">Phone & fax</span>
                    <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
                  </div>
                </li>
                <li>
                  <Mail size={18} />
                  <div>
                    <span className="contact-label">Email</span>
                    <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="contact-card">
              <h2 className="contact-card-title">Contact persons</h2>
              <ul className="person-list">
                {COMPANY.contacts.map((c) => (
                  <li key={c.name}>
                    <span className="person-name">{c.name}</span>
                    <a href={`tel:${c.tel}`} className="person-phone">
                      <Phone size={14} /> {c.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <a href={whatsappHref('Hello Alfa Industries, I have an enquiry about HART hardware.')} target="_blank" rel="noreferrer" className="whatsapp-card">
              <MessageCircle size={22} />
              <span>
                <strong>Chat on WhatsApp</strong>
                <span>Quick answers from our sales team</span>
              </span>
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  );
}
