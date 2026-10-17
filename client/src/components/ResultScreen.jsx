import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  IndianRupee,
  Clock,
  Zap,
  Hash,
  FileText,
  CheckCircle,
  HelpCircle,
  Home,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';

export function ResultScreen({
  t,
  result,
  currentLang,
  speech,
  onReset,
  onGoHome
}) {
  const [activeTab, setActiveTab] = useState('simple'); // 'simple' | 'details' | 'glossary'
  const [feedbackGiven, setFeedbackGiven] = useState(null);

  const {
    isPlaying,
    isPaused,
    activeKey,
    playbackRate,
    setPlaybackRate,
    speak,
    stop,
    pause,
    resume
  } = speech;

  // Icon mapping helper
  const getFieldIcon = (iconName) => {
    switch (iconName) {
      case 'currency': return <IndianRupee size={22} color="#059669" />;
      case 'calendar': return <Calendar size={22} color="#DC2626" />;
      case 'clock': return <Clock size={22} color="#7C3AED" />;
      case 'zap': return <Zap size={22} color="#2563EB" />;
      case 'hash': return <Hash size={22} color="#475569" />;
      default: return <FileText size={22} color="#2563EB" />;
    }
  };

  const toggleFullAudio = () => {
    if (isPlaying && activeKey === 'full') {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(result.fullSpokenText || result.simpleSummary, currentLang, 'full');
    }
  };

  const listenBtnText = currentLang === 'hi' ? 'सुनें' : currentLang === 'te' ? 'వినండి' : currentLang === 'gu' ? 'સાંભળો' : 'Listen';

  const handleSpeakSection = (text, key) => {
    speak(text, currentLang, key);
  };

  return (
    <div className="main-content" style={{ paddingBottom: '32px' }}>
      {/* Document Type Badge & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            color: 'var(--primary-700)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700
          }}
        >
          <FileText size={14} />
          <span>{result.documentTypeLocalized || result.documentType}</span>
        </div>

        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
          {result.languageName}
        </span>
      </div>

      <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
        {result.simpleSummary ? result.simpleSummary.split('.')[0] : t.resultHeading}
      </h1>

      {/* Primary Audio Player Bar (Voice First for Elders) */}
      <div className="audio-player-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{
              width: 'auto',
              minHeight: '52px',
              padding: '12px 24px',
              fontSize: '1.1rem',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 4px 14px rgba(29, 78, 216, 0.3)'
            }}
            onClick={toggleFullAudio}
            id="btn-play-full-audio"
            aria-label={isPlaying && activeKey === 'full' && !isPaused ? 'Pause explanation audio' : 'Play full explanation audio'}
          >
            {isPlaying && activeKey === 'full' && !isPaused ? (
              <>
                <Pause size={20} />
                <span>{t.btnPause}</span>
              </>
            ) : (
              <>
                <Volume2 size={22} />
                <span>{t.btnListenFull}</span>
              </>
            )}
          </button>

          {isPlaying && activeKey === 'full' && (
            <button
              type="button"
              onClick={() => speak(result.fullSpokenText || result.simpleSummary, currentLang, 'full')}
              style={{
                background: 'white',
                border: '2px solid var(--primary-300)',
                borderRadius: '50%',
                width: '46px',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--primary-700)'
              }}
              title={t.btnReplay}
              aria-label={t.btnReplay}
            >
              <RotateCcw size={20} />
            </button>
          )}

          <span style={{ fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: 600 }}>
            {currentLang === 'hi' 
              ? 'आवाज में सुनने के लिए बटन दबाएं' 
              : currentLang === 'te'
              ? 'వినడానికి బటన్ నొక్కండి'
              : currentLang === 'gu'
              ? 'સાંભળવા માટે બટન દબાવો'
              : 'Press button to hear explanation read aloud'}
          </span>
        </div>

        {/* Speed Slower Toggle for Elders */}
        <button
          type="button"
          className="audio-speed-btn"
          onClick={() => setPlaybackRate(playbackRate === 1.0 ? 0.8 : 1.0)}
          title="Toggle playback speed"
          aria-label={`Playback speed: ${playbackRate === 1.0 ? 'Normal' : 'Slower'}`}
          style={{ minHeight: '44px', padding: '8px 18px', fontSize: '0.95rem' }}
        >
          {playbackRate === 1.0 ? `🐰 ${t.speedNormal}` : `🐢 ${t.speedSlow}`}
        </button>
      </div>

      {/* MEDICAL PRESCRIPTION REFUSAL GUARDRAIL ALERT */}
      {result.isMedicalOrPrescription && (
        <div className="card card-danger" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <AlertOctagon size={24} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#991B1B', marginBottom: '4px' }}>
                {t.medicalRefusalTitle}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#7F1D1D', lineHeight: 1.45 }}>
                {t.medicalRefusalText}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUSPICIOUS SCAM MESSAGE WARNING ALERT */}
      {result.isSuspiciousMessage && (
        <div className="card card-warning" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#92400E', marginBottom: '4px' }}>
                {t.scamWarningTitle}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#78350F', marginBottom: '8px' }}>
                {t.scamWarningNote}
              </div>
              {result.suspiciousSignals && result.suspiciousSignals.length > 0 && (
                <ul style={{ paddingLeft: '20px', fontSize: '0.82rem', color: '#92400E' }}>
                  {result.suspiciousSignals.map((sig, idx) => (
                    <li key={idx}>{sig}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Key Highlights Grid Cards (Amount, Due Date, Doc Type) */}
      {result.keyDetails && result.keyDetails.length > 0 && (
        <div className="key-info-grid">
          {result.keyDetails.slice(0, 3).map((item, index) => (
            <div key={index} className="key-info-card">
              <div
                className="icon-bubble"
                style={{
                  background: index === 0 ? '#ECFDF5' : index === 1 ? '#FEF2F2' : '#EFF6FF'
                }}
              >
                {getFieldIcon(item.icon)}
              </div>
              <div className="info-texts">
                <span className="info-label">{item.label}</span>
                <span className="info-value">{item.value}</span>
                {item.isUncertain && (
                  <span className="uncertain-tag">
                    <AlertTriangle size={12} />
                    <span>Uncertain / अस्पष्ट</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Required Card ("इसमें क्या करना है?") */}
      <div className="card card-highlight">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--slate-900)' }}>
            <CheckCircle size={20} color="var(--primary-600)" />
            <span>{t.whatToDoTitle}</span>
          </div>

          <button
            type="button"
            className={`btn-audio ${isPlaying && activeKey === 'action' ? 'is-playing' : ''}`}
            onClick={() => handleSpeakSection(result.actionRequired, 'action')}
            style={{ padding: '6px 14px', fontSize: '0.9rem', minHeight: '38px' }}
          >
            <Volume2 size={16} />
            <span>{listenBtnText}</span>
          </button>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--slate-800)', lineHeight: 1.6 }}>
          {result.actionRequired}
        </p>
      </div>

      {/* Warnings & Important Points */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="card" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#92400E' }}>
              <AlertTriangle size={20} color="#D97706" />
              <span>{t.importantPointsTitle}</span>
            </div>

            <button
              type="button"
              className={`btn-audio ${isPlaying && activeKey === 'warnings' ? 'is-playing' : ''}`}
              onClick={() => handleSpeakSection(result.warnings.map(w => w.text).join('. '), 'warnings')}
              style={{
                padding: '6px 14px',
                fontSize: '0.9rem',
                minHeight: '38px',
                background: '#FEF3C7',
                color: '#92400E',
                borderColor: '#FCD34D'
              }}
            >
              <Volume2 size={16} />
              <span>{listenBtnText}</span>
            </button>
          </div>

          <ul style={{ paddingLeft: '20px', color: '#78350F', fontSize: '0.98rem', lineHeight: 1.55 }}>
            {result.warnings.map((w, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>
                <span>{w.text}</span>
                {w.isGeneralGuidance && (
                  <span style={{ fontSize: '0.78rem', color: '#B45309', marginLeft: '6px', fontStyle: 'italic' }}>
                    {currentLang === 'hi' ? '(सामान्य सुरक्षा नियम)' : currentLang === 'te' ? '(సాధారణ భద్రతా నియమం)' : currentLang === 'gu' ? '(સામાન્ય સુરક્ષા નિયમ)' : '(General Safety Tip)'}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Explicit Uncertainty Handling */}
      {result.uncertainFields && result.uncertainFields.length > 0 && (
        <div className="card card-warning">
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#B45309', marginBottom: '4px' }}>
            {t.uncertaintyWarningTitle}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#78350F', marginBottom: '8px' }}>
            {t.uncertaintyNote}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {result.uncertainFields.map((field, idx) => (
              <span
                key={idx}
                style={{
                  background: 'white',
                  border: '1px solid #FCD34D',
                  color: '#92400E',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                ❓ {field}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Section Tabs (Walkthrough Screen 8) */}
      <div style={{ marginTop: '14px' }}>
        <div className="tab-nav">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'simple' ? 'active' : ''}`}
            onClick={() => setActiveTab('simple')}
          >
            {t.tabSimple}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            {t.tabDetails}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'glossary' ? 'active' : ''}`}
            onClick={() => setActiveTab('glossary')}
          >
            {t.tabGlossary}
          </button>
        </div>

        {/* Tab 1: Simple Summary */}
        {activeTab === 'simple' && (
          <div className="card">
            <p style={{ fontSize: '1.02rem', lineHeight: 1.6, color: 'var(--slate-800)', marginBottom: '14px' }}>
              {result.simpleSummary}
            </p>
            <button
              type="button"
              className={`btn-audio ${isPlaying && activeKey === 'summary' ? 'is-playing' : ''}`}
              onClick={() => handleSpeakSection(result.simpleSummary, 'summary')}
            >
              <Volume2 size={16} />
              <span>{listenBtnText}</span>
            </button>
          </div>
        )}

        {/* Tab 2: Key Details with individual listen buttons */}
        {activeTab === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.keyDetails && result.keyDetails.map((item, idx) => (
              <div key={idx} className="card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-500)' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', margin: '2px 0 4px' }}>
                      {item.value}
                    </div>
                    {item.explanation && (
                      <div style={{ fontSize: '0.92rem', color: 'var(--slate-600)' }}>
                        {item.explanation}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`btn-audio ${isPlaying && activeKey === `item_${idx}` ? 'is-playing' : ''}`}
                    onClick={() => handleSpeakSection(`${item.label}: ${item.value}. ${item.explanation || ''}`, `item_${idx}`)}
                    style={{ padding: '6px 14px', fontSize: '0.85rem', minHeight: '36px' }}
                  >
                    <Volume2 size={14} />
                    <span>{listenBtnText}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Glossary / Words Explained */}
        {activeTab === 'glossary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.glossary && result.glossary.length > 0 ? (
              result.glossary.map((item, idx) => (
                <div key={idx} className="card" style={{ marginBottom: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--slate-900)', marginBottom: '4px' }}>
                    {item.term}
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                    {item.meaning}
                  </div>
                </div>
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', color: 'var(--slate-500)', padding: '24px' }}>
                {currentLang === 'hi' ? 'कोई कठिन शब्द नहीं पाया गया।' : currentLang === 'te' ? 'కఠినమైన పదాలు లేవు.' : currentLang === 'gu' ? 'કોઈ અઘરા શબ્દો મળ્યા નથી.' : 'No difficult terms found in this document.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Anonymous Usefulness Feedback */}
      <div
        style={{
          marginTop: '24px',
          background: 'var(--slate-50)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '10px' }}>
          {t.feedbackTitle}
        </div>

        {feedbackGiven ? (
          <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
            {t.feedbackThanks}
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: 'auto', minHeight: '38px', padding: '6px 16px', fontSize: '0.88rem' }}
              onClick={() => setFeedbackGiven('yes')}
            >
              <ThumbsUp size={16} color="#059669" />
              <span>{t.feedbackYes}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: 'auto', minHeight: '38px', padding: '6px 16px', fontSize: '0.88rem' }}
              onClick={() => setFeedbackGiven('no')}
            >
              <ThumbsDown size={16} color="#DC2626" />
              <span>{t.feedbackNo}</span>
            </button>
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onReset}
          id="btn-try-another"
        >
          <RefreshCw size={18} />
          <span>{t.btnTryAnother}</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onGoHome}
          id="btn-go-home"
        >
          <Home size={18} />
          <span>{t.btnGoHome}</span>
        </button>
      </div>
    </div>
  );
}
