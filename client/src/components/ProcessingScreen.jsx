import React from 'react';
import { FileText, Sparkles, Clock, ShieldCheck } from 'lucide-react';

export function ProcessingScreen({ t }) {
  return (
    <div className="main-content" style={{ justifyContent: 'center' }}>
      <div className="processing-card">
        {/* Pulsing Visual Effect */}
        <div className="processing-graphic">
          <div className="pulse-ring"></div>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
              position: 'relative',
              zIndex: 2
            }}
          >
            <FileText size={40} />
            <Sparkles
              size={20}
              color="#FBBF24"
              style={{ position: 'absolute', top: '-6px', right: '-6px' }}
            />
          </div>
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
          {t.processingTitle}
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--slate-600)', maxWidth: '340px', lineHeight: 1.4 }}>
          {t.processingSubtitle}
        </p>

        {/* Animated Indeterminate Progress Bar */}
        <div className="progress-bar-container" style={{ maxWidth: '300px' }}>
          <div className="progress-bar-fill"></div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            color: 'var(--slate-500)',
            marginTop: '8px'
          }}
        >
          <Clock size={16} />
          <span>{t.processingWaitNote}</span>
        </div>

        {/* Zero-Storage Assurance */}
        <div
          style={{
            marginTop: '36px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--slate-100)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            color: 'var(--slate-600)'
          }}
        >
          <ShieldCheck size={16} color="#059669" />
          <span>RAM-only processing • No files saved</span>
        </div>
      </div>
    </div>
  );
}
