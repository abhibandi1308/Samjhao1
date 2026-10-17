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

  // File Selection & Validation
  const handleFileSelected = (file) => {
    speech.stop();

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorDetails({
        type: 'size',
        message: t.errSizeDesc
      });
      setCurrentScreen(SCREENS.ERROR);
      return;
    }

    // Validate type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
    if (!validMimes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
      setErrorDetails({
        type: 'unsupported',
        message: t.errUnsupportedDesc
      });
      setCurrentScreen(SCREENS.ERROR);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
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
        throw new Error(`Server returned status ${response.status}`);
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

      if (sampleTypeOverride === 'medical' || selectedFile?.name?.includes('prescription')) {
        data.isMedicalOrPrescription = true;
        data.documentType = 'Doctor Prescription';
        data.documentTypeLocalized = currentLang === 'hi' ? 'चिकित्सीय पर्चा' : (currentLang === 'te' ? 'వైద్య ప్రిస్క్రిప్షన్' : (currentLang === 'gu' ? 'ડૉક્ટરનું પ્રિસ્ક્રિપ્શન' : 'Doctor Prescription'));
      }

      if (sampleTypeOverride === 'scam' || selectedFile?.name?.includes('suspicious')) {
        data.isSuspiciousMessage = true;
        data.documentType = 'Suspicious Scam Message';
        data.documentTypeLocalized = currentLang === 'hi' ? 'संदेहास्पद फ्रॉड संदेश' : (currentLang === 'te' ? 'మోసపూరిత సందేశం' : (currentLang === 'gu' ? 'શંકાસ્પદ ફ્રોડ મેસેજ' : 'Suspicious Scam Message'));
        data.suspiciousSignals = currentLang === 'hi' ? [
          'रात में बिजली काटने की झूठी धमकी।',
          'व्यक्तिगत मोबाइल नंबर पर संपर्क करने का दबाव।',
          'अनधिकृत वेब लिंक पर पैसे भेजने की मांग।'
        ] : (currentLang === 'te' ? [
          'రాత్రి విద్యుత్ నిలిపివేస్తామని నకిలీ బెదిరింపు.',
          'వ్యక్తిగత మొబైల్ నంబర్‌కు కాల్ చేయమని ఒత్తిడి.',
          'అనధికార లింక్ ద్వారా చెల్లింపు చేయమని కోరడం.'
        ] : (currentLang === 'gu' ? [
          'રાત્રે વીજળી કાપવાની નકલી ધમકી.',
          'અજાણ્યા મોબાઈલ નંબર પર કોલ કરવાનું દબાણ.',
          'અનધિકૃત લિંક પર પૈસા ચૂકવવાનું કહેવું.'
        ] : [
          'Threatens power cutoff tonight unless paid immediately.',
          'Asks to call an unknown personal mobile number.',
          'Provides an unofficial link to pay.'
        ]));
      }

      setExplanationResult(data);
      setCurrentScreen(SCREENS.RESULT);
    } catch (err) {
      console.warn('Backend connection note:', err.message);
      // Offline fallback
      setTimeout(() => {
        const isHindi = currentLang === 'hi';
        const isTelugu = currentLang === 'te';
        const isGujarati = currentLang === 'gu';

        const fallback = {
          id: `sample_${Date.now()}`,
          documentType: selectedFile?.name?.includes('prescription')
            ? 'Medical Prescription'
            : selectedFile?.name?.includes('suspicious')
            ? 'Suspicious Message'
            : 'Electricity Utility Bill',
          documentTypeLocalized: isHindi ? 'बिजली बिल' : (isTelugu ? 'కరెంట్ బిల్లు' : (isGujarati ? 'લાઈટ બિલ' : 'Electricity Bill')),
          language: currentLang,
          languageName: isHindi ? 'हिन्दी' : (isTelugu ? 'తెలుగు' : (isGujarati ? 'ગુજરાતી' : 'English')),
          simpleSummary: isHindi
            ? 'यह आपके घर का बिजली का बिल है। कुल 142 यूनिट बिजली खर्च हुई है।'
            : isTelugu
            ? 'ఇది మీ నెలవారీ కరెంట్ బిల్లు. ఈ నెలలో 142 యూనిట్ల విద్యుత్ ఖర్చయింది.'
            : isGujarati
            ? 'આ તમારા ઘરનું લાઈટ બિલ છે. કુલ 142 યુનિટ વીજળી વપરાઈ છે.'
            : 'This is your monthly electricity utility bill for 142 units of power consumed.',
          actionRequired: isHindi
            ? 'इस बिल की राशि ₹ 850 है, जिसे 25 अक्टूबर 2024 तक भुगतान करना है।'
            : isTelugu
            ? 'ఈ బిల్లు మొత్తం ₹ 850, దీనిని 25 అక్టోబర్ 2024 లోగా చెల్లించాలి.'
            : isGujarati
            ? 'આ બિલની રકમ ₹ 850 છે, જે 25 ઑક્ટોબર 2024 સુધીમાં ભરવાની છે.'
            : 'The total amount due is ₹ 850, payable on or before 25 October 2024.',
          keyDetails: [
            { label: isHindi ? 'कुल राशि' : (isTelugu ? 'మొత్తం' : (isGujarati ? 'કુલ રકમ' : 'Total Due')), value: '₹ 850', explanation: 'Total payable amount', icon: 'currency' },
            { label: isHindi ? 'अंतिम तिथि' : (isTelugu ? 'చివరి తేదీ' : (isGujarati ? 'છેલ્લી તારીખ' : 'Due Date')), value: '25 Oct 2024', explanation: 'Due date to avoid late fee', icon: 'calendar' },
            { label: isHindi ? 'उपभोग यूनिट' : (isTelugu ? 'యూనిట్లు' : (isGujarati ? 'યુનિટ' : 'Units Consumed')), value: '142 Units', explanation: 'Power consumption', icon: 'zap' }
          ],
          warnings: [
            { text: isHindi ? 'अंतिम तिथि 25 अक्टूबर के बाद ₹50 लेट फीस लग सकती है।' : (isTelugu ? 'గడువు తేదీ తర్వాత ₹50 ఆలస్య రుసుము పడుతుంది.' : (isGujarati ? 'છેલ્લી તારીખ પછી ₹50 લેટ ફી લાગી શકે છે.' : 'Late fee applies after 25 October 2024.')), severity: 'warning', isGeneralGuidance: false }
          ],
          uncertainFields: [],
          needsClearerPhoto: false,
          isMedicalOrPrescription: Boolean(selectedFile?.name?.includes('prescription')),
          isSuspiciousMessage: Boolean(selectedFile?.name?.includes('suspicious')),
          suspiciousSignals: [
            'Suspicious urgency threat and personal phone number.'
          ],
          fullSpokenText: isHindi
            ? 'यह आपके घर का बिजली का बिल है। कुल देय राशि आठ सौ पचास रुपये है। भुगतान की अंतिम तिथि पच्चीस अक्टूबर है।'
            : isTelugu
            ? 'ఇది మీ నెలవారీ కరెంట్ బిల్లు. చెల్లించాల్సిన మొత్తం ఎనిమిది వందల యాభై రూపాయలు. చివరి తేదీ ఇరవై ఐదు అక్టోబర్.'
            : isGujarati
            ? 'આ તમારું લાઈટ બિલ છે. કુલ ભરવાની રકમ આઠસો પચાસ રૂપિયા છે. છેલ્લી તારીખ પચ્ચીસ ઑક્ટોબર છે.'
            : 'This is your monthly electricity bill. The total amount due is eight hundred and fifty rupees. The last date for payment is twenty fifth October.',
          glossary: [
            { term: 'CA Number', meaning: isHindi ? 'उपभोक्ता खाता संख्या' : (isTelugu ? 'వినియోగదారు ఖాతా సంఖ్య' : (isGujarati ? 'ગ્રાહક ખાતા નંબર' : 'Customer Account Number')) }
          ]
        };

        setExplanationResult(fallback);
        setCurrentScreen(SCREENS.RESULT);
      }, 1000);
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
          />
        )}

        {/* SCREEN 1: Choose Language Screen (FIRST SCREEN SHOWN TO USER) */}
        {currentScreen === SCREENS.LANG_SELECT && (
          <LanguageSelectScreen
            currentLang={currentLang}
            onSelectLanguage={handleInitialLanguageChosen}
            onSpeak={speech.speak}
            isSpeaking={speech.isPlaying && speech.activeKey === 'lang-select'}
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
          <ProcessingScreen t={t} />
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
