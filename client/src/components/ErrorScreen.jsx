import React from 'react';
import { AlertCircle, Camera, Image as ImageIcon, RotateCcw, Home, Volume2 } from 'lucide-react';
import { getScreenVoiceInstructions } from '../voiceGuideConfig.js';

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
      const guidance = getScreenVoiceInstructions('ERROR', currentLang, t);
      onSpeak(`${title}. ${desc}. ${guidance}`, currentLang, 'error-guidance');
    }
  };

  return (
    <div className="main-content" style={{ justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '16px 8px' }}>
        {/* Error Graphic */}
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '24px',
            background: 'var(--danger-surface)',
            border: '2px solid var(--danger-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            boxShadow: '0 8px 20px rgba(220, 38, 38, 0.15)'
          }}
        >
          <AlertCircle size={48} color="var(--danger-text)" />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {title}
        </h1>

        <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px', maxWidth: '340px', marginInline: 'auto' }}>
          {desc}
        </p>

        {/* Audio advice button */}
        {onSpeak && (
          <button
            type="button"
            className={`btn-inline-speaker ${isSpeaking ? 'is-playing' : ''}`}
            onClick={handleListenError}
            style={{ margin: '0 auto 24px', padding: '8px 18px' }}
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
                className="btn btn-primary-action"
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
              className="btn btn-primary-action"
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
            id="btn-error-go-home"
            style={{ minHeight: '46px', fontSize: '0.92rem' }}
          >
            <Home size={18} />
            <span>{t.btnGoHome || 'Go to home'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
