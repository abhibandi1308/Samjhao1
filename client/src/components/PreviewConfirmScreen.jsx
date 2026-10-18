import React from 'react';
import { RotateCcw, CheckCircle2, Volume2, FileText } from 'lucide-react';
import { getScreenVoiceInstructions } from '../voiceGuideConfig.js';

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
    const textToSpeak = getScreenVoiceInstructions('PREVIEW', currentLang, t);
    onSpeak(textToSpeak, currentLang, 'preview-guidance');
  };

  return (
    <div className="main-content" style={{ justifyContent: 'space-between' }}>
      <div>
        <div style={{ marginBottom: '14px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {t.previewTitle}
          </h1>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            {t.previewSubtitle}
          </p>

          {/* Audio Guidance Pill */}
          <button
            type="button"
            className={`btn-inline-speaker ${isSpeaking ? 'is-playing' : ''}`}
            onClick={handleListenGuidance}
            id="btn-preview-audio-top"
            style={{
              padding: '6px 16px',
              fontSize: '0.88rem'
            }}
          >
            <Volume2 size={16} />
            <span>{t.btnGuidanceAudio}</span>
          </button>
        </div>

        {/* Document Preview Box matching Walkthrough Screen 4/5 */}
        <div className="preview-box">
          {isPdf ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#FFFFFF' }}>
              <FileText size={64} color="#EF4444" style={{ marginBottom: '12px' }} />
              <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>PDF Document</div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>{file?.name}</div>
            </div>
          ) : (
            <img
              src={previewUrl}
              alt="Uploaded document preview"
              className="preview-img"
            />
          )}
        </div>

        {/* Two Clear Actions: Retake (left) & Use this photo (right, prominent green) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '12px', marginTop: '16px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRetake}
            id="btn-preview-retake"
            style={{ minHeight: '56px', fontSize: '1rem', fontWeight: 700 }}
          >
            <RotateCcw size={18} />
            <span>{t.btnRetake}</span>
          </button>

          <button
            type="button"
            className="btn btn-primary-action"
            onClick={onConfirm}
            id="btn-preview-continue"
            style={{ minHeight: '56px', fontSize: '1.05rem', fontWeight: 800 }}
          >
            <CheckCircle2 size={20} strokeWidth={2.4} />
            <span>{t.btnContinue}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
