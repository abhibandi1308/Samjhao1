import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAndNormalizeResult, createFallbackErrorResult } from '../../shared/documentSchema.js';

// Pre-packaged realistic sample explanations for offline demo & reliable testing
const SAMPLE_MOCK_RESPONSES = {
  hi: {
    id: 'mock_bill_hi',
    documentType: 'बिजली का बिल (Electricity Bill)',
    documentTypeLocalized: 'बिजली बिल',
    language: 'hi',
    languageName: 'हिन्दी',
    simpleSummary: 'यह आपके घर का बिजली का बिल है। इस महीने आपने 142 यूनिट बिजली इस्तेमाल की है।',
    actionRequired: 'इस बिल की राशि ₹ 850 है, जिसे 25 अक्टूबर 2024 तक भुगतान करना है। यदि आपने पहले ही भुगतान कर दिया है तो इसे अनदेखा करें।',
    keyDetails: [
      {
        label: 'कुल राशि',
        value: '₹ 850',
        explanation: 'बिल की कुल देय राशि जो आपको भुगतान करनी है।',
        isUncertain: false,
        icon: 'currency'
      },
      {
        label: 'भुगतान की अंतिम तिथि',
        value: '25 अक्टूबर 2024',
        explanation: 'इस तारीख के बाद भुगतान करने पर विलंब शुल्क (late fee) लग सकता है।',
        isUncertain: false,
        icon: 'calendar'
      },
      {
        label: 'बिलिंग अवधि',
        value: '1 सित - 30 सित (30 दिन)',
        explanation: 'यह 30 दिनों का मासिक बिल है।',
        isUncertain: false,
        icon: 'clock'
      },
      {
        label: 'उपभोग की गई यूनिट',
        value: '142 Units',
        explanation: 'इस महीने आपने इतनी यूनिट बिजली खर्च की है।',
        isUncertain: false,
        icon: 'zap'
      },
      {
        label: 'उपभोक्ता संख्या (CA Number)',
        value: '100492819',
        explanation: 'ऑनलाइन भुगतान या शिकायत दर्ज करने के लिए यह नंबर चाहिए।',
        isUncertain: false,
        icon: 'hash'
      }
    ],
    warnings: [
      {
        text: 'अंतिम तिथि 25 अक्टूबर 2024 के बाद ₹50 का अतिरिक्त विलंब शुल्क लग सकता है।',
        severity: 'warning',
        isGeneralGuidance: false
      },
      {
        text: 'यदि आप पहले ही नेट बैंकिंग या UPI से भुगतान कर चुके हैं, तो बैंक रसीद संभाल कर रखें।',
        severity: 'info',
        isGeneralGuidance: true
      }
    ],
    uncertainFields: [],
    needsClearerPhoto: false,
    photoGuidance: null,
    isMedicalOrPrescription: false,
    isSuspiciousMessage: false,
    suspiciousSignals: [],
    fullSpokenText: 'यह आपके घर का बिजली का बिल है। कुल देय राशि आठ सौ पचास रुपये है। भुगतान की अंतिम तिथि पच्चीस अक्टूबर दो हज़ार चौबीस है। समय पर भुगतान करें ताकि पेनल्टी न लगे।',
    glossary: [
      { term: 'CA Number', meaning: 'उपभोक्ता खाता संख्या (Customer Account Number)' },
      { term: 'Surcharge', meaning: 'देरी से भुगतान करने पर लगने वाला अतिरिक्त जुर्माना' },
      { term: 'KWh', meaning: 'बिजली की यूनिट नापने की इकाई' }
    ]
  },
  en: {
    id: 'mock_bill_en',
    documentType: 'Utility Bill (Electricity)',
    documentTypeLocalized: 'Electricity Bill',
    language: 'en',
    languageName: 'English',
    simpleSummary: 'This is your monthly electricity utility bill for 142 units of power consumed.',
    actionRequired: 'The total amount due is ₹ 850, payable on or before 25 October 2024.',
    keyDetails: [
      {
        label: 'Total Due Amount',
        value: '₹ 850',
        explanation: 'Total payable amount for this billing cycle.',
        isUncertain: false,
        icon: 'currency'
      },
      {
        label: 'Payment Due Date',
        value: '25 October 2024',
        explanation: 'Paying after this date may incur a late payment surcharge.',
        isUncertain: false,
        icon: 'calendar'
      },
      {
        label: 'Billing Period',
        value: '01 Sep - 30 Sep (30 days)',
        explanation: 'One month electricity consumption.',
        isUncertain: false,
        icon: 'clock'
      },
      {
        label: 'Units Consumed',
        value: '142 KWh Units',
        explanation: 'Energy units measured by your meter.',
        isUncertain: false,
        icon: 'zap'
      },
      {
        label: 'Consumer Account (CA)',
        value: '100492819',
        explanation: 'Unique identifier required for online bill payments.',
        isUncertain: false,
        icon: 'hash'
      }
    ],
    warnings: [
      {
        text: 'Late payment surcharge of ₹50 applies after 25 October 2024.',
        severity: 'warning',
        isGeneralGuidance: false
      },
      {
        text: 'If already paid via UPI or card, please allow 24-48 hours for reconciliation.',
        severity: 'info',
        isGeneralGuidance: true
      }
    ],
    uncertainFields: [],
    needsClearerPhoto: false,
    photoGuidance: null,
    isMedicalOrPrescription: false,
    isSuspiciousMessage: false,
    suspiciousSignals: [],
    fullSpokenText: 'This is your monthly electricity bill. The total amount due is eight hundred and fifty rupees. The last date for payment is twenty fifth October twenty twenty four.',
    glossary: [
      { term: 'CA Number', meaning: 'Customer Account unique number for payments' },
      { term: 'Surcharge', meaning: 'Additional penalty fee applied if paid late' },
      { term: 'KWh', meaning: 'Kilowatt hour, the standard unit of electrical energy' }
    ]
  },
  te: {
    id: 'mock_bill_te',
    documentType: 'కరెంట్ బిల్లు (Electricity Bill)',
    documentTypeLocalized: 'కరెంట్ బిల్లు',
    language: 'te',
    languageName: 'తెలుగు',
    simpleSummary: 'ఇది మీ నెలవారీ కరెంట్ బిల్లు. ఈ నెలలో మీరు 142 యూనిట్ల విద్యుత్ ఉపయోగించారు.',
    actionRequired: 'ఈ బిల్లు మొత్తం ₹ 850, దీనిని 25 అక్టోబర్ 2024 లోగా చెల్లించాలి.',
    keyDetails: [
      { label: 'చెల్లించాల్సిన మొత్తం', value: '₹ 850', explanation: 'ఈ నెలకు చెల్లించవలసిన మొత్తం.', isUncertain: false, icon: 'currency' },
      { label: 'చివరి తేదీ', value: '25 అక్టోబర్ 2024', explanation: 'ఆలస్య రుసుము లేకుండా చెల్లించడానికి చివరి తేదీ.', isUncertain: false, icon: 'calendar' },
      { label: 'వినియోగించిన యూనిట్లు', value: '142 యూనిట్లు', explanation: 'మీ మీటర్ రీడింగ్ ప్రకారం వాడిన యూనిట్లు.', isUncertain: false, icon: 'zap' }
    ],
    warnings: [
      { text: '25 అక్టోబర్ 2024 తర్వాత చెల్లిస్తే ₹50 ఆలస్య రుసుము విధించబడుతుంది.', severity: 'warning', isGeneralGuidance: false }
    ],
    uncertainFields: [],
    needsClearerPhoto: false,
    photoGuidance: null,
    isMedicalOrPrescription: false,
    isSuspiciousMessage: false,
    suspiciousSignals: [],
    fullSpokenText: 'ఇది మీ నెలవారీ కరెంట్ బిల్లు. మొత్తం చెల్లించాల్సిన మొత్తం ఎనిమిది వందల యాభై రూపాయలు. చెల్లించడానికి చివరి తేదీ ఇరవై ఐదు అక్టోబర్ రెండు వేల ఇరవై నాలుగు.',
    glossary: [
      { term: 'CA Number', meaning: 'వినియోగదారు ఖాతా సంఖ్య' }
    ]
  },
  gu: {
    id: 'mock_bill_gu',
    documentType: 'લાઈટ બિલ (Electricity Bill)',
    documentTypeLocalized: 'લાઈટ બિલ',
    language: 'gu',
    languageName: 'ગુજરાતી',
    simpleSummary: 'આ તમારા ઘરનું લાઈટ બિલ છે. આ મહિને તમે 142 યુનિટ વીજળી વાપરી છે.',
    actionRequired: 'આ બિલની કુલ રકમ ₹ 850 છે, જે 25 ઑક્ટોબર 2024 સુધીમાં ભરવાની રહેશે.',
    keyDetails: [
      { label: 'કુલ ભરવાની રકમ', value: '₹ 850', explanation: 'આ બિલની કુલ ભરવાપાત્ર રકમ.', isUncertain: false, icon: 'currency' },
      { label: 'છેલ્લી તારીખ', value: '25 ઑક્ટોબર 2024', explanation: 'દંડ વગર ભરવાની છેલ્લી તારીખ.', isUncertain: false, icon: 'calendar' },
      { label: 'વાપરેલા યુનિટ', value: '142 Units', explanation: 'મીટર મુજબ વપરાયેલ વીજળીના યુનિટ.', isUncertain: false, icon: 'zap' }
    ],
    warnings: [
      { text: '25 ઑક્ટોબર 2024 પછી બિલ ભરવા પર ₹50 લેટ ફી લાગી શકે છે.', severity: 'warning', isGeneralGuidance: false }
    ],
    uncertainFields: [],
    needsClearerPhoto: false,
    photoGuidance: null,
    isMedicalOrPrescription: false,
    isSuspiciousMessage: false,
    suspiciousSignals: [],
    fullSpokenText: 'આ તમારું લાઈટ બિલ છે. કુલ ભરવાની રકમ આઠસો પચાસ રૂપિયા છે. બિલ ભરવાની છેલ્લી તારીખ પચ્ચીસ ઑક્ટોબર બે હજાર ચોવીસ છે.',
    glossary: [
      { term: 'CA Number', meaning: 'ગ્રાહક ખાતા નંબર' }
    ]
  }
};

/**
 * System instruction prompt strictly forbidding hallucination, medical advice, and false certainty
 */
const SYSTEM_INSTRUCTION = `You are "Samjhao", an empathetic, highly accurate AI assistant designed to help everyday citizens, elders, and families understand documents such as bills, receipts, notices, and messages.

CRITICAL SAFETY & RELIABILITY RULES:
1. MEDICAL PRESCRIPTION REFUSAL:
   - If the uploaded image is a medical prescription, doctor note, or pharmaceutical dosage instruction, you MUST IMMEDIATELY set "isMedicalOrPrescription": true.
   - In "simpleSummary", state clearly in the requested language: "Samjhao cannot interpret medical prescriptions or provide medical advice. Please consult a qualified doctor or pharmacist."
   - DO NOT transcribe dosages, medicine names, or medical directions.

2. NEVER INVENT OR GUESS VALUES:
   - If a date, amount, account number, or name is blurred, cut off, folded, or unreadable, mark "isUncertain": true and add the field name to "uncertainFields".
   - If the entire image is too blurry, dark, or unreadable to be reliable, set "needsClearerPhoto": true and provide friendly guidance in "photoGuidance".

3. SUSPICIOUS MESSAGE & SCAM DETECTION:
   - If the image shows a screenshot of a suspicious SMS, WhatsApp message, email, or lucky draw/lottery claiming prize money, electricity disconnection threat, or asking for OTP / APK install:
     - Set "isSuspiciousMessage": true.
     - List the danger signals under "suspiciousSignals".
     - NEVER declare a message "definitely safe". Clearly mark safety tips as general safety guidance ("isGeneralGuidance": true).

4. NEVER CLAIM AUTHENTICITY VERIFICATION:
   - Do not claim that you verify whether a government or commercial document is genuine or counterfeit.

5. OUTPUT FORMAT:
   - You MUST output ONLY valid JSON matching the exact schema requested. No markdown wrapping outside the JSON, no intro text.
   - All explanations and summaries MUST be written in the user's requested language.`;

/**
 * Explain document using Google Gemini Vision API or fallback demo mode
 * @param {Object} params
 * @param {Buffer} [params.fileBuffer] - In-memory image buffer
 * @param {string} [params.mimeType] - Mime type of the image
 * @param {string} [params.language] - Target language code ('hi', 'en', 'te', 'gu')
 * @returns {Promise<Object>} Validated structured result
 */
export async function explainDocument({ fileBuffer, mimeType, language = 'hi' }) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Graceful offline mock mode when API key is missing
  if (!apiKey || apiKey.trim() === '') {
    console.log(`ℹ️ [Samjhao] GEMINI_API_KEY not configured. Using high-fidelity mock engine for lang="${language}".`);
    const mock = SAMPLE_MOCK_RESPONSES[language] || SAMPLE_MOCK_RESPONSES.en;
    return validateAndNormalizeResult(mock, language);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash or gemini-2.5-flash for fast multimodal vision
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1 // Low temperature for high factual accuracy
      }
    });

    const prompt = `Analyze this document image carefully. Explain it simply and clearly in ${language === 'hi' ? 'Hindi (हिन्दी)' : language === 'te' ? 'Telugu' : language === 'gu' ? 'Gujarati' : 'English'}.
Return a JSON object adhering to this schema:
{
  "documentType": string,
  "documentTypeLocalized": string,
  "language": "${language}",
  "languageName": string,
  "simpleSummary": string (2-3 simple sentences for elders/families),
  "actionRequired": string (what to do next, e.g. amount to pay, due date, or no action),
  "keyDetails": [
    {
      "label": string,
      "value": string,
      "explanation": string,
      "isUncertain": boolean,
      "uncertaintyReason": string or null,
      "icon": "currency" | "calendar" | "clock" | "zap" | "hash" | "file" | "alert" | "info"
    }
  ],
  "warnings": [
    {
      "text": string,
      "severity": "urgent" | "warning" | "info",
      "isGeneralGuidance": boolean
    }
  ],
  "uncertainFields": string[],
  "needsClearerPhoto": boolean,
  "photoGuidance": string or null,
  "isMedicalOrPrescription": boolean,
  "isSuspiciousMessage": boolean,
  "suspiciousSignals": string[],
  "fullSpokenText": string (a natural, warm text designed to be read aloud via Text-to-Speech),
  "glossary": [
    { "term": string, "meaning": string }
  ]
}`;

    const imagePart = {
      inlineData: {
        data: fileBuffer.toString('base64'),
        mimeType: mimeType || 'image/jpeg'
      }
    };

    const response = await model.generateContent([prompt, imagePart]);
    const rawText = response.response.text();
    const parsed = JSON.parse(rawText);

    return validateAndNormalizeResult(parsed, language);
  } catch (err) {
    console.error('❌ [Samjhao] AI Processing Error:', err.message);
    return createFallbackErrorResult(err.message, language);
  }
}
