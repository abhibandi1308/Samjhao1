import React from 'react';
import { FileText, Volume2 } from 'lucide-react';

export function LanguageSelectScreen({ currentLang, onSelectLanguage, onSpeak, isSpeaking }) {
  const languageCards = [
    {
      code: 'en',
      badge: 'EN',
      badgeBg: '#2563EB',
      name: 'English',
      nativeName: 'English',
      voiceSample: 'English language',
      confirmText: 'English selected'
    },
    {
      code: 'hi',
      badge: 'हि',
      badgeBg: '#EA580C',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      voiceSample: 'हिन्दी भाषा',
      confirmText: 'हिन्दी भाषा चुनी गई'
    },
    {
      code: 'te',
      badge: 'తె',
      badgeBg: '#16A34A',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      voiceSample: 'తెలుగు భాష',
      confirmText: 'తెలుగు భాష ఎంపిక చేయబడింది'
    },
    {
      code: 'gu',
      badge: 'ગુ',
      badgeBg: '#7C3AED',
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      voiceSample: 'ગુજરાતી ભાષા',
      confirmText: 'ગુજરાતી ભાષા પસંદ કરી'
    }
  ];

  const handleListenPage = () => {
    onSpeak(
      'Welcome to Samjhao! Please choose your language. Tap English, Hindi, Telugu, or Gujarati.',
      'en',
      'lang-select-instructions'
    );
  };

  const handlePreviewVoice = (e, lang) => {
    e.stopPropagation();
    onSpeak(lang.voiceSample, lang.code, `lang-preview-${lang.code}`);
  };

  const handleChoose = (lang) => {
    onSpeak(lang.confirmText, lang.code, `lang-select-${lang.code}`);
    onSelectLanguage(lang.code);
  };

  return (
    <div className="main-content lang-select-container">
      {/* Screen 1 Header */}
      <div className="lang-select-header">
        <div className="lang-select-logo-badge">
          <FileText size={32} strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 4px' }}>
          Samjhao
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--slate-500)', margin: 0 }}>
          Your documents, made simple.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '4px' }}>
          Choose your language
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--slate-500)', marginBottom: '12px' }}>
          अपनी भाषा चुनें / మీ భాషను ఎంచుకోండి
        </p>

        {/* Audio guide button right at top for illiterate users */}
        <button
          type="button"
          className={`btn-card-audio ${isSpeaking ? 'is-playing' : ''}`}
          onClick={handleListenPage}
          id="btn-lang-audio-top"
          style={{
            margin: '0 auto',
            padding: '8px 18px',
            fontSize: '0.92rem',
            borderRadius: 'var(--radius-full)'
          }}
          aria-label="Hear spoken instructions"
        >
          <Volume2 size={16} />
          <span>Tap to hear instructions / सुनने के लिए दबाएं</span>
        </button>
      </div>

      {/* 4 Clean Language Option Cards with Audio Preview */}
      <div className="lang-card-list">
        {languageCards.map((lang) => {
          const isSelected = currentLang === lang.code;
          return (
            <div
              key={lang.code}
              className={`lang-card-wrapper ${isSelected ? 'selected' : ''}`}
              style={{ position: 'relative' }}
            >
              <button
                type="button"
                className={`lang-card-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleChoose(lang)}
                aria-label={`Select ${lang.name} (${lang.nativeName})`}
                id={`choose-lang-${lang.code}`}
                style={{
                  minHeight: '66px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="lang-card-badge" style={{ backgroundColor: lang.badgeBg }}>
                    {lang.badge}
                  </div>
                  <div className="lang-card-text">
                    <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>{lang.nativeName}</span>
                    {lang.name !== lang.nativeName && (
                      <span style={{ fontSize: '0.95rem', color: 'var(--slate-500)', marginLeft: '8px', fontWeight: 600 }}>
                        ({lang.name})
                      </span>
                    )}
                  </div>
                </div>

                {/* Per-language voice preview button for illiterate users */}
                <button
                  type="button"
                  className="lang-preview-audio-btn"
                  onClick={(e) => handlePreviewVoice(e, lang)}
                  aria-label={`Hear ${lang.name} sample audio`}
                  title={`Hear ${lang.name}`}
                  style={{
                    background: 'var(--slate-100)',
                    border: '1px solid var(--slate-300)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--slate-700)',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <Volume2 size={18} />
                </button>
              </button>
            </div>
          );
        })}
      </div>

      {/* Reassuring note at bottom */}
      <div style={{ marginTop: 'auto', textAlign: 'center', padding: '10px 0' }}>
        <p style={{ fontSize: '0.88rem', color: 'var(--slate-500)', margin: 0 }}>
          You can change the language anytime at the top of the screen.
        </p>
      </div>
    </div>
  );
}
