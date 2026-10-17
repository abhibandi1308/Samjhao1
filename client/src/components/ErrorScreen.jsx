import React from 'react';
import { AlertCircle, Camera, Image as ImageIcon, RotateCcw, ArrowLeft, Volume2 } from 'lucide-react';

export function ErrorScreen({
  t,
  errorType = 'blurry', // 'blurry' | 'unsupported' | 'size' | 'generic'
  customMessage,
  onRetakePhoto,
  onChooseAnother,
  onTryAgain,
  onGoHome,
  onSpeak,
  isSpeaking,
  currentLang
}) {
  const isBlurry = errorType === 'blurry';
  const title = isBlurry ? t.errBlurryTitle : (errorType === 'unsupported' ? t.errUnsupportedTitle : t.errSizeTitle);
  const desc = customMessage || (isBlurry ? t.errBlurryDesc : (errorType === 'unsupported' ? t.errUnsupportedDesc : t.errSizeDesc));

  const handleListenError = () => {
    if (onSpeak) {
      onSpeak(`${title}. ${desc}`, currentLang, 'error-guidance');
    }
  };

  return (
    <div className="main-content" style={{ justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '16px 8px' }}>
        {/* Error Graphic */}
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '28px',
            background: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.2)'
          }}
        >
          <AlertCircle size={56} color="#DC2626" />
        </div>

        <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
          {title}
        </h1>

        <p style={{ fontSize: '0.98rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '20px', maxWidth: '340px', marginInline: 'auto' }}>
          {desc}
        </p>

        {/* Audio advice button */}
        {onSpeak && (
          <button
            type="button"
            className={`btn-card-audio ${isSpeaking ? 'is-playing' : ''}`}
            onClick={handleListenError}
            style={{ margin: '0 auto 28px', padding: '8px 18px', borderRadius: 'var(--radius-full)' }}
          >
            <Volume2 size={16} />
            <span>{t.listenToThisPage || 'Listen'}</span>
          </button>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '340px', marginInline: 'auto' }}>
          {isBlurry ? (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onRetakePhoto}
                id="btn-error-retake"
              >
                <Camera size={20} />
                <span>{t.btnTakeAgain}</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onChooseAnother}
                id="btn-error-choose-photo"
              >
                <ImageIcon size={20} />
                <span>{t.btnChooseAnother}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onTryAgain}
              id="btn-error-try-again"
            >
              <RotateCcw size={20} />
              <span>{t.btnTryAgain}</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onGoHome}
            style={{ marginTop: '8px' }}
          >
            <ArrowLeft size={18} />
            <span>{t.btnGoHome}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
