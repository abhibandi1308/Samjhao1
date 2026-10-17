import React from 'react';
import { RotateCcw, CheckCircle2, Volume2, FileText } from 'lucide-react';

export function PreviewConfirmScreen({
  t,
  currentLang,
  file,
  previewUrl,
  onRetake,
  onConfirm,
  onSpeak,
  isSpeaking
}) {
  const isPdf = file?.type === 'application/pdf';

  const handleListenGuidance = () => {
    const textToSpeak = `${t.previewTitle}. ${t.previewSubtitle}. If readable, tap the green continue button. If blurry, tap the retake button.`;
    onSpeak(textToSpeak, currentLang, 'preview-guidance');
  };

  return (
    <div className="main-content" style={{ justifyContent: 'space-between' }}>
      <div>
        <div style={{ marginBottom: '14px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '4px' }}>
            {t.previewTitle}
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', marginBottom: '12px' }}>
            {t.previewSubtitle}
          </p>

          {/* Audio Guidance Pill right under heading */}
          <button
            type="button"
            className={`btn-card-audio ${isSpeaking ? 'is-playing' : ''}`}
            onClick={handleListenGuidance}
            id="btn-preview-audio-top"
            style={{
              padding: '8px 18px',
              fontSize: '0.92rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <Volume2 size={16} />
            <span>{t.btnGuidanceAudio}</span>
          </button>
        </div>

        {/* Document Preview Box matching Screen 5 */}
        <div className="preview-box" style={{ borderRadius: '16px', border: '2px solid var(--slate-300)' }}>
          {isPdf ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: 'white' }}>
              <FileText size={64} color="#EF4444" style={{ marginBottom: '12px' }} />
              <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>PDF Document</div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{file?.name}</div>
            </div>
          ) : (
            <img
              src={previewUrl}
              alt="Uploaded document preview"
              className="preview-img"
              style={{ maxHeight: '380px' }}
            />
          )}
        </div>

        {/* Action Buttons: Retake (left) & Yes, Continue (right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '12px', marginTop: '18px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRetake}
            id="btn-preview-retake"
            style={{ minHeight: '56px', fontSize: '1rem', fontWeight: 700 }}
          >
            <RotateCcw size={20} />
            <span>{t.btnRetake}</span>
          </button>

          <button
            type="button"
            className="btn btn-success"
            onClick={onConfirm}
            id="btn-preview-continue"
            style={{ minHeight: '56px', fontSize: '1.1rem', fontWeight: 800, boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)' }}
          >
            <CheckCircle2 size={22} strokeWidth={2.5} />
            <span>{t.btnContinue}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
