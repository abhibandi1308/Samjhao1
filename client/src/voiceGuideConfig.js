/**
 * Samjhao Voice Guidance & Color-Assisted Navigation System
 * Synchronized configuration linking button visual colors, labels, and spoken help
 * across English, Hindi, Telugu, and Tamil.
 */

export const COLOR_TOKENS = {
  green: {
    name: 'green',
    hex: '#078A60',
    hover: '#06734F',
    lightBg: '#ECFDF5',
    border: '#10B981',
    text: '#065F46'
  },
  yellow: {
    name: 'yellow',
    hex: '#D97706',
    hover: '#B45309',
    lightBg: '#FFFBEB',
    border: '#F59E0B',
    text: '#92400E'
  },
  pink: {
    name: 'pink',
    hex: '#DB2777',
    hover: '#BE185D',
    lightBg: '#FDF2F8',
    border: '#EC4899',
    text: '#9D174D'
  },
  blue: {
    name: 'blue',
    hex: '#2563EB',
    hover: '#1D4ED8',
    lightBg: '#EFF6FF',
    border: '#3B82F6',
    text: '#1E40AF'
  },
  white: {
    name: 'white',
    hex: '#FFFFFF',
    hover: '#F8FAFC',
    lightBg: '#FFFFFF',
    border: '#D8E0E8',
    text: '#17212F'
  }
};

export const COLOR_NAMES = {
  en: {
    green: 'green',
    yellow: 'yellow',
    pink: 'pink',
    blue: 'blue',
    white: 'white'
  },
  hi: {
    green: 'हरा',
    yellow: 'पीला',
    pink: 'गुलाबी',
    blue: 'नीला',
    white: 'सफ़ेद'
  },
  te: {
    green: 'ఆకుపచ్చ',
    yellow: 'పసుపు',
    pink: 'గులాబీ',
    blue: 'నీలం',
    white: 'తెలుపు'
  },
  ta: {
    green: 'பச்சை',
    yellow: 'மஞ்சள்',
    pink: 'இளஞ்சிவப்பு',
    blue: 'நீலம்',
    white: 'வெள்ளை'
  }
};

/**
 * Returns synchronized screen-specific spoken help instructions
 * identifying buttons by their exact color and label.
 */
export function getScreenVoiceInstructions(screenName, lang = 'en', t = {}) {
  const c = COLOR_NAMES[lang] || COLOR_NAMES.en;

  switch (screenName) {
    case 'LANG_SELECT':
      if (lang === 'hi') {
        return 'समझो में आपका स्वागत है। कृपया अपनी भाषा चुनें। अंग्रेजी, हिन्दी, तेलुगु या तमिल पर टैप करें। आप सुनने के लिए पास वाले स्पीकर बटन को दबा सकते हैं।';
      }
      if (lang === 'te') {
        return 'సమఝావోకి స్వాగతం. దయచేసి మీ భాషను ఎంచుకోండి. ఇంగ్లీష్, హిందీ, తెలుగు లేదా తమిళం ఎంచుకోండి. స్వరాన్ని వినడానికి పక్కన ఉన్న స్పీకర్‌ను నొక్కండి.';
      }
      if (lang === 'ta') {
        return 'சம்ஜாவோவிற்கு நல்வரவு. தயவுசெய்து உங்கள் மொழியைத் தேர்ந்தெடுக்கவும். ஆங்கிலம், இந்தி, தெலுங்கு அல்லது தமிழைத் தொடவும்.';
      }
      return 'Welcome to Samjhao. Please choose your language to begin. Tap English, Hindi, Telugu, or Tamil. You can hear each language before choosing.';

    case 'WELCOME':
      if (lang === 'hi') {
        return `डॉक्यूमेंट को समझने के लिए, ${c.green} रंग का बड़ा बटन दबाएं जिस पर लिखा है फोटो खींचें। आप नीचे दिए गए उदाहरणों को भी आज़मा सकते हैं।`;
      }
      if (lang === 'te') {
        return `మీ పత్రాన్ని అర్థం చేసుకోవడానికి, కాగితం ఫోటో తీయండి అని రాసి ఉన్న ${c.green} రంగు బటన్‌ను నొక్కండి. మీరు క్రింద ఉన్న ఉదాహరణలను కూడా ప్రయత్నించవచ్చు.`;
      }
      if (lang === 'ta') {
        return `ஆவணத்தைப் புரிந்து கொள்ள, காகிதத்தைப் படம் எடுங்கள் என்று எழுதப்பட்ட ${c.green} நிற பட்டனை அழுத்தவும். கீழே உள்ள மாதிரி ஆவணங்களையும் முயற்சிக்கலாம்.`;
      }
      return `To understand a document, press the ${c.green} button labelled Take photo of paper. You can also try with an example document below.`;

    case 'CHOOSE_INPUT':
      if (lang === 'hi') {
        return `नया फोटो खींचने के लिए, ${c.yellow} बटन दबाएं। यदि फोन में पहले से फोटो है, तो ${c.pink} बटन दबाएं। यदि आपका डॉक्यूमेंट PDF है, तो ${c.blue} बटन दबाएं।`;
      }
      if (lang === 'te') {
        return `మీరు కొత్త ఫోటో తీయాలనుకుంటే, ${c.yellow} రంగు బటన్ నొక్కండి. ఇప్పటికే ఉన్న ఫోటోను ఎంచుకోవడానికి ${c.pink} రంగు బటన్ నొక్కండి. మీ పత్రం PDF అయితే ${c.blue} రంగు బటన్ నొక్కండి.`;
      }
      if (lang === 'ta') {
        return `புதிய படம் எடுக்க ${c.yellow} நிற பட்டனை அழுத்தவும். ஏற்கனவே உள்ள படத்தைத் தேர்வுசெய்ய ${c.pink} நிற பட்டனை அழுத்தவும். ஆவணம் PDF என்றால் ${c.blue} நிற பட்டனை அழுத்தவும்.`;
      }
      return `If you want to take a new photo, press the ${c.yellow} button. If you already have a photo, press the ${c.pink} button. If your document is a PDF, press the ${c.blue} button.`;

    case 'PREVIEW':
      if (lang === 'hi') {
        return `जांचें कि आपका डॉक्यूमेंट साफ दिख रहा है। आगे बढ़ने के लिए, ${c.green} बटन दबाएं जिस पर लिखा है हाँ आगे बढ़ें। दोबारा फोटो लेने के लिए, ${c.white} बटन दबाएं जिस पर लिखा है दोबारा लें।`;
      }
      if (lang === 'te') {
        return `మీ పత్రం స్పష్టంగా కనిపిస్తుందో లేదో చూడండి. ముందుకు వెళ్లడానికి, అవును ముందుకు వెళ్లండి అనే ${c.green} రంగు బటన్ నొక్కండి. మళ్ళీ ఫోటో తీయడానికి ${c.white} రంగు బటన్ నొక్కండి.`;
      }
      if (lang === 'ta') {
        return `ஆவணம் தெளிவாகத் தெரிகிறதா என்று பார்க்கவும். தொடர, ஆம் தொடரவும் என்ற ${c.green} நிற பட்டனை அழுத்தவும். மீண்டும் படம் எடுக்க ${c.white} நிற பட்டனை அழுத்தவும்.`;
      }
      return `Check if your document is clearly visible. To continue, press the ${c.green} button labelled Yes continue. To take another photo, press the ${c.white} button labelled Retake.`;

    case 'PROCESSING':
      if (lang === 'hi') {
        return 'कृपया कुछ सेकंड प्रतीक्षा करें। समझो आपका डॉक्यूमेंट पढ़ रहा है और आसान शब्दों में समझाई तैयार कर रहा है।';
      }
      if (lang === 'te') {
        return 'దయచేసి కొన్ని సెకన్లు వేచి ఉండండి. సమఝావో మీ పత్రాన్ని చదువుతోంది మరియు సులభమైన వివరణను సిద్ధం చేస్తోంది.';
      }
      if (lang === 'ta') {
        return 'தயவுசெய்து சில நொடிகள் காத்திருக்கவும். Samjhao உங்கள் ஆவணத்தைப் படித்து எளிய விளக்கத்தைத் தயாரிக்கிறது.';
      }
      return 'Please wait a few seconds. Samjhao is reading your document and preparing a simple explanation.';

    case 'RESULT':
      if (lang === 'hi') {
        return `पूरी जानकारी सुनने के लिए ऊपर ${c.green} बटन दबाएं जिस पर लिखा है पूरी जानकारी सुनें। आप धीमी आवाज में भी सुन सकते हैं या किसी भी बॉक्स के पास वाले स्पीकर बटन को दबा सकते हैं।`;
      }
      if (lang === 'te') {
        return `పూర్తి వివరణ వినడానికి పైన ఉన్న పూర్తి వివరణ వినండి అనే ${c.green} రంగు బటన్ నొక్కండి. నెమ్మదిగా వినడానికి నెమ్మది స్వరం నొక్కవచ్చు లేదా ఏదైనా వివరాల పక్కన ఉన్న స్పీకర్ నొక్కండి.`;
      }
      if (lang === 'ta') {
        return `முழு விளக்கத்தைக் கேட்க மேலே உள்ள ${c.green} நிற பட்டனை அழுத்தவும். மெதுவாகக் கேட்க மெதுவான குரல் பட்டனை அழுத்தலாம் அல்லது குறிப்பிட்ட விவரத்திற்கு அருகிலுள்ள ஸ்பீக்கரைத் தொடவும்.`;
      }
      return `To hear the full explanation, press the ${c.green} button at the top labelled Listen to full explanation. You can also select Slower Voice or tap any speaker icon to hear that specific detail.`;

    case 'ERROR':
      if (lang === 'hi') {
        return `डॉक्यूमेंट को साफ नहीं पढ़ा जा सका। अच्छी रोशनी में दोबारा फोटो लेने के लिए ${c.green} बटन दबाएं, या मुख्य पेज पर जाने के लिए ${c.white} बटन दबाएं।`;
      }
      if (lang === 'te') {
        return `పత్రం స్పష్టంగా చదవలేకపోయాము. మంచి వెలుతురులో మళ్ళీ ఫోటో తీయడానికి ${c.green} రంగు బటన్ నొక్కండి, లేదా హోమ్‌కి వెళ్లడానికి ${c.white} రంగు బటన్ నొక్కండి.`;
      }
      if (lang === 'ta') {
        return `ஆவணத்தைத் தெளிவாகப் படிக்க முடியவில்லை. நல்ல வெளிச்சத்தில் மீண்டும் படம் எடுக்க ${c.green} நிற பட்டனை அழுத்தவும், அல்லது முகப்புக்குச் செல்ல ${c.white} நிற பட்டனை அழுத்தவும்.`;
      }
      return `We could not read this document clearly. To take another photo with better lighting, press the ${c.green} button, or press the ${c.white} button to return home.`;

    default:
      return 'Press any button on the screen to continue.';
  }
}
