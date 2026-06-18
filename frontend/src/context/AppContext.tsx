import React, { createContext, useContext, useState, useEffect } from 'react';

// Multi-language dictionary
export const translations: Record<string, Record<string, string>> = {
  en: {
    tagline: "Know Your Bills. Predict Your Costs. Save Smarter.",
    hero_title: "Understand Every Bill. Predict Every Expense.",
    hero_subtitle: "Upload any utility bill and let AI explain changes, detect anomalies, forecast future costs, and help you save money.",
    cta_start: "Start Free",
    cta_demo: "Watch Demo",
    nav_dashboard: "Dashboard",
    nav_upload: "Upload Bill",
    nav_ocr: "OCR Extraction",
    nav_insights: "AI Insights",
    nav_predictions: "Predictions",
    nav_recommendations: "Savings Recommendations",
    nav_anomalies: "Anomaly Detection",
    nav_voice: "Voice Assistant",
    nav_whatsapp: "WhatsApp Bot",
    nav_schema: "Database Schema",
    nav_api: "API Docs",
    nav_admin: "Admin Console",
    metric_spend: "Total Monthly Spend",
    metric_forecast: "Predicted Next Month Cost",
    metric_savings: "Savings Identified",
    metric_alerts: "Active Alerts",
    home: "Home",
    logout: "Log Out",
    login: "Log In",
    features: "Features",
    pricing: "Pricing",
    faqs: "FAQs",
    how_it_works: "How It Works",
    problem_sec: "The Problem We Solve",
  },
  hi: {
    tagline: "अपने बिलों को जानें। अपनी लागत का अनुमान लगाएं। समझदारी से बचत करें।",
    hero_title: "हर बिल को समझें। हर खर्च का अनुमान लगाएं।",
    hero_subtitle: "किसी भी उपयोगिता बिल को अपलोड करें और एआई को परिवर्तनों को समझाने, विसंगतियों का पता लगाने, भविष्य की लागतों का पूर्वानुमान लगाने और पैसे बचाने में मदद करने दें।",
    cta_start: "मुफ़्त शुरू करें",
    cta_demo: "डेमो देखें",
    nav_dashboard: "डैशबोर्ड",
    nav_upload: "बिल अपलोड करें",
    nav_ocr: "ओसीआर एक्सट्रैक्शन",
    nav_insights: "एआई अंतर्दृष्टि",
    nav_predictions: "पूर्वानुमान",
    nav_recommendations: "बचत सिफारिशें",
    nav_anomalies: "विसंगति का पता लगाना",
    nav_voice: "आवाज सहायक",
    nav_whatsapp: "व्हाट्सएप बॉट",
    nav_schema: "डेटाबेस स्कीमा",
    nav_api: "एपीआई दस्तावेज़",
    nav_admin: "एडमिन कंसोल",
    metric_spend: "कुल मासिक खर्च",
    metric_forecast: "अनुमानित अगले महीने की लागत",
    metric_savings: "पहचानी गई बचत",
    metric_alerts: "सक्रिय अलर्ट",
    home: "होम",
    logout: "लॉग आउट",
    login: "लॉग इन",
    features: "विशेषताएं",
    pricing: "मूल्य निर्धारण",
    faqs: "पूछे जाने वाले प्रश्न",
    how_it_works: "यह काम कैसे करता है",
    problem_sec: "समस्या जिसका हम समाधान करते हैं",
  },
  ta: {
    tagline: "உங்கள் பில்களை அறிந்து கொள்ளுங்கள். செலவுகளைக் கணிக்கவும். புத்திசாலித்தனமாகச் சேமிக்கவும்.",
    hero_title: "ஒவ்வொரு பில்லையும் புரிந்து கொள்ளுங்கள். ஒவ்வொரு செலவையும் கணிக்கவும்.",
    hero_subtitle: "ஏதேனும் பயன்பாட்டு பில் பதிவேற்றவும், மாற்றங்களை விளக்கவும், முரண்பாடுகளைக் கண்டறியவும், எதிர்கால செலவுகளைக் கணிக்கவும், பணத்தைச் சேமிக்கவும் AI-க்கு அனுமதிக்கவும்.",
    cta_start: "இலவசமாகத் தொடங்குங்கள்",
    cta_demo: "டெமோவைப் பார்க்கவும்",
    nav_dashboard: "டாஷ்போர்டு",
    nav_upload: "பில் பதிவேற்றம்",
    nav_ocr: "OCR பிரித்தெடுத்தல்",
    nav_insights: "AI நுண்ணறிவு",
    nav_predictions: "கணிப்புகள்",
    nav_recommendations: "சேமிப்பு பரிந்துரைகள்",
    nav_anomalies: "முரண்பாடு கண்டறிதல்",
    nav_voice: "குரல் உதவியாளர்",
    nav_whatsapp: "வாட்ஸ்அப் பாட்",
    nav_schema: "தரவுத்தள வடிவமைப்பு",
    nav_api: "API ஆவணங்கள்",
    nav_admin: "நிர்வாக மையம்",
    metric_spend: "மொத்த மாத செலவு",
    metric_forecast: "அடுத்த மாத கணிப்பு செலவு",
    metric_savings: "கண்டறியப்பட்ட சேமிப்புகள்",
    metric_alerts: "செயலில் உள்ள எச்சரிக்கைகள்",
    home: "முகப்பு",
    logout: "வெளியேறு",
    login: "உள்நுழை",
    features: "அம்சங்கள்",
    pricing: "கட்டணங்கள்",
    faqs: "கேள்விகள்",
    how_it_works: "செயல்முறை",
    problem_sec: "நாங்கள் தீர்க்கும் பிரச்சனை",
  },
  te: {
    tagline: "మీ బిల్లులను తెలుసుకోండి. మీ ఖర్చులను అంచనా వేయండి. తెలివిగా ఆదా చేయండి.",
    hero_title: "ప్రతి బిల్లును అర్థం చేసుకోండి. ప్రతి ఖర్చును అంచనా వేయండి.",
    hero_subtitle: "ఏదైనా యుటిలిటీ బిల్లును అప్‌లోడ్ చేయండి మరియు మార్పులను వివరించడానికి, అసాధారణతలను గుర్తించడానికి, భవిష్యత్ ఖర్చులను అంచనా వేయడానికి మరియు డబ్బు ఆదా చేయడానికి AI ని అనుమతించండి.",
    cta_start: "ఉచితంగా ప్రారంభించండి",
    cta_demo: "డెమో చూడండి",
    nav_dashboard: "డ్యాష్‌బోర్డ్",
    nav_upload: "బిల్లు అప్‌లోడ్",
    nav_ocr: "OCR ఎక్స్‌ట్రాక్షన్",
    nav_insights: "AI అంతర్దృష్టులు",
    nav_predictions: "అంచనాలు",
    nav_recommendations: "పొదుపు సిఫార్సులు",
    nav_anomalies: "అసాధారణతల గుర్తింపు",
    nav_voice: "వాయిస్ అసిస్టెంట్",
    nav_whatsapp: "వాట్సాప్ బాట్",
    nav_schema: "డేటాబేస్ స్కీమా",
    nav_api: "API డాక్స్",
    nav_admin: "అడ్మిన్ ప్యానెల్",
    metric_spend: "మొత్తం నెలవారీ ఖర్చు",
    metric_forecast: "అంచనా వేసిన వచ్చే నెల ఖర్చు",
    metric_savings: "గుర్తించిన పొదుపులు",
    metric_alerts: "క్రియాశీల అలర్ట్లు",
    home: "హోమ్",
    logout: "లాగ్ అవుట్",
    login: "లాగిన్",
    features: "ఫీచర్లు",
    pricing: "ధరలు",
    faqs: "FAQs",
    how_it_works: "ఇది ఎలా పనిచేస్తుంది",
    problem_sec: "మేము పరిష్కరించే సమస్య",
  },
  bn: {
    tagline: "আপনার বিল জানুন। খরচ অনুমান করুন। বুদ্ধিমত্তার সাথে সঞ্চয় করুন।",
    hero_title: "প্রতিটি বিল বুঝুন। প্রতিটি খরচ অনুমান করুন।",
    hero_subtitle: "যেকোনো ইউটিলিটি বিল আপলোড করুন এবং এআই-কে পরিবর্তনের কারণ ব্যাখ্যা করতে, অসঙ্গতি সনাক্ত করতে, ভবিষ্যতের খরচ অনুমান করতে এবং আপনার অর্থ সাশ্রয় করতে দিন।",
    cta_start: "বিনামূল্যে শুরু করুন",
    cta_demo: "ডেমো দেখুন",
    nav_dashboard: "ড্যাশবোর্ড",
    nav_upload: "বিল আপলোড করুন",
    nav_ocr: "ওসিআর নিষ্কাশন",
    nav_insights: "এআই ইনসাইটস",
    nav_predictions: "ভবিষ্যদ্বাণী",
    nav_recommendations: "সঞ্চয় পরামর্শ",
    nav_anomalies: "অসঙ্গতি সনাক্তকরণ",
    nav_voice: "ভয়েস অ্যাসিস্ট্যান্ট",
    nav_whatsapp: "হোয়াটসঅ্যাপ বট",
    nav_schema: "ডাটাবেস স্কিমা",
    nav_api: "এপিআই ডকুমেন্টস",
    nav_admin: "অ্যাডমিন কনসোল",
    metric_spend: "মোট মাসিক খরচ",
    metric_forecast: "পরবর্তী মাসের সম্ভাব্য খরচ",
    metric_savings: "চিহ্নিত সঞ্চয়",
    metric_alerts: "সক্রিয় সতর্কতা",
    home: "হোম",
    logout: "লগ আউট",
    login: "লগ ইন",
    features: "বৈশিষ্ট্যসমূহ",
    pricing: "মূল্য নির্ধারণ",
    faqs: "জিজ্ঞাসাবাদ",
    how_it_works: "কিভাবে এটি কাজ করে",
    problem_sec: "আমাদের সমাধান করা সমস্যা",
  },
  mr: {
    tagline: "तुमची बिले जाणून घ्या. तुमच्या खर्चाचा अंदाज लावा. हुशारीने बचत करा.",
    hero_title: "प्रत्येक बिल समजून घ्या. प्रत्येक खर्चाचा अंदाज लावा.",
    hero_subtitle: "कोणतेही युटिलिटी बिल अपलोड करा आणि एआय ला बदल स्पष्ट करू द्या, विसंगती शोधू द्या, भविष्यातील खर्चाचा अंदाज लावू द्या आणि पैसे वाचविण्यात मदत करू द्या.",
    cta_start: "विनामूल्य सुरू करा",
    cta_demo: "डेमो पहा",
    nav_dashboard: "डॅशबोर्ड",
    nav_upload: "बिल अपलोड करा",
    nav_ocr: "ओसीआर एक्स्ट्रॅक्शन",
    nav_insights: "एआय अंतर्दृष्टी",
    nav_predictions: "पूर्वानुमान",
    nav_recommendations: "बचत शिफारसी",
    nav_anomalies: "विसंगती शोधणे",
    nav_voice: "व्हॉइस असिस्टंट",
    nav_whatsapp: "व्हॉट्सॲप बॉट",
    nav_schema: "डेटाबेस स्कीमा",
    nav_api: "एपीआय दस्तऐवज",
    nav_admin: "ॲडमिन कन्सोल",
    metric_spend: "एकूण मासिक खर्च",
    metric_forecast: "अंदाजित पुढील महिन्याचा खर्च",
    metric_savings: "ओळखलेली बचत",
    metric_alerts: "सक्रिय इशारे",
    home: "होम",
    logout: "लॉग आउट",
    login: "लॉग इन",
    features: "वैशिष्ट्ये",
    pricing: "किंमत",
    faqs: "नेहमी विचारले जाणारे प्रश्न",
    how_it_works: "हे कसे चालते",
    problem_sec: "आम्ही सोडवत असलेली समस्या",
  },
  kn: {
    tagline: "ನಿಮ್ಮ ಬಿಲ್ಲುಗಳನ್ನು ತಿಳಿಯಿರಿ. ನಿಮ್ಮ ವೆಚ್ಚಗಳನ್ನು ಊಹಿಸಿ. ಜಾಣತನದಿಂದ ಉಳಿಸಿ.",
    hero_title: "ಪ್ರತಿ ಬಿಲ್ಲನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಪ್ರತಿ ವೆಚ್ಚವನ್ನು ಊಹಿಸಿ.",
    hero_subtitle: "ಯಾವುದೇ ಯುಟಿಲಿಟಿ ಬಿಲ್ಲನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಬದಲಾವಣೆಗಳನ್ನು ವಿವರಿಸಲು, ಅಸಂಗತಿಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲು, ಭವಿಷ್ಯದ ವೆಚ್ಚಗಳನ್ನು ಮುನ್ಸೂಚಿಸಲು ಮತ್ತು ಹಣ ಉಳಿಸಲು AI ಗೆ ಸಹಾಯ ಮಾಡಲು ಬಿಡಿ.",
    cta_start: "ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ",
    cta_demo: "ಡೆಮೊ ವೀಕ್ಷಿಸಿ",
    nav_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    nav_upload: "ಬಿಲ್ ಅಪ್‌ಲೋಡ್",
    nav_ocr: "OCR ಎಕ್ಸ್‌ಟ್ರಾಕ್ಷನ್",
    nav_insights: "AI ಒಳನೋಟಗಳು",
    nav_predictions: "ಮುನ್ಸೂಚನೆಗಳು",
    nav_recommendations: "ಉಳಿತಾಯ ಶಿಫಾರಸುಗಳು",
    nav_anomalies: "ಅಸಂಗತಿ ಪತ್ತೆಹಚ್ಚುವಿಕೆ",
    nav_voice: "ಧ್ವನಿ ಸಹಾಯಕ",
    nav_whatsapp: "ವಾಟ್ಸಾಪ್ ಬಾಟ್",
    nav_schema: "ಡೇಟಾಬೇಸ್ ಸ್ಕೀಮಾ",
    nav_api: "API ದಾಖಲೆಗಳು",
    nav_admin: "ಅಡ್ಮಿನ್ ಪ್ಯಾನೆಲ್",
    metric_spend: "ಒಟ್ಟು ಮಾಸಿಕ ವೆಚ್ಚ",
    metric_forecast: "ಮುಂದಿನ ತಿಂಗಳ ಅಂದಾಜು ವೆಚ್ಚ",
    metric_savings: "ಗುರುತಿಸಲಾದ ಉಳಿತಾಯ",
    metric_alerts: "ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು",
    home: "ಮುಖಪುಟ",
    logout: "ಲಾಗ್ ಔಟ್",
    login: "ಲಾಗಿನ್",
    features: "ವೈಶಿಷ್ಟ್ಯಗಳು",
    pricing: "ದರಗಳು",
    faqs: "ಪ್ರಶ್ನೋತ್ತರಗಳು",
    how_it_works: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    problem_sec: "ನಾವು ಪರಿಹರಿಸುವ ಸಮಸ್ಯೆ",
  },
  gu: {
    tagline: "તમારા બિલને જાણો. તમારા ખર્ચની આગાહી કરો. સ્માર્ટ બચત કરો.",
    hero_title: "દરેક બિલને સમજો. દરેક ખર્ચની આગાહી કરો.",
    hero_subtitle: "કોઈપણ યુટિલિટી બિલ અપલોડ કરો અને AI ને ફેરફારો સમજાવવા, વિસંગતતાઓ શોધવા, ભવિષ્યના ખર્ચની આગાહી કરવા અને પૈસા બચાવવા માટે મદદ કરવા દો.",
    cta_start: "મફત શરૂ કરો",
    cta_demo: "ડેમો જુઓ",
    nav_dashboard: "ડેશબોર્ડ",
    nav_upload: "બિલ અપલોડ કરો",
    nav_ocr: "OCR એક્સ્ટ્રેક્શન",
    nav_insights: "AI આંતરદૃષ્ટિ",
    nav_predictions: "આગાહી",
    nav_recommendations: "બચત ભલામણો",
    nav_anomalies: "વિસંગતતા શોધ",
    nav_voice: "વોઇસ આસિસ્ટન્ટ",
    nav_whatsapp: "વોટ્સએપ બોટ",
    nav_schema: "ડેટાબેઝ સ્કીમા",
    nav_api: "API દસ્તાવેજો",
    nav_admin: "એડમિન કન્સોલ",
    metric_spend: "કુલ માસિક ખર્ચ",
    metric_forecast: "આગાહી કરેલ આગામી મહિનાનો ખર્ચ",
    metric_savings: "ઓળખાયેલ બચત",
    metric_alerts: "સક્રિય ચેતવણીઓ",
    home: "હોમ",
    logout: "લોગ આઉટ",
    login: "લોગ ઇન",
    features: "સુવિધાઓ",
    pricing: "કિંમતો",
    faqs: "પ્રશ્નોત્તરી",
    how_it_works: "તે કેવી રીતે કામ કરે છે",
    problem_sec: "સમસ્યા જેનું અમે નિવારણ કરીએ છીએ",
  }
};

interface Bill {
  id: string;
  type: string;
  amount: number;
  billingDate: string;
  dueDate: string;
  units: number;
  tariffRate: number;
  tax: number;
  status: string;
  provider: string;
  usagePeriod: string;
  fileName?: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  estSavings: number;
  difficulty: string;
  impact: string;
  applied: boolean;
}

interface Alert {
  id: string;
  type: string;
  level: string;
  title: string;
  description: string;
  billId?: string;
  date: string;
  resolved: boolean;
}

interface Profile {
  name: string;
  email: string;
  currency: string;
  phone: string;
  language: string;
}

interface AppContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (key: string) => string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  authStatus: 'guest' | 'authenticated';
  setAuthStatus: (status: 'guest' | 'authenticated') => void;
  bills: Bill[];
  recommendations: Recommendation[];
  alerts: Alert[];
  profile: Profile;
  predictions: Record<string, any>;
  loading: boolean;
  ocrPendingData: Bill | null;
  setOcrPendingData: (data: Bill | null) => void;
  fetchData: () => Promise<void>;
  addBill: (billData: Omit<Bill, 'id'>) => Promise<Bill>;
  updateBill: (id: string, billData: Partial<Bill>) => Promise<Bill>;
  deleteBill: (id: string) => Promise<void>;
  toggleRecommendation: (id: string) => Promise<void>;
  resolveAlert: (id: string) => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  signupUser: (name: string, email: string, password: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [activeTab, setActiveTab] = useState('landing');
  const [authStatus, setAuthStatus] = useState<'guest' | 'authenticated'>('guest');
  const [bills, setBills] = useState<Bill[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [profile, setProfile] = useState<Profile>({
    name: 'Subham Sharma',
    email: 'subham.sharma@example.com',
    currency: '₹',
    phone: '+91 98765 43210',
    language: 'en',
  });
  const [predictions, setPredictions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [ocrPendingData, setOcrPendingData] = useState<Bill | null>(null);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    updateProfile({ language: lang });
  };

  const translate = (key: string) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  // Fetch all core application data from backend Express REST endpoints
  const fetchData = async () => {
    setLoading(true);
    try {
      const [billsRes, recsRes, alertsRes, profileRes, predRes] = await Promise.all([
        fetch('/api/bills').then(r => r.json()),
        fetch('/api/recommendations').then(r => r.json()),
        fetch('/api/alerts').then(r => r.json()),
        fetch('/api/profile').then(r => r.json()),
        fetch('/api/predictions').then(r => r.json())
      ]);

      setBills(billsRes);
      setRecommendations(recsRes);
      setAlerts(alertsRes);
      setProfile(profileRes);
      setLanguageState(profileRes.language || 'en');
      setPredictions(predRes);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Post a new manual bill
  const addBill = async (billData: Omit<Bill, 'id'>) => {
    const res = await fetch('/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billData),
    });
    const newBill = await res.json();
    await fetchData(); // Refresh data to update metrics and predictions!
    return newBill;
  };

  // Update a bill
  const updateBill = async (id: string, billData: Partial<Bill>) => {
    const res = await fetch(`/api/bills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billData),
    });
    const updated = await res.json();
    await fetchData(); // Refresh charts!
    return updated;
  };

  // Delete a bill
  const deleteBill = async (id: string) => {
    await fetch(`/api/bills/${id}`, { method: 'DELETE' });
    await fetchData();
  };

  // Apply or un-apply recommendation
  const toggleRecommendation = async (id: string) => {
    const target = recommendations.find(r => r.id === id);
    if (!target) return;
    const res = await fetch(`/api/recommendations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applied: !target.applied }),
    });
    const updatedRec = await res.json();
    setRecommendations(prev => prev.map(r => r.id === id ? updatedRec : r));
  };

  // Resolve anomaly alert
  const resolveAlert = async (id: string) => {
    const res = await fetch(`/api/alerts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolved: true }),
    });
    const updatedAlert = await res.json();
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Update profile
  const updateProfile = async (profileData: Partial<Profile>) => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const updatedProf = await res.json();
    setProfile(updatedProf);
  };

  const loginUser = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    const profileData = await res.json();
    setProfile(profileData);
    setAuthStatus('authenticated');
    await fetchData();
  };

  const signupUser = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Signup failed');
    }
    const profileData = await res.json();
    setProfile(profileData);
    setAuthStatus('authenticated');
    await fetchData();
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      translate,
      activeTab,
      setActiveTab,
      authStatus,
      setAuthStatus,
      bills,
      recommendations,
      alerts,
      profile,
      predictions,
      loading,
      ocrPendingData,
      setOcrPendingData,
      fetchData,
      addBill,
      updateBill,
      deleteBill,
      toggleRecommendation,
      resolveAlert,
      updateProfile,
      loginUser,
      signupUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
