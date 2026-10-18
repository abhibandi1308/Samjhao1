import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from './translations.js';
import { useSpeech } from './hooks/useSpeech.js';
import { Navbar } from './components/Navbar.jsx';
import { LanguageSelectScreen } from './components/LanguageSelectScreen.jsx';
import { WelcomeScreen } from './components/WelcomeScreen.jsx';
import { ChooseInputScreen } from './components/ChooseInputScreen.jsx';
import { PreviewConfirmScreen } from './components/PreviewConfirmScreen.jsx';
import { ProcessingScreen } from './components/ProcessingScreen.jsx';
import { ResultScreen } from './components/ResultScreen.jsx';
import { HelpModal } from './components/HelpModal.jsx';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal.jsx';
import { ErrorScreen } from './components/ErrorScreen.jsx';
import { getScreenVoiceInstructions } from './voiceGuideConfig.js';
import { compressImageIfNeeded } from './utils/imageCompressor.js';
import './App.css';

// Screen State Constants
const SCREENS = {
  LANG_SELECT: 'LANG_SELECT', // Screen 1 (First screen shown to user)
  WELCOME: 'WELCOME',         // Screen 2
  CHOOSE_INPUT: 'CHOOSE_INPUT', // Screen 3
  PREVIEW: 'PREVIEW',         // Screen 5
  PROCESSING: 'PROCESSING',   // Screen 6
  RESULT: 'RESULT',           // Screen 7 & 8
  ERROR: 'ERROR'              // Screen 10
};

export default function App() {
  // Default starting language is English
  const [currentLang, setCurrentLang] = useState('en');
  // FIRST THING SHOWN: Choose Language screen (Screen 1)
  const [currentScreen, setCurrentScreen] = useState(SCREENS.LANG_SELECT);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [explanationResult, setExplanationResult] = useState(null);
  const [errorDetails, setErrorDetails] = useState({ type: 'blurry', message: '' });

  // Modals
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Web Speech Hook
  const speech = useSpeech(currentLang);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Cleanup object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Language Change Handler - works instantly on any screen
  const handleSelectLanguage = (langCode) => {
    setCurrentLang(langCode);
    speech.stop();
  };

  // From Screen 1 (Language Select) -> Screen 2 (Welcome)
  const handleInitialLanguageChosen = (langCode) => {
    setCurrentLang(langCode);
    speech.stop();
    setCurrentScreen(SCREENS.WELCOME);
  };

  // File Selection, Optimization & Validation
  const handleFileSelected = async (file) => {
    speech.stop();
    if (!file) return;

    // Validate type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
    const isImage = file.type?.startsWith('image/') || Boolean(file.name?.match(/\.(jpg|jpeg|png|webp|heic)$/i));
    const isPdf = file.type === 'application/pdf' || Boolean(file.name?.match(/\.pdf$/i));

    if (!isImage && !isPdf && !validMimes.includes(file.type)) {
      setErrorDetails({
        type: 'unsupported',
        message: t.errUnsupportedDesc
      });
      setCurrentScreen(SCREENS.ERROR);
      return;
    }

    // Automatically optimize oversized camera photos taken on mobile phones
    // Modern smartphones take 48-108MP photos resulting in 12MB-25MB files.
    // Compressing to max 2048px preserves 100% document readability while reducing size to ~1MB.
    let processedFile = file;
    if (isImage) {
      try {
        processedFile = await compressImageIfNeeded(file);
      } catch (err) {
        console.warn('Image optimization skipped:', err);
        processedFile = file;
      }
    }

    // Validate size (max 25MB)
    const MAX_ALLOWED_BYTES = 25 * 1024 * 1024;
    if (processedFile.size > MAX_ALLOWED_BYTES) {
      setErrorDetails({
        type: 'size',
        message: t.errSizeDesc
      });
      setCurrentScreen(SCREENS.ERROR);
      return;
    }

    setSelectedFile(processedFile);
    const objectUrl = URL.createObjectURL(processedFile);
    setPreviewUrl(objectUrl);
    setCurrentScreen(SCREENS.PREVIEW);
  };

  // Instant Sample Document Selection (for quick testing)
  const handleSelectSample = async (sampleType) => {
    speech.stop();
    let samplePath = '';
    let sampleName = '';

    if (sampleType === 'bill') {
      samplePath = '/samples/electricity-bill.jpg';
      sampleName = 'sample-electricity-bill.jpg';
    } else if (sampleType === 'scam') {
      samplePath = '/samples/suspicious-sms.jpg';
      sampleName = 'suspicious-message.jpg';
    } else if (sampleType === 'medical') {
      samplePath = '/samples/medical-prescription.jpg';
      sampleName = 'doctor-prescription.jpg';
    }

    try {
      const res = await fetch(samplePath);
      const blob = await res.blob();
      const file = new File([blob], sampleName, { type: 'image/jpeg' });
      setSelectedFile(file);
      setPreviewUrl(samplePath);
      setCurrentScreen(SCREENS.PREVIEW);
    } catch (e) {
      console.warn('Sample fetch fallback:', e);
      startAnalysisWithFile(null, sampleType);
    }
  };

  // Confirm and start AI analysis
  const handleConfirmPreview = () => {
    startAnalysisWithFile(selectedFile);
  };

  const startAnalysisWithFile = async (fileToUpload, sampleTypeOverride = null) => {
    setCurrentScreen(SCREENS.PROCESSING);
    speech.stop();

    try {
      const formData = new FormData();
      formData.append('language', currentLang);

      if (fileToUpload) {
        formData.append('document', fileToUpload);
      }

      const response = await fetch('/api/explain', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Server returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.needsClearerPhoto) {
        setErrorDetails({
          type: 'blurry',
          message: data.photoGuidance || t.errBlurryDesc
        });
        setCurrentScreen(SCREENS.ERROR);
        return;
      }

      if (sampleTypeOverride === 'medical') {
        data.isMedicalOrPrescription = true;
        data.documentType = 'Doctor Prescription';
        data.documentTypeLocalized = currentLang === 'hi' ? 'चिकित्सीय पर्चा' : (currentLang === 'te' ? 'వైద్య ప్రిస్క్రిప్షన్' : (currentLang === 'ta' ? 'மருத்துவர் மருந்துச் சீட்டு' : 'Doctor Prescription'));
      }

      if (sampleTypeOverride === 'scam') {
        data.isSuspiciousMessage = true;
        data.documentType = 'Suspicious Scam Message';
        data.documentTypeLocalized = currentLang === 'hi' ? 'संदेहास्पद फ्रॉड संदेश' : (currentLang === 'te' ? 'మోసపూరిత సందేశం' : (currentLang === 'ta' ? 'சந்தேகத்திற்குரிய மோசடி செய்தி' : 'Suspicious Scam Message'));
        data.suspiciousSignals = currentLang === 'hi' ? [
          'रात में बिजली काटने की झूठी धमकी।',
          'व्यक्तिगत मोबाइल नंबर पर संपर्क करने का दबाव।',
          'अनधिकृत वेब लिंक पर पैसे भेजने की मांग।'
        ] : (currentLang === 'te' ? [
          'రాత్రి విద్యుత్ నిలిపివేస్తామని నకిలీ బెదిరింపు.',
          'వ్యక్తిగత మొబైల్ నంబర్‌కు కాల్ చేయమని ఒత్తిడి.',
          'అనధికార లింక్ ద్వారా చెల్లింపు చేయమని కోరడం.'
        ] : (currentLang === 'ta' ? [
          'இன்றிரவு மின்சாரம் துண்டிக்கப்படும் என்ற போலி மிரட்டல்.',
          'அறியப்படாத தனிப்பட்ட கைபேசி எண்ணை அழைக்க அழுத்தம்.',
          'அங்கீகரிக்கப்படாத லிங்கில் பணம் செலுத்தக் கூறுதல்.'
        ] : [
          'Threatens power cutoff tonight unless paid immediately.',
          'Asks to call an unknown personal mobile number.',
          'Provides an unofficial link to pay.'
        ]));
      }

      setExplanationResult(data);
      setCurrentScreen(SCREENS.RESULT);
    } catch (err) {
      console.error('Processing error:', err);
      setErrorDetails({
        type: 'generic',
        message: currentLang === 'hi'
          ? 'डॉक्यूमेंट का विश्लेषण नहीं हो सका। कृपया दोबारा प्रयास करें।'
          : currentLang === 'te'
          ? 'పత్రాన్ని విశ్లేషించలేకపోయాము. దయచేసి మంచి వెలుతురులో మళ్ళీ ప్రయత్నించండి.'
          : currentLang === 'ta'
          ? 'ஆவணத்தை பகுப்பாய்வு செய்ய முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
          : 'Could not analyze document. Please try again with a clearer photo.'
      });
      setCurrentScreen(SCREENS.ERROR);
    }
  };

  const handleReset = () => {
    speech.stop();
    setSelectedFile(null);
    setPreviewUrl(null);
    setExplanationResult(null);
    setCurrentScreen(SCREENS.CHOOSE_INPUT);
  };

  const handleGoHome = () => {
    speech.stop();
    setSelectedFile(null);
    setPreviewUrl(null);
    setExplanationResult(null);
    setCurrentScreen(SCREENS.WELCOME);
  };

  const handleBackNavigation = () => {
    speech.stop();
    if (currentScreen === SCREENS.CHOOSE_INPUT) {
      setCurrentScreen(SCREENS.WELCOME);
    } else if (currentScreen === SCREENS.PREVIEW) {
      setCurrentScreen(SCREENS.CHOOSE_INPUT);
    } else if (currentScreen === SCREENS.RESULT) {
      handleGoHome();
    } else if (currentScreen === SCREENS.ERROR) {
      setCurrentScreen(SCREENS.CHOOSE_INPUT);
    }
  };

  const isVoiceHelpSpeaking = speech.isPlaying && speech.activeKey === 'screen-voice-help';

  const handleTriggerVoiceHelp = () => {
    if (isVoiceHelpSpeaking) {
      speech.stop();
      return;
    }
    // Cancel any current utterance before speaking screen guidance
    speech.stop();
    const instructions = getScreenVoiceInstructions(currentScreen, currentLang, t);
    speech.speak(instructions, currentLang, 'screen-voice-help');
  };

  return (
    <div className="app-viewport">
      <div className="app-container">
        {/* Top Navbar with persistent Language Switcher Dropdown (Shown on every screen except Screen 1) */}
        {currentScreen !== SCREENS.LANG_SELECT && (
          <Navbar
            t={t}
            currentLang={currentLang}
            onSelectLanguage={handleSelectLanguage}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onGoHome={handleGoHome}
            showBackButton={currentScreen !== SCREENS.WELCOME}
            onBack={handleBackNavigation}
            onSpeak={speech.speak}
            onTriggerVoiceHelp={handleTriggerVoiceHelp}
            isVoiceHelpSpeaking={isVoiceHelpSpeaking}
          />
        )}

        {/* SCREEN 1: Choose Language Screen (FIRST SCREEN SHOWN TO USER) */}
        {currentScreen === SCREENS.LANG_SELECT && (
          <LanguageSelectScreen
            currentLang={currentLang}
            onSelectLanguage={handleInitialLanguageChosen}
            onSpeak={speech.speak}
            isSpeaking={speech.isPlaying && (speech.activeKey === 'lang-select' || speech.activeKey === 'lang-select-instructions')}
          />
        )}

        {/* SCREEN 2: Welcome Screen */}
        {currentScreen === SCREENS.WELCOME && (
          <WelcomeScreen
            t={t}
            currentLang={currentLang}
            onStart={() => setCurrentScreen(SCREENS.CHOOSE_INPUT)}
            onOpenHelp={() => setIsHelpOpen(true)}
            onSelectSample={handleSelectSample}
            onSpeak={speech.speak}
            isSpeaking={speech.isPlaying && speech.activeKey === 'welcome-summary'}
          />
        )}

        {/* SCREEN 3: Choose Document Input */}
        {currentScreen === SCREENS.CHOOSE_INPUT && (
          <ChooseInputScreen
            t={t}
            currentLang={currentLang}
            onFileSelected={handleFileSelected}
            onSpeak={speech.speak}
            isSpeaking={speech.isPlaying && speech.activeKey === 'choose-input'}
          />
        )}

        {/* SCREEN 5: Preview & Confirm */}
        {currentScreen === SCREENS.PREVIEW && (
          <PreviewConfirmScreen
            t={t}
            currentLang={currentLang}
            file={selectedFile}
            previewUrl={previewUrl}
            onRetake={() => setCurrentScreen(SCREENS.CHOOSE_INPUT)}
            onConfirm={handleConfirmPreview}
            onSpeak={speech.speak}
            isSpeaking={speech.isPlaying && speech.activeKey === 'preview-guidance'}
          />
        )}

        {/* SCREEN 6: Processing Animation */}
        {currentScreen === SCREENS.PROCESSING && (
          <ProcessingScreen
            t={t}
            currentLang={currentLang}
            onSpeak={speech.speak}
            isSpeaking={speech.isPlaying && speech.activeKey === 'processing-guidance'}
          />
        )}

        {/* SCREEN 7 & 8: Result Screen */}
        {currentScreen === SCREENS.RESULT && explanationResult && (
          <ResultScreen
            t={t}
            result={explanationResult}
            currentLang={currentLang}
            speech={speech}
            onReset={handleReset}
            onGoHome={handleGoHome}
          />
        )}

        {/* SCREEN 10: Error Screen */}
        {currentScreen === SCREENS.ERROR && (
          <ErrorScreen
            t={t}
            errorType={errorDetails.type}
            customMessage={errorDetails.message}
            onRetakePhoto={() => setCurrentScreen(SCREENS.CHOOSE_INPUT)}
            onChooseAnother={() => setCurrentScreen(SCREENS.CHOOSE_INPUT)}
            onTryAgain={() => setCurrentScreen(SCREENS.CHOOSE_INPUT)}
            onGoHome={handleGoHome}
            onSpeak={speech.speak}
            isSpeaking={speech.isPlaying && speech.activeKey === 'error-guidance'}
            currentLang={currentLang}
          />
        )}

        {/* SCREEN 9: Step-by-Step Help Guide Modal */}
        {isHelpOpen && (
          <HelpModal
            t={t}
            currentLang={currentLang}
            onClose={() => setIsHelpOpen(false)}
            onSpeak={speech.speak}
            isSpeaking={speech.isPlaying && speech.activeKey === 'help-modal'}
          />
        )}

        {/* Privacy Notice Modal */}
        {isPrivacyOpen && (
          <PrivacyNoticeModal
            onClose={() => setIsPrivacyOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
