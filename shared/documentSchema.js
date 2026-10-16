/**
 * Samjhao - Structured Document Explanation Schema & Validator
 * Shared contract between Backend AI parser and Frontend UI
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'en', name: 'English', englishName: 'English', nativeLabel: 'English' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'gu', name: 'ગુજરાતી', englishName: 'Gujarati', nativeLabel: 'ગુજરાતી' },
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

  return {
    id: raw.id || `doc_${Date.now()}`,
    documentType: raw.documentType || 'General Document',
    documentTypeLocalized: raw.documentTypeLocalized || raw.documentType || 'डॉक्यूमेंट',
    language: raw.language || fallbackLang,
    languageName: raw.languageName || (fallbackLang === 'hi' ? 'हिन्दी' : 'English'),
    simpleSummary: raw.simpleSummary || 'डॉक्यूमेंट का विश्लेषण पूरा हुआ।',
    actionRequired: raw.actionRequired || 'कृपया नीचे दी गई जानकारी की जाँच करें।',
    keyDetails: Array.isArray(raw.keyDetails)
      ? raw.keyDetails.map(item => ({
          label: String(item.label || 'विवरण'),
          value: String(item.value || 'उपलब्ध नहीं'),
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
  const isHindi = lang === 'hi';
  return {
    id: `err_${Date.now()}`,
    documentType: isHindi ? 'अस्पष्ट डॉक्यूमेंट' : 'Unclear Document',
    documentTypeLocalized: isHindi ? 'अस्पष्ट डॉक्यूमेंट' : 'Unclear Document',
    language: lang,
    languageName: isHindi ? 'हिन्दी' : 'English',
    simpleSummary: isHindi
      ? 'मैं इस डॉक्यूमेंट को पूरी तरह से साफ नहीं पढ़ पाया।'
      : 'Could not clearly read this document.',
    actionRequired: isHindi
      ? 'कृपया बेहतर रोशनी में पूरे डॉक्यूमेंट की सीधी फोटो लेकर दोबारा भेजें।'
      : 'Please retake a clear, well-lit photo of the entire document.',
    keyDetails: [],
    warnings: [
      {
        text: isHindi
          ? 'फोटो धुंधली या कटी हुई होने के कारण कुछ जानकारी छूट सकती है।'
          : 'Document appears blurry or partially cut off.',
        severity: 'warning',
        isGeneralGuidance: true
      }
    ],
    uncertainFields: ['संपूर्ण दस्तावेज़ / Whole document'],
    needsClearerPhoto: true,
    photoGuidance: isHindi
      ? 'कैमरे को डॉक्यूमेंट के ठीक ऊपर रखें और सुनिश्चित करें कि कोई परछाई या चमक न हो।'
      : 'Hold camera directly above the document. Avoid shadows and glare.',
    isMedicalOrPrescription: false,
    isSuspiciousMessage: false,
    suspiciousSignals: [],
    fullSpokenText: isHindi
      ? 'माफ़ कीजिए, यह तस्वीर साफ़ नहीं दिख रही है। कृपया अच्छी रोशनी में दोबारा फ़ोटो खींचें।'
      : 'Sorry, this image is not clear enough. Please retake a photo in good lighting.',
    glossary: []
  };
}
