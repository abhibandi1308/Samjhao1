import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, FileText, Volume2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { COLOR_TOKENS, COLOR_NAMES, getScreenVoiceInstructions } from '../voiceGuideConfig.js';

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
    const textToSpeak = getScreenVoiceInstructions('CHOOSE_INPUT', currentLang, t);
    onSpeak(textToSpeak, currentLang, 'choose-input');
  };

  const cNames = COLOR_NAMES[currentLang] || COLOR_NAMES.en;

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
          className={`btn-inline-speaker ${isSpeaking ? 'is-playing' : ''}`}
          onClick={handleListenHelp}
          id="btn-input-help-top"
          style={{
            margin: '0 0 18px',
            padding: '8px 18px',
            fontSize: '0.92rem'
          }}
          aria-label="Listen to color-assisted options"
        >
          <Volume2 size={16} />
          <span>{t.listenToHelp}</span>
        </button>

        {/* Native Hidden File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          id="native-camera-input"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          id="native-gallery-input"
        />
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          id="native-pdf-input"
        />

        {/* 3 Color-Assisted Option Cards (Yellow: Take Photo, Pink: Gallery, Blue: PDF) */}
        <div className="input-option-stack">
          {/* Option 1: Take Photo (Yellow) */}
          <button
            type="button"
            className="input-option-card card-color-assisted"
            onClick={() => cameraInputRef.current?.click()}
            id="btn-take-photo"
            style={{
              backgroundColor: COLOR_TOKENS.yellow.lightBg,
              borderColor: COLOR_TOKENS.yellow.border,
              borderWidth: '2px'
            }}
          >
            <div className="input-icon-box" style={{ background: COLOR_TOKENS.yellow.hex }}>
              <Camera size={26} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span className="input-option-title" style={{ color: 'var(--text-primary)' }}>
                  {t.optionCamera}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: '#FDE68A',
                    color: COLOR_TOKENS.yellow.text
                  }}
                >
                  {cNames.yellow}
                </span>
              </div>
              <div className="input-option-sub">
                {t.optionCameraSub}
              </div>
            </div>
          </button>

          {/* Option 2: Choose Photo from Gallery (Pink) */}
          <button
            type="button"
            className="input-option-card card-color-assisted"
            onClick={() => galleryInputRef.current?.click()}
            id="btn-choose-photo"
            style={{
              backgroundColor: COLOR_TOKENS.pink.lightBg,
              borderColor: COLOR_TOKENS.pink.border,
              borderWidth: '2px'
            }}
          >
            <div className="input-icon-box" style={{ background: COLOR_TOKENS.pink.hex }}>
              <ImageIcon size={26} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span className="input-option-title" style={{ color: 'var(--text-primary)' }}>
                  {t.optionGallery}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: '#FBCFE8',
                    color: COLOR_TOKENS.pink.text
                  }}
                >
                  {cNames.pink}
                </span>
              </div>
              <div className="input-option-sub">
                {t.optionGallerySub}
              </div>
            </div>
          </button>

          {/* Option 3: Choose PDF (Blue) */}
          <button
            type="button"
            className="input-option-card card-color-assisted"
            onClick={() => pdfInputRef.current?.click()}
            id="btn-choose-pdf"
            style={{
              backgroundColor: COLOR_TOKENS.blue.lightBg,
              borderColor: COLOR_TOKENS.blue.border,
              borderWidth: '2px'
            }}
          >
            <div className="input-icon-box" style={{ background: COLOR_TOKENS.blue.hex }}>
              <FileText size={26} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span className="input-option-title" style={{ color: 'var(--text-primary)' }}>
                  {t.optionPdf}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: '#BFDBFE',
                    color: COLOR_TOKENS.blue.text
                  }}
                >
                  {cNames.blue}
                </span>
              </div>
              <div className="input-option-sub">
                {t.optionPdfSub}
              </div>
            </div>
          </button>
        </div>

        {/* Framing guidance note */}
        <div
          style={{
            background: 'var(--bg-main)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          <CheckCircle2 size={20} color="var(--primary-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {t.frameGuidanceTitle}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {t.frameGuidanceSub}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy guarantee tag at bottom */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          paddingTop: '10px'
        }}
      >
        <ShieldCheck size={16} color="var(--primary-green)" />
        <span>Your photo is never stored on disk or server.</span>
      </div>
    </div>
  );
}
