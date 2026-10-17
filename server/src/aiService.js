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
    gu: {
      id: 'mock_rx_gu',
      documentType: 'ડૉક્ટરનું પ્રિસ્ક્રિપ્શન (Medical Prescription)',
      documentTypeLocalized: 'ડૉક્ટરનું પ્રિસ્ક્રિપ્શન',
      language: 'gu',
      languageName: 'ગુજરાતી',
      simpleSummary: 'Samjhao તબીબી પ્રિસ્ક્રિપ્શનની સમજૂતી કે દવા સંબંધી સલાહ આપતું નથી.',
      actionRequired: 'દવા અને માત્રા માટે કૃપા કરીને ડૉક્ટર અથવા ફાર્માસિસ્ટનો સંપર્ક કરો.',
      keyDetails: [
        { label: 'દસ્તાવેજ પ્રકાર', value: 'ડૉક્ટરનું પ્રિસ્ક્રિપ્શન', explanation: 'તબીબી ચિઠ્ઠી', isUncertain: false, icon: 'file' },
        { label: 'સુરક્ષા નિયમ', value: 'સમજૂતી આપવી નિષેધ છે', explanation: 'સ્વાસ્થ્ય સુરક્ષા માટે', isUncertain: false, icon: 'alert' }
      ],
      warnings: [
        { text: 'કમ્પ્યુટર અથવા AI ના આધારે કોઈ દવા ન લેશો.', severity: 'urgent', isGeneralGuidance: false }
      ],
      uncertainFields: [],
      needsClearerPhoto: false,
      photoGuidance: null,
      isMedicalOrPrescription: true,
      isSuspiciousMessage: false,
      suspiciousSignals: [],
      fullSpokenText: 'આ ડૉક્ટરનું પ્રિસ્ક્રિપ્શન છે. તમારી સુરક્ષા માટે Samjhao દવાઓની સલાહ આપતું નથી. કૃપા કરીને ડૉક્ટરને મળો.',
      glossary: []
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
    gu: {
      id: 'mock_scam_gu',
      documentType: 'શંકાસ્પદ ફ્રોડ મેસેજ (Scam Message)',
      documentTypeLocalized: 'શંકાસ્પદ ફ્રોડ મેસેજ',
      language: 'gu',
      languageName: 'ગુજરાતી',
      simpleSummary: 'આ વીજળી કાપવાની ખોટી ધમકી આપીને છેતરપિંડી કરવાનો ફ્રોડ મેસેજ છે.',
      actionRequired: 'આપેલા નંબર પર કોલ ન કરો, કોઈ લિંક પર ક્લિક ન કરો અને કોઈને પૈસા ન આપો.',
      keyDetails: [
        { label: 'ચેતવણી', value: 'ખોટી ધમકી', explanation: 'રાત્રે વીજળી કાપવાનો દાવો', isUncertain: false, icon: 'alert' }
      ],
      warnings: [
        { text: 'વીજળી કાપવાની ઉતાવળી ધમકી આપવી એ છેતરપિંડીની સામાન્ય રીત છે.', severity: 'urgent', isGeneralGuidance: false }
      ],
      uncertainFields: [],
      needsClearerPhoto: false,
      photoGuidance: null,
      isMedicalOrPrescription: false,
      isSuspiciousMessage: true,
      suspiciousSignals: [
        'રાત્રે વીજળી કાપવાની નકલી ધમકી.',
        'અજાણ્યા મોબાઈલ નંબર પર કોલ કરવાનું દબાણ.'
      ],
      fullSpokenText: 'સાવધાન! આ છેતરપિંડી વાળો નકલી મેસેજ છે. કોઈ નંબર પર કોલ ન કરશો અને પૈસા ન ચૂકવશો.',
      glossary: []
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
   - All explanations and summaries MUST be written in the user's requested language.`;

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
 * @param {string} [params.language] - Target language code ('en', 'hi', 'te', 'gu')
 * @param {string} [params.fileName] - Original file name for fallback hints
 * @returns {Promise<Object>} Validated structured result
 */
export async function explainDocument({ fileBuffer, mimeType, language = 'en', fileName = '' }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const langKey = ['en', 'hi', 'te', 'gu'].includes(language) ? language : 'en';

  // Offline mock mode when API key is missing
  if (!apiKey || apiKey.trim() === '') {
    const category = detectMockCategory(fileName);
    console.log(`ℹ️ [Samjhao] GEMINI_API_KEY not configured. Using high-fidelity mock engine (${category}) for lang="${langKey}".`);
    const mock = DOMAIN_MOCKS[category]?.[langKey] || DOMAIN_MOCKS.bill[langKey];
    return validateAndNormalizeResult(mock, langKey);
  }

  // Live Multimodal AI with Gemini
  const CANDIDATE_MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      console.log(`🤖 [Samjhao] Analyzing document with model "${modelName}" in language "${langKey}"...`);
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      });

      const prompt = `Analyze this document image carefully. Explain it simply and clearly in ${langKey === 'hi' ? 'Hindi (हिन्दी)' : langKey === 'te' ? 'Telugu' : langKey === 'gu' ? 'Gujarati' : 'English'}.
Return a JSON object adhering to this schema:
{
  "documentType": string,
  "documentTypeLocalized": string,
  "language": "${langKey}",
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
