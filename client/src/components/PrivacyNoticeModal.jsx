import React from 'react';
import { Shield, Lock, Server, Cpu, X, Check } from 'lucide-react';

export function PrivacyNoticeModal({ onClose }) {
  return (
    <div className="help-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="privacy-title">
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669'
              }}
            >
              <Shield size={22} />
            </div>
            <div>
              <h2 id="privacy-title" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Privacy & Data Security Policy
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                गोपनीयता और ज़ीरो-स्टोरेज गारंटी
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
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: 1.55 }}>
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
              <Lock size={16} color="#059669" />
              <span>1. Zero Persistent Document Storage</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--slate-600)' }}>
              Uploaded images and documents are processed strictly in volatile RAM memory (in-memory buffer) during the API request. They are NEVER written to a server disk, database, or stored in persistent logs.
            </p>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
              <Server size={16} color="#2563EB" />
              <span>2. Secure Backend Proxy</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--slate-600)' }}>
              API credentials are kept strictly in backend environment variables and never exposed to the client browser.
            </p>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
              <Cpu size={16} color="#D97706" />
              <span>3. Responsible AI Boundaries</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--slate-600)' }}>
              • Samjhao strictly refuses to interpret medical prescriptions or offer medical advice.<br />
              • Samjhao does not claim to verify a document's legal authenticity or declare unknown messages definitively safe.<br />
              • Ambiguous or unreadable text is explicitly marked as uncertain.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onClose}
          style={{ marginTop: '10px' }}
        >
          <Check size={18} />
          <span>I Understand / समझ गया</span>
        </button>
      </div>
    </div>
  );
}
