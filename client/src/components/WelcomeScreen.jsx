import React from 'react';
import { Volume2, FileText, ArrowRight, HelpCircle, Shield, AlertTriangle, Zap, Pill } from 'lucide-react';
import welcomeImg from '../assets/welcome_illustration.jpg';

export function WelcomeScreen({ t, currentLang, onStart, onOpenHelp, onSelectSample, onSpeak, isSpeaking }) {
  const handleListenWelcome = () => {
    const textToSpeak = `${t.welcomeTitle}. ${t.welcomeSubtitle}`;
    onSpeak(textToSpeak, currentLang, 'welcome-summary');
  };

  return (
    <div className="main-content">
      <div className="welcome-hero">
        {/* Friendly Character Illustration */}
        <div className="welcome-avatar-wrap" style={{ overflow: 'hidden' }}>
          <img 
            src={welcomeImg} 
            alt="Friendly Samjhao illustration" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        <h1 className="welcome-title">{t.welcomeTitle}</h1>
        <p className="welcome-subtitle">{t.welcomeSubtitle}</p>

        {/* Audio narration button */}
        <button
          type="button"
          className={`btn-audio ${isSpeaking ? 'is-playing' : ''}`}
          onClick={handleListenWelcome}
          style={{ marginBottom: '24px' }}
          aria-label="Listen to welcome message"
        >
          <Volume2 size={18} />
          <span>{t.listenToThisPage}</span>
        </button>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '380px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onStart}
            id="start-understand-btn"
          >
            <FileText size={20} />
            <span>{t.btnUnderstandDoc}</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenHelp}
            id="help-guide-btn"
          >
            <HelpCircle size={20} color="var(--slate-600)" />
            <span>{t.btnTeachMe}</span>
          </button>
        </div>

        {/* Instant Samples Tray for Quick Demonstrations */}
        <div
          style={{
            marginTop: '32px',
            width: '100%',
            background: 'var(--slate-50)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '16px 14px',
            textAlign: 'left'
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '10px' }}>
            {t.quickTryHeading}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.92rem', minHeight: '44px' }}
              onClick={() => onSelectSample('bill')}
            >
              <Zap size={18} color="#2563EB" />
              <span>{t.sampleBillBtn}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.92rem', minHeight: '44px' }}
              onClick={() => onSelectSample('scam')}
            >
              <AlertTriangle size={18} color="#D97706" />
              <span>{t.sampleScamBtn}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.92rem', minHeight: '44px' }}
              onClick={() => onSelectSample('medical')}
            >
              <Pill size={18} color="#DC2626" />
              <span>{t.sampleMedicalBtn}</span>
            </button>
          </div>
        </div>

        {/* Zero Storage Privacy Notice Banner */}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            color: 'var(--slate-500)',
            background: '#F1F5F9',
            padding: '8px 14px',
            borderRadius: '20px'
          }}
        >
          <Shield size={14} color="#059669" />
          <span>{t.privacyBadge}</span>
        </div>
      </div>
    </div>
  );
}
