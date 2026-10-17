import React from 'react';
import { FileText, Clock, Sparkles } from 'lucide-react';

export function ProcessingScreen({ t }) {
  return (
    <div className="main-content" style={{ justifyContent: 'center' }}>
      <div className="processing-card">
        {/* Animated Document Graphic matching Screen 6 */}
        <div className="processing-graphic">
          <div className="pulse-ring"></div>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
              position: 'relative',
              zIndex: 2
            }}
          >
            <FileText size={42} strokeWidth={2.2} />
            <Sparkles
              size={22}
              color="#FBBF24"
              style={{ position: 'absolute', top: '-6px', right: '-6px' }}
            />
          </div>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
          {t.processingTitle}
        </h1>
        <p style={{ fontSize: '0.98rem', color: 'var(--slate-600)', maxWidth: '340px', lineHeight: 1.5 }}>
          {t.processingSubtitle}
        </p>

        {/* Indeterminate Loading Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar-fill"></div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            color: 'var(--slate-500)',
            marginTop: '8px'
          }}
        >
          <Clock size={16} />
          <span>{t.processingWaitNote}</span>
        </div>
      </div>
    </div>
  );
}
