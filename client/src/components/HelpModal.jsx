import React, { useState } from 'react';
import { Volume2, X, Play, BookOpen, Info, Shield, Check, MessageSquare } from 'lucide-react';
import helperAvatarImg from '../assets/helper_avatar.jpg';

export function HelpModal({ t, currentLang, onClose, onSpeak, isSpeaking }) {
  const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'about' | 'privacy'

  const handleListenHelp = () => {
    let textToSpeak = `${t.helpTitle}. ${t.helpSubtitle}. 1. ${t.helpStep1}. 2. ${t.helpStep2}. 3. ${t.helpStep3}. 4. ${t.helpStep4}.`;
    onSpeak(textToSpeak, currentLang, 'help-modal');
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="help-title">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Top Header with Assistant Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid var(--border-default)',
                flexShrink: 0
              }}
            >
              <img
                src={helperAvatarImg}
                alt="Samjhao Helper"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h2 id="help-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {t.helpTitle || 'How to use Samjhao'}
              </h2>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {t.helpSubtitle || 'Quick guide to reading your papers'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="header-icon-btn"
            aria-label="Close help"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher Pills */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-main)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
            marginBottom: '18px',
            gap: '4px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'steps' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'steps' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'steps' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {currentLang === 'hi' ? 'कैसे उपयोग करें' : (currentLang === 'te' ? 'ఎలా వాడాలి' : (currentLang === 'ta' ? 'எப்படி பயன்படுத்துவது' : 'How to Use'))}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'privacy' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'privacy' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'privacy' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {currentLang === 'hi' ? 'गोपनीयता' : (currentLang === 'te' ? 'గోప్యత' : (currentLang === 'ta' ? 'தனியுரிமை' : 'Privacy Guarantee'))}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('about')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'about' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'about' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'about' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {currentLang === 'hi' ? 'परिचय' : (currentLang === 'te' ? 'గురించి' : (currentLang === 'ta' ? 'பற்றி' : 'About'))}
          </button>
        </div>

        {/* Tab 1: 4 Easy Steps */}
        {activeTab === 'steps' && (
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EFF6FF', color: 'var(--primary-blue)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  1
                </div>
                <div style={{ fontSize: '0.94rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {t.helpStep1}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EFF6FF', color: 'var(--primary-blue)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  2
                </div>
                <div style={{ fontSize: '0.94rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {t.helpStep2}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EFF6FF', color: 'var(--primary-blue)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  3
                </div>
                <div style={{ fontSize: '0.94rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {t.helpStep3}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EFF6FF', color: 'var(--primary-blue)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  4
                </div>
                <div style={{ fontSize: '0.94rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {t.helpStep4}
                </div>
              </div>
            </div>

            {/* Audio Button for Spoken Help */}
            <button
              type="button"
              className={`btn-audio-listen ${isSpeaking ? 'is-playing' : ''}`}
              onClick={handleListenHelp}
              style={{ marginTop: '18px' }}
            >
              <Volume2 size={18} />
              <span>{t.listenToThisPage || 'Listen to steps'}</span>
            </button>
          </div>
        )}

        {/* Tab 2: Privacy Guarantee */}
        {activeTab === 'privacy' && (
          <div style={{ marginBottom: '18px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#166534', marginBottom: '4px' }}>
                <Shield size={18} color="#059669" />
                <span>Zero Persistent Document Storage</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#14532D' }}>
                Your photos and files exist strictly in volatile memory during the analysis. They are NEVER saved to server disk, database, or persistent storage.
              </p>
            </div>

            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Responsible AI & Patient Safety
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem' }}>
                Samjhao never offers medical advice or dosage interpretations. For any medicine, always consult a licensed doctor or pharmacist.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: About Samjhao */}
        {activeTab === 'about' && (
          <div style={{ marginBottom: '18px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <p style={{ marginBottom: '10px' }}>
              <strong>Samjhao (समझो)</strong> is a public-utility document reader designed to empower elderly parents, grandparents, and everyday citizens across India.
            </p>
            <p style={{ margin: 0 }}>
              Supporting <strong>English</strong>, <strong>हिन्दी (Hindi)</strong>, <strong>తెలుగు (Telugu)</strong>, and <strong>தமிழ் (Tamil)</strong> with natural native voice read-aloud.
            </p>
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          style={{ minHeight: '46px', fontSize: '0.95rem' }}
        >
          <span>{t.btnClose || 'Close'}</span>
        </button>
      </div>
    </div>
  );
}
