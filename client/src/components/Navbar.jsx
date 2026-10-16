import React, { useState } from 'react';
import { FileText, Globe, HelpCircle, Shield, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../../shared/documentSchema.js';

export function Navbar({ currentLang, onSelectLanguage, onOpenHelp, onOpenPrivacy, onGoHome }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="top-nav" role="banner">
      <button 
        className="brand-logo-wrap" 
        onClick={onGoHome}
        aria-label="Go to Samjhao Home"
      >
        <div className="brand-icon">
          <FileText size={22} strokeWidth={2.5} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div className="brand-title">Samjhao</div>
          <div className="brand-tagline">समझो • Your documents, simplified</div>
        </div>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Language Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="lang-selector-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            aria-label="Select language"
          >
            <Globe size={16} color="#2563EB" />
            <span>{currentLangObj.name}</span>
            <ChevronDown size={14} />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: 'white',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                padding: '6px',
                zIndex: 40,
                minWidth: '150px'
              }}
              role="listbox"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    setDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: currentLang === lang.code ? 'var(--primary-50)' : 'transparent',
                    color: currentLang === lang.code ? 'var(--primary-700)' : 'var(--slate-800)',
                    fontWeight: currentLang === lang.code ? '700' : '500',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                  role="option"
                  aria-selected={currentLang === lang.code}
                >
                  <span>{lang.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{lang.englishName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Help button */}
        <button
          type="button"
          onClick={onOpenHelp}
          style={{
            background: 'var(--slate-100)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--slate-700)'
          }}
          aria-label="Help and instructions"
        >
          <HelpCircle size={20} />
        </button>

        {/* Privacy modal trigger */}
        <button
          type="button"
          onClick={onOpenPrivacy}
          style={{
            background: 'var(--slate-100)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--slate-700)'
          }}
          aria-label="Zero storage and privacy details"
        >
          <Shield size={18} />
        </button>
      </div>
    </header>
  );
}
