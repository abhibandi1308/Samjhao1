import React from 'react';
import { FileText, HelpCircle, Shield, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../../shared/documentSchema.js';

export function Navbar({ currentLang, onSelectLanguage, onOpenHelp, onOpenPrivacy, onGoHome }) {
  // Primary 4 languages requested: English, Hindi, Telugu, Gujarati
  const primaryLanguages = SUPPORTED_LANGUAGES.slice(0, 4);

  return (
    <header className="top-nav" role="banner">
      <div className="top-nav-bar">
        <button 
          className="brand-logo-wrap" 
          onClick={onGoHome}
          aria-label="Go to Samjhao Home"
        >
          <div className="brand-icon">
            <FileText size={26} strokeWidth={2.5} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div className="brand-title">Samjhao</div>
            <div className="brand-tagline">Simple Document Reader for Elders & Families</div>
          </div>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Help Button */}
          <button
            type="button"
            onClick={onOpenHelp}
            style={{
              background: '#EFF6FF',
              border: '2px solid #BFDBFE',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1D4ED8',
              fontWeight: 800,
              fontSize: '1.2rem'
            }}
            title="Help & Instructions"
            aria-label="Help and instructions"
            id="nav-help-btn"
          >
            <HelpCircle size={24} />
          </button>

          {/* Privacy & Zero-Storage Details Button */}
          <button
            type="button"
            onClick={onOpenPrivacy}
            style={{
              background: '#ECFDF5',
              border: '2px solid #A7F3D0',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#047857'
            }}
            title="Privacy & Zero-Storage Guarantee"
            aria-label="Zero storage guarantee details"
            id="nav-privacy-btn"
          >
            <Shield size={22} />
          </button>
        </div>
      </div>

      {/* Prominent 1-Tap Language Bar (Elders can switch in 1 tap) */}
      <div className="lang-bar-container" aria-label="Language selection">
        <div className="lang-bar-label">
          <span>Choose Your Language / भाषा चुनें:</span>
        </div>
        <div className="lang-pill-group" role="group">
          {primaryLanguages.map(lang => {
            const isActive = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                className={`lang-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectLanguage(lang.code)}
                aria-pressed={isActive}
                id={`lang-btn-${lang.code}`}
              >
                <span>{lang.name}</span>
                {isActive && <Check size={16} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
