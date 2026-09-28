import React from 'react';
import { COMPANY } from '../data/catalog';

// lucide-react v1 ships no brand icons, so these are inlined
const ICONS = {
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
};

export function SocialIcon({ id, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[id]}
    </svg>
  );
}

export const SOCIAL_LINKS = COMPANY.social.filter((s) => s.url);

export default function SocialLinks({ className = 'social-links', showLabels = false }) {
  if (!SOCIAL_LINKS.length) return null;
  return (
    <ul className={className}>
      {SOCIAL_LINKS.map((s) => (
        <li key={s.id}>
          <a href={s.url} target="_blank" rel="noreferrer" aria-label={`Alfa Industries on ${s.label}`}>
            <SocialIcon id={s.id} />
            {showLabels && (
              <span>
                <strong>{s.label}</strong>
                {s.handle && <span>{s.handle}</span>}
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
