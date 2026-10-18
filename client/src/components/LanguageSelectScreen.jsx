import React from 'react';
import { Volume2, ChevronRight } from 'lucide-react';
import { SamjhaoLogo } from './SamjhaoLogo.jsx';
import { getScreenVoiceInstructions } from '../voiceGuideConfig.js';

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
      code: 'ta',
      badge: 'த',
      badgeBg: '#7C3AED',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      voiceSample: 'தமிழ் மொழி',
      confirmText: 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது'
    }
  ];

  const handleListenPage = () => {
    const text = getScreenVoiceInstructions('LANG_SELECT', currentLang || 'en');
    onSpeak(text, currentLang || 'en', 'lang-select-instructions');
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
      {/* Screen 1 Header with Stylish Public Utility Emblem */}
      <div className="lang-select-header">
        <div className="lang-select-logo-wrap">
          <SamjhaoLogo size={56} />
        </div>
        <h1 className="lang-select-title">Samjhao</h1>
        <p className="lang-select-tagline">
          Understand your documents in simple words, with voice.
        </p>
      </div>

      <div className="lang-select-prompt-box">
        <h2 className="lang-select-prompt-title">Choose your language</h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0 }}>
          अपनी भाषा चुनें • మీ భాషను ఎంచుకోండి • மொழியைத் தேர்வுசெய்க
        </p>
      </div>

      {/* 4 Clean Language Option Cards with Audio Preview and Chevron */}
      <div className="lang-card-list">
        {languageCards.map((lang) => {
          const isSelected = currentLang === lang.code;
          return (
            <div
              key={lang.code}
              style={{ position: 'relative' }}
            >
              <button
                type="button"
                className={`lang-card-row ${isSelected ? 'active' : ''}`}
                onClick={() => handleChoose(lang)}
                aria-label={`Select ${lang.name} (${lang.nativeName})`}
                id={`choose-lang-${lang.code}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div className="lang-card-badge" style={{ backgroundColor: lang.badgeBg }}>
                    {lang.badge}
                  </div>
                  <div className="lang-card-label">
                    <span className="lang-card-native">{lang.nativeName}</span>
                    {lang.name !== lang.nativeName && (
                      <span className="lang-card-english">({lang.name})</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {/* Speaker audio preview */}
                  <button
                    type="button"
                    className="lang-card-speaker-btn"
                    onClick={(e) => handlePreviewVoice(e, lang)}
                    aria-label={`Hear ${lang.name} pronunciation`}
                    title={`Hear ${lang.name}`}
                  >
                    <Volume2 size={18} />
                  </button>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Spoken Guidance Audio Pill */}
      <button
        type="button"
        className={`btn-audio-listen ${isSpeaking ? 'is-playing' : ''}`}
        onClick={handleListenPage}
        id="btn-lang-audio-instructions"
        style={{ marginBottom: '20px' }}
      >
        <Volume2 size={18} />
        <span>Tap a language to hear how it sounds</span>
      </button>

      {/* Reassurance note at bottom */}
      <div style={{ marginTop: 'auto', textAlign: 'center', padding: '6px 0' }}>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
          You can change the language anytime at the top of the screen.
        </p>
      </div>
    </div>
  );
}
