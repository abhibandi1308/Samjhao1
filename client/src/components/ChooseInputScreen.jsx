import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, FileText, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

export function ChooseInputScreen({ t, currentLang, onFileSelected, onSpeak, isSpeaking }) {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  const handleListenHelp = () => {
    const textToSpeak = `${t.chooseDocTitle}. ${t.chooseDocSubtitle}. 1. ${t.optionCamera}: ${t.optionCameraSub}. 2. ${t.optionGallery}: ${t.optionGallerySub}. 3. ${t.optionPdf}: ${t.optionPdfSub}. ${t.frameGuidanceTitle}: ${t.frameGuidanceSub}`;
    onSpeak(textToSpeak, currentLang, 'choose-input');
  };

  return (
    <div className="main-content" style={{ justifyContent: 'space-between' }}>
      <div>
        <div className="choose-doc-header">
          <h1 className="choose-doc-title">{t.chooseDocTitle}</h1>
          <p className="choose-doc-subtitle">{t.chooseDocSubtitle}</p>
        </div>

        {/* Top Audio Guidance Button */}
        <button
          type="button"
          className={`btn-card-audio ${isSpeaking ? 'is-playing' : ''}`}
          onClick={handleListenHelp}
          id="btn-input-help-top"
          style={{
            margin: '0 0 20px',
            padding: '8px 18px',
            fontSize: '0.92rem',
            borderRadius: 'var(--radius-full)'
          }}
          aria-label="Listen to options"
        >
          <Volume2 size={16} />
          <span>{t.listenToHelp}</span>
        </button>

        {/* Hidden File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* 3 Large Input Options matching Screen 3 */}
        <div className="input-option-stack">
          {/* Option 1: Take Photo */}
          <button
            type="button"
            className="input-option-card"
            onClick={() => cameraInputRef.current?.click()}
            id="btn-take-photo"
            style={{ minHeight: '78px', padding: '16px 18px' }}
          >
            <div className="input-icon-box" style={{ background: '#EF4444', width: '52px', height: '52px', borderRadius: '14px' }}>
              <Camera size={28} strokeWidth={2.4} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="input-option-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {t.optionCamera}
              </div>
              <div className="input-option-sub" style={{ fontSize: '0.9rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                {t.optionCameraSub}
              </div>
            </div>
          </button>

          {/* Option 2: Choose Photo */}
          <button
            type="button"
            className="input-option-card"
            onClick={() => galleryInputRef.current?.click()}
            id="btn-choose-photo"
            style={{ minHeight: '78px', padding: '16px 18px' }}
          >
            <div className="input-icon-box" style={{ background: '#2563EB', width: '52px', height: '52px', borderRadius: '14px' }}>
              <ImageIcon size={28} strokeWidth={2.4} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="input-option-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {t.optionGallery}
              </div>
              <div className="input-option-sub" style={{ fontSize: '0.9rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                {t.optionGallerySub}
              </div>
            </div>
          </button>

          {/* Option 3: Choose PDF */}
          <button
            type="button"
            className="input-option-card"
            onClick={() => pdfInputRef.current?.click()}
            id="btn-choose-pdf"
            style={{ minHeight: '78px', padding: '16px 18px' }}
          >
            <div className="input-icon-box" style={{ background: '#D97706', width: '52px', height: '52px', borderRadius: '14px' }}>
              <FileText size={28} strokeWidth={2.4} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="input-option-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {t.optionPdf}
              </div>
              <div className="input-option-sub" style={{ fontSize: '0.9rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                {t.optionPdfSub}
              </div>
            </div>
          </button>
        </div>

        {/* Framing guidance note */}
        <div
          style={{
            background: 'var(--slate-50)',
            border: '1px solid var(--slate-200)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            marginTop: '16px'
          }}
        >
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--slate-800)', marginBottom: '4px' }}>
            {t.frameGuidanceTitle}
          </div>
          <div style={{ fontSize: '0.86rem', color: 'var(--slate-600)', lineHeight: 1.45 }}>
            {t.frameGuidanceSub}
          </div>
        </div>
      </div>
    </div>
  );
}
