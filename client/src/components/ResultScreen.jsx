import React from 'react';
import {
  Volume2,
  Pause,
  RotateCcw,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Home,
  RefreshCw,
  FileText,
  Share2,
  BookOpen,
  DollarSign,
  Clock,
  Zap,
  Hash,
  User,
  ShieldAlert
} from 'lucide-react';

export function ResultScreen({
  t,
  result,
  currentLang,
  speech,
  onReset,
  onGoHome
}) {
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
    let actionHeader = 'Action Needed:';
    let detailsHeader = 'Key Details:';
    let warningHeader = 'Warning: Possible fraud/scam message detected.';
    let footerTag = 'Simplified with Samjhao (समझो) - Accessible AI Document Reader';

    if (currentLang === 'hi') {
      actionHeader = 'क्या करना है:';
      detailsHeader = 'मुख्य विवरण:';
      warningHeader = 'चेतावनी: संदेहास्पद फ्रॉड संदेश हो सकता है।';
      footerTag = 'समझो (Samjhao) द्वारा सरल बनाया गया';
    } else if (currentLang === 'te') {
      actionHeader = 'చేయాల్సిన పని:';
      detailsHeader = 'ముఖ్య వివరాలు:';
      warningHeader = 'హెచ్చరిక: మోసపూరిత సందేశం కావచ్చు.';
      footerTag = 'సమఝావో (Samjhao) ద్వారా సులభతరం చేయబడింది';
    } else if (currentLang === 'ta') {
      actionHeader = 'செய்ய வேண்டியவை:';
      detailsHeader = 'முக்கிய விவரங்கள்:';
      warningHeader = 'எச்சரிக்கை: இது சந்தேகத்திற்குரிய மோசடி செய்தியாக இருக்கலாம்.';
      footerTag = 'சம்ஜாவோ (Samjhao) மூலம் எளிமையாக்கப்பட்டது';
    }

    let shareText = `*${result.documentTypeLocalized || result.documentType || 'Document Explanation via Samjhao'}*\n\n`;
    if (result.actionRequired) {
      shareText += `📌 *${actionHeader}* ${result.actionRequired}\n\n`;
    }
    if (result.keyDetails && result.keyDetails.length > 0) {
      shareText += `📋 *${detailsHeader}*\n`;
      result.keyDetails.forEach(item => {
        shareText += `• ${item.label}: ${item.value}\n`;
      });
      shareText += `\n`;
    }
    if (result.isSuspiciousMessage) {
      shareText += `⚠️ *${warningHeader}*\n\n`;
    }
    shareText += `_${footerTag}_`;

    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  // Helper icon selector for key details
  const getDetailIcon = (item) => {
    const label = (item.label || '').toLowerCase();
    if (item.icon === 'currency' || /amount|pay|total|रुपये|राशि|మొత్తం|చెల్లించ|தொகை|கட்டணம்/i.test(label)) {
      return <DollarSign size={20} color="#078A60" strokeWidth={2.4} />;
    }
    if (item.icon === 'calendar' || /date|due|अंतिम|तिथि|తేదీ|తారీఖు|தேதி|கடைசி/i.test(label)) {
      return <Calendar size={20} color="#DC2626" strokeWidth={2.4} />;
    }
    if (item.icon === 'clock' || /period|billing|समय|గడువు|காலம்/i.test(label)) {
      return <Clock size={20} color="#2563EB" strokeWidth={2.4} />;
    }
    if (item.icon === 'zap' || /units|power|बिजली|విద్యుత్|மின்சாரம்/i.test(label)) {
      return <Zap size={20} color="#D97706" strokeWidth={2.4} />;
    }
    if (item.icon === 'hash' || /account|consumer|ca|नंबर|నంబర్|எண்/i.test(label)) {
      return <Hash size={20} color="#475569" strokeWidth={2.4} />;
    }
    if (/name|नाम|పేరు|பெயர்/i.test(label)) {
      return <User size={20} color="#475569" strokeWidth={2.4} />;
    }
    return <FileText size={20} color="var(--primary-blue)" strokeWidth={2.4} />;
  };

  const isFullPlaying = isPlaying && activeKey === 'full' && !isPaused;

  return (
    <div className="main-content" style={{ paddingBottom: '36px' }}>
      {/* 1. MASTER AUDIO BAR (Screen 5 Top Bar) */}
      <div className="result-master-audio-bar">
        <button
          type="button"
          onClick={toggleFullAudio}
          id="btn-result-full-audio"
          style={{
            background: isFullPlaying ? '#06734F' : 'var(--primary-green)',
            color: '#FFFFFF',
            minHeight: '48px',
            fontSize: '1rem',
            fontWeight: 800,
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            border: 'none',
            boxShadow: '0 3px 10px rgba(7, 138, 96, 0.25)',
            cursor: 'pointer'
          }}
          aria-label={isFullPlaying ? t.btnPause : t.btnListenFull}
        >
          {isFullPlaying ? <Pause size={18} /> : <Volume2 size={18} />}
          <span>{isFullPlaying ? t.btnPause : t.btnListenFull}</span>
        </button>

        {/* Speed toggle: Slower / Normal */}
        <button
          type="button"
          onClick={() => setPlaybackRate(playbackRate === 1.0 ? 0.8 : 1.0)}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--border-default)',
            borderRadius: 'var(--radius-full)',
            padding: '10px 14px',
            fontSize: '0.84rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            minHeight: '48px',
            flexShrink: 0
          }}
          aria-label="Toggle voice speed"
          title="Toggle slower voice speed"
          id="btn-toggle-speed"
        >
          {playbackRate === 1.0 ? t.speedNormal : t.speedSlow}
        </button>

        {/* Replay Button */}
        <button
          type="button"
          onClick={() => speak(result.fullSpokenText || result.simpleSummary, currentLang, 'full')}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--border-default)',
            borderRadius: 'var(--radius-full)',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            flexShrink: 0
          }}
          aria-label="Play explanation again from start"
          title="Play Again"
          id="btn-replay-audio"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* 2. DOCUMENT IDENTITY CARD (Screen 5 Overview Card) */}
      <div className="result-doc-identity">
        <div className="result-doc-pill">
          <FileText size={14} color="var(--primary-blue)" />
          <span>{result.documentTypeLocalized || result.documentType}</span>
        </div>

        <h1 className="result-main-heading">
          {result.documentTypeLocalized || result.documentType}
        </h1>

        <p className="result-simple-summary">
          {result.simpleSummary}
        </p>
      </div>

      {/* 3. SAFETY GUARDRAIL: Medical Prescription Refusal (Screen 8) */}
      {result.isMedicalOrPrescription && (
        <div className="card-danger">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertOctagon size={26} color="var(--danger-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.08rem', color: 'var(--danger-text)', marginBottom: '4px' }}>
                  {t.medicalRefusalTitle}
                </div>
                <div style={{ fontSize: '0.94rem', color: '#7F1D1D', lineHeight: 1.5 }}>
                  {t.medicalRefusalText}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-inline-speaker"
              onClick={() => handleSpeak(t.medicalRefusalText, 'medical')}
              style={{ background: '#FEE2E2', borderColor: '#FCA5A5', color: 'var(--danger-text)' }}
              aria-label="Listen to prescription notice"
            >
              <Volume2 size={14} />
              <span>{listenLabel}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. SAFETY GUARDRAIL: Suspicious Scam Message Alert (Screen 9) */}
      {result.isSuspiciousMessage && (
        <div className="card-danger" style={{ background: '#FFF1F0', border: '1.5px solid #FCA5A5' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertTriangle size={28} color="var(--danger-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--danger-text)', marginBottom: '4px' }}>
                  {t.scamWarningTitle}
                </div>
                <div style={{ fontSize: '0.94rem', color: '#7F1D1D', lineHeight: 1.5 }}>
                  {t.scamWarningNote}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-inline-speaker"
              onClick={() => handleSpeak(t.scamWarningNote, 'scam')}
              style={{ background: '#FEE2E2', borderColor: '#FCA5A5', color: 'var(--danger-text)' }}
              aria-label="Listen to scam warning"
            >
              <Volume2 size={14} />
              <span>{listenLabel}</span>
            </button>
          </div>

          {result.suspiciousSignals && result.suspiciousSignals.length > 0 && (
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #FECACA' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--danger-text)', marginBottom: '6px' }}>
                {currentLang === 'hi' ? 'यह फ्रॉड क्यों है?' : (currentLang === 'te' ? 'ఇది ఎందుకు మోసం?' : (currentLang === 'ta' ? 'இது ஏன் மோசடி?' : 'Why is this a scam?'))}
              </div>
              <ul style={{ paddingLeft: '22px', fontSize: '0.9rem', color: '#991B1B', lineHeight: 1.5, margin: 0 }}>
                {result.suspiciousSignals.map((sig, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{sig}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 5. SINGLE-COLUMN IMPORTANT DETAILS LIST (Screens 5 & 6) */}
      {result.keyDetails && result.keyDetails.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '10px',
              paddingLeft: '2px'
            }}
          >
            {currentLang === 'hi' ? 'मुख्य जानकारी' : (currentLang === 'te' ? 'ముఖ్య సమాచారం' : (currentLang === 'ta' ? 'முக்கிய விவரங்கள்' : 'Important Information'))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.keyDetails.map((item, idx) => {
              const isAmount = /amount|pay|total|राशि|रुपये|రకం|మొత్తం|చెల్లించ|தொகை|கட்டணம்/i.test(item.label || '');
              return (
                <div
                  key={idx}
                  className={`detail-card-row ${isAmount ? 'hero-amount' : ''}`}
                >
                  <div className="detail-card-left">
                    <div
                      className="detail-icon-bubble"
                      style={{
                        background: isAmount ? 'var(--primary-green-light)' : 'var(--bg-main)',
                        border: isAmount ? '1px solid var(--primary-green-border)' : '1px solid var(--border-default)'
                      }}
                    >
                      {getDetailIcon(item)}
                    </div>
                    <div className="detail-texts">
                      <span className="detail-label">{item.label}</span>
                      <span className={`detail-value ${isAmount ? 'amount' : ''}`}>{item.value}</span>
                      {item.explanation && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {item.explanation}
                        </span>
                      )}
                      {item.isUncertain && (
                        <span className="uncertain-tag">
                          ⚠ {item.uncertaintyReason || 'Uncertain (unclear photo)'}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-inline-speaker"
                    onClick={() => handleSpeak(`${item.label}: ${item.value}`, `detail-${idx}`)}
                    aria-label={`Listen to ${item.label}`}
                    title={`Listen to ${item.label}`}
                  >
                    <Volume2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. "WHAT SHOULD YOU DO?" ACTION BOX (Screen 6 Action Section) */}
      {result.actionRequired && (
        <div className="action-next-steps-card">
          <div className="action-card-header">
            <div className="action-card-title">
              <CheckCircle2 size={20} color="var(--primary-green)" />
              <span>{t.whatToDoTitle || 'What should you do?'}</span>
            </div>

            <button
              type="button"
              className="btn-inline-speaker"
              onClick={() => handleSpeak(result.actionRequired, 'action-plan')}
              style={{ background: '#DCFCE7', borderColor: '#86EFAC', color: '#166534' }}
              aria-label="Listen to required action"
            >
              <Volume2 size={14} />
              <span>{listenLabel}</span>
            </button>
          </div>

          <p className="action-card-text">
            {result.actionRequired}
          </p>
        </div>
      )}

      {/* 7. IMPORTANT NOTES / WARNINGS */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="card-warning">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--warning-text)' }}>
              <AlertTriangle size={18} color="#D97706" />
              <span>{t.importantPointsTitle}</span>
            </div>

            <button
              type="button"
              className="btn-inline-speaker"
              onClick={() => handleSpeak(result.warnings.map(w => w.text).join('. '), 'warnings-list')}
              style={{ background: '#FEF3C7', borderColor: '#FCD34D', color: 'var(--warning-text)' }}
              aria-label="Listen to important notes"
            >
              <Volume2 size={14} />
              <span>{listenLabel}</span>
            </button>
          </div>

          <ul style={{ paddingLeft: '22px', color: '#78350F', fontSize: '0.92rem', lineHeight: 1.5, margin: 0 }}>
            {result.warnings.map((w, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>
                {w.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 8. WORDS EXPLAINED (Screen 10 Glossary) */}
      {result.glossary && result.glossary.length > 0 && (
        <div className="card-clean" style={{ background: 'var(--bg-main)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--text-primary)' }}>
              <BookOpen size={18} color="var(--primary-blue)" />
              <span>{t.tabGlossary || 'Words Explained'}</span>
            </div>

            <button
              type="button"
              className="btn-inline-speaker"
              onClick={() => {
                const text = result.glossary.map(g => `${g.term}: ${g.meaning}`).join('. ');
                handleSpeak(text, 'glossary-audio');
              }}
              style={{ background: '#FFFFFF', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
              aria-label="Listen to words explained"
            >
              <Volume2 size={14} />
              <span>{listenLabel}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.glossary.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                    {item.term}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '2px', lineHeight: 1.45 }}>
                    {item.meaning}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSpeak(`${item.term}: ${item.meaning}`, `gloss-${idx}`)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                  aria-label={`Hear ${item.term}`}
                >
                  <Volume2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. 1-TAP SHARE WITH FAMILY (WhatsApp Action) */}
      <button
        type="button"
        id="btn-share-family"
        onClick={handleShareWhatsApp}
        className="btn"
        style={{
          width: '100%',
          minHeight: '52px',
          backgroundColor: '#16A34A',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          fontWeight: 800,
          fontSize: '1.02rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
          marginTop: '6px',
          marginBottom: '14px',
          border: 'none',
          cursor: 'pointer'
        }}
        aria-label="Share document summary on WhatsApp"
      >
        <Share2 size={20} />
        <span>{t.btnShareFamily || 'Share with Family (WhatsApp)'}</span>
      </button>

      {/* 10. SECONDARY NAVIGATION: Another Document & Home */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onReset}
          id="btn-try-another"
          style={{ minHeight: '50px', fontSize: '0.94rem', fontWeight: 700 }}
        >
          <RefreshCw size={17} />
          <span>{t.btnTryAnother}</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onGoHome}
          id="btn-go-home"
          style={{ minHeight: '50px', fontSize: '0.94rem', fontWeight: 700 }}
        >
          <Home size={17} />
          <span>{t.btnGoHome}</span>
        </button>
      </div>
    </div>
  );
}
