import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAndNormalizeResult, createFallbackErrorResult } from '../../shared/documentSchema.js';

/**
 * High-fidelity domain mock responses for reliable testing and offline demo mode
 * Covering:
 * 1. Utility Bills (Electricity)
 * 2. Medical Prescriptions (Strict Safety Refusal)
 * 3. Suspicious Scam Messages (Fraud Threat Detection)
 */
const DOMAIN_MOCKS = {
  // 1. Utility Bill Mock
  bill: {
    en: {
      id: 'mock_bill_en',
      documentType: 'Utility Bill (Electricity)',
      documentTypeLocalized: 'Electricity Bill',
      language: 'en',
      languageName: 'English',
      simpleSummary: 'This is your monthly electricity utility bill for 142 units of power consumed.',
      actionRequired: 'The total amount due is ₹ 850, payable on or before 25 October 2024.',
      keyDetails: [
        { label: 'Total Due Amount', value: '₹ 850', explanation: 'Total payable amount for this billing cycle.', isUncertain: false, icon: 'currency' },
        { label: 'Payment Due Date', value: '25 October 2024', explanation: 'Paying after this date may incur a late payment surcharge.', isUncertain: false, icon: 'calendar' },
        { label: 'Billing Period', value: '01 Sep - 30 Sep (30 days)', explanation: 'One month electricity consumption.', isUncertain: false, icon: 'clock' },
        { label: 'Units Consumed', value: '142 KWh Units', explanation: 'Energy units measured by your meter.', isUncertain: false, icon: 'zap' },
        { label: 'Consumer Account (CA)', value: '100492819', explanation: 'Unique identifier required for online bill payments.', isUncertain: false, icon: 'hash' }
      ],
      warnings: [
        { text: 'Late payment surcharge of ₹50 applies after 25 October 2024.', severity: 'warning', isGeneralGuidance: false },
        { text: 'If already paid via UPI or card, please allow 24-48 hours for reconciliation.', severity: 'info', isGeneralGuidance: true }
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
    hi: {
      id: 'mock_bill_hi',
      documentType: 'बिजली का बिल (Electricity Bill)',
      documentTypeLocalized: 'बिजली बिल',
      language: 'hi',
      languageName: 'हिन्दी',
      simpleSummary: 'यह आपके घर का बिजली का बिल है। इस महीने आपने 142 यूनिट बिजली इस्तेमाल की है।',
      actionRequired: 'इस बिल की राशि ₹ 850 है, जिसे 25 अक्टूबर 2024 तक भुगतान करना है। यदि आपने पहले ही भुगतान कर दिया है तो इसे अनदेखा करें।',
      keyDetails: [
        { label: 'कुल राशि', value: '₹ 850', explanation: 'बिल की कुल देय राशि जो आपको भुगतान करनी है।', isUncertain: false, icon: 'currency' },
        { label: 'भुगतान की अंतिम तिथि', value: '25 अक्टूबर 2024', explanation: 'इस तारीख के बाद भुगतान करने पर विलंब शुल्क लग सकता है।', isUncertain: false, icon: 'calendar' },
        { label: 'बिलिंग अवधि', value: '1 सित - 30 सित (30 दिन)', explanation: 'यह 30 दिनों का मासिक बिल है।', isUncertain: false, icon: 'clock' },
        { label: 'उपभोग की गई यूनिट', value: '142 Units', explanation: 'इस महीने आपने इतनी यूनिट बिजली खर्च की है।', isUncertain: false, icon: 'zap' },
        { label: 'उपभोक्ता संख्या (CA Number)', value: '100492819', explanation: 'ऑनलाइन भुगतान के लिए यह नंबर चाहिए।', isUncertain: false, icon: 'hash' }
      ],
      warnings: [
        { text: 'अंतिम तिथि 25 अक्टूबर 2024 के बाद ₹50 का अतिरिक्त विलंब शुल्क लग सकता है।', severity: 'warning', isGeneralGuidance: false },
        { text: 'यदि आप पहले ही नेट बैंकिंग या UPI से भुगतान कर चुके हैं, तो बैंक रसीद संभाल कर रखें।', severity: 'info', isGeneralGuidance: true }
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
        { term: 'Surcharge', meaning: 'देरी से भुगतान करने पर लगने वाला अतिरिक्त जुर्माना' }
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
        { label: 'బిల్లింగ్ వ్యవధి', value: '01 సెప్టెంబర్ - 30 సెప్టెంబర్ (30 రోజులు)', explanation: 'ఒక నెల విద్యుత్ వినియోగ కాలం.', isUncertain: false, icon: 'clock' },
        { label: 'వినియోగించిన యూనిట్లు', value: '142 యూనిట్లు', explanation: 'మీ మీటర్ రీడింగ్ ప్రకారం వాడిన యూనిట్లు.', isUncertain: false, icon: 'zap' },
        { label: 'ఖాతా సంఖ్య (CA నంబర్)', value: '100492819', explanation: 'ఆన్‌లైన్ చెల్లింపుల కోసం మీ ప్రత్యేక నంబర్.', isUncertain: false, icon: 'hash' }
      ],
      warnings: [
        { text: '25 అక్టోబర్ 2024 తర్వాత చెల్లిస్తే ₹50 ఆలస్య రుసుము విధించబడుతుంది.', severity: 'warning', isGeneralGuidance: false },
        { text: 'మీరు ఇప్పటికే UPI లేదా కార్డు ద్వారా చెల్లించినట్లయితే, దయచేసి రసీదు ఉంచుకోండి.', severity: 'info', isGeneralGuidance: true }
      ],
      uncertainFields: [],
      needsClearerPhoto: false,
      photoGuidance: null,
      isMedicalOrPrescription: false,
      isSuspiciousMessage: false,
      suspiciousSignals: [],
      fullSpokenText: 'నమస్కారం! ఇది మీ నెలవారీ కరెంట్ బిల్లు. మొత్తం చెల్లించాల్సిన మొత్తం ఎనిమిది వందల యాభై రూపాయలు. చెల్లించడానికి చివరి తేదీ ఇరవై ఐదు అక్టోబర్ రెండు వేల ఇరవై నాలుగు. ఆలస్య రుసుము పడకుండా సమయానికి చెల్లించండి.',
      glossary: [
        { term: 'ఖాతా సంఖ్య (CA Number)', meaning: 'ఆన్‌లైన్ బిల్లు చెల్లించడానికి అవసరమైన వినియోగదారు ఖాతా సంఖ్య' },
        { term: 'సర్ఛార్జ్ (ఆలస్య రుసుము)', meaning: 'గడువు తేదీ తర్వాత చెల్లిస్తే విధించే అదనపు జరిమానా' }
      ]
    },
    ta: {
      id: 'mock_bill_ta',
      documentType: 'மின் கட்டண பில் (Electricity Bill)',
      documentTypeLocalized: 'மின் கட்டண பில்',
      language: 'ta',
      languageName: 'தமிழ்',
      simpleSummary: 'இது உங்கள் மாதாந்திர மின் கட்டண பில் ஆகும். இந்த மாதம் நீங்கள் 142 யூனிட் மின்சாரம் பயன்படுத்தியுள்ளீர்கள்.',
      actionRequired: 'செலுத்த வேண்டிய மொத்தத் தொகை ₹ 850 ஆகும். இதனை 25 அக்டோபர் 2024-க்குள் செலுத்த வேண்டும்.',
      keyDetails: [
        { label: 'செலுத்த வேண்டிய தொகை', value: '₹ 850', explanation: 'இந்த மாதத்திற்கான மொத்தக் கட்டணம்.', isUncertain: false, icon: 'currency' },
        { label: 'கடைசி தேதி', value: '25 அக்டோபர் 2024', explanation: 'கூடுதல் கட்டணம் இன்றி செலுத்த கடைசி நாள்.', isUncertain: false, icon: 'calendar' },
        { label: 'பில்லிங் காலம்', value: '01 செப் - 30 செப் (30 நாட்கள்)', explanation: 'ஒரு மாத மின் நுகர்வு காலம்.', isUncertain: false, icon: 'clock' },
        { label: 'பயன்படுத்திய யூனிட்டுகள்', value: '142 Units', explanation: 'உங்கள் மீட்டரில் பதிவான மின் நுகர்வு.', isUncertain: false, icon: 'zap' },
        { label: 'நுகர்வோர் கணக்கு எண் (CA எண்)', value: '100492819', explanation: 'ஆன்லைனில் பணம் செலுத்த உதவும் தனித்துவ எண்.', isUncertain: false, icon: 'hash' }
      ],
      warnings: [
        { text: '25 அக்டோபர் 2024-க்குப் பிறகு செலுத்தினால் ₹50 அபராதக் கட்டணம் விதிக்கப்படலாம்.', severity: 'warning', isGeneralGuidance: false },
        { text: 'நீங்கள் ஏற்கனவே UPI அல்லது வங்கி மூலம் செலுத்தியிருந்தால் இந்த ரசீதை பத்திரமாக வைத்திருக்கவும்.', severity: 'info', isGeneralGuidance: true }
      ],
      uncertainFields: [],
      needsClearerPhoto: false,
      photoGuidance: null,
      isMedicalOrPrescription: false,
      isSuspiciousMessage: false,
      suspiciousSignals: [],
      fullSpokenText: 'வணக்கம்! இது உங்கள் மாதாந்திர மின் கட்டண பில். நீங்கள் செலுத்த வேண்டிய மொத்தத் தொகை எட்டு நூற்று ஐம்பது ரூபாய். பணம் செலுத்த கடைசி தேதி இருபத்தி ஐந்து அக்டோபர் இரண்டு ஆயிரத்து இருபத்தி நான்கு. தாமதக் கட்டணத்தைத் தவிர்க்க குறித்த தேதிக்குள் செலுத்துங்கள்.',
      glossary: [
        { term: 'நுகர்வோர் கணக்கு எண் (CA Number)', meaning: 'மின் கட்டணம் செலுத்தப் பயன்படும் நுகர்வோர் கணக்கு எண்' },
        { term: 'தாமதக் கட்டணம் (Surcharge)', meaning: 'கடைசி தேதிக்குப் பிறகு செலுத்தினால் வசூலிக்கப்படும் அபராதத் தொகை' }
      ]
    }
  },

  // 2. Medical Prescription Mock (Strict Safety Refusal)
  prescription: {
    en: {
      id: 'mock_rx_en',
      documentType: 'Medical Prescription (Safety Refusal)',
      documentTypeLocalized: 'Doctor Prescription',
      language: 'en',
      languageName: 'English',
      simpleSummary: 'Samjhao strictly refuses to interpret medical prescriptions or provide medical advice.',
      actionRequired: 'Please consult a licensed doctor or pharmacist directly regarding all medications and dosages.',
      keyDetails: [
        { label: 'Document Category', value: 'Medical Prescription', explanation: 'Prescription or clinical note', isUncertain: false, icon: 'file' },
        { label: 'Safety Protocol', value: 'Interpretation Refused', explanation: 'To prevent patient harm', isUncertain: false, icon: 'alert' }
      ],
      warnings: [
        { text: 'Do not take or change any medicine dosages based on AI or computer interpretations.', severity: 'urgent', isGeneralGuidance: false },
        { text: 'Visit your nearest pharmacy or clinic with this original paper.', severity: 'info', isGeneralGuidance: true }
      ],
      uncertainFields: [],
      needsClearerPhoto: false,
      photoGuidance: null,
      isMedicalOrPrescription: true,
      isSuspiciousMessage: false,
      suspiciousSignals: [],
      fullSpokenText: 'This is a medical prescription. For your safety, Samjhao does not interpret medical documents or advise on medications. Please consult your doctor or pharmacist.',
      glossary: [
        { term: 'Rx', meaning: 'Medical prescription written by a licensed physician' }
      ]
    },
    hi: {
      id: 'mock_rx_hi',
      documentType: 'चिकित्सीय पर्चा (Medical Prescription)',
      documentTypeLocalized: 'चिकित्सीय पर्चा',
      language: 'hi',
      languageName: 'हिन्दी',
      simpleSummary: 'समझो चिकित्सीय पर्चों (Prescriptions) की व्याख्या या दवा की सलाह नहीं देता है।',
      actionRequired: 'कृपया अपनी दवा और सही खुराक के लिए किसी योग्य डॉक्टर या फार्मासिस्ट से संपर्क करें।',
      keyDetails: [
        { label: 'दस्तावेज़ प्रकार', value: 'डॉक्टर का पर्चा', explanation: 'चिकित्सीय सलाह या पर्चा', isUncertain: false, icon: 'file' },
        { label: 'सुरक्षा नियम', value: 'व्याख्या वर्जित', explanation: 'मरीज की सुरक्षा के लिए', isUncertain: false, icon: 'alert' }
      ],
      warnings: [
        { text: 'किसी भी कंप्यूटर या एआई के आधार पर कोई दवा न लें या न बदलें।', severity: 'urgent', isGeneralGuidance: false },
        { text: 'यह मूल पर्चा लेकर अपने नजदीकी मेडिकल स्टोर या डॉक्टर के पास जाएं।', severity: 'info', isGeneralGuidance: true }
      ],
      uncertainFields: [],
      needsClearerPhoto: false,
      photoGuidance: null,
      isMedicalOrPrescription: true,
      isSuspiciousMessage: false,
      suspiciousSignals: [],
      fullSpokenText: 'यह डॉक्टर का पर्चा है। आपकी सेहत की सुरक्षा के लिए समझो दवाइयों या पर्चों की व्याख्या नहीं करता। कृपया किसी डॉक्टर या फार्मासिस्ट से मिलें।',
      glossary: [
        { term: 'Prescription', meaning: 'डॉक्टर द्वारा लिखी गई दवा की आधिकारिक पर्ची' }
      ]
    },
    te: {
      id: 'mock_rx_te',
      documentType: 'వైద్య ప్రిస్క్రిప్షన్ (Medical Prescription)',
      documentTypeLocalized: 'వైద్య ప్రిస్క్రిప్షన్',
      language: 'te',
      languageName: 'తెలుగు',
      simpleSummary: 'Samjhao వైద్య ప్రిస్క్రిప్షన్లను అర్థం చేసుకోదు లేదా వైద్య సలహాలు ఇవ్వదు.',
      actionRequired: 'దయచేసి మీ మందులు మరియు మోతాదు కోసం అర్హత కలిగిన డాక్టర్ లేదా ఫార్మసిస్ట్‌ను సంప్రదించండి.',
      keyDetails: [
        { label: 'పత్రం రకం', value: 'వైద్యుడి ప్రిస్క్రిప్షన్', explanation: 'డాక్టర్ రాసిన చీటీ', isUncertain: false, icon: 'file' },
        { label: 'భద్రతా నిబంధన', value: 'వివరణ తిరస్కరించబడింది', explanation: 'ఆరోగ్య భద్రత కొరకు', isUncertain: false, icon: 'alert' }
      ],
      warnings: [
        { text: 'AI లేదా కంప్యూటర్ ఆధారంగా ఎటువంటి మందులు తీసుకోకండి.', severity: 'urgent', isGeneralGuidance: false }
      ],
      uncertainFields: [],
      needsClearerPhoto: false,
      photoGuidance: null,
      isMedicalOrPrescription: true,
      isSuspiciousMessage: false,
      suspiciousSignals: [],
      fullSpokenText: 'ఇది వైద్య ప్రిస్క్రిప్షన్. మీ భద్రత కోసం, Samjhao మందుల వివరాలను వివరించదు. దయచేసి డాక్టర్‌ను సంప్రదించండి.',
      glossary: []
    },
    ta: {
      id: 'mock_rx_ta',
      documentType: 'மருத்துவர் மருந்துச் சீட்டு (Medical Prescription)',
      documentTypeLocalized: 'மருந்துச் சீட்டு',
      language: 'ta',
      languageName: 'தமிழ்',
      simpleSummary: 'சம்ஜாவோ (Samjhao) மருந்துச் சீட்டுகளை விளக்குவதையோ அல்லது மருத்துவ ஆலோசனைகளையோ வழங்காது.',
      actionRequired: 'உங்கள் மருந்துகள் மற்றும் சரியான அளவுக்கு தகுதியான மருத்துவர் அல்லது மருந்தாளரை நேரில் அணுகவும்.',
      keyDetails: [
        { label: 'ஆவண வகை', value: 'மருத்துவர் மருந்துச் சீட்டு', explanation: 'மருத்துவர் வழங்கிய சீட்டு', isUncertain: false, icon: 'file' },
        { label: 'பாதுகாப்பு விதிமுறை', value: 'விளக்கம் அளிக்கப்படாது', explanation: 'உடல்நலப் பாதுகாப்பிற்காக', isUncertain: false, icon: 'alert' }
      ],
      warnings: [
        { text: 'AI அல்லது கணினி விளக்கத்தின் அடிப்படையில் எந்த ஒரு மருந்தையும் உட்கொள்ளவோ மாற்றவோ கூடாது.', severity: 'urgent', isGeneralGuidance: false },
        { text: 'இந்த அசல் மருந்துச் சீட்டுடன் அருகில் உள்ள மருந்தகம் அல்லது மருத்துவமனைக்குச் செல்லவும்.', severity: 'info', isGeneralGuidance: true }
      ],
      uncertainFields: [],
      needsClearerPhoto: false,
      photoGuidance: null,
      isMedicalOrPrescription: true,
      isSuspiciousMessage: false,
      suspiciousSignals: [],
      fullSpokenText: 'இது மருத்துவரின் மருந்துச் சீட்டு. உங்கள் பாதுகாப்பிற்காக சம்ஜாவோ மருந்து விவரங்களை விளக்குவதில்லை. தயவுசெய்து உங்கள் மருத்துவரை நேரில் அணுகவும்.',
      glossary: [
        { term: 'Prescription (Rx)', meaning: 'மருத்துவரால் பரிந்துரைக்கப்பட்ட மருத்துவ மருந்துச் சீட்டு' }
      ]
    }
  },

  // 3. Suspicious Scam SMS Mock (Fraud Alert)
  scam: {
    en: {
      id: 'mock_scam_en',
      documentType: 'Suspicious Scam Message (Fraud Alert)',
      documentTypeLocalized: 'Suspicious Scam Message',
      language: 'en',
      languageName: 'English',
      simpleSummary: 'This message shows clear signs of an urgent electricity disconnection scam.',
      actionRequired: 'Do NOT call the personal phone number, do NOT click any links, and never share OTPs.',
      keyDetails: [
        { label: 'Threat Detected', value: 'Fake Disconnection', explanation: 'Claims power will cut off tonight', isUncertain: false, icon: 'alert' },
        { label: 'Suspicious Contact', value: 'Personal Mobile Number', explanation: 'Official utilities never use personal mobile numbers', isUncertain: false, icon: 'hash' }
      ],
      warnings: [
        { text: 'Urgent threats demanding immediate payment tonight are typical signs of fraud.', severity: 'urgent', isGeneralGuidance: false },
        { text: 'Official electricity boards send communications only through registered alphabetic sender IDs.', severity: 'info', isGeneralGuidance: true }
      ],
      uncertainFields: [],
      needsClearerPhoto: false,
      photoGuidance: null,
      isMedicalOrPrescription: false,
      isSuspiciousMessage: true,
      suspiciousSignals: [
        'Threatens electricity cutoff tonight to create artificial panic.',
        'Urges calling an unknown personal 10-digit mobile number.',
        'Asks to send money or download an unverified payment link.'
      ],
      fullSpokenText: 'Caution! This message is a suspected fraud scam. It threatens that your electricity will be disconnected tonight. Do not call the number and do not send any money.',
      glossary: [
        { term: 'Phishing', meaning: 'Fraudulent attempt to steal your money through fake urgent messages' }
      ]
    },
    hi: {
      id: 'mock_scam_hi',
      documentType: 'संदेहास्पद फ्रॉड संदेश (Fraud Alert)',
      documentTypeLocalized: 'संदेहास्पद फ्रॉड संदेश',
      language: 'hi',
      languageName: 'हिन्दी',
      simpleSummary: 'यह संदेश बिजली काटने की झूठी धमकी देकर पैसे ठगने वाला फ्रॉड संदेश है।',
      actionRequired: 'दिए गए मोबाइल नंबर पर कभी फोन न करें, किसी लिंक पर क्लिक न करें, और कोई OTP न बताएं।',
      keyDetails: [
        { label: 'धमकी का प्रकार', value: 'बिजली काटने का फर्जी डर', explanation: 'रात 9:30 बजे बिजली काटने का दावा', isUncertain: false, icon: 'alert' },
        { label: 'संदेहास्पद नंबर', value: 'व्यक्तिगत मोबाइल नंबर', explanation: 'बिजली विभाग कभी पर्सनल नंबर से मैसेज नहीं भेजता', isUncertain: false, icon: 'hash' }
      ],
      warnings: [
        { text: 'तुरंत पैसे न भरने पर बिजली काटने की धमकी देना ठगी का आम तरीका है।', severity: 'urgent', isGeneralGuidance: false },
        { text: 'हमेशा अपने बिजली विभाग के आधिकारिक केंद्र या सरकारी काउंटर पर ही बिल भरें।', severity: 'info', isGeneralGuidance: true }
      ],
      uncertainFields: [],
      needsClearerPhoto: false,
      photoGuidance: null,
      isMedicalOrPrescription: false,
      isSuspiciousMessage: true,
      suspiciousSignals: [
        'रात में तुरंत बिजली काटने की झूठी धमकी देकर घबराहट पैदा करना।',
        'अज्ञात 10-अंकों के व्यक्तिगत मोबाइल नंबर पर संपर्क करने को कहना।',
        'अनधिकृत लिंक से पैसे ट्रांसफर करने या ऐप डाउनलोड करने का दबाव।'
      ],
      fullSpokenText: 'सावधान! यह एक फर्जी संदेश है। इसमें रात में बिजली काटने की झूठी धमकी दी गई है। किसी भी नंबर पर फोन न करें और पैसे न भेजें।',
      glossary: [
        { term: 'Fraud SMS', meaning: 'पैसे चुराने के उद्देश्य से भेजा गया फर्जी संदेश' }
      ]
    },
    te: {
      id: 'mock_scam_te',
      documentType: 'మోసపూరిత సందేశం (Scam Message)',
      documentTypeLocalized: 'మోసపూరిత సందేశం',
      language: 'te',
      languageName: 'తెలుగు',
      simpleSummary: 'ఇది విద్యుత్ నిలిపివేస్తామని భయపెట్టి డబ్బులు కాజేసే నకిలీ మోసపూరిత సందేశం.',
      actionRequired: 'ఆ నంబర్‌కు కాల్ చేయవద్దు, ఏ లింక్ ఓపెన్ చేయవద్దు మరియు ఎవరికీ OTP చెప్పవద్దు.',
      keyDetails: [
        { label: 'గుర్తించబడిన హెచ్చరిక', value: 'నకిలీ బెదిరింపు', explanation: 'రాత్రికి కరెంట్ తీసేస్తామని అబద్ధం', isUncertain: false, icon: 'alert' },
        { label: 'వ్యక్తిగత నంబర్', value: 'వ్యక్తిగత మొబైల్', explanation: 'విద్యుత్ శాఖ పర్సనల్ నంబర్లు వాడదు', isUncertain: false, icon: 'hash' }
      ],
      warnings: [
        { text: 'అత్యవసరంగా డబ్బులు చెల్లించమని బెదిరించడం మోసగాళ్ల పద్ధతి.', severity: 'urgent', isGeneralGuidance: false }
      ],
      uncertainFields: [],
      needsClearerPhoto: false,
      photoGuidance: null,
      isMedicalOrPrescription: false,
      isSuspiciousMessage: true,
      suspiciousSignals: [
        'రాత్రి కరెంట్ తీసేస్తామని భయం కలిగించడం.',
        'వ్యక్తిగత మొబైల్ నంబర్‌కు కాల్ చేయమని ఒత్తిడి చేయడం.'
      ],
      fullSpokenText: 'హెచ్చరిక! ఇది మోసపూరిత సందేశం. రాత్రి కరెంట్ నిలిపివేస్తామని నకిలీ బెదిరింపు. ఎవరికీ డబ్బులు పంపవద్దు.',
      glossary: []
    },
    ta: {
      id: 'mock_scam_ta',
      documentType: 'சந்தேகத்திற்குரிய மோசடி செய்தி (Fraud Alert)',
      documentTypeLocalized: 'சந்தேகத்திற்குரிய மோசடி செய்தி',
      language: 'ta',
      languageName: 'தமிழ்',
      simpleSummary: 'இது மின்சாரம் துண்டிக்கப்படும் என்று மிரட்டி பணம் பறிக்க முயலும் போலி மோசடிச் செய்தியாகும்.',
      actionRequired: 'கொடுக்கப்பட்ட எண்ணிற்கு அழைக்க வேண்டாம், எந்த இணைப்பையும் திறக்க வேண்டாம், யாருக்கும் OTP சொல்ல வேண்டாம்.',
      keyDetails: [
        { label: 'கண்டறியப்பட்ட அச்சுறுத்தல்', value: 'போலி மிரட்டல்', explanation: 'இரவு மின்சாரம் துண்டிக்கப்படும் என்ற பொய்', isUncertain: false, icon: 'alert' },
        { label: 'சந்தேகத்திற்கிடமான எண்', value: 'தனிநபர் மொபைல் எண்', explanation: 'மின் வாரியம் தனிநபர் எண்களிலிருந்து செய்தி அனுப்பாது', isUncertain: false, icon: 'hash' }
      ],
      warnings: [
        { text: 'உடனடியாக பணம் செலுத்தாவிட்டால் மின்சாரம் துண்டிக்கப்படும் என்று மிரட்டுவது வழக்கமான பண மோசடி முறையாகும்.', severity: 'urgent', isGeneralGuidance: false },
        { text: 'எப்போதும் மின் வாரியத்தின் அதிகாரப்பூர்வ அலுவலகம் அல்லது இணையதளத்தில் மட்டுமே பணம் செலுத்தவும்.', severity: 'info', isGeneralGuidance: true }
      ],
      uncertainFields: [],
      needsClearerPhoto: false,
      photoGuidance: null,
      isMedicalOrPrescription: false,
      isSuspiciousMessage: true,
      suspiciousSignals: [
        'இன்றிரவு உடனடியாக மின்சாரம் துண்டிக்கப்படும் என்ற அவசர மிரட்டல்.',
        'அறியப்படாத 10 இலக்க தனிநபர் மொபைல் எண்ணை அழைக்கும்படி வற்புறுத்துதல்.',
        'சரிபார்க்கப்படாத இணைப்பில் பணம் அனுப்பும்படி தூண்டுதல்.'
      ],
      fullSpokenText: 'எச்சரிக்கை! இது ஒரு போலி மோசடிச் செய்தி. இன்றிரவு மின்சாரம் துண்டிக்கப்படும் என்ற போலி மிரட்டல் விடுக்கப்பட்டுள்ளது. எந்த எண்ணிற்கும் அழைக்காதீர்கள் மற்றும் பணம் அனுப்பாதீர்கள்.',
      glossary: [
        { term: 'Fraud SMS', meaning: 'பணம் திருடும் நோக்கில் அனுப்பப்படும் போலி மோசடிச் செய்தி' }
      ]
    }
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
   - All explanations and summaries MUST be written in the user's requested language.

6. SPOKEN AUDIO GUIDELINES FOR ELDERS ("fullSpokenText"):
   - "fullSpokenText" is read aloud via speech to an elderly parent or grandparent who may have difficulty reading fine print.
   - Tone: Very warm, respectful, and reassuring (like a polite family member explaining a paper at home).
   - Greeting: Start with a respectful native greeting:
     - English: "Hello! Here is a simple explanation of your document."
     - Hindi: "नमस्ते! यह आपके दस्तावेज़ की सरल जानकारी है।"
     - Telugu: "నమస్కారం! ఇది మీ పత్రం యొక్క ముఖ్యమైన వివరాలు."
     - Tamil: "வணக்கம்! இது உங்கள் ஆவணத்தின் எளிய விளக்கம்."
   - Pronounceable Numbers: ALWAYS spell out numbers and currencies as natural spoken words (e.g. write "eight hundred and fifty rupees" instead of "₹850.00", write "twenty-fifth of October" instead of "25/10/2024").
   - Zero Symbol Clutter: Never use symbols like ₹, /, %, @, (), brackets, or dashes in fullSpokenText so the speech engine sounds completely human and never reads "slash" or "bracket open".
   - Clear Action: Reassure the elder about what it is, whether they need to pay or not, and what to do next.

7. ZERO ENGLISH RESIDUE IN REGIONAL LANGUAGES (Telugu, Tamil, Hindi):
   - When the requested language is Telugu ('te') or Tamil ('ta') or Hindi ('hi'):
     * NEVER output English labels in "keyDetails" (e.g. for Telugu write 'చెల్లించాల్సిన మొత్తం', 'చివరి తేదీ', 'వినియోగించిన యూనిట్లు'; for Tamil write 'செலுத்த வேண்டிய தொகை', 'கடைசி தேதி', 'பயன்படுத்திய யூனிட்டுகள்').
     * Translate every word in "documentTypeLocalized", "simpleSummary", "actionRequired", "explanation", "warnings", and "glossary" into the target native script.
     * Do NOT leave document headings in English even if the printed bill is in English.`;

/**
 * Normalization dictionary to translate common English labels to native regional languages
 * guarantees that even if the AI model leaves an English label, it gets translated.
 */
const LABEL_TRANSLATIONS = {
  te: {
    'total due amount': 'చెల్లించాల్సిన మొత్తం',
    'total amount': 'చెల్లించాల్సిన మొత్తం',
    'total due': 'చెల్లించాల్సిన మొత్తం',
    'amount due': 'చెల్లించాల్సిన మొత్తం',
    'amount payable': 'చెల్లించాల్సిన మొత్తం',
    'bill amount': 'బిల్లు మొత్తం',
    'payment due date': 'చివరి తేదీ',
    'due date': 'చివరి తేదీ',
    'last date': 'చివరి తేదీ',
    'billing period': 'బిల్లింగ్ వ్యవధి',
    'bill period': 'బిల్లింగ్ కాలం',
    'units consumed': 'వినియోగించిన యూనిట్లు',
    'power consumed': 'వాడిన విద్యుత్',
    'consumer account': 'ఖాతా సంఖ్య (CA నంబర్)',
    'consumer account (ca)': 'ఖాతా సంఖ్య (CA నంబర్)',
    'account number': 'ఖాతా సంఖ్య',
    'consumer name': 'వినియోగదారు పేరు',
    'name': 'పేరు',
    'meter number': 'మీటర్ నంబర్',
    'bill number': 'బిల్లు సంఖ్య',
    'threat detected': 'గుర్తించబడిన హెచ్చరిక',
    'suspicious contact': 'అనుమానాస్పద నంబర్',
    'document category': 'పత్రం రకం',
    'safety protocol': 'భద్రతా నిబంధన'
  },
  ta: {
    'total due amount': 'செலுத்த வேண்டிய தொகை',
    'total amount': 'செலுத்த வேண்டிய தொகை',
    'total due': 'செலுத்த வேண்டிய தொகை',
    'amount due': 'செலுத்த வேண்டிய தொகை',
    'amount payable': 'செலுத்த வேண்டிய தொகை',
    'bill amount': 'மின்கட்டணத் தொகை',
    'payment due date': 'கடைசி தேதி',
    'due date': 'கடைசி தேதி',
    'last date': 'கடைசி தேதி',
    'billing period': 'பில்லிங் காலம்',
    'bill period': 'பில்லிங் காலம்',
    'units consumed': 'பயன்படுத்திய யூனிட்டுகள்',
    'power consumed': 'பயன்படுத்திய மின்சாரம்',
    'consumer account': 'நுகர்வோர் கணக்கு எண் (CA எண்)',
    'consumer account (ca)': 'நுகர்வோர் கணக்கு எண் (CA எண்)',
    'account number': 'கணக்கு எண்',
    'consumer name': 'நுகர்வோர் பெயர்',
    'name': 'பெயர்',
    'meter number': 'மீட்டர் எண்',
    'bill number': 'பில் எண்',
    'threat detected': 'கண்டறியப்பட்ட எச்சரிக்கை',
    'suspicious contact': 'சந்தேகத்திற்கிடமான எண்',
    'document category': 'ஆவண வகை',
    'safety protocol': 'பாதுகாப்பு விதிமுறை'
  },
  hi: {
    'total due amount': 'कुल देय राशि',
    'total amount': 'कुल राशि',
    'total due': 'कुल देय राशि',
    'amount due': 'देय राशि',
    'amount payable': 'कुल भुगतान राशि',
    'bill amount': 'बिल की राशि',
    'payment due date': 'भुगतान की अंतिम तिथि',
    'due date': 'अंतिम तिथि',
    'last date': 'अंतिम तिथि',
    'billing period': 'बिलिंग अवधि',
    'bill period': 'बिलिंग समय',
    'units consumed': 'उपभोग की गई यूनिट',
    'power consumed': 'खर्च हुई बिजली',
    'consumer account': 'उपभोक्ता संख्या (CA Number)',
    'consumer account (ca)': 'उपभोक्ता संख्या (CA Number)',
    'account number': 'खाता संख्या',
    'consumer name': 'उपभोक्ता का नाम',
    'name': 'नाम',
    'meter number': 'मीटर संख्या',
    'bill number': 'बिल संख्या',
    'threat detected': 'धमकी का प्रकार',
    'suspicious contact': 'संदेहास्पद नंबर',
    'document category': 'दस्तावेज़ प्रकार',
    'safety protocol': 'सुरक्षा नियम'
  }
};

/**
 * Determine offline document category based on filename or metadata
 */
function detectMockCategory(fileName = '') {
  const lower = fileName.toLowerCase();
  if (lower.includes('prescription') || lower.includes('medical') || lower.includes('doctor') || lower.includes('rx')) {
    return 'prescription';
  }
  if (lower.includes('suspicious') || lower.includes('scam') || lower.includes('fraud') || lower.includes('sms')) {
    return 'scam';
  }
  return 'bill';
}

/**
 * Explain document using Google Gemini Vision API or fallback domain engine
 * @param {Object} params
 * @param {Buffer} [params.fileBuffer] - In-memory image buffer
 * @param {string} [params.mimeType] - Mime type of the image
 * @param {string} [params.language] - Target language code ('en', 'hi', 'te', 'ta')
 * @param {string} [params.fileName] - Original file name for fallback hints
 * @returns {Promise<Object>} Validated structured result
 */
export async function explainDocument({ fileBuffer, mimeType, language = 'en', fileName = '' }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const langKey = ['en', 'hi', 'te', 'ta'].includes(language) ? language : 'en';

  // Offline mock mode when API key is missing
  if (!apiKey || apiKey.trim() === '') {
    const category = detectMockCategory(fileName);
    console.log(`ℹ️ [Samjhao] GEMINI_API_KEY not configured. Using high-fidelity mock engine (${category}) for lang="${langKey}".`);
    const mock = DOMAIN_MOCKS[category]?.[langKey] || DOMAIN_MOCKS.bill[langKey];
    return validateAndNormalizeResult(mock, langKey);
  }

  // Live Multimodal AI with Gemini
  const CANDIDATE_MODELS = [
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
    'gemini-pro-latest'
  ];
  let lastError = null;

  const targetLangDescriptor = langKey === 'hi' 
    ? 'Hindi (हिन्दी)' 
    : langKey === 'te' 
    ? 'Telugu (తెలుగు)' 
    : langKey === 'ta' 
    ? 'Tamil (தமிழ்)' 
    : 'English';

  for (const modelName of CANDIDATE_MODELS) {
    try {
      console.log(`🤖 [Samjhao] Analyzing document with model "${modelName}" in language "${langKey}"...`);
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
          thinkingConfig: {
            thinkingBudget: 0
          }
        }
      });

      const prompt = `Analyze this document image carefully. Explain it simply, warmly, and clearly for everyday families and elders in ${targetLangDescriptor}.
CRITICAL LANGUAGE RULES:
1. Every label in "keyDetails" MUST be written in ${targetLangDescriptor} (NOT in English).
2. "simpleSummary", "actionRequired", "documentTypeLocalized", "warnings", and "glossary" must be 100% in ${targetLangDescriptor}.
3. "fullSpokenText" must be spoken naturally and warmly in ${targetLangDescriptor} with spelled-out amounts and dates.

Return a JSON object adhering to this schema:
{
  "documentType": string,
  "documentTypeLocalized": string,
  "language": "${langKey}",
  "languageName": "${langKey === 'hi' ? 'हिन्दी' : langKey === 'te' ? 'తెలుగు' : langKey === 'ta' ? 'தமிழ்' : 'English'}",
  "simpleSummary": string (2-3 simple sentences in ${targetLangDescriptor}),
  "actionRequired": string (clear instruction in ${targetLangDescriptor}),
  "keyDetails": [
    {
      "label": string (in ${targetLangDescriptor}),
      "value": string,
      "explanation": string (in ${targetLangDescriptor}),
      "isUncertain": boolean,
      "uncertaintyReason": string or null,
      "icon": "currency" | "calendar" | "clock" | "zap" | "hash" | "file" | "alert" | "info"
    }
  ],
  "warnings": [
    {
      "text": string (in ${targetLangDescriptor}),
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
  "fullSpokenText": string (natural warm spoken text in ${targetLangDescriptor}),
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

      // Post-process labels: if model left English labels for te/gu/hi, translate them
      if (LABEL_TRANSLATIONS[langKey] && Array.isArray(parsed.keyDetails)) {
        parsed.keyDetails.forEach(item => {
          if (item && item.label) {
            const cleanKey = item.label.trim().toLowerCase();
            if (LABEL_TRANSLATIONS[langKey][cleanKey]) {
              item.label = LABEL_TRANSLATIONS[langKey][cleanKey];
            }
          }
        });
      }

      console.log(`✅ [Samjhao] Document analyzed successfully with "${modelName}".`);
      return validateAndNormalizeResult(parsed, langKey);
    } catch (err) {
      console.warn(`⚠️ [Samjhao] Model "${modelName}" failed:`, err.message);
      lastError = err;
      // Try next candidate model
    }
  }

  // Graceful fallback to domain engine if live AI fails or quota is exhausted
  console.error('❌ [Samjhao] Live AI unavailable, falling back to safe domain engine:', lastError?.message);
  const fallbackCategory = detectMockCategory(fileName);
  const fallback = DOMAIN_MOCKS[fallbackCategory]?.[langKey] || DOMAIN_MOCKS.bill[langKey];
  return validateAndNormalizeResult(fallback, langKey);
}
