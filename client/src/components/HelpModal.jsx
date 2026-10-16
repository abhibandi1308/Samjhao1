import React from 'react';
import { Volume2, X } from 'lucide-react';
import helperAvatarImg from '../assets/helper_avatar.jpg';

export function HelpModal({ t, currentLang, onClose, onSpeak, isSpeaking }) {
  const handleListenHelp = () => {
    const textToSpeak = `${t.helpTitle}. ${t.helpSubtitle}. 1. ${t.helpStep1}. 2. ${t.helpStep2}. 3. ${t.helpStep3}. 4. ${t.helpStep4}`;
    onSpeak(textToSpeak, currentLang, 'help-modal');
  };

  return (
    <div className="help-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="help-title">
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top Header with Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #38BDF8',
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)'
              }}
            >
              <img
                src={helperAvatarImg}
                alt="Samjhao Helper Assistant"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h2 id="help-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                {t.helpTitle}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                {t.helpSubtitle}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--slate-100)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--slate-600)'
            }}
            aria-label="Close help"
          >
            <X size={20} />
          </button>
        </div>

        {/* 4 Step Items */}
        <div style={{ margin: '20px 0' }}>
          <div className="help-step-item">
            <div className="help-step-number">1</div>
            <div style={{ fontSize: '0.98rem', color: 'var(--slate-800)', lineHeight: 1.45 }}>
              {t.helpStep1}
            </div>
          </div>

          <div className="help-step-item">
            <div className="help-step-number">2</div>
            <div style={{ fontSize: '0.98rem', color: 'var(--slate-800)', lineHeight: 1.45 }}>
              {t.helpStep2}
            </div>
          </div>

          <div className="help-step-item">
            <div className="help-step-number">3</div>
            <div style={{ fontSize: '0.98rem', color: 'var(--slate-800)', lineHeight: 1.45 }}>
              {t.helpStep3}
            </div>
          </div>

          <div className="help-step-item">
            <div className="help-step-number">4</div>
            <div style={{ fontSize: '0.98rem', color: 'var(--slate-800)', lineHeight: 1.45 }}>
              {t.helpStep4}
            </div>
          </div>
        </div>

        {/* Audio Button */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleListenHelp}
          style={{ marginBottom: '12px' }}
        >
          <Volume2 size={20} />
          <span>{t.listenToThisPage}</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
        >
          <span>{t.btnClose}</span>
        </button>
      </div>
    </div>
  );
}
