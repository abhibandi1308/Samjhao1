import React, { useState, useEffect, useRef } from 'react';
import { Globe, HelpCircle, ChevronDown, Check, ArrowLeft, Volume2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../../shared/documentSchema.js';
import { SamjhaoLogo } from './SamjhaoLogo.jsx';
import { VoiceHelpButton } from './VoiceHelpButton.jsx';

export function Navbar({
  t,
  currentLang,
  onSelectLanguage,
  onOpenHelp,
  onGoHome,
  showBackButton = false,
  onBack = null,
  onSpeak = null,
  onTriggerVoiceHelp = null,
  isVoiceHelpSpeaking = false
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="top-nav" role="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {showBackButton && (
          <button
            type="button"
            onClick={onBack || onGoHome}
            style={{
              background: 'var(--bg-main)',
              border: '1.5px solid var(--border-default)',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.84rem',
              fontWeight: 700,
              minHeight: '38px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
            aria-label="Go back to previous step"
            id="nav-back-btn"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            <span>{t?.navBack || 'Back'}</span>
          </button>
        )}

        <button 
          type="button"
          className="brand-logo-btn" 
          onClick={onGoHome}
          aria-label="Go to Samjhao Home"
          id="nav-brand-logo-btn"
          style={{ flexShrink: 0 }}
        >
          <SamjhaoLogo size={34} showWordmark={!showBackButton} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {/* Always-Visible Language Switcher Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            className="header-lang-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            aria-label="Change language at any time"
            id="header-lang-dropdown"
          >
            <Globe size={16} color="var(--primary-blue)" />
            <span>{currentLangObj.name}</span>
            <ChevronDown size={14} color="var(--text-secondary)" />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                background: '#FFFFFF',
                border: '1.5px solid var(--border-default)',
                borderRadius: '16px',
                boxShadow: '0 12px 28px rgba(23, 50, 77, 0.16)',
                padding: '8px',
                zIndex: 100,
                minWidth: '220px'
              }}
              role="listbox"
              id="lang-dropdown-panel"
            >
              <div
                style={{
                  padding: '6px 10px 8px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {t?.langChangeModalTitle || 'Change Language'}
              </div>

              {SUPPORTED_LANGUAGES.slice(0, 4).map(lang => {
                const isSelected = currentLang === lang.code;
                const badges = { en: 'EN', hi: 'हि', te: 'తె', ta: 'த' };
                const badgeColors = { en: '#2563EB', hi: '#EA580C', te: '#16A34A', ta: '#7C3AED' };
                const audioSample = lang.code === 'hi' ? 'हिन्दी भाषा' : (lang.code === 'te' ? 'తెలుగు భాష' : (lang.code === 'ta' ? 'தமிழ் மொழி' : 'English language'));

                return (
                  <div
                    key={lang.code}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      background: isSelected ? 'var(--blue-surface)' : 'transparent',
                      borderRadius: '10px',
                      marginBottom: '3px'
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
                        color: isSelected ? 'var(--primary-blue)' : 'var(--text-primary)',
                        fontWeight: isSelected ? '800' : '600',
                        cursor: 'pointer',
                        fontSize: '0.98rem',
                        textAlign: 'left'
                      }}
                      role="option"
                      aria-selected={isSelected}
                      id={`dropdown-lang-${lang.code}`}
                    >
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: badgeColors[lang.code] || '#2563EB',
                          color: '#FFFFFF',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          flexShrink: 0
                        }}
                      >
                        {badges[lang.code]}
                      </span>
                      <span>{lang.name}</span>
                      {isSelected && <Check size={16} strokeWidth={3} style={{ marginLeft: 'auto', color: 'var(--primary-blue)' }} />}
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
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        aria-label={`Hear ${lang.name}`}
                        title={`Hear ${lang.name}`}
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

        {/* Persistent Reusable Voice-Help Button */}
        {onTriggerVoiceHelp && (
          <VoiceHelpButton
            isSpeaking={isVoiceHelpSpeaking}
            onTrigger={onTriggerVoiceHelp}
            currentLang={currentLang}
            id="nav-voice-help-btn"
          />
        )}

        {/* Help Question Icon */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="header-icon-btn"
          aria-label="Help & instructions"
          id="nav-help-icon"
          title="Help & How to use"
        >
          <HelpCircle size={20} />
        </button>
      </div>
    </header>
  );
}
