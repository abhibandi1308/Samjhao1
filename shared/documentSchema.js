/**
 * Samjhao - Structured Document Explanation Schema & Validator
 * Shared contract between Backend AI parser and Frontend UI
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', englishName: 'English', nativeLabel: 'English' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்', englishName: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'bn', name: 'বাংলা', englishName: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'mr', name: 'मराठी', englishName: 'Marathi', nativeLabel: 'मराठी' }
];

export const DOCUMENT_TYPES = [
  'Utility Bill (Electricity / Water / Gas)',
  'Household Receipt / Invoice',
  'Official / Community Notice',
  'Suspicious Message / SMS / Email',
  'Identity / Card / Document',
  'Medical Prescription (Unsupported)',
  'Other / Unclear Document'
];

/**
 * Validates and normalizes raw model response into guaranteed DocumentExplanationResult
 * @param {any} raw
 * @param {string} fallbackLang
 * @returns {Object} normalized result
 */
export function validateAndNormalizeResult(raw, fallbackLang = 'hi') {
  if (!raw || typeof raw !== 'object') {
    return createFallbackErrorResult('Invalid AI response structure', fallbackLang);
  }

  // Check for medical prescription refusal constraint
  const isMedical = Boolean(
    raw.isMedicalOrPrescription ||
    (raw.documentType && raw.documentType.toLowerCase().includes('prescription')) ||
    (raw.documentType && raw.documentType.toLowerCase().includes('medical'))
  );

  const defaultDocType = fallbackLang === 'te' ? 'పత్రం' : fallbackLang === 'ta' ? 'ஆவணம்' : fallbackLang === 'hi' ? 'दस्तावेज़' : 'Document';
  const defaultSummary = fallbackLang === 'te' ? 'పత్రం యొక్క విశ్లేషణ పూర్తయింది.' : fallbackLang === 'ta' ? 'ஆவண விளக்கம் முடிந்தது.' : fallbackLang === 'hi' ? 'दस्तावेज़ का विश्लेषण पूरा हुआ।' : 'Document analysis completed.';
  const defaultAction = fallbackLang === 'te' ? 'దయచేసి క్రింద ఇచ్చిన సమాచారాన్ని తనిఖీ చేయండి.' : fallbackLang === 'ta' ? 'கீழே உள்ள விவரங்களைச் சரிபார்க்கவும்.' : fallbackLang === 'hi' ? 'कृपया नीचे दी गई जानकारी की जाँच करें।' : 'Please check the details below.';
  const defaultLabel = fallbackLang === 'te' ? 'వివరాలు' : fallbackLang === 'ta' ? 'விவரம்' : fallbackLang === 'hi' ? 'विवरण' : 'Details';
  const defaultValue = fallbackLang === 'te' ? 'లభ్యం కాలేదు' : fallbackLang === 'ta' ? 'கிடைக்கவில்லை' : fallbackLang === 'hi' ? 'उपलब्ध नहीं' : 'Not available';
  const defaultLangName = fallbackLang === 'te' ? 'తెలుగు' : fallbackLang === 'ta' ? 'தமிழ்' : fallbackLang === 'hi' ? 'हिन्दी' : 'English';

  return {
    id: raw.id || `doc_${Date.now()}`,
    documentType: raw.documentType || 'General Document',
    documentTypeLocalized: raw.documentTypeLocalized || raw.documentType || defaultDocType,
    language: raw.language || fallbackLang,
    languageName: raw.languageName || defaultLangName,
    simpleSummary: raw.simpleSummary || defaultSummary,
    actionRequired: raw.actionRequired || defaultAction,
    keyDetails: Array.isArray(raw.keyDetails)
      ? raw.keyDetails.map(item => ({
          label: String(item.label || defaultLabel),
          value: String(item.value || defaultValue),
          explanation: String(item.explanation || ''),
          isUncertain: Boolean(item.isUncertain),
          uncertaintyReason: item.uncertaintyReason ? String(item.uncertaintyReason) : null,
          icon: item.icon || 'info'
        }))
      : [],
    warnings: Array.isArray(raw.warnings)
      ? raw.warnings.map(w => ({
          text: typeof w === 'string' ? w : String(w.text || ''),
          severity: w.severity || 'warning',
          isGeneralGuidance: Boolean(w.isGeneralGuidance)
        }))
      : [],
    uncertainFields: Array.isArray(raw.uncertainFields)
      ? raw.uncertainFields.map(String)
      : [],
    needsClearerPhoto: Boolean(raw.needsClearerPhoto),
    photoGuidance: raw.photoGuidance ? String(raw.photoGuidance) : null,
    isMedicalOrPrescription: isMedical,
    isSuspiciousMessage: Boolean(raw.isSuspiciousMessage),
    suspiciousSignals: Array.isArray(raw.suspiciousSignals)
      ? raw.suspiciousSignals.map(String)
      : [],
    fullSpokenText: raw.fullSpokenText || raw.simpleSummary || '',
    glossary: Array.isArray(raw.glossary)
      ? raw.glossary.map(g => ({
          term: String(g.term || ''),
          meaning: String(g.meaning || '')
        }))
      : []
  };
}

/**
 * Creates a graceful fallback result when processing encounters an error or blurry image
 */
export function createFallbackErrorResult(reason, lang = 'hi') {
  const isTelugu = lang === 'te';
  const isTamil = lang === 'ta';
  const isHindi = lang === 'hi';

  const docType = isTelugu ? 'అస్పష్టమైన పత్రం' : isTamil ? 'தெளிவற்ற ஆவணம்' : isHindi ? 'अस्पष्ट डॉक्यूमेंट' : 'Unclear Document';
  const langName = isTelugu ? 'తెలుగు' : isTamil ? 'தமிழ்' : isHindi ? 'हिन्दी' : 'English';
  const summary = isTelugu
    ? 'నేను ఈ పత్రాన్ని పూర్తిగా స్పష్టంగా చదవలేకపోయాను.'
    : isTamil
    ? 'என்னால் இந்த ஆவணத்தைத் தெளிவாகப் படிக்க முடியவில்லை.'
    : isHindi
    ? 'मैं इस डॉक्यूमेंट को पूरी तरह से साफ नहीं पढ़ पाया।'
    : 'Could not clearly read this document.';
  const action = isTelugu
    ? 'దయచేసి మంచి వెలుతురులో మొత్తం పత్రాన్ని స్పష్టంగా ఫోటో తీసి మళ్లీ పంపండి.'
    : isTamil
    ? 'தயவுசெய்து நல்ல வெளிச்சத்தில் முழு ஆவணத்தையும் தெளிவாகப் படம் பிடித்து மீண்டும் அனுப்பவும்.'
    : isHindi
    ? 'कृपया बेहतर रोशनी में पूरे डॉक्यूमेंट की सीधी फोटो लेकर दोबारा भेजें।'
    : 'Please retake a clear, well-lit photo of the entire document.';
  const warningText = isTelugu
    ? 'ఫోటో మసకగా లేదా కత్తిరించబడి ఉన్నందున కొన్ని వివరాలు తప్పిపోయి ఉండవచ్చు.'
    : isTamil
    ? 'படம் மங்கலாகவோ அல்லது வெட்டப்பட்டோ உள்ளதால் சில தகவல்கள் விடுபட்டிருக்கலாம்.'
    : isHindi
    ? 'फोटो धुंधली या कटी हुई होने के कारण कुछ जानकारी छूट सकती है।'
    : 'Document appears blurry or partially cut off.';
  const photoGuidance = isTelugu
    ? 'కెమెరాను పత్రంపై నేరుగా ఉంచండి మరియు నీడలు పడకుండా చూసుకోండి.'
    : isTamil
    ? 'கேமராவை ஆவணத்திற்கு நேராகப் பிடித்து, நிழல் விழாமல் பார்த்துக் கொள்ளுங்கள்.'
    : isHindi
    ? 'कैमरे को डॉक्यूमेंट के ठीक ऊपर रखें और सुनिश्चित करें कि कोई परछाई या चमक न हो।'
    : 'Hold camera directly above the document. Avoid shadows and glare.';
  const spoken = isTelugu
    ? 'క్షమించండి, ఈ ఫోటో స్పష్టంగా కనిపించడం లేదు. దయచేసి మంచి వెలుతురులో మళ్లీ ఫోటో తీయండి.'
    : isTamil
    ? 'மன்னிக்கவும், இந்த படம் தெளிவாகத் தெரியவில்லை. தயவுசெய்து நல்ல வெளிச்சத்தில் மீண்டும் படம் எடுக்கவும்.'
    : isHindi
    ? 'माफ़ कीजिए, यह तस्वीर साफ़ नहीं दिख रही है। कृपया अच्छी रोशनी में दोबारा फ़ोटो खींचें।'
    : 'Sorry, this image is not clear enough. Please retake a photo in good lighting.';

  return {
    id: `err_${Date.now()}`,
    documentType: docType,
    documentTypeLocalized: docType,
    language: lang,
    languageName: langName,
    simpleSummary: summary,
    actionRequired: action,
    keyDetails: [],
    warnings: [
      {
        text: warningText,
        severity: 'warning',
        isGeneralGuidance: true
      }
    ],
    uncertainFields: [isTelugu ? 'మొత్తం పత్రం' : isTamil ? 'முழு ஆவணம்' : isHindi ? 'संपूर्ण दस्तावेज़' : 'Whole document'],
    needsClearerPhoto: true,
    photoGuidance: photoGuidance,
    isMedicalOrPrescription: false,
    isSuspiciousMessage: false,
    suspiciousSignals: [],
    fullSpokenText: spoken,
    glossary: []
  };
}
