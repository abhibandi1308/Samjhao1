import React, { useState } from 'react';
import {
  Volume2,
  Pause,
  RotateCcw,
  Calendar,
  IndianRupee,
  Clock,
  Zap,
  Hash,
  FileText,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  Home,
  RefreshCw,
  Info,
  Share2
} from 'lucide-react';

export function ResultScreen({
  t,
  result,
  currentLang,
  speech,
  onReset,
  onGoHome
}) {
  const [activeTab, setActiveTab] = useState('simple');

  const {
    isPlaying,
    isPaused,
    activeKey,
    playbackRate,
    setPlaybackRate,
    speak,
    pause,
    resume
  } = speech;

  const listenLabel = t.btnListen || 'Listen';

  const getFieldIcon = (iconName) => {
    switch (iconName) {
      case 'currency': return <IndianRupee size={20} color="#059669" />;
      case 'calendar': return <Calendar size={20} color="#DC2626" />;
      case 'clock': return <Clock size={20} color="#7C3AED" />;
      case 'zap': return <Zap size={20} color="#2563EB" />;
      case 'hash': return <Hash size={20} color="#475569" />;
      default: return <FileText size={20} color="#2563EB" />;
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

  const handleSpeak = (text, key) => {
    speak(text, currentLang, key);
  };

  const handleShareWhatsApp = () => {
    let shareText = `*${result.title || 'Document Explanation via Samjhao'}*\n\n`;
    if (result.whatToDo) {
      shareText += `📌 *Action Needed:* ${result.whatToDo}\n\n`;
    }
    if (result.keyDetails && result.keyDetails.length > 0) {
      shareText += `📋 *Key Details:*\n`;
      result.keyDetails.forEach(item => {
        shareText += `• ${item.label}: ${item.value}\n`;
      });
      shareText += `\n`;
    }
    if (result.suspiciousAlert) {
      shareText += `⚠️ *Warning:* ${result.suspiciousAlert}\n\n`;
    }
    shareText += `_Simplified with Samjhao (समझो) - Accessible AI Document Reader_`;

    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="main-content" style={{ paddingBottom: '28px' }}>
      {/* Top Prominent Voice Player Bar for Elders & Low-Literacy Users */}
      <div
        className="result-audio-bar"
        style={{
          background: 'var(--primary-light)',
          border: '1.5px solid var(--primary-border)',
          borderRadius: '16px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '18px'
        }}
      >
        <button
          type="button"
          className={`btn ${isPlaying && activeKey === 'full' ? 'btn-primary is-playing' : 'btn-primary'}`}
          onClick={toggleFullAudio}
          id="btn-result-full-audio"
          style={{
            minHeight: '48px',
            fontSize: '1.05rem',
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            flex: 1,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
        >
          {isPlaying && activeKey === 'full' && !isPaused ? <Pause size={20} /> : <Volume2 size={20} />}
          <span>{isPlaying && activeKey === 'full' && !isPaused ? t.btnPause : t.btnListenFull}</span>
        </button>

        {/* Slower Voice Toggle for Elders */}
        <button
          type="button"
          onClick={() => setPlaybackRate(playbackRate === 1.0 ? 0.8 : 1.0)}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--slate-300)',
            borderRadius: 'var(--radius-full)',
            padding: '10px 16px',
            fontSize: '0.88rem',
            fontWeight: 800,
            color: 'var(--slate-800)',
            cursor: 'pointer',
            minHeight: '48px',
            flexShrink: 0
          }}
          aria-label="Toggle slower voice speed"
        >
          {playbackRate === 1.0 ? t.speedNormal : t.speedSlow}
        </button>
      </div>

      {/* Document Type Badge & Title */}
      <div style={{ marginBottom: '16px' }}>
        <div className="result-doc-badge" style={{ marginBottom: '6px' }}>
          <FileText size={14} />
          <span>{result.documentTypeLocalized || result.documentType}</span>
        </div>
        <h1 className="result-main-title" style={{ margin: '4px 0 6px', fontSize: '1.65rem' }}>
          {result.documentTypeLocalized ? `${result.documentTypeLocalized}` : t.resultHeading}
        </h1>
        <p className="result-subtitle" style={{ margin: 0, fontSize: '0.98rem' }}>
          {result.simpleSummary ? result.simpleSummary.split('.')[0] : ''}
        </p>
      </div>

      {/* MEDICAL PRESCRIPTION REFUSAL GUARDRAIL */}
      {result.isMedicalOrPrescription && (
        <div className="card card-danger" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <AlertOctagon size={26} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#991B1B', marginBottom: '4px' }}>
                  {t.medicalRefusalTitle}
                </div>
                <div style={{ fontSize: '0.92rem', color: '#7F1D1D', lineHeight: 1.5 }}>
                  {t.medicalRefusalText}
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`btn-card-audio ${isPlaying && activeKey === 'medical' ? 'is-playing' : ''}`}
              onClick={() => handleSpeak(t.medicalRefusalText, 'medical')}
              style={{ background: '#FEE2E2', borderColor: '#FCA5A5', color: '#991B1B' }}
            >
              <Volume2 size={14} />
              <span>{listenLabel}</span>
            </button>
          </div>
        </div>
      )}

      {/* SUSPICIOUS SCAM MESSAGE ALERT */}
      {result.isSuspiciousMessage && (
        <div className="card card-warning" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <AlertTriangle size={26} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#92400E', marginBottom: '4px' }}>
                  {t.scamWarningTitle}
                </div>
                <div style={{ fontSize: '0.92rem', color: '#78350F' }}>
                  {t.scamWarningNote}
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`btn-card-audio ${isPlaying && activeKey === 'scam' ? 'is-playing' : ''}`}
              onClick={() => handleSpeak(t.scamWarningNote, 'scam')}
              style={{ background: '#FEF3C7', borderColor: '#FCD34D', color: '#92400E' }}
            >
              <Volume2 size={14} />
              <span>{listenLabel}</span>
            </button>
          </div>

          {result.suspiciousSignals && result.suspiciousSignals.length > 0 && (
            <ul style={{ paddingLeft: '24px', fontSize: '0.88rem', color: '#92400E', marginTop: '6px' }}>
              {result.suspiciousSignals.map((sig, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{sig}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 3 Highlight Badges matching Screen 7 (Total Amount, Due Date, Document Type) with tap-to-listen */}
      {result.keyDetails && result.keyDetails.length > 0 && (
        <div className="stat-badges-grid">
          {result.keyDetails.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="stat-badge-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  className="stat-icon-bubble"
                  style={{
                    width: '46px',
                    height: '46px',
                    background: index === 0 ? '#ECFDF5' : index === 1 ? '#FEF2F2' : '#EFF6FF'
                  }}
                >
                  {getFieldIcon(item.icon)}
                </div>
                <div className="stat-texts">
                  <span className="stat-label" style={{ fontSize: '0.82rem' }}>{item.label}</span>
                  <span className="stat-value" style={{ fontSize: '1.3rem', fontWeight: 800 }}>{item.value}</span>
                  {item.isUncertain && (
                    <span className="uncertain-tag">
                      <AlertTriangle size={12} />
                      <span>Uncertain</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Speaker button on each badge */}
              <button
                type="button"
                className={`btn-card-audio ${isPlaying && activeKey === `badge_${index}` ? 'is-playing' : ''}`}
                onClick={() => handleSpeak(`${item.label}: ${item.value}`, `badge_${index}`)}
                aria-label={`Listen to ${item.label}`}
                style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center' }}
              >
                <Volume2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* "What should I do?" Card matching Screen 7 */}
      <div className="card" style={{ background: '#F8FAFC', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--slate-900)' }}>
            <HelpCircle size={18} color="var(--primary)" />
            <span>{t.whatToDoTitle}</span>
          </div>

          <button
            type="button"
            className={`btn-card-audio ${isPlaying && activeKey === 'action' ? 'is-playing' : ''}`}
            onClick={() => handleSpeak(result.actionRequired, 'action')}
          >
            <Volume2 size={14} />
            <span>{listenLabel}</span>
          </button>
        </div>

        <p style={{ fontSize: '0.98rem', color: 'var(--slate-800)', lineHeight: 1.5, margin: 0 }}>
          {result.actionRequired}
        </p>
      </div>

      {/* "Important Points" Card matching Screen 7 */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="card" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#92400E' }}>
              <AlertTriangle size={18} color="#D97706" />
              <span>{t.importantPointsTitle}</span>
            </div>

            <button
              type="button"
              className={`btn-card-audio ${isPlaying && activeKey === 'warnings' ? 'is-playing' : ''}`}
              onClick={() => handleSpeak(result.warnings.map(w => w.text).join('. '), 'warnings')}
              style={{ background: '#FEF3C7', borderColor: '#FCD34D', color: '#92400E' }}
            >
              <Volume2 size={14} />
              <span>{listenLabel}</span>
            </button>
          </div>

          <ul style={{ paddingLeft: '20px', color: '#78350F', fontSize: '0.92rem', lineHeight: 1.5 }}>
            {result.warnings.map((w, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>
                {w.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Explicit Uncertainty Note */}
      {result.uncertainFields && result.uncertainFields.length > 0 && (
        <div className="card card-warning">
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#B45309', marginBottom: '4px' }}>
            {t.uncertaintyWarningTitle}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#78350F', marginBottom: '8px' }}>
            {t.uncertaintyNote}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {result.uncertainFields.map((field, idx) => (
              <span key={idx} className="uncertain-tag">
                {field}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3 Tabs matching Screen 8: Simple Explanation, Key Info, Glossary */}
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
          <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--slate-800)', marginBottom: '14px' }}>
            {result.simpleSummary}
          </p>
          <button
            type="button"
            className={`btn-card-audio ${isPlaying && activeKey === 'summary' ? 'is-playing' : ''}`}
            onClick={() => handleSpeak(result.simpleSummary, 'summary')}
          >
            <Volume2 size={14} />
            <span>{listenLabel}</span>
          </button>
        </div>
      )}

      {/* Tab 2: Key Details with individual Listen buttons */}
      {activeTab === 'details' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {result.keyDetails && result.keyDetails.map((item, idx) => (
            <div key={idx} className="card" style={{ marginBottom: 0, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {item.value}
                  </div>
                  {item.explanation && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                      {item.explanation}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className={`btn-card-audio ${isPlaying && activeKey === `item_${idx}` ? 'is-playing' : ''}`}
                  onClick={() => handleSpeak(`${item.label}: ${item.value}. ${item.explanation || ''}`, `item_${idx}`)}
                >
                  <Volume2 size={14} />
                  <span>{listenLabel}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Glossary */}
      {activeTab === 'glossary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {result.glossary && result.glossary.length > 0 ? (
            result.glossary.map((item, idx) => (
              <div key={idx} className="card" style={{ marginBottom: 0, padding: '14px 16px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--slate-900)' }}>
                  {item.term}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '2px' }}>
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

      {/* 1-Tap Share with Family via WhatsApp */}
      <button
        type="button"
        id="btn-share-family"
        onClick={handleShareWhatsApp}
        className="btn"
        style={{
          width: '100%',
          minHeight: '50px',
          backgroundColor: '#16A34A',
          color: '#FFFFFF',
          borderRadius: '16px',
          fontWeight: 700,
          fontSize: '0.98rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
          marginTop: '22px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <Share2 size={18} />
        <span>{t.btnShareFamily || 'Share with Family (WhatsApp)'}</span>
      </button>

      {/* Bottom Actions matching Screen 7 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onReset}
          id="btn-try-another"
          style={{ minHeight: '48px', fontSize: '0.95rem' }}
        >
          <RefreshCw size={16} />
          <span>{t.btnTryAnother}</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onGoHome}
          id="btn-go-home"
          style={{ minHeight: '48px', fontSize: '0.95rem' }}
        >
          <Home size={16} />
          <span>{t.btnGoHome}</span>
        </button>
      </div>
    </div>
  );
}
