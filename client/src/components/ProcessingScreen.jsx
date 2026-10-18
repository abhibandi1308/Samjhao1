import React from 'react';
import { CheckCircle2, Lock, Volume2 } from 'lucide-react';
import { getScreenVoiceInstructions } from '../voiceGuideConfig.js';

export function ProcessingScreen({ t, currentLang = 'en', onSpeak = null, isSpeaking = false }) {
  const handleListenProcessing = () => {
    if (onSpeak) {
      const textToSpeak = getScreenVoiceInstructions('PROCESSING', currentLang, t);
      onSpeak(textToSpeak, currentLang, 'processing-guidance');
    }
  };

  return (
    <div className="main-content" style={{ justifyContent: 'center' }}>
      <div className="processing-card">
        {/* Subtle Rotating Progress Spinner */}
        <div className="processing-spinner" aria-hidden="true"></div>

        <h1 className="processing-title">
          {t.processingTitle || 'Reading your document...'}
        </h1>
        <p className="processing-sub">
          {t.processingSubtitle || 'Please wait a few seconds.'}
        </p>

        {onSpeak && (
          <button
            type="button"
            className={`btn-inline-speaker ${isSpeaking ? 'is-playing' : ''}`}
            onClick={handleListenProcessing}
            style={{ margin: '0 auto 16px', padding: '6px 16px' }}
            aria-label="Listen to processing status"
            id="btn-processing-audio"
          >
            <Volume2 size={16} />
            <span>{t.listenToThisPage || 'Listen'}</span>
          </button>
        )}

        {/* 3 Step Sequence Checklist with Checkmarks matching Screen 4 */}
        <div className="processing-steps-list">
          <div className="processing-step-row">
            <CheckCircle2 size={18} color="var(--primary-green)" strokeWidth={2.5} />
            <span>{t.processingStep1 || 'Extracting text from photo'}</span>
          </div>

          <div className="processing-step-row">
            <CheckCircle2 size={18} color="var(--primary-green)" strokeWidth={2.5} />
            <span>{t.processingStep2 || 'Understanding the content'}</span>
          </div>

          <div className="processing-step-row">
            <CheckCircle2 size={18} color="var(--primary-green)" strokeWidth={2.5} />
            <span>{t.processingStep3 || 'Preparing simple explanation'}</span>
          </div>
        </div>

        {/* Privacy Statement / Zero Storage Promise */}
        <div className="processing-trust-badge">
          <Lock size={18} color="#2563EB" style={{ flexShrink: 0 }} />
          <span>
            {t.privacyPromise || 'Your photo is deleted after processing. We do not store your images.'}
          </span>
        </div>
      </div>
    </div>
  );
}
