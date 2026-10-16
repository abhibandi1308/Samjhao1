import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for Browser Web Speech API (speechSynthesis)
 * Supports multiple Indian languages, adjustable playback rates (1.0x, 0.8x),
 * and tracking of actively speaking sections.
 */
export function useSpeech(defaultLang = 'hi') {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isSupported, setIsSupported] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);

  const currentUtteranceRef = useRef(null);

  // Check speech synthesis support and load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Map language codes to BCP 47 tags
  const getLangCode = (lang) => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'te': return 'te-IN';
      case 'gu': return 'gu-IN';
      case 'bn': return 'bn-IN';
      case 'mr': return 'mr-IN';
      case 'en': return 'en-IN';
      default: return 'hi-IN';
    }
  };

  // Find best matching voice for the target language
  const findBestVoice = useCallback((langCode) => {
    if (!availableVoices.length) return null;
    const exact = availableVoices.find(v => v.lang.replace('_', '-').toLowerCase() === langCode.toLowerCase());
    if (exact) return exact;
    const prefix = availableVoices.find(v => v.lang.toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase()));
    return prefix || null;
  }, [availableVoices]);

  // Stop speech
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setActiveKey(null);
  }, []);

  // Pause speech
  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  // Resume speech
  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  // Speak text with specific key identifier
  const speak = useCallback((text, lang = defaultLang, itemKey = 'main') => {
    if (!isSupported || !text) return;

    // If already playing this key, toggle stop
    if (isPlaying && activeKey === itemKey && !isPaused) {
      stop();
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const langCode = getLangCode(lang);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    const matchedVoice = findBestVoice(langCode);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setActiveKey(itemKey);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveKey(null);
    };

    utterance.onerror = (e) => {
      // Don't treat user-initiated cancel as an error
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e);
      }
      setIsPlaying(false);
      setIsPaused(false);
      setActiveKey(null);
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [defaultLang, playbackRate, isSupported, isPlaying, isPaused, activeKey, findBestVoice, stop]);

  return {
    isSupported,
    isPlaying,
    isPaused,
    activeKey,
    playbackRate,
    setPlaybackRate,
    speak,
    stop,
    pause,
    resume
  };
}
