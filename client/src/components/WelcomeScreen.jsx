import React from 'react';
import { Camera, HelpCircle, ArrowRight, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import welcomeImg from '../assets/welcome_illustration.jpg';

export function WelcomeScreen({
  t,
  currentLang,
  onStart,
  onOpenHelp,
  onSelectSample,
  onSpeak,
  isSpeaking
}) {
  const handleListenWelcome = () => {
    const textToSpeak = `${t.welcomeTitle}. ${t.welcomeSubtitle}. ${t.btnUnderstandDoc}: ${t.btnUnderstandDocSub || ''}.`;
    onSpeak(textToSpeak, currentLang, 'welcome-summary');
  };

  return (
    <div className="main-content">
      <div className="welcome-hero">
        {/* Friendly Grandparents Illustration */}
        <div className="welcome-avatar-wrap">
          <img 
            src={welcomeImg} 
            alt="Samjhao friendly illustration" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        <h1 className="welcome-title">{t.welcomeTitle}</h1>
        <p className="welcome-subtitle">{t.welcomeSubtitle}</p>

        {/* Prominent Voice Guidance Button for Illiterate & Elderly Users */}
        <button
          type="button"
          className={`btn-card-audio ${isSpeaking ? 'is-playing' : ''}`}
          onClick={handleListenWelcome}
          style={{
            padding: '10px 22px',
            fontSize: '1rem',
            minHeight: '46px',
            marginBottom: '24px',
            borderRadius: 'var(--radius-full)'
          }}
          aria-label="Listen out loud to welcome message"
          id="welcome-audio-btn"
        >
          <Volume2 size={20} />
          <span>{t.listenToThisPage}</span>
        </button>

        {/* Primary Action Buttons Matching Screen 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '400px', marginBottom: '28px' }}>
          {/* Big Green Primary Button: Take photo of paper */}
          <button
            type="button"
            className="btn btn-success"
            onClick={onStart}
            id="start-understand-btn"
            style={{
              minHeight: '64px',
              fontSize: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 6px 18px rgba(5, 150, 105, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
              <Camera size={26} strokeWidth={2.4} />
              <span>{t.btnUnderstandDoc}</span>
            </div>
            {t.btnUnderstandDocSub && (
              <span style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9, marginTop: '2px' }}>
                {t.btnUnderstandDocSub}
              </span>
            )}
          </button>

          {/* Secondary Button: How does Samjhao work? */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenHelp}
            id="help-guide-btn"
            style={{ minHeight: '52px', fontSize: '1.05rem', fontWeight: 700 }}
          >
            <HelpCircle size={22} color="var(--slate-600)" />
            <span>{t.btnTeachMe}</span>
          </button>
        </div>

        {/* 3 Simple Visual Steps for Beginners & Elders */}
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            background: 'var(--slate-50)',
            border: '1px solid var(--slate-200)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 18px',
            marginBottom: '20px',
            textAlign: 'left'
          }}
        >
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--slate-700)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {t.howItWorksHeading || '3 Simple Steps'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ECFDF5', color: 'var(--success)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                1
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--slate-900)' }}>{t.step1Title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>{t.step1Desc}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EFF6FF', color: 'var(--primary)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                2
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--slate-900)' }}>{t.step2Title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>{t.step2Desc}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FEF3C7', color: '#B45309', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                3
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--slate-900)' }}>{t.step3Title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>{t.step3Desc}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Sample Button (Instant test without camera) */}
        <div style={{ width: '100%', borderTop: '1px solid var(--slate-200)', paddingTop: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '8px' }}>
            {t.quickTryHeading}
          </div>
          <button
            type="button"
            onClick={() => onSelectSample('bill')}
            style={{
              background: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              color: 'var(--primary)',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)'
            }}
            id="quick-sample-bill-btn"
          >
            <Sparkles size={16} />
            <span>{t.sampleBillBtn}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
