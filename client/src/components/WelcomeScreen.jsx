import React from 'react';
import { Camera, Volume2, HelpCircle, FileText, Pill, MessageSquare } from 'lucide-react';
import welcomeImg from '../assets/welcome_illustration.jpg';
import { getScreenVoiceInstructions } from '../voiceGuideConfig.js';

export function WelcomeScreen({
  t,
  currentLang,
  onStart,
  onOpenHelp,
  onSelectSample,
  onSpeak,
  isSpeaking
}) {
  const handleListenWelcome = () => {
    const textToSpeak = getScreenVoiceInstructions('WELCOME', currentLang, t);
    onSpeak(textToSpeak, currentLang, 'welcome-summary');
  };

  return (
    <div className="main-content">
      <div className="welcome-hero">
        {/* Modest Warm Illustration of Elderly Couple */}
        <div className="welcome-avatar-wrap">
          <img 
            src={welcomeImg} 
            alt="Samjhao welcome illustration" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        {/* Clear Main Heading */}
        <h1 className="welcome-title">{t.welcomeTitle}</h1>
        <p className="welcome-subtitle">{t.welcomeSubtitle}</p>

        {/* Audio Button for Spoken Explanation */}
        <button
          type="button"
          className={`btn-inline-speaker ${isSpeaking ? 'is-playing' : ''}`}
          onClick={handleListenWelcome}
          style={{
            padding: '8px 20px',
            fontSize: '0.94rem',
            minHeight: '42px',
            marginBottom: '24px'
          }}
          aria-label="Listen out loud to welcome message"
          id="welcome-audio-btn"
        >
          <Volume2 size={18} />
          <span>{t.listenToThisPage}</span>
        </button>

        {/* GIANT PRIMARY ACTION: Green Take Photo Button */}
        <button
          type="button"
          className="btn-giant-camera"
          onClick={onStart}
          id="start-understand-btn"
          aria-label={t.btnUnderstandDoc}
        >
          <div className="btn-giant-camera-content">
            <Camera size={26} strokeWidth={2.4} />
            <span>{t.btnUnderstandDoc}</span>
          </div>
          {t.btnUnderstandDocSub && (
            <span className="btn-giant-camera-sub">
              {t.btnUnderstandDocSub}
            </span>
          )}
        </button>

        {/* Secondary Action: How does Samjhao work? */}
        <button
          type="button"
          className="btn-how-to-use"
          onClick={onOpenHelp}
          id="help-guide-btn"
        >
          <HelpCircle size={18} />
          <span>{t.btnTeachMe || 'How does Samjhao work?'}</span>
        </button>

        {/* Quick Example Category Pills (Bills, Medicines, Messages) */}
        <div className="sample-categories-section">
          <div className="sample-categories-label">
            {currentLang === 'hi'
              ? 'या उदाहरण देखकर आजमाएं'
              : currentLang === 'te'
              ? 'లేదా ఉదాహరణలను ప్రయత్నించండి'
              : currentLang === 'ta'
              ? 'அல்லது உதாரணங்களை முயற்சிக்கவும்'
              : 'Or test with an example document'}
          </div>

          <div className="sample-categories-grid">
            <button
              type="button"
              className="sample-pill-btn"
              onClick={() => onSelectSample('bill')}
              id="sample-bill-btn"
              title="Test with an electricity bill"
            >
              <FileText size={20} color="#2563EB" />
              <span>
                {currentLang === 'hi' ? 'बिजली बिल' : (currentLang === 'te' ? 'కరెంట్ బిల్లు' : (currentLang === 'ta' ? 'மின்சார பில்' : 'Utility Bill'))}
              </span>
            </button>

            <button
              type="button"
              className="sample-pill-btn"
              onClick={() => onSelectSample('medical')}
              id="sample-medical-btn"
              title="Test with a medical prescription"
            >
              <Pill size={20} color="#059669" />
              <span>
                {currentLang === 'hi' ? 'दवा का पर्चा' : (currentLang === 'te' ? 'వైద్య చీటీ' : (currentLang === 'ta' ? 'மருந்துச் சீட்டு' : 'Prescription'))}
              </span>
            </button>

            <button
              type="button"
              className="sample-pill-btn"
              onClick={() => onSelectSample('scam')}
              id="sample-scam-btn"
              title="Test with a suspicious SMS message"
            >
              <MessageSquare size={20} color="#D97706" />
              <span>
                {currentLang === 'hi' ? 'संदेश / SMS' : (currentLang === 'te' ? 'SMS / లేఖ' : (currentLang === 'ta' ? 'மோசடி SMS' : 'Suspicious SMS'))}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
