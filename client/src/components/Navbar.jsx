import React, { useState } from 'react';
import { FileText, Globe, HelpCircle, ChevronDown, Check, ArrowLeft, Volume2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../../shared/documentSchema.js';

export function Navbar({
  t,
  currentLang,
  onSelectLanguage,
  onOpenHelp,
  onGoHome,
  showBackButton = false,
  onBack = null,
  onSpeak = null
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="top-nav" role="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {showBackButton ? (
          <button
            type="button"
            onClick={onBack || onGoHome}
            style={{
              background: 'var(--slate-100)',
              border: '1px solid var(--slate-300)',
              padding: '6px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--slate-800)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 700
            }}
            aria-label="Go back"
            id="nav-back-btn"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            <span>{t?.navBack || 'Back'}</span>
          </button>
        ) : null}

        <button 
          className="brand-logo-wrap" 
          onClick={onGoHome}
          aria-label="Go to Samjhao Home"
        >
          <div className="brand-icon">
            <FileText size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-title">Samjhao</div>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Always-Visible Language Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="header-lang-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            aria-label="Change language at any time"
            id="header-lang-dropdown"
          >
            <Globe size={16} color="var(--primary)" />
            <span>{currentLangObj.name}</span>
            <ChevronDown size={14} />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                background: '#FFFFFF',
                border: '1.5px solid var(--slate-200)',
                borderRadius: '16px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                padding: '8px',
                zIndex: 60,
                minWidth: '220px'
              }}
              role="listbox"
            >
              <div style={{ padding: '6px 10px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t?.langChangeModalTitle || 'Change Language'}
              </div>
              {SUPPORTED_LANGUAGES.slice(0, 4).map(lang => {
                const isSelected = currentLang === lang.code;
                const badges = { en: 'EN', hi: 'हि', te: 'తె', gu: 'ગુ' };
                const badgeColors = { en: '#2563EB', hi: '#EA580C', te: '#16A34A', gu: '#7C3AED' };
                const audioSample = lang.code === 'hi' ? 'हिन्दी' : (lang.code === 'te' ? 'తెలుగు' : (lang.code === 'gu' ? 'ગુજરાતી' : 'English'));
                return (
                  <div
                    key={lang.code}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      background: isSelected ? 'var(--primary-light)' : 'transparent',
                      borderRadius: '10px',
                      marginBottom: '4px'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        flex: 1,
                        padding: '10px 12px',
                        border: 'none',
                        background: 'transparent',
                        color: isSelected ? 'var(--primary)' : 'var(--slate-900)',
                        fontWeight: isSelected ? '800' : '600',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        textAlign: 'left'
                      }}
                      role="option"
                      aria-selected={isSelected}
                      id={`dropdown-lang-${lang.code}`}
                    >
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          background: badgeColors[lang.code] || '#2563EB',
                          color: 'white',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.78rem',
                          fontWeight: 800
                        }}
                      >
                        {badges[lang.code]}
                      </span>
                      <span>{lang.name}</span>
                      {isSelected && <Check size={16} strokeWidth={3} style={{ marginLeft: 'auto' }} />}
                    </button>

                    {onSpeak && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSpeak(audioSample, lang.code, `nav-preview-${lang.code}`);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '8px 10px',
                          cursor: 'pointer',
                          color: 'var(--slate-500)',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        aria-label={`Hear ${lang.name}`}
                      >
                        <Volume2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Help Question Icon */}
        <button
          type="button"
          onClick={onOpenHelp}
          style={{
            background: 'var(--slate-100)',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--slate-700)'
          }}
          aria-label="Help & instructions"
          id="nav-help-icon"
        >
          <HelpCircle size={20} />
        </button>
      </div>
    </header>
  );
}
