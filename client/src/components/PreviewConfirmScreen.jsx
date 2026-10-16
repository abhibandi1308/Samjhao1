import React from 'react';
import { ArrowLeft, RotateCcw, CheckCircle2, Volume2, ShieldCheck, FileText } from 'lucide-react';

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
  const fileSizeMb = file ? (file.size / (1024 * 1024)).toFixed(2) : '0';

  const handleListenGuidance = () => {
    const textToSpeak = `${t.previewTitle}. ${t.previewSubtitle}`;
    onSpeak(textToSpeak, currentLang, 'preview-guidance');
  };

  return (
    <div className="main-content">
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={onRetake}
          style={{
            background: 'var(--slate-100)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginRight: '12px'
          }}
          aria-label="Back / Retake"
        >
          <ArrowLeft size={20} color="var(--slate-700)" />
        </button>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>
          {t.btnRetake}
        </span>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '4px' }}>
          {t.previewTitle}
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
          {t.previewSubtitle}
        </p>
      </div>

      {/* Document Preview Box */}
      <div className="preview-box">
        {isPdf ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'white' }}>
            <FileText size={64} color="#EF4444" style={{ marginBottom: '12px' }} />
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>PDF Document</div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{file?.name}</div>
          </div>
        ) : (
          <img
            src={previewUrl}
            alt="Uploaded document preview"
            className="preview-img"
          />
        )}

        {/* Security watermark badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '14px',
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ShieldCheck size={14} color="#10B981" />
          <span>In-Memory RAM Only</span>
        </div>
      </div>

      {/* File info badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--slate-500)',
          marginBottom: '20px',
          padding: '0 4px'
        }}
      >
        <span>{file?.name || 'Document'}</span>
        <span>{t.fileSizeLabel} {fileSizeMb} MB</span>
      </div>

      {/* Primary Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onRetake}
          id="btn-preview-retake"
        >
          <RotateCcw size={18} />
          <span>{t.btnRetake}</span>
        </button>

        <button
          type="button"
          className="btn btn-success"
          onClick={onConfirm}
          id="btn-preview-continue"
        >
          <CheckCircle2 size={18} />
          <span>{t.btnContinue}</span>
        </button>
      </div>

      {/* Audio Guidance */}
      <div style={{ textAlign: 'center', marginTop: 'auto' }}>
        <button
          type="button"
          className={`btn-audio ${isSpeaking ? 'is-playing' : ''}`}
          onClick={handleListenGuidance}
        >
          <Volume2 size={18} />
          <span>{t.btnGuidanceAudio}</span>
        </button>
      </div>
    </div>
  );
}
