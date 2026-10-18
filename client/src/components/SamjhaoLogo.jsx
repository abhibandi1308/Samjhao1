import React from 'react';

/**
 * Samjhao Official Brand Logo:
 * Combines an official document parchment silhouette with radiating voice/understanding soundwaves.
 * Designed to look like a trustworthy Indian public utility emblem (crisp, modern, authoritative).
 */
export function SamjhaoLogo({ size = 36, showWordmark = false, subtitle = null, className = '' }) {
  return (
    <div
      className={`samjhao-brand-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        lineHeight: 1
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, borderRadius: '12px', overflow: 'hidden' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="samjhao-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#17324D" />
            <stop offset="100%" stopColor="#0B1A28" />
          </linearGradient>
          <linearGradient id="samjhao-sheet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="samjhao-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="samjhao-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        {/* Outer Trust Badge Frame */}
        <rect width="48" height="48" rx="12" fill="url(#samjhao-bg)" />
        <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="11.25" stroke="#334E68" strokeWidth="1.5" />

        {/* Document Sheet Silhouette */}
        <path
          d="M13 11C13 9.89543 13.8954 9 15 9H26.5L34 16.5V37C34 38.1046 33.1046 39 32 39H15C13.8954 39 13 38.1046 13 37V11Z"
          fill="url(#samjhao-sheet)"
        />

        {/* Folded Top-Right Corner */}
        <path
          d="M26.5 9V16.5H34"
          fill="url(#samjhao-emerald)"
        />

        {/* Document Text Lines (Subtle) */}
        <rect x="17" y="15" width="6" height="2" rx="1" fill="#94A3B8" />
        <rect x="17" y="20" width="13" height="2" rx="1" fill="#94A3B8" />

        {/* Radiating Voice & Understanding Soundwave Waves */}
        {/* Inner Wave */}
        <path
          d="M18 29.5C19.8 27.5 22.8 26.5 25.5 27.2"
          stroke="url(#samjhao-cyan)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Outer Wave */}
        <path
          d="M17 33.5C21.2 30.5 26.5 29.8 30.5 32"
          stroke="url(#samjhao-cyan)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Voice Origin Clarity Spark (Speaker / Sun dot) */}
        <circle cx="17.5" cy="25.5" r="2.25" fill="#F59E0B" />
        <path d="M17.5 23.5V27.5M15.5 25.5H19.5" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
      </svg>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <span
            style={{
              fontSize: `${Math.round(size * 0.58)}px`,
              fontWeight: 800,
              color: '#17212F',
              letterSpacing: '-0.3px',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1.1
            }}
          >
            Samjhao
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: `${Math.max(10, Math.round(size * 0.32))}px`,
                color: '#536273',
                fontWeight: 600,
                marginTop: '1px',
                letterSpacing: '0.2px'
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
