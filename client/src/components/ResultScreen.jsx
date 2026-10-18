import React from 'react';
import {
  Volume2,
  Pause,
  RotateCcw,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  Home,
  RefreshCw,
  FileText,
  Share2,
  BookOpen
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
    let shareText = `*${result.documentTypeLocalized || result.documentType || 'Document Explanation via Samjhao'}*\n\n`;
    if (result.actionRequired) {
      shareText += `📌 *Action Needed:* ${result.actionRequired}\n\n`;
    }
    if (result.keyDetails && result.keyDetails.length > 0) {
      shareText += `📋 *Key Details:*\n`;
      result.keyDetails.forEach(item => {
        shareText += `• ${item.label}: ${item.value}\n`;
      });
      shareText += `\n`;
    }
    if (result.isSuspiciousMessage) {
      shareText += `⚠️ *Warning:* Possible fraud/scam message detected.\n\n`;
    }
    shareText += `_Simplified with Samjhao (समझो) - Accessible AI Document Reader_`;

    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  // Find primary amount item
  const amountItem = result.keyDetails?.find(item =>
    item.icon === 'currency' ||
    /amount|pay|total|राशि|रुपये|రకం|మొత్తం|చెల్లించ|રકમ/i.test(item.label)
  ) || (result.keyDetails?.length > 0 ? result.keyDetails[0] : null);

  // Find due date item
  const dueDateItem = result.keyDetails?.find(item =>
    item !== amountItem && (
      item.icon === 'calendar' ||
      /date|due|अंतिम|तिथि|తేదీ|తారీఖు|તારીખ/i.test(item.label)
    )
  ) || (result.keyDetails?.length > 1 && result.keyDetails[1] !== amountItem ? result.keyDetails[1] : null);

  // Remaining key details (Consumer name, account number, units, etc.)
  const otherDetails = (result.keyDetails || []).filter(item =>
    item !== amountItem && item !== dueDateItem
  );

  return (
    <div className="main-content" style={{ paddingBottom: '32px' }}>
      {/* 1. Master Audio Bar (Top, high contrast, clean) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          border: '1.5px solid #BFDBFE',
          borderRadius: '18px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
        }}
      >
        <button
          type="button"
          onClick={toggleFullAudio}
          id="btn-result-full-audio"
          className="btn"
          style={{
            background: isPlaying && activeKey === 'full' && !isPaused ? '#1E40AF' : '#2563EB',
            color: '#FFFFFF',
            minHeight: '46px',
            fontSize: '0.98rem',
            fontWeight: 700,
            padding: '10px 18px',
            borderRadius: '9999px',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            border: 'none',
            boxShadow: '0 3px 10px rgba(37, 99, 235, 0.25)',
            cursor: 'pointer'
          }}
        >
          {isPlaying && activeKey === 'full' && !isPaused ? <Pause size={18} /> : <Volume2 size={18} />}
          <span>{isPlaying && activeKey === 'full' && !isPaused ? t.btnPause : t.btnListenFull}</span>
        </button>

        <button
          type="button"
          onClick={() => setPlaybackRate(playbackRate === 1.0 ? 0.8 : 1.0)}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '9999px',
            padding: '10px 14px',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#1E293B',
            cursor: 'pointer',
            minHeight: '46px',
            flexShrink: 0
          }}
          aria-label="Toggle slower voice speed"
        >
          {playbackRate === 1.0 ? t.speedNormal : t.speedSlow}
        </button>
      </div>

      {/* 2. Document Identity Banner */}
      <div style={{ marginBottom: '18px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#F1F5F9',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '4px 10px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#475569',
            marginBottom: '8px'
          }}
        >
          <FileText size={14} color="#3B82F6" />
          <span>{result.documentTypeLocalized || result.documentType}</span>
        </div>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 8px 0',
            lineHeight: 1.2
          }}
        >
          {result.documentTypeLocalized || result.documentType}
        </h1>

        <p
          style={{
            fontSize: '1.02rem',
            color: '#334155',
            lineHeight: 1.55,
            margin: 0
          }}
        >
          {result.simpleSummary}
        </p>
      </div>

      {/* 3. SAFETY GUARDRAIL: Medical Prescription Refusal */}
      {result.isMedicalOrPrescription && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1.5px solid #FCA5A5',
            borderRadius: '16px',
            padding: '18px',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertOctagon size={28} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#991B1B', marginBottom: '4px' }}>
                  {t.medicalRefusalTitle}
                </div>
                <div style={{ fontSize: '0.94rem', color: '#7F1D1D', lineHeight: 1.5 }}>
                  {t.medicalRefusalText}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-card-audio"
              onClick={() => handleSpeak(t.medicalRefusalText, 'medical')}
              style={{ background: '#FEE2E2', borderColor: '#FCA5A5', color: '#991B1B' }}
            >
              <Volume2 size={14} />
              <span>{listenLabel}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. SAFETY GUARDRAIL: Suspicious Scam Message Alert */}
      {result.isSuspiciousMessage && (
        <div
          style={{
            background: '#FFFBEB',
            border: '1.5px solid #FCD34D',
            borderRadius: '16px',
            padding: '18px',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertTriangle size={28} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#92400E', marginBottom: '4px' }}>
                  {t.scamWarningTitle}
                </div>
                <div style={{ fontSize: '0.94rem', color: '#78350F', lineHeight: 1.5 }}>
                  {t.scamWarningNote}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-card-audio"
              onClick={() => handleSpeak(t.scamWarningNote, 'scam')}
              style={{ background: '#FEF3C7', borderColor: '#FCD34D', color: '#92400E' }}
            >
              <Volume2 size={14} />
              <span>{listenLabel}</span>
            </button>
          </div>

          {result.suspiciousSignals && result.suspiciousSignals.length > 0 && (
            <ul style={{ paddingLeft: '28px', fontSize: '0.9rem', color: '#92400E', margin: '8px 0 0', lineHeight: 1.5 }}>
              {result.suspiciousSignals.map((sig, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{sig}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 5. HERO CARD: Key Numbers & Details (Spacious, Non-Squished) */}
      {(amountItem || dueDateItem || otherDetails.length > 0) && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '20px',
            padding: '22px 20px',
            marginBottom: '18px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
          }}
        >
          {/* Top Hero Section: Amount & Due Date */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            {amountItem && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {amountItem.label}
                </div>
                <div
                  style={{
                    fontSize: '2.3rem',
                    fontWeight: 800,
                    color: '#047857',
                    lineHeight: 1.1,
                    marginTop: '4px',
                    letterSpacing: '-0.5px'
                  }}
                >
                  {amountItem.value}
                </div>
                {amountItem.explanation && (
                  <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>
                    {amountItem.explanation}
                  </div>
                )}
              </div>
            )}

            {dueDateItem && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Calendar size={18} color="#DC2626" />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase' }}>
                    {dueDateItem.label}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#991B1B' }}>
                    {dueDateItem.value}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full-width Details List (Zero Cramping) */}
          {otherDetails.length > 0 && (
            <div
              style={{
                marginTop: '18px',
                paddingTop: '16px',
                borderTop: '1px solid #F1F5F9',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {otherDetails.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '6px 0',
                    borderBottom: idx < otherDetails.length - 1 ? '1px dashed #F1F5F9' : 'none',
                    gap: '12px'
                  }}
                >
                  <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: '1rem',
                      color: '#0F172A',
                      fontWeight: 700,
                      textAlign: 'right'
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. "What should I do?" Action Box */}
      {result.actionRequired && (
        <div
          style={{
            background: '#F0FDF4',
            border: '1.5px solid #BBF7D0',
            borderRadius: '18px',
            padding: '20px',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.05rem', color: '#166534' }}>
              <CheckCircle2 size={20} color="#16A34A" />
              <span>{t.whatToDoTitle}</span>
            </div>

            <button
              type="button"
              className="btn-card-audio"
              onClick={() => handleSpeak(result.actionRequired, 'action')}
              style={{ background: '#DCFCE7', borderColor: '#86EFAC', color: '#166534' }}
            >
              <Volume2 size={14} />
              <span>{listenLabel}</span>
            </button>
          </div>

          <p style={{ fontSize: '1rem', color: '#14532D', lineHeight: 1.55, margin: 0, fontWeight: 500 }}>
            {result.actionRequired}
          </p>
        </div>
      )}

      {/* 7. Important Notes / Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <div
          style={{
            background: '#FFFBEB',
            border: '1.5px solid #FDE68A',
            borderRadius: '18px',
            padding: '18px',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#92400E' }}>
              <AlertTriangle size={18} color="#D97706" />
              <span>{t.importantPointsTitle}</span>
            </div>

            <button
              type="button"
              className="btn-card-audio"
              onClick={() => handleSpeak(result.warnings.map(w => w.text).join('. '), 'warnings')}
              style={{ background: '#FEF3C7', borderColor: '#FCD34D', color: '#92400E' }}
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

      {/* 8. Words Explained (Glossary) if any */}
      {result.glossary && result.glossary.length > 0 && (
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '18px',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#334155', marginBottom: '12px' }}>
            <BookOpen size={18} color="#475569" />
            <span>{t.tabGlossary || 'Words Explained'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.glossary.map((item, idx) => (
              <div key={idx} style={{ padding: '8px 10px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>{item.term}: </span>
                <span style={{ color: '#475569', fontSize: '0.88rem' }}>{item.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. 1-Tap Share with Family via WhatsApp (High Contrast Green, Prominent) */}
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
          borderRadius: '16px',
          fontWeight: 800,
          fontSize: '1.02rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.28)',
          marginTop: '8px',
          marginBottom: '14px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <Share2 size={20} />
        <span>{t.btnShareFamily || 'Share with Family (WhatsApp)'}</span>
      </button>

      {/* 10. Secondary Navigation Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onReset}
          id="btn-try-another"
          style={{ minHeight: '48px', fontSize: '0.92rem', fontWeight: 700 }}
        >
          <RefreshCw size={16} />
          <span>{t.btnTryAnother}</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onGoHome}
          id="btn-go-home"
          style={{ minHeight: '48px', fontSize: '0.92rem', fontWeight: 700 }}
        >
          <Home size={16} />
          <span>{t.btnGoHome}</span>
        </button>
      </div>
    </div>
  );
}
