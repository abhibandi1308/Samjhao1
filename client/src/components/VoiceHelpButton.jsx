import React from 'react';
import { Volume2, Square } from 'lucide-react';

export function VoiceHelpButton({
  isSpeaking = false,
  onTrigger,
  currentLang = 'en',
  id = 'global-voice-help-btn'
}) {
  const labels = {
    en: { idle: 'Voice Help', playing: 'Stop' },
    hi: { idle: 'बोलकर मदद', playing: 'रोकें' },
    te: { idle: 'మాటల సహాయం', playing: 'ఆపు' },
    ta: { idle: 'குரல் உதவி', playing: 'நிறுத்து' }
  };

  const currentLabels = labels[currentLang] || labels.en;

  return (
    <button
      type="button"
      onClick={onTrigger}
      id={id}
      className={`voice-help-btn ${isSpeaking ? 'is-speaking' : ''}`}
      aria-label={isSpeaking ? currentLabels.playing : currentLabels.idle}
      aria-pressed={isSpeaking}
      title={isSpeaking ? currentLabels.playing : currentLabels.idle}
    >
      <div className="voice-help-icon-wrap">
        {isSpeaking ? (
          <Square size={16} fill="#FFFFFF" strokeWidth={0} />
        ) : (
          <Volume2 size={20} strokeWidth={2.4} />
        )}
      </div>

      <span className="voice-help-label">
        {isSpeaking ? currentLabels.playing : currentLabels.idle}
      </span>

      {/* Pulsing sound ring indicator when speaking */}
      {isSpeaking && (
        <span className="voice-help-sound-waves" aria-hidden="true">
          <span className="wave wave-1"></span>
          <span className="wave wave-2"></span>
        </span>
      )}
    </button>
  );
}
