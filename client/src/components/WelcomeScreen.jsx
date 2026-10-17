import React from 'react';
import { Volume2, Camera, FileText, ArrowRight, HelpCircle, Shield, AlertTriangle, Zap, Pill, CheckCircle2 } from 'lucide-react';
import welcomeImg from '../assets/welcome_illustration.jpg';

export function WelcomeScreen({ t, currentLang, onStart, onOpenHelp, onSelectSample, onSpeak, isSpeaking }) {
  const handleListenWelcome = () => {
    const textToSpeak = `${t.welcomeTitle}. ${t.welcomeSubtitle}`;
    onSpeak(textToSpeak, currentLang, 'welcome-summary');
  };

  return (
    <div className="main-content">
      <div className="welcome-hero">
        {/* Friendly Illustration */}
        <div className="welcome-avatar-wrap" style={{ overflow: 'hidden' }}>
          <img 
            src={welcomeImg} 
            alt="Friendly elder-friendly Samjhao illustration" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        <h1 className="welcome-title">{t.welcomeTitle}</h1>
        <p className="welcome-subtitle">{t.welcomeSubtitle}</p>

        {/* Big Spoken Audio Button (Voice First) */}
        <button
          type="button"
          className={`btn-audio-hero ${isSpeaking ? 'is-playing' : ''}`}
          onClick={handleListenWelcome}
          style={{ marginBottom: '28px' }}
          aria-label="Listen out loud to welcome message"
          id="btn-welcome-listen"
        >
          <Volume2 size={24} />
          <span>{t.listenToThisPage}</span>
        </button>

        {/* Giant Primary Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '480px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onStart}
            id="start-understand-btn"
            style={{ minHeight: '62px', fontSize: '1.25rem' }}
          >
            <Camera size={26} />
            <span>{t.btnUnderstandDoc}</span>
            <ArrowRight size={22} />
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenHelp}
            id="help-guide-btn"
            style={{ minHeight: '52px' }}
          >
            <HelpCircle size={22} color="var(--slate-700)" />
            <span>{t.btnTeachMe}</span>
          </button>
        </div>

        {/* 3 Simple Visual Steps For Elders */}
        <div className="how-it-works-grid">
          <div className="how-step-card">
            <div className="how-step-num">1</div>
            <div className="how-step-title">
              {currentLang === 'hi' ? 'फोटो लें' : currentLang === 'te' ? 'ఫోటో తీయండి' : currentLang === 'gu' ? 'ફોટો પાડો' : 'Take a Photo'}
            </div>
            <div className="how-step-desc">
              {currentLang === 'hi' 
                ? 'अपने फोन के कैमरे से बिल या कागज की फोटो खींचें।'
                : currentLang === 'te'
                ? 'మీ కెమెరాతో బిల్లు లేదా కాగితం ఫోటో తీయండి.'
                : currentLang === 'gu'
                ? 'તમારા કેમેરાથી બિલ કે કાગળનો ફોટો પાડો.'
                : 'Take a picture of your paper bill, receipt, or letter.'}
            </div>
          </div>

          <div className="how-step-card">
            <div className="how-step-num">2</div>
            <div className="how-step-title">
              {currentLang === 'hi' ? 'आसान समझाई' : currentLang === 'te' ? 'సులభమైన వివరణ' : currentLang === 'gu' ? 'સરળ સમજૂતી' : 'Simple Summary'}
            </div>
            <div className="how-step-desc">
              {currentLang === 'hi'
                ? 'हम कुल राशि, आखिरी तारीख और जरूरी बातें साफ-साफ बताते हैं।'
                : currentLang === 'te'
                ? 'మేము చెల్లించాల్సిన మొత్తం మరియు గడువు తేదీని సులభంగా చూపిస్తాము.'
                : currentLang === 'gu'
                ? 'અમે ભરવાની રકમ અને છેલ્લી તારીખ સ્પષ્ટપણે જણાવીએ છીએ.'
                : 'We find the amount to pay, the last date, and what to do.'}
            </div>
          </div>

          <div className="how-step-card">
            <div className="how-step-num">3</div>
            <div className="how-step-title">
              {currentLang === 'hi' ? 'बोलकर सुनें' : currentLang === 'te' ? 'వినండి' : currentLang === 'gu' ? 'સાંભળો' : 'Listen Out Loud'}
            </div>
            <div className="how-step-desc">
              {currentLang === 'hi'
                ? 'स्पीकर बटन दबाएं और पूरी जानकारी अपनी भाषा में सुनें।'
                : currentLang === 'te'
                ? 'స్పీకర్ బటన్ నొక్కి మీ భాషలో స్పష్టంగా వినండి.'
                : currentLang === 'gu'
                ? 'સ્પીકર બટન દબાવો અને તમારી ભાષામાં સાંભળો.'
                : 'Press the speaker button to hear everything read aloud.'}
            </div>
          </div>
        </div>

        {/* Instant Samples Section (Elders can click and test right away) */}
        <div
          style={{
            width: '100%',
            background: 'white',
            border: '2px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '24px 20px',
            textAlign: 'left',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '4px' }}>
            {t.quickTryHeading}
          </div>
          <div style={{ fontSize: '0.95rem', color: 'var(--slate-600)', marginBottom: '16px' }}>
            {currentLang === 'hi' 
              ? 'यदि आपके पास अभी कोई बिल नहीं है, तो नीचे दिए गए उदाहरण पर क्लिक करें:'
              : currentLang === 'te'
              ? 'మీ వద్ద ప్రస్తుతం బిల్లు లేకపోతే, ఉదాహరణను ప్రయత్నించండి:'
              : currentLang === 'gu'
              ? 'જો તમારી પાસે અત્યારે કોઈ બિલ ન હોય, તો નીચે આપેલા નમૂના પર ક્લિક કરો:'
              : "Don't have a document handy right now? Click an example below to see how it works:"}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', padding: '16px 20px', fontSize: '1.05rem', minHeight: '52px' }}
              onClick={() => onSelectSample('bill')}
              id="sample-bill-btn"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Zap size={22} color="#1D4ED8" />
                <span style={{ fontWeight: 800 }}>{t.sampleBillBtn}</span>
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                {currentLang === 'hi' ? 'राशि और तारीख देखें' : 'See due amount & date'}
              </span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', padding: '16px 20px', fontSize: '1.05rem', minHeight: '52px' }}
              onClick={() => onSelectSample('scam')}
              id="sample-scam-btn"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertTriangle size={22} color="#D97706" />
                <span style={{ fontWeight: 800 }}>{t.sampleScamBtn}</span>
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                {currentLang === 'hi' ? 'धोखाधड़ी चेतावनी' : 'Scam alert check'}
              </span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', padding: '16px 20px', fontSize: '1.05rem', minHeight: '52px' }}
              onClick={() => onSelectSample('medical')}
              id="sample-medical-btn"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Pill size={22} color="#DC2626" />
                <span style={{ fontWeight: 800 }}>{t.sampleMedicalBtn}</span>
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                {currentLang === 'hi' ? 'सुरक्षा नियम' : 'Safety refusal check'}
              </span>
            </button>
          </div>
        </div>

        {/* Zero-Storage Privacy Guarantee */}
        <div
          style={{
            marginTop: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            color: 'var(--slate-700)',
            background: '#F1F5F9',
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600
          }}
        >
          <Shield size={18} color="#047857" />
          <span>{t.privacyBadge}</span>
        </div>
      </div>
    </div>
  );
}
