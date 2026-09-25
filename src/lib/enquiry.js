import { COMPANY, decode } from '../data/catalog';

export function itemsToLines(items) {
  return items.map((i, idx) => `${idx + 1}. ${i.product.code} - ${decode(i.product.title)} (Qty: ${i.qty})`).join('\n');
}

export function mailtoHref(subject, body) {
  return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsappHref(text) {
  return `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function quickEnquiryText(items) {
  return `Hello Alfa Industries,\n\nPlease send a quotation for the following HART products:\n\n${itemsToLines(items)}\n\nThank you.`;
}
