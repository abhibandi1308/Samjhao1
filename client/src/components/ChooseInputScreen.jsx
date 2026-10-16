import React, { useRef } from 'react';
import { ArrowLeft, Camera, Image as ImageIcon, FileText, Volume2, Info } from 'lucide-react';

export function ChooseInputScreen({ t, currentLang, onBack, onFileSelected, onSpeak, isSpeaking }) {
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
    const textToSpeak = `${t.chooseDocTitle}. ${t.chooseDocSubtitle}. ${t.frameGuidanceTitle}. ${t.frameGuidanceSub}`;
    onSpeak(textToSpeak, currentLang, 'input-help');
  };

  return (
    <div className="main-content">
      {/* Top Back Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={onBack}
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
          aria-label="Back"
        >
          <ArrowLeft size={20} color="var(--slate-700)" />
        </button>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}>
          {t.navHome}
        </span>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '6px' }}>
          {t.chooseDocTitle}
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--slate-600)' }}>
          {t.chooseDocSubtitle}
        </p>
      </div>

      {/* Hidden file inputs */}
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

      {/* Upload Option Cards */}
      <div className="upload-options-stack">
        {/* Option 1: Camera */}
        <button
          type="button"
          className="upload-card-option"
          onClick={() => cameraInputRef.current?.click()}
          id="btn-take-photo"
        >
          <div className="upload-option-icon" style={{ background: '#EF4444' }}>
            <Camera size={26} />
          </div>
          <div className="upload-option-texts">
            <div className="upload-option-title">{t.optionCamera}</div>
            <div className="upload-option-subtitle">{t.optionCameraSub}</div>
          </div>
        </button>

        {/* Option 2: Gallery Photo */}
        <button
          type="button"
          className="upload-card-option"
          onClick={() => galleryInputRef.current?.click()}
          id="btn-choose-photo"
        >
          <div className="upload-option-icon" style={{ background: '#2563EB' }}>
            <ImageIcon size={26} />
          </div>
          <div className="upload-option-texts">
            <div className="upload-option-title">{t.optionGallery}</div>
            <div className="upload-option-subtitle">{t.optionGallerySub}</div>
          </div>
        </button>

        {/* Option 3: PDF Document */}
        <button
          type="button"
          className="upload-card-option"
          onClick={() => pdfInputRef.current?.click()}
          id="btn-choose-pdf"
        >
          <div className="upload-option-icon" style={{ background: '#DC2626' }}>
            <FileText size={26} />
          </div>
          <div className="upload-option-texts">
            <div className="upload-option-title">{t.optionPdf}</div>
            <div className="upload-option-subtitle">{t.optionPdfSub}</div>
          </div>
        </button>
      </div>

      {/* Framing & Visibility Guidance Card */}
      <div
        style={{
          marginTop: '24px',
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '16px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}
      >
        <Info size={22} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1E40AF', marginBottom: '2px' }}>
            {t.frameGuidanceTitle}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#1E3A8A' }}>
            {t.frameGuidanceSub}
          </div>
        </div>
      </div>

      {/* Audio Help Button */}
      <div style={{ marginTop: 'auto', paddingTop: '24px', textAlign: 'center' }}>
        <button
          type="button"
          className={`btn-audio ${isSpeaking ? 'is-playing' : ''}`}
          onClick={handleListenHelp}
        >
          <Volume2 size={18} />
          <span>{t.listenToHelp}</span>
        </button>
      </div>
    </div>
  );
}
