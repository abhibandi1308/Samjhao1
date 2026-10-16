import React from 'react';
import { Volume2, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../../shared/documentSchema.js';

export function LanguageSelectScreen({ currentLang, onSelectLanguage, onSpeak, isSpeaking }) {
  const languageOptions = [
    { code: 'en', name: 'English', native: 'English', audioText: 'Please select your language. Choose English, Hindi, Telugu, or Gujarati.' },
    { code: 'hi', name: 'हिन्दी', native: 'हिन्दी', audioText: 'अपनी भाषा चुनें। अंग्रेजी, हिन्दी, तेलुगु, या गुजराती चुनें।' },
    { code: 'te', name: 'తెలుగు', native: 'తెలుగు', audioText: 'మీ భాషను ఎంచుకోండి. ఇంగ్లీష్, హిందీ, తెలుగు లేదా గుజరాతీని ఎంచుకోండి.' },
    { code: 'gu', name: 'ગુજરાતી', native: 'ગુજરાતી', audioText: 'તમારી ભાષા પસંદ કરો. અંગ્રેજી, હિન્દી, તેલુગુ અથવા ગુજરાતી પસંદ કરો.' }
  ];

  const handlePageAudio = () => {
    const active = languageOptions.find(l => l.code === currentLang) || languageOptions[1];
    onSpeak(active.audioText, currentLang, 'lang-page');
  };

  return (
    <div className="main-content" style={{ justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
          अपनी भाषा चुनें
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--slate-600)' }}>
          Choose your preferred language
        </p>
      </div>

      {/* Language Selection Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '28px' }}>
        {languageOptions.map((lang) => {
          const isSelected = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLanguage(lang.code)}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                border: isSelected ? '2.5px solid var(--primary-600)' : '2px solid var(--border-subtle)',
                background: isSelected ? 'var(--primary-50)' : 'white',
                borderRadius: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                margin: 0
              }}
              aria-pressed={isSelected}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: isSelected ? 'var(--primary-600)' : 'var(--slate-100)',
                    color: isSelected ? 'white' : 'var(--slate-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 800
                  }}
                >
                  {lang.native.slice(0, 1)}
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    {lang.native}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                    {lang.name}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--primary-600)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Check size={18} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Audio guide button */}
      <button
        type="button"
        className={`btn-audio ${isSpeaking ? 'is-playing' : ''}`}
        onClick={handlePageAudio}
        style={{ alignSelf: 'center', width: 'auto', padding: '10px 24px' }}
      >
        <Volume2 size={18} />
        <span>इस पेज को सुनें / Listen to this page</span>
      </button>
    </div>
  );
}
