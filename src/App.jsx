import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Book, Landmark, Crown, Scroll, Map as MapIcon, Menu, ChevronRight, 
  Home, User, Sword, Clock, ArrowRight, Brain, MapPin, X, Trophy, CheckCircle, 
  AlertCircle, Moon, Sun, Bookmark, Volume2, GitMerge, ArrowDown, 
  Lock, Plus, Trash2, Edit, LogOut, Save, GraduationCap, Building2, FileText, 
  Info, MinusCircle, PlusCircle, Image as ImageIcon, Printer, Mail, Phone, 
  Globe, Facebook, Twitter, Instagram, Share2, Type, Lightbulb, Quote, 
  MessageSquare, Download, Upload, File, Wifi, WifiOff
} from 'lucide-react';

/**
 * ==========================================
 * CONFIGURATION & ASSETS
 * ==========================================
 */
const API_URL = "http://localhost:5000"; // Backend URL
const LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Flag_of_the_Ahom_Kingdom.svg/1200px-Flag_of_the_Ahom_Kingdom.svg.png"; 
const HERO_BG = "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/6f/35/66/rang-ghar.jpg?w=1400&h=800&s=1";

/**
 * ==========================================
 * TRANSLATIONS
 * ==========================================
 */
const TRANSLATIONS = {
  en: {
    appTitle: "Sibsagar Digital",
    subtitle: "A Comprehensive Digital Archive of Ahom Heritage",
    explore: "EXPLORE",
    home: "HOME GRID",
    timeline: "CHRONOLOGY",
    map: "MAP ROOM",
    tree: "ROYAL LINEAGE",
    gallery: "DIGITAL GALLERY",
    saved: "SAVED COLLECTION",
    collections: "COLLECTIONS",
    learn: "LEARN",
    quiz: "ROYAL CHALLENGE",
    admin: "CURATOR PORTAL",
    searchPlaceholder: "Search the archives...",
    readHistory: "Read History",
    seeAlso: "See Also",
    royalRecord: "Royal Record",
    return: "Return to Collection",
    est: "Est. 1228 CE",
    heroTitle: "The Golden Annals of the",
    heroSubtitle: "Ahom Kingdom",
    heroDesc: "Explore the history of the Swargadeos, the monumental architecture of Rangpur, and the unconquerable spirit of Lachit Borphukan.",
    viewTimeline: "View Timeline",
    takeQuiz: "Take Quiz",
    entries: "artifacts archived",
    noRecords: "No records found matching your criteria.",
    reset: "Reset Archive",
    quizCompleted: "Quiz Completed!",
    retake: "Retake Challenge",
    score: "You scored",
    glory: "Legacy Preserved",
    loginTitle: "Curator Access",
    loginDesc: "Please enter your credentials to manage the archive.",
    username: "Username",
    password: "Password",
    loginBtn: "Access Archives",
    dashboard: "Admin Dashboard",
    addNew: "Add New Article",
    editItem: "Edit Article",
    manageContent: "Artifacts",
    managePages: "Pages & Info",
    manageResources: "Resources (PDF)",
    actions: "Actions",
    cancel: "Cancel",
    saveItem: "Save Changes",
    formTitle: "Article Title",
    formCategory: "Category",
    formYear: "Year",
    formSummary: "Short Summary",
    formImage: "Main Image URL",
    sections: "Article Sections (Wikipedia Style)",
    infobox: "Infobox Data",
    addSection: "Add Section",
    addRow: "Add Row",
    aboutProject: "About Project",
    authSpeech: "Authority Speech",
    research: "Research & Resources",
    districtInfo: "Sivasagar District",
    footerDev: "Developed by Department of Computer Science, Sibsagar University",
    footerRights: "© 2024 Sibsagar Digital. All Rights Preserved.",
    contactUs: "Contact Us",
    quickLinks: "Quick Links",
    resources: "Resources",
    address: "Sibsagar University, Joysagar, Assam 785665",
    email: "archive@sibsagaruniversity.ac.in",
    phone: "+91 3772 222222",
    share: "Share",
    shareTitle: "Share this Artifact",
    copyLink: "Copy Link",
    copied: "Copied!",
    didYouKnow: "Did You Know?",
    fact: "The Ahom Kingdom is the only dynasty in India that successfully defeated the Mughals 17 times.",
    cite: "Cite",
    citation: "Citation Copied",
    info: "INFORMATION",
    comments: "Community Discussion",
    postComment: "Post Comment",
    download: "Download PDF",
    zoom: "Zoom",
    messages: "Inbox",
    stats: "Overview",
    sectionHeader: "Header",
    sectionText: "Content...",
    sectionImg: "Section Image URL (Optional)",
    sectionCap: "Image Caption",
    uploadPdf: "Upload PDF Document",
    fileName: "File Name",
    fileType: "Document Type",
    msgSuccess: "Success",
    sysOnline: "System Online",
    sysOffline: "Backend Disconnected"
  },
  as: {
    appTitle: "শিৱসাগৰ ডিজিটেল",
    subtitle: "আহোম ঐতিহ্যৰ এক বিস্তৃত ডিজিটেল সংগ্ৰহ",
    explore: "অন্বেষণ",
    home: "মূল পৃষ্ঠা",
    timeline: "কালক্ৰম",
    map: "মানচিত্ৰ",
    tree: "বংশাৱলী",
    gallery: "চিত্ৰশালা",
    saved: "সংৰক্ষিত সংগ্ৰহ",
    collections: "বিভাগসমূহ",
    learn: "শিকক",
    quiz: "ৰাজকীয় প্ৰশ্নোত্তৰ",
    admin: "কিউৰেটৰ প্ৰৱেশ",
    searchPlaceholder: "সংগ্ৰহালয়ত অনুসন্ধান কৰক...",
    readHistory: "বুৰঞ্জী পঢ়ক",
    seeAlso: "অধিক চাওক",
    royalRecord: "ৰাজকীয় তথ্য",
    return: "উভতি যাওক",
    est: "স্থাপিত ১২২৮ খ্ৰীঃ",
    heroTitle: "আহোম সাম্ৰাজ্যৰ",
    heroSubtitle: "স্বৰ্ণিল ইতিহাস",
    heroDesc: "স্বৰ্গদেউসকলৰ ইতিহাস, ৰংপুৰৰ স্থাপত্য আৰু লাচিত বৰফুকনৰ অপৰাজেয় সাহসিকতা অন্বেষণ কৰক।",
    viewTimeline: "কালক্ৰম চাওক",
    takeQuiz: "প্ৰশ্নোত্তৰ",
    entries: "টা তথ্য সংৰক্ষিত",
    noRecords: "আপোনাৰ অনুসন্ধানৰ লগত মিল থকা কোনো তথ্য পোৱা নগল।",
    reset: "পুনৰাই আৰম্ভ কৰক",
    quizCompleted: "প্ৰশ্নোত্তৰ সমাপ্ত!",
    retake: "পুনৰ চেষ্টা কৰক",
    score: "আপোনাৰ স্ক'ৰ",
    glory: "ঐতিহ্য সংৰক্ষিত",
    loginTitle: "কিউৰেটৰ প্ৰৱেশ",
    loginDesc: "অনুগ্রহ কৰি আৰ্কাইভ পৰিচালনা কৰিবলৈ আপোনাৰ তথ্য প্ৰবিষ্ট কৰক।",
    username: "ব্যৱহাৰকাৰীৰ নাম",
    password: "পাচৱৰ্ড",
    loginBtn: "প্ৰৱেশ কৰক",
    dashboard: "প্ৰশাসকৰ ডেশ্ববৰ্ড",
    addNew: "নতুন যোগ কৰক",
    editItem: "সম্পাদনা কৰক",
    manageContent: "সমল পৰিচালনা",
    managePages: "পৃষ্ঠা আৰু তথ্য",
    manageResources: "সম্পদ (PDF)",
    actions: "কাৰ্যসমূহ",
    cancel: "বাতিল কৰক",
    saveItem: "সংৰক্ষণ কৰক",
    formTitle: "শিৰোনাম",
    formCategory: "বিভাগ",
    formYear: "বৰ্ষ",
    formSummary: "সাৰাংশ",
    formImage: "চিত্ৰ ইউ.আৰ.এল",
    sections: "বিষয়বস্তুৰ অংশ",
    infobox: "তথ্য পেৰা",
    addSection: "অংশ যোগ কৰক",
    addRow: "শাৰী যোগ কৰক",
    aboutProject: "প্ৰকল্পৰ বিষয়ে",
    authSpeech: "কৰ্তৃপক্ষৰ ভাষণ",
    research: "গৱেষণা আৰু সমল",
    districtInfo: "শিৱসাগৰ জিলা",
    footerDev: "কম্পিউটাৰ বিজ্ঞান বিভাগ, শিৱসাগৰ বিশ্ববিদ্যালয়ৰ দ্বাৰা বিকশিত",
    footerRights: "© ২০২৪ শিৱসাগৰ ডিজিটেল। সৰ্বস্বত্ব সংৰক্ষিত।",
    contactUs: "যোগাযোগ",
    quickLinks: "লিংকসমূহ",
    resources: "সমলসমূহ",
    address: "শিৱসাগৰ বিশ্ববিদ্যালয়, জয়সাগৰ, অসম ৭৮৫৬৬৫",
    email: "archive@sibsagaruniversity.ac.in",
    phone: "+৯১ ৩৭৭২ ২২২২২২",
    share: "শ্বেয়াৰ কৰক",
    shareTitle: "এই তথ্য শ্বেয়াৰ কৰক",
    copyLink: "লিংক কপি কৰক",
    copied: "কপি কৰা হ'ল!",
    didYouKnow: "আপুনি জানেনে?",
    fact: "আহোম সাম্ৰাজ্য ভাৰতৰ একমাত্ৰ ৰাজবংশ যিয়ে মোগলক ১৭ বাৰ সফলতাৰে পৰাজিত কৰিছিল।",
    cite: "উদ্ধৃতি",
    citation: "উদ্ধৃতি কপি কৰা হ'ল",
    info: "তথ্য",
    comments: "মন্তব্য",
    postComment: "পোষ্ট কৰক",
    download: "ডাউনলোড",
    zoom: "জুম",
    messages: "ইনবক্স",
    stats: "পৰ্যবেক্ষণ",
    sectionHeader: "শিৰোনাম",
    sectionText: "বিষয়বস্তু...",
    sectionImg: "ছবি লিংক (ঐচ্ছিক)",
    sectionCap: "ছবিৰ বিৱৰণ",
    uploadPdf: "PDF আপলোড কৰক",
    fileName: "ফাইলৰ নাম",
    fileType: "ফাইলৰ ধৰণ",
    msgSuccess: "সফল",
    sysOnline: "সিস্টেম সক্ৰিয়",
    sysOffline: "চাৰ্ভাৰ সংযোগ বিচ্ছিন্ন"
  },
  hi: {
    appTitle: "शिवसागर डिजिटल",
    subtitle: "अहोम विरासत का एक व्यापक डिजिटल संग्रह",
    explore: "अन्वेषण",
    home: "मुख्य पृष्ठ",
    timeline: "कालक्रम",
    map: "मानचित्र कक्ष",
    tree: "शाही वंशावली",
    gallery: "डिजिटल गैलरी",
    saved: "सहेजा गया संग्रह",
    collections: "संग्रह",
    learn: "सीखें",
    quiz: "शाही प्रश्नोत्तरी",
    admin: "क्यूरेटर पोर्टल",
    searchPlaceholder: "अभिलेखागार खोजें...",
    readHistory: "इतिहास पढ़ें",
    seeAlso: "यह भी देखें",
    royalRecord: "शाही रिकॉर्ड",
    return: "संग्रह पर वापस",
    est: "स्थापना १२२८ ई",
    heroTitle: "अहोम साम्राज्य का",
    heroSubtitle: "स्वर्णिम इतिहास",
    heroDesc: "स्वर्गदेवों के इतिहास, रंगपुर की स्मारक वास्तुकला और लचित बोरफुकन की अदम्य भावना का अन्वेषण करें।",
    viewTimeline: "कालक्रम देखें",
    takeQuiz: "प्रश्नोत्तरी लें",
    entries: "कलाकृतियां संग्रहीत",
    noRecords: "आपके मानदंडों से मेल खाने वाले कोई रिकॉर्ड नहीं मिले।",
    reset: "रीसेट करें",
    quizCompleted: "प्रश्नोत्तरी पूर्ण!",
    retake: "पुनः प्रयास करें",
    score: "आपका स्कोर",
    glory: "विरासत संरक्षित",
    loginTitle: "क्यूरेटर लॉगिन",
    loginDesc: "कृपया अभिलेखागार का प्रबंधन करने के लिए अपना विवरण दर्ज करें।",
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    loginBtn: "प्रवेश करें",
    dashboard: "एडमिन डैशबोर्ड",
    addNew: "नई वस्तु जोड़ें",
    editItem: "संपादित करें",
    manageContent: "सामग्री प्रबंधन",
    managePages: "पृष्ठ और जानकारी",
    manageResources: "संसाधन (PDF)",
    actions: "क्रियाएं",
    cancel: "रद्द करें",
    saveItem: "सहेजें",
    formTitle: "शीर्षक",
    formCategory: "श्रेणी",
    formYear: "वर्ष",
    formSummary: "सारांश",
    formImage: "छवि URL",
    sections: "सामग्री अनुभाग",
    infobox: "इन्फोबॉक्स डेटा",
    addSection: "अनुभाग जोड़ें",
    addRow: "पंक्ति जोड़ें",
    aboutProject: "परियोजना के बारे में",
    authSpeech: "प्राधिकरण भाषण",
    research: "अनुसंधान और संसाधन",
    districtInfo: "शिवसागर जिला",
    footerDev: "कंप्यूटर विज्ञान विभाग, शिवसागर विश्वविद्यालय द्वारा विकसित",
    footerRights: "© २०२४ शिवसागर डिजिटल। सर्वाधिकार सुरक्षित।",
    contactUs: "संपर्क करें",
    quickLinks: "त्वरित लिंक",
    resources: "संसाधन",
    address: "शिवसागर विश्वविद्यालय, जयसागर, असम ७८५६६५",
    email: "archive@sibsagaruniversity.ac.in",
    phone: "+९१ ३७७२ २२२२२२",
    share: "साझा करें",
    shareTitle: "इस जानकारी को साझा करें",
    copyLink: "लिंक कॉपी करें",
    copied: "कॉपी किया गया!",
    didYouKnow: "क्या आप जानते हैं?",
    fact: "अहोम साम्राज्य भारत का एकमात्र राजवंश है जिसने मुगलों को १७ बार सफलतापूर्वक हराया।",
    cite: "उद्धरण",
    citation: "उद्धरण कॉपी किया गया",
    info: "जानकारी",
    comments: "टिप्पणियाँ",
    postComment: "पोस्ट करें",
    download: "डाउनलोड",
    zoom: "ज़ूम",
    messages: "इनबॉक्स",
    stats: "अवलोकन",
    sectionHeader: "शीर्षक",
    sectionText: "सामग्री...",
    sectionImg: "छवि लिंक (वैकल्पिक)",
    sectionCap: "छवि कैप्शन",
    uploadPdf: "PDF अपलोड करें",
    fileName: "फ़ाइल का नाम",
    fileType: "फ़ाइल प्रकार",
    msgSuccess: "सफल",
    sysOnline: "सिस्टम ऑनलाइन",
    sysOffline: "सर्वर डिस्कनेक्ट"
  }
};

/**
 * ==========================================
 * DATA ARCHIVE (MOCK FALLBACK)
 * ==========================================
 */
const CATEGORIES = [
  { id: 'all', label: 'ALL ARCHIVES', icon: Book, labelAs: "সকলো তথ্য", labelHi: "सभी अभिलेखागार" },
  { id: 'kings', label: 'SWARGADEOS', icon: Crown, labelAs: "স্বৰ্গদেউসকল", labelHi: "स्वर्गदेव (राजा)" },
  { id: 'wars', label: 'BATTLES', icon: Sword, labelAs: "যুদ্ধ আৰু সামৰিক", labelHi: "युद्ध और सैन्य" },
  { id: 'architecture', label: 'MONUMENTS', icon: Landmark, labelAs: "স্থাপত্য আৰু দুৰ্গ", labelHi: "वास्तुकला और किले" },
  { id: 'people', label: 'FIGURES', icon: User, labelAs: "প্ৰখ্যাত ব্যক্তি", labelHi: "प्रमुख व्यक्ति" },
  { id: 'culture', label: 'CULTURE', icon: Scroll, labelAs: "সংস্কৃতি আৰু পৰম্পৰা", labelHi: "संस्कृति और परंपरा" },
];

const INITIAL_DB = [
  {
    id: 'sukaphaa',
    title: 'Chaolung Sukaphaa',
    category: 'kings',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Sukaphaa.jpg/640px-Sukaphaa.jpg',
    summary: 'The founder of the Ahom Kingdom who established his capital at Charaideo in 1228 CE, laying the foundation for 600 years of Ahom rule.',
    year: 1228,
    coords: { x: 80, y: 30 },
    lineageOrder: 1,
    successor: 'Sutephaa',
    content: [
      {
        header: 'The Great Journey',
        text: 'Chaolung Sukaphaa was a Tai prince from Mong Mao (present-day Yunnan province, China). He left his homeland in 1215 with a band of followers, crossing the rugged Patkai mountains to reach the Brahmaputra valley. His journey is celebrated as a feat of leadership and endurance, marking the beginning of the Tai-Ahom history in Assam.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Ahom_Raja_Palace.jpg/320px-Ahom_Raja_Palace.jpg',
        caption: 'Traditional depiction of the migration'
      },
      {
        header: 'Establishment of the Kingdom',
        text: 'In 1228, he entered the Brahmaputra valley. Unlike other conquerors, Sukaphaa adopted a policy of assimilation and conciliation with the local tribes (Moran and Borahi), laying the foundation for the "Greater Assamese" society. He established his permanent capital at Charaideo in 1253, which became the sacred burial ground for future kings.',
      }
    ],
    infobox: [
      { label: 'Reign', value: '1228–1268 CE' },
      { label: 'Title', value: 'Swargadeo (Heavenly King)' },
      { label: 'Capital', value: 'Charaideo' },
      { label: 'Successor', value: 'Sutephaa' },
    ]
  },
  // ... (Other initial items kept as fallback)
];

const QUIZ_QUESTIONS = [
  { id: 1, question: "Who was the founder of the Ahom Kingdom?", options: ["Rudra Singha", "Lachit Borphukan", "Chaolung Sukaphaa", "Pramatta Singha"], correct: 2 },
  { id: 2, question: "Which battle marked the decisive defeat of the Mughals by the Ahoms?", options: ["Battle of Plassey", "Battle of Saraighat", "Battle of Itakhuli", "Battle of Panipat"], correct: 1 },
  { id: 3, question: "What is the traditional Ahom burial mound called?", options: ["Stupa", "Maidam", "Gumbaz", "Samadhi"], correct: 1 },
  { id: 4, question: "Which Ahom king built the Rang Ghar?", options: ["Rudra Singha", "Shiva Singha", "Pramatta Singha", "Rajeswar Singha"], correct: 2 },
  { id: 5, question: "Where was the first capital of the Ahom Kingdom established?", options: ["Garhgaon", "Rangpur", "Jorhat", "Charaideo"], correct: 3 }
];

const INITIAL_RESOURCES = [
    { id: 1, title: "Architecture of the Ahom Dynasty: A Study of Rangpur", author: "Dr. A. Baruah, 2021", type: "Academic Paper" },
    { id: 2, title: "Military Strategies of Lachit Borphukan", author: "K. Gogoi, 2019", type: "Academic Paper" },
    { id: 3, title: "Economic History of Pre-Colonial Assam", author: "S. Saikia, 2023", type: "Academic Paper" },
    { id: 4, title: "ASI Circle Report: Sivasagar Zone", author: "Archaeological Survey of India, 2022", type: "Official Report" },
    { id: 5, title: "UNESCO World Heritage Dossier: Charaideo", author: "Dept of Cultural Affairs, 2023", type: "Official Report" }
];

const INITIAL_CMS = {
    about: {
        title: "About Project",
        text: "Sibsagar Digital is a comprehensive effort to digitize, preserve, and showcase the rich heritage of the Ahom Kingdom. Initiated by the Department of Computer Science at Sibsagar University, this project serves as a bridge between the glorious past of the 600-year Ahom rule and the digital future.\n\nOur mission is to create an accessible, educational, and immersive platform for students, researchers, and history enthusiasts worldwide. By archiving architectural marvels, military strategies, and cultural traditions, we aim to keep the legacy of the Swargadeos alive."
    },
    speech: {
        title: "Authority Speech",
        text: "\"The history of Sivasagar is not just the history of a district, but the soul of Assamese identity. This digital archive is a monumental step towards preserving our roots for generations to come.\"\n\n- Vice Chancellor, Sibsagar University"
    },
    district: {
        title: "Sivasagar District",
        text: "Sivasagar, formerly known as Rangpur, was the capital of the Ahom Kingdom from 1699 to 1788. The district derives its name from the Sivasagar Tank, commissioned by Queen Ambika in 1734.\n\nToday, it stands as a testament to the engineering prowess of the Ahoms, dotted with maidams (burial mounds), temples, and palaces that have survived centuries of weathering and earthquakes."
    }
};

/**
 * ==========================================
 * HELPER COMPONENTS
 * ==========================================
 */
const TimelineItem = ({ item, isDarkMode, onClick }) => (
  <div onClick={onClick} className="relative mb-10 ml-6 cursor-pointer group animate-in slide-in-from-right duration-500">
    <div className={`absolute -left-[41px] flex items-center justify-center w-8 h-8 rounded-full ring-4 ${isDarkMode ? 'bg-stone-800 ring-stone-900 text-amber-500' : 'bg-amber-100 ring-stone-50 text-amber-600'}`}>
        <Crown className="w-4 h-4" />
    </div>
    <div className={`p-4 rounded-lg border shadow-sm transition-all group-hover:scale-[1.02] group-hover:shadow-md ${isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
        <div className="flex flex-col md:flex-row gap-4">
            {item.image && <img src={item.image} alt={item.title} className="w-full md:w-32 h-32 object-cover rounded-md" />}
            <div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-800'}`}>{item.year} CE</span>
                <h3 className={`text-xl font-bold font-serif mt-2 ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>{item.title}</h3>
                <p className={`text-sm mt-2 line-clamp-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{item.summary}</p>
            </div>
        </div>
    </div>
  </div>
);

/**
 * ==========================================
 * MAIN COMPONENT
 * ==========================================
 */
const App = () => {
  const [view, setView] = useState('grid'); 
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeArticleId, setActiveArticleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [savedIds, setSavedIds] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lang, setLang] = useState('en'); 
  const [backendOnline, setBackendOnline] = useState(false);
  
  // Data States
  const [db, setDb] = useState(INITIAL_DB); // Fallback init
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [cmsContent, setCmsContent] = useState(INITIAL_CMS);

  // UI States
  const [fontSize, setFontSize] = useState(16);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  
  // Auth & Admin State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', category: 'kings', year: '', summary: '', image: '', content: [{ header: '', text: '', image: '', caption: '' }], infobox: [{ label: '', value: '' }] });
  const [newResource, setNewResource] = useState({ title: '', author: '', type: 'Academic Paper' });
  const [editingCms, setEditingCms] = useState(null); 
  const [tempCmsText, setTempCmsText] = useState('');

  const [inbox, setInbox] = useState([
      { id: 1, from: "Student", subject: "Research Access", msg: "Hello, I am a PhD student requesting access to the Archives.", date: "2 hrs ago" },
      { id: 2, from: "Tourist", subject: "Visiting Hours", msg: "Is the Rang Ghar open on Sundays?", date: "1 day ago" }
  ]);
  const [adminTab, setAdminTab] = useState('content'); 

  // Comments State
  const [comments, setComments] = useState({}); 
  const [newComment, setNewComment] = useState('');

  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Helper for translations
  const t = (key) => TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key];

  /**
   * ==========================================
   * BACKEND INTEGRATION
   * ==========================================
   */
  
  // Fetch Artifacts from Backend
  useEffect(() => {
    fetch(`${API_URL}/api/artifacts`)
      .then(res => res.json())
      .then(data => {
         if(Array.isArray(data) && data.length > 0) {
            // Map backend fields to frontend structure
            const mappedData = data.map(item => ({
                ...item,
                image: item.main_image_url || item.image, // Handle backend snake_case
                // Ensure content and infobox arrays exist if missing
                content: item.content || [],
                infobox: item.infobox || []
            }));
            setDb(mappedData);
            setBackendOnline(true);
         }
      })
      .catch(err => {
          console.log("Backend offline, using fallback data.");
          setBackendOnline(false);
      });

    fetch(`${API_URL}/api/resources`)
       .then(res => res.json())
       .then(data => {
           if(Array.isArray(data) && data.length > 0) setResources(data);
       })
       .catch(err => console.log("Resources backend offline."));
  }, []);

  // Fetch Full Article Details on Click (Lazy Load)
  const handleArticleClick = async (id) => {
    setActiveArticleId(id);
    setView('article');

    // Fetch full details from backend if available
    try {
        const res = await fetch(`${API_URL}/api/artifacts/${id}`);
        if (res.ok) {
            const detailData = await res.json();
            // Merge details into local DB state
            setDb(prev => prev.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        ...detailData,
                        image: detailData.main_image_url || detailData.image,
                        content: detailData.content || [],
                        infobox: detailData.infobox || []
                    };
                }
                return item;
            }));
        }
    } catch (e) {
        // Silent fail, rely on what we have
    }
  };

  // Helper to trigger Google Translate
  const changeLanguage = (langCode) => {
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event('change'));
    }
    setLang(langCode);
  };

  useEffect(() => {
    if (!document.querySelector('#google_translate_script')) {
      const script = document.createElement('script');
      script.id = 'google_translate_script';
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
      
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          includedLanguages: 'en,as,hi,bn', 
          autoDisplay: false
        }, 'google_translate_element');
      };
    }
  }, []);

  // Stop speaking when navigating away
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, [view, activeArticleId]);

  // Theme Config
  const theme = isDarkMode ? {
    bg: "bg-stone-950",
    sidebar: "bg-stone-900 border-stone-800",
    sidebarHeader: "bg-stone-900",
    header: "bg-stone-900/90 border-stone-800",
    text: "text-stone-200",
    textMuted: "text-stone-400",
    card: "bg-stone-900 border-stone-800 hover:border-amber-700",
    accent: "text-amber-500",
    accentBg: "bg-amber-900/30 text-amber-400",
    input: "bg-stone-800 border-stone-700 text-stone-200 placeholder-stone-500 focus:ring-amber-900",
    divider: "border-stone-800",
    activeNav: "bg-stone-800 text-amber-400 border-amber-800",
    inactiveNav: "text-stone-400 hover:bg-stone-800"
  } : {
    bg: "bg-stone-50",
    sidebar: "bg-white border-stone-200",
    sidebarHeader: "bg-stone-50",
    header: "bg-white/80 border-stone-200",
    text: "text-stone-900",
    textMuted: "text-stone-600",
    card: "bg-white border-stone-200 hover:border-amber-300",
    accent: "text-amber-700",
    accentBg: "bg-amber-50 text-amber-900",
    input: "bg-white border-stone-300 text-stone-900 placeholder-stone-400 focus:ring-amber-500/30",
    divider: "border-stone-200",
    activeNav: "bg-amber-50 text-amber-900 border-amber-200",
    inactiveNav: "text-stone-600 hover:bg-stone-100"
  };

  // Filter Data
  const filteredData = useMemo(() => {
    let data = db;
    if (activeCategory === 'saved') {
      data = data.filter(item => savedIds.includes(item.id));
    } else if (activeCategory !== 'all') {
      data = data.filter(item => item.category === activeCategory);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(item => {
        const title = item.title?.toLowerCase() || "";
        const summary = item.summary?.toLowerCase() || "";
        return title.includes(q) || summary.includes(q);
      });
    }
    if (view === 'timeline') {
      return [...data].sort((a, b) => a.year - b.year);
    }
    if (view === 'tree') {
        return [...db].filter(i => i.category === 'kings').sort((a, b) => (a.lineageOrder || 999) - (b.lineageOrder || 999));
    }
    return data;
  }, [activeCategory, searchQuery, view, savedIds, db]);

  const activeArticle = useMemo(() => 
    db.find(item => item.id === activeArticleId), 
  [activeArticleId, db]);

  const relatedArticles = useMemo(() => {
    if (!activeArticle) return [];
    return db.filter(item => 
      item.id !== activeArticle.id && 
      (item.category === activeArticle.category || Math.abs(item.year - activeArticle.year) < 50)
    ).slice(0, 3);
  }, [activeArticle, db]);

  // Actions
  const toggleSave = (e, id) => {
    e.stopPropagation();
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (activeArticle) {
      const text = `${activeArticle.title}. ${activeArticle.summary}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      if(lang === 'as') utterance.lang = 'bn-IN';
      if(lang === 'hi') utterance.lang = 'hi-IN';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handlePrint = () => window.print();

  const handleShare = () => {
      setShowShareModal(true);
      setCopied(false);
  };

  const copyToClipboard = () => {
      const dummyUrl = `https://sibsagardigital.in/archive/${activeArticleId}`;
      navigator.clipboard.writeText(dummyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handlePostComment = () => {
      if(!newComment.trim()) return;
      const commentObj = {
          user: "Guest User", // Mock
          text: newComment,
          date: new Date().toLocaleDateString()
      };
      setComments(prev => ({
          ...prev,
          [activeArticleId]: [...(prev[activeArticleId] || []), commentObj]
      }));
      setNewComment('');
  };

  // Admin Logic
  const handleLogin = (e) => {
      e.preventDefault();
      setIsLoggedIn(true);
      setView('admin');
  };

  const handleSaveItem = async (e) => {
      e.preventDefault();
      
      try {
        // Attempt to save to backend
        const res = await fetch(`${API_URL}/api/artifacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });

        if (res.ok) {
            // Refetch or update locally
            const newItemWithDefaults = { ...newItem, id: newItem.id || Date.now().toString(), year: parseInt(newItem.year) || 0 };
            setDb(prev => {
                const exists = prev.some(i => i.id === newItemWithDefaults.id);
                return exists ? prev.map(i => i.id === newItemWithDefaults.id ? newItemWithDefaults : i) : [newItemWithDefaults, ...prev];
            });
            alert('Article saved to backend database!');
        } else {
             throw new Error('Backend error');
        }
      } catch (err) {
        // Fallback to local state if backend fails
        console.error(err);
        const item = { ...newItem, id: newItem.id || Date.now().toString(), year: parseInt(newItem.year) || 0 };
        setDb(prev => [item, ...prev]);
        alert('Backend offline: Saved locally (changes will be lost on refresh)');
      }

      setShowAddModal(false);
      setNewItem({ title: '', category: 'kings', year: '', summary: '', image: '', content: [{ header: '', text: '', image: '', caption: '' }], infobox: [{ label: '', value: '' }] });
  };

  // CMS & Resources
  const handleSaveCms = (key) => {
      setCmsContent(prev => ({ ...prev, [key]: { ...prev[key], text: tempCmsText } }));
      setEditingCms(null);
  };

  const handleSaveResource = async (e) => {
      e.preventDefault();
      
      const fileInput = document.getElementById('resourceFile');
      if (!fileInput || !fileInput.files[0]) {
          alert("Please select a file");
          return;
      }

      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      formData.append('title', newResource.title);
      formData.append('author', newResource.author);
      formData.append('type', newResource.type);

      try {
          const res = await fetch(`${API_URL}/api/resources/upload`, {
              method: 'POST',
              body: formData
          });
          
          if(res.ok) {
             // Refresh resources
             const updated = await fetch(`${API_URL}/api/resources`).then(r => r.json());
             setResources(updated);
             alert("File uploaded successfully!");
          } else {
              throw new Error("Upload failed");
          }
      } catch (err) {
          console.error(err);
          const res = { ...newResource, id: Date.now() };
          setResources(prev => [res, ...prev]);
          alert("Backend offline: Resource mock-added.");
      }
      
      setShowResourceModal(false);
      setNewResource({ title: '', author: '', type: 'Academic Paper' });
  };

  const handleDeleteResource = (id) => setResources(prev => prev.filter(r => r.id !== id));

  // Form Field Helpers
  const updateContentSection = (idx, field, value) => {
      const newContent = [...newItem.content];
      newContent[idx][field] = value;
      setNewItem({...newItem, content: newContent});
  };
  const addContentSection = () => setNewItem({...newItem, content: [...newItem.content, { header: '', text: '', image: '', caption: '' }]});
  const removeContentSection = (idx) => setNewItem({...newItem, content: newItem.content.filter((_, i) => i !== idx)});
  const updateInfoboxRow = (idx, field, value) => {
      const newInfobox = [...newItem.infobox];
      newInfobox[idx][field] = value;
      setNewItem({...newItem, infobox: newInfobox});
  };
  const addInfoboxRow = () => setNewItem({...newItem, infobox: [...newItem.infobox, { label: '', value: '' }]});
  const removeInfoboxRow = (idx) => setNewItem({...newItem, infobox: newItem.infobox.filter((_, i) => i !== idx)});
  const handleDelete = (id) => { if(window.confirm("Are you sure?")) setDb(prev => prev.filter(item => item.id !== id)); };
  const handleEditClick = (item) => { setNewItem({...item, content: item.content || [], infobox: item.infobox || []}); setShowAddModal(true); };

  // Quiz Handlers
  const handleQuizAnswer = (idx) => {
    setSelectedAnswer(idx);
    setTimeout(() => {
      if (idx === QUIZ_QUESTIONS[currentQuestion].correct) setQuizScore(s => s + 1);
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(c => c + 1);
        setSelectedAnswer(null);
      } else {
        setShowQuizResult(true);
      }
    }, 800);
  };
  const resetQuiz = () => { setCurrentQuestion(0); setQuizScore(0); setShowQuizResult(false); setSelectedAnswer(null); };

  // Generic Page Component
  const InfoPage = ({ pageKey, icon: Icon }) => {
    const content = cmsContent[pageKey];
    return (
      <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500">
          <div className="mb-8 border-b pb-4 border-stone-300">
              <h1 className={`text-4xl font-serif font-bold mb-2 flex items-center gap-3 ${theme.text}`}>
                  <Icon className="w-8 h-8 text-amber-600" />
                  {t(pageKey === 'about' ? 'aboutProject' : pageKey === 'speech' ? 'authSpeech' : 'districtInfo')}
              </h1>
          </div>
          <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''} whitespace-pre-wrap ${theme.text}`}>
              {content.text}
          </div>
      </div>
    );
  };

  return (
    <div 
      className={`flex h-screen ${theme.bg} ${theme.text} font-sans overflow-hidden transition-colors duration-300 ${lang === 'as' ? 'lang-as' : (lang === 'hi' ? 'lang-hi' : '')}`}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;700&family=Noto+Serif+Devanagari:wght@400;700&display=swap');
          
          /* Global Font Mapping based on root class */
          .lang-as * { font-family: 'Noto Serif Bengali', serif !important; }
          .lang-hi * { font-family: 'Noto Serif Devanagari', serif !important; }
          
          .goog-te-banner-frame { display: none !important; }
          body { top: 0px !important; }
          #google_translate_element { display: none; } 
          @media print {
            aside, header, footer, .no-print { display: none !important; }
            .print-full-width { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; }
            body { background: white !important; color: black !important; }
            .print-bg-white { background: white !important; border: none !important; box-shadow: none !important; }
          }
        `}
      </style>
      
      {lightboxImg && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300" onClick={() => setLightboxImg(null)}>
              <img src={lightboxImg} alt="Fullscreen" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
              <button className="absolute top-6 right-6 text-white hover:text-amber-500"><X className="w-8 h-8" /></button>
          </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden no-print"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-72 ${theme.sidebar} border-r transform transition-transform duration-300 z-40 flex flex-col shadow-xl md:shadow-none no-print
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        notranslate
      `}>
        <div className={`p-6 border-b ${theme.divider} ${theme.sidebarHeader} flex flex-col gap-2`}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView('grid'); setActiveArticleId(null); }}>
            <img src={LOGO_URL} alt="Logo" className="w-14 h-14 object-contain" />
            <span className={`font-serif font-bold text-xl leading-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>
              {t('appTitle')}
            </span>
          </div>
          <p className={`text-[10px] italic pl-1 border-l-2 border-amber-500 ml-1 ${theme.textMuted}`}>
            {t('subtitle')}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ml-2 mt-2 ${theme.textMuted}`}>{t('explore')}</div>
          {['home', 'timeline', 'map', 'tree', 'gallery'].map((v, idx) => {
             const key = ['home', 'timeline', 'map', 'tree', 'gallery'][idx];
             return (
             <button
                key={key}
                onClick={() => { 
                    setView(key === 'home' ? 'grid' : key); 
                    setActiveArticleId(null); 
                    if(key === 'timeline') setActiveCategory('all');
                    setIsSidebarOpen(false); 
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide transition-colors ${view === (key==='home'?'grid':key) && !activeArticleId ? theme.activeNav : theme.inactiveNav}`}
             >
                {key === 'home' && <Home className="w-4 h-4" />}
                {key === 'timeline' && <Clock className="w-4 h-4" />}
                {key === 'map' && <MapPin className="w-4 h-4" />}
                {key === 'tree' && <GitMerge className="w-4 h-4" />}
                {key === 'gallery' && <ImageIcon className="w-4 h-4" />}
                {t(key)}
             </button>
          )})}

           <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ml-2 mt-4 ${theme.textMuted}`}>{t('saved')}</div>
           <button
            onClick={() => { setActiveCategory('saved'); setActiveArticleId(null); setView('grid'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide transition-colors ${activeCategory === 'saved' ? theme.activeNav : theme.inactiveNav}`}
          >
            <Bookmark className="w-4 h-4" /> {t('saved')}
            {savedIds.length > 0 && <span className="ml-auto bg-amber-600 text-white text-[10px] px-1.5 rounded-full">{savedIds.length}</span>}
          </button>

          <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ml-2 mt-4 ${theme.textMuted}`}>{t('collections')}</div>
          {CATEGORIES.slice(1).map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setActiveArticleId(null); setView('grid'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide transition-colors ${activeCategory === cat.id ? theme.activeNav : theme.inactiveNav}`}
            >
              <cat.icon className="w-4 h-4 opacity-70" />
              <span>{lang === 'as' ? cat.labelAs : (lang === 'hi' ? cat.labelHi : cat.label)}</span>
            </button>
          ))}

          <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ml-2 mt-4 ${theme.textMuted}`}>{t('learn')}</div>
           <button onClick={() => { setView('quiz'); setActiveArticleId(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide transition-colors ${view === 'quiz' ? theme.activeNav : theme.inactiveNav}`}>
            <Brain className="w-4 h-4" /> {t('quiz')}
          </button>
          
          <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ml-2 mt-4 ${theme.textMuted}`}>{t('info')}</div>
           <button onClick={() => { setView('about'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${view === 'about' ? theme.activeNav : theme.inactiveNav}`}><Info className="w-4 h-4" /> {t('aboutProject')}</button>
           <button onClick={() => { setView('speech'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${view === 'speech' ? theme.activeNav : theme.inactiveNav}`}><Building2 className="w-4 h-4" /> {t('authSpeech')}</button>
           <button onClick={() => { setView('research'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${view === 'research' ? theme.activeNav : theme.inactiveNav}`}><GraduationCap className="w-4 h-4" /> {t('research')}</button>
           <button onClick={() => { setView('district'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${view === 'district' ? theme.activeNav : theme.inactiveNav}`}><FileText className="w-4 h-4" /> {t('districtInfo')}</button>

          <div className={`mt-6 pt-4 border-t ${theme.divider}`}>
             <button
                onClick={() => { if(isLoggedIn) setView('admin'); else setView('login'); setActiveArticleId(null); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide transition-colors ${view === 'admin' || view === 'login' ? theme.activeNav : theme.inactiveNav}`}
             >
                <Lock className="w-4 h-4" /> {t('admin')}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden w-full relative print-full-width`}>
        
        {/* Header */}
        <header className={`h-16 border-b ${theme.divider} ${theme.header} backdrop-blur-md flex items-center px-4 md:px-8 justify-between shrink-0 z-10 sticky top-0 transition-colors no-print`}>
          <div className="flex items-center gap-4 w-full">
            <button className={`md:hidden p-2 rounded-md ${theme.inactiveNav}`} onClick={() => setIsSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
            <div className="flex-1 max-w-xl relative group ml-auto md:ml-0">
              {['grid', 'timeline', 'map', 'tree', 'article', 'gallery', 'quiz', 'research', 'about', 'speech', 'district', 'login', 'admin'].includes(view) && (
                <>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className={`h-4 w-4 ${theme.textMuted}`} /></div>
                  <input type="text" className={`block w-full pl-10 pr-3 py-2 border rounded-full leading-5 sm:text-sm transition-all shadow-sm focus:outline-none focus:ring-2 ${theme.input}`} placeholder={t('searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
                <div className={`flex items-center border rounded-full overflow-hidden ${theme.divider}`}>
                    <button onClick={() => setFontSize(s => Math.max(12, s - 2))} className={`px-2 py-1 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs ${theme.text}`}><MinusCircle className="w-3 h-3" /></button>
                    <span className={`px-2 text-xs font-bold ${theme.text}`}><Type className="w-3 h-3 inline mr-1" />{fontSize}</span>
                    <button onClick={() => setFontSize(s => Math.min(24, s + 2))} className={`px-2 py-1 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs ${theme.text}`}><PlusCircle className="w-3 h-3" /></button>
                </div>

                <div className={`flex items-center border rounded overflow-hidden ${theme.divider} notranslate`}>
                    <button onClick={() => changeLanguage('en')} className={`px-3 py-1 text-xs font-bold ${lang === 'en' ? 'bg-amber-600 text-white' : `hover:bg-stone-200 ${theme.text}`}`}>EN</button>
                    <button onClick={() => changeLanguage('hi')} className={`px-3 py-1 text-xs font-bold ${lang === 'hi' ? 'bg-amber-600 text-white' : `hover:bg-stone-200 ${theme.text}`}`}>HI</button>
                    <button onClick={() => changeLanguage('as')} className={`px-3 py-1 text-xs font-bold ${lang === 'as' ? 'bg-amber-600 text-white' : `hover:bg-stone-200 ${theme.text}`}`}>AS</button>
                </div>

                <div id="google_translate_element"></div>

                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-stone-800 text-amber-400' : 'bg-stone-100 text-stone-600'}`}>{isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className={`flex-1 overflow-y-auto scroll-smooth ${theme.bg} flex flex-col`}>
            <div className="flex-1">
              {view === 'article' && activeArticleId ? (
                // ARTICLE VIEW
                <article className="max-w-6xl mx-auto p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500 print-full-width">
                  
                  {/* Share Modal */}
                  {showShareModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 no-print">
                          <div className={`w-full max-w-sm p-6 rounded-xl shadow-2xl border ${theme.card} relative`}>
                              <button onClick={() => setShowShareModal(false)} className="absolute top-3 right-3 text-stone-400 hover:text-stone-600"><X className="w-5 h-5" /></button>
                              <h3 className={`text-lg font-bold mb-4 ${theme.text}`}>{t('shareTitle')}</h3>
                              <div className="flex gap-4 justify-center mb-6">
                                  <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"><Facebook className="w-5 h-5" /></button>
                                  <button className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600"><Twitter className="w-5 h-5" /></button>
                                  <button className="p-3 bg-pink-600 text-white rounded-full hover:bg-pink-700"><Instagram className="w-5 h-5" /></button>
                              </div>
                              <div className={`flex items-center gap-2 p-2 rounded border ${theme.divider} ${isDarkMode ? 'bg-stone-950' : 'bg-stone-50'}`}>
                                  <span className={`text-xs truncate flex-1 ${theme.textMuted}`}>https://sibsagardigital.in/archive/{activeArticleId}</span>
                                  <button onClick={copyToClipboard} className={`text-xs font-bold px-3 py-1 rounded ${copied ? 'bg-green-500 text-white' : 'bg-stone-200 text-stone-700'}`}>
                                      {copied ? t('copied') : t('copyLink')}
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}

                  <button onClick={() => setView('grid')} className={`mb-8 flex items-center text-sm font-medium ${theme.textMuted} hover:text-amber-600 transition-colors group no-print`}>
                    <div className={`border p-1.5 rounded-full mr-2 ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}><ChevronRight className="w-4 h-4 rotate-180" /></div>
                    {t('return')}
                  </button>

                  <div className="flex flex-col xl:flex-row gap-10">
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center justify-between mb-4`}>
                        <div className={`flex items-center gap-3 text-sm font-bold tracking-wider uppercase ${theme.accent}`}>
                            {CATEGORIES.find(c => c.id === activeArticle.category)?.icon && React.createElement(CATEGORIES.find(c => c.id === activeArticle.category).icon, { className: "w-4 h-4" })}
                            <span>{CATEGORIES.find(c => c.id === activeArticle.category)?.label}</span>
                        </div>
                        <div className="flex items-center gap-2 no-print">
                            <button onClick={() => {
                                navigator.clipboard.writeText(`${activeArticle.title}, Sibsagar Digital Archive. Accessed ${new Date().toLocaleDateString()}`);
                                alert(t('citation'));
                            }} className={`p-2 rounded-full hover:bg-stone-200/50 text-stone-400 hover:text-stone-600`} title={t('cite')}><Quote className="w-5 h-5" /></button>
                            <button onClick={handleShare} className={`p-2 rounded-full hover:bg-stone-200/50 text-stone-400 hover:text-stone-600`} title="Share"><Share2 className="w-5 h-5" /></button>
                            <button onClick={handleSpeak} className={`p-2 rounded-full ${isSpeaking ? 'bg-amber-100 text-amber-600 animate-pulse' : 'hover:bg-stone-200/50 text-stone-400 hover:text-stone-600'}`} title="Listen"><Volume2 className="w-5 h-5" /></button>
                            <button onClick={handlePrint} className={`p-2 rounded-full hover:bg-stone-200/50 text-stone-400 hover:text-stone-600`} title="Print"><Printer className="w-5 h-5" /></button>
                            <button onClick={(e) => toggleSave(e, activeArticle.id)} className={`p-2 rounded-full ${savedIds.includes(activeArticle.id) ? 'text-amber-600 bg-amber-50' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-200/50'}`} title="Save"><Bookmark className={`w-5 h-5 ${savedIds.includes(activeArticle.id) ? 'fill-current' : ''}`} /></button>
                        </div>
                      </div>
                      <h1 className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight ${theme.text}`}>{activeArticle.title}</h1>
                      <div style={{ fontSize: `${fontSize}px` }} className={`p-6 rounded-xl border-l-4 border-amber-600 shadow-sm mb-10 font-serif leading-relaxed italic print-bg-white ${isDarkMode ? 'bg-stone-900/50 text-stone-300' : 'bg-white text-stone-700'}`}>
                        "{activeArticle.summary}"
                      </div>
                      {activeArticle.content.map((section, idx) => (
                        <section key={idx} className="mb-8 group">
                          <h2 className={`text-2xl font-bold mb-4 flex items-center font-serif transition-colors ${theme.text} group-hover:text-amber-600`}>
                            <span className="text-amber-500/50 mr-2 text-3xl">§</span>
                            {section.header}
                          </h2>
                          {section.image && (
                              <div className="float-right ml-6 mb-4 w-1/3">
                                  <div className={`p-1 border rounded ${theme.divider} ${isDarkMode ? 'bg-stone-800' : 'bg-white'}`}>
                                      <img src={section.image} alt={section.caption || "Section Image"} className="w-full h-auto cursor-zoom-in" onClick={() => setLightboxImg(section.image)} />
                                      {section.caption && <p className={`text-xs text-center mt-1 italic ${theme.textMuted}`}>{section.caption}</p>}
                                  </div>
                              </div>
                          )}
                          <p style={{ fontSize: `${fontSize}px` }} className={`text-base leading-relaxed text-justify tracking-wide ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                            {section.text}
                          </p>
                          <div className="clear-both"></div>
                        </section>
                      ))}

                      {/* Comments Section */}
                      <div className={`mt-12 p-6 rounded-xl border ${theme.divider} ${isDarkMode ? 'bg-stone-900/50' : 'bg-stone-100/50'} no-print`}>
                          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme.text}`}><MessageSquare className="w-5 h-5" /> {t('comments')}</h3>
                          <div className="space-y-4 mb-6">
                              {(comments[activeArticle.id] || []).map((c, i) => (
                                  <div key={i} className="p-3 bg-white dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">
                                      <div className="flex justify-between items-center mb-1">
                                          <span className="font-bold text-xs text-amber-600">{c.user}</span>
                                          <span className={`text-xs ${theme.textMuted}`}>{c.date}</span>
                                      </div>
                                      <p className={`text-sm ${theme.text}`}>{c.text}</p>
                                  </div>
                              ))}
                              {(!comments[activeArticle.id] || comments[activeArticle.id].length === 0) && <p className={`text-sm italic ${theme.textMuted}`}>No comments yet. Be the first!</p>}
                          </div>
                          <div className="flex gap-2">
                              <input 
                                type="text" 
                                className={`flex-1 p-2 rounded border text-sm ${theme.input}`} 
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                              />
                              <button onClick={handlePostComment} className="bg-amber-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-amber-700">{t('postComment')}</button>
                          </div>
                      </div>
                    </div>
                    <div className="w-full xl:w-80 shrink-0 space-y-8">
                      <div className={`border ${theme.divider} shadow-lg rounded-lg overflow-hidden print-bg-white ${isDarkMode ? 'bg-stone-900' : 'bg-white'}`}>
                        <div className={`p-3 text-center border-b ${theme.divider} ${isDarkMode ? 'bg-stone-800' : 'bg-[#E4DFC9]'}`}>
                          <h3 className={`font-bold font-serif tracking-wide uppercase text-sm ${theme.text}`}>{t('royalRecord')}</h3>
                        </div>
                        {activeArticle.image && (
                          <div className={`p-3 border-b ${theme.divider} ${isDarkMode ? 'bg-stone-950' : 'bg-stone-50'}`}>
                            <div className="cursor-zoom-in" onClick={() => setLightboxImg(activeArticle.image)}>
                                <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-auto rounded border" />
                            </div>
                          </div>
                        )}
                        <table className="w-full text-sm text-left">
                          <tbody>
                            {activeArticle.infobox.map((info, idx) => (
                              <tr key={idx} className={`border-b last:border-0 ${theme.divider}`}>
                                <th className={`py-2 px-4 font-semibold w-2/5 align-top text-xs uppercase ${isDarkMode ? 'text-stone-500' : 'text-stone-600'}`}>{info.label}</th>
                                <td className={`py-2 px-4 font-medium ${isDarkMode ? 'text-stone-300' : 'text-stone-800'}`}>{info.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {relatedArticles.length > 0 && (
                        <div className={`rounded-lg p-5 border ${theme.divider} no-print ${isDarkMode ? 'bg-stone-900/50' : 'bg-[#EBE7DE]/50'}`}>
                          <h4 className={`font-bold mb-4 font-serif flex items-center gap-2 ${theme.text}`}><Scroll className="w-4 h-4" /> {t('seeAlso')}</h4>
                          <div className="space-y-3">
                            {relatedArticles.map(item => (
                              <button key={item.id} onClick={() => handleArticleClick(item.id)} className={`w-full text-left p-3 rounded border shadow-sm transition-all group ${isDarkMode ? 'bg-stone-800 border-stone-700 hover:border-amber-500' : 'bg-white border-stone-200 hover:border-amber-400 hover:shadow-md'}`}>
                                <div className={`font-bold text-sm group-hover:text-amber-600 ${theme.text}`}>{item.title}</div>
                                <div className={`text-xs mt-1 flex items-center gap-1 ${theme.textMuted}`}><span>{t('readHistory')}</span> <ArrowRight className="w-3 h-3" /></div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ) : view === 'map' ? (
                 <div className={`h-full flex flex-col relative overflow-hidden ${isDarkMode ? 'bg-stone-900' : 'bg-stone-200'}`}>
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114041.04279093844!2d94.6062779!3d26.9829285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37471900f64c67b5%3A0x6b4f74d08b3c4f7a!2sSivasagar%2C%20Assam!5e1!3m2!1sen!2sin!4v1709664567890!5m2!1sen!2sin" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0, filter: isDarkMode ? 'invert(0.9) hue-rotate(180deg)' : 'none' }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Sivasagar Satellite Map"
                    ></iframe>
                    
                    <div className={`absolute top-4 left-4 p-4 backdrop-blur-md rounded shadow border z-10 w-64 ${isDarkMode ? 'bg-stone-900/80 border-stone-700' : 'bg-white/80 border-stone-200'}`}>
                        <h3 className={`font-bold font-serif ${theme.text}`}>Sivasagar Satellite View</h3>
                        <p className={`text-xs mt-1 ${theme.textMuted}`}>Live Google Earth view of the historic capital region.</p>
                    </div>
                </div>
              ) : view === 'research' ? (
                <div className="max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
                    <h2 className={`text-3xl font-serif font-bold mb-8 ${theme.text}`}>{t('research')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-6 rounded-xl border shadow-sm ${theme.card}`}>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><GraduationCap className="w-6 h-6 text-amber-600" /> Academic Papers</h3>
                            <ul className="space-y-4">
                                {resources.filter(r => r.type === 'Academic Paper').map((paper) => (
                                    <li key={paper.id} className={`flex justify-between items-center p-3 rounded border ${theme.divider} ${isDarkMode ? 'bg-stone-950' : 'bg-stone-50'}`}>
                                        <div>
                                            <div className={`font-bold text-sm ${theme.text}`}>{paper.title}</div>
                                            <div className={`text-xs ${theme.textMuted}`}>{paper.author}</div>
                                        </div>
                                        <button className="text-amber-600 hover:text-amber-700"><Download className="w-5 h-5" /></button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={`p-6 rounded-xl border shadow-sm ${theme.card}`}>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><Building2 className="w-6 h-6 text-amber-600" /> Official Reports</h3>
                            <ul className="space-y-4">
                                {resources.filter(r => r.type === 'Official Report').map((paper) => (
                                    <li key={paper.id} className={`flex justify-between items-center p-3 rounded border ${theme.divider} ${isDarkMode ? 'bg-stone-950' : 'bg-stone-50'}`}>
                                        <div>
                                            <div className={`font-bold text-sm ${theme.text}`}>{paper.title}</div>
                                            <div className={`text-xs ${theme.textMuted}`}>{paper.author}</div>
                                        </div>
                                        <button className="text-amber-600 hover:text-amber-700"><Download className="w-5 h-5" /></button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
              ) : view === 'about' || view === 'speech' || view === 'district' ? (
                <InfoPage pageKey={view} icon={view === 'about' ? Info : view === 'speech' ? Building2 : FileText} />
              ) : view === 'login' ? (
                  <div className="flex items-center justify-center h-full p-4">
                      <div className={`max-w-md w-full p-8 rounded-xl shadow-2xl border ${theme.card}`}>
                          <div className="text-center mb-8">
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-amber-900/30 text-amber-500' : 'bg-amber-100 text-amber-700'}`}><Lock className="w-8 h-8" /></div>
                              <h2 className={`text-2xl font-bold font-serif ${theme.text}`}>{t('loginTitle')}</h2>
                              <p className={`text-sm mt-2 ${theme.textMuted}`}>{t('loginDesc')}</p>
                          </div>
                          <form onSubmit={handleLogin} className="space-y-6">
                              <div>
                                  <label className={`block text-sm font-medium mb-1 ${theme.textMuted}`}>{t('username')}</label>
                                  <input type="text" className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none transition-colors ${theme.input}`} value={username} onChange={(e) => setUsername(e.target.value)} required />
                              </div>
                              <div>
                                  <label className={`block text-sm font-medium mb-1 ${theme.textMuted}`}>{t('password')}</label>
                                  <input type="password" className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none transition-colors ${theme.input}`} value={password} onChange={(e) => setPassword(e.target.value)} required />
                              </div>
                              <button type="submit" className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-amber-900/20">{t('loginBtn')}</button>
                          </form>
                          <div className="mt-6 text-center"><button onClick={() => setView('grid')} className={`text-sm hover:underline ${theme.textMuted}`}>Return to Archive</button></div>
                      </div>
                  </div>
              ) : view === 'admin' ? (
                  <div className="max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in duration-500 h-full flex flex-col relative">
                      {showAddModal && (
                          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                              <div className={`w-full max-w-4xl p-6 rounded-xl shadow-2xl border ${theme.card} my-8 max-h-full overflow-y-auto`}>
                                  <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>{newItem.id ? t('editItem') : t('addNew')}</h3>
                                  <form onSubmit={handleSaveItem} className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                          <input type="text" required className={`w-full p-2 rounded border ${theme.input}`} placeholder={t('formTitle')} value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                                          <select className={`w-full p-2 rounded border ${theme.input}`} value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                                              {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                          </select>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                          <input type="number" className={`w-full p-2 rounded border ${theme.input}`} placeholder={t('formYear')} value={newItem.year} onChange={e => setNewItem({...newItem, year: e.target.value})} />
                                          <input type="text" className={`w-full p-2 rounded border ${theme.input}`} placeholder={t('formImage')} value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} />
                                      </div>
                                      <textarea className={`w-full p-2 rounded border ${theme.input}`} placeholder={t('formSummary')} rows="3" value={newItem.summary} onChange={e => setNewItem({...newItem, summary: e.target.value})}></textarea>
                                      
                                      <div className="border-t pt-4 border-stone-200 dark:border-stone-700">
                                          <h4 className={`font-bold mb-2 ${theme.text}`}>{t('sections')}</h4>
                                          {newItem.content.map((section, idx) => (
                                              <div key={idx} className={`p-4 rounded border mb-2 ${theme.divider} ${isDarkMode ? 'bg-stone-950' : 'bg-stone-50'}`}>
                                                  <div className="flex justify-between mb-2">
                                                      <span className="text-xs font-bold text-stone-500">SECTION {idx + 1}</span>
                                                      <button type="button" onClick={() => removeContentSection(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                                  </div>
                                                  <input type="text" className={`w-full p-2 rounded border mb-2 ${theme.input}`} placeholder={t('sectionHeader')} value={section.header} onChange={e => updateContentSection(idx, 'header', e.target.value)} />
                                                  <textarea className={`w-full p-2 rounded border mb-2 ${theme.input}`} rows="4" placeholder={t('sectionText')} value={section.text} onChange={e => updateContentSection(idx, 'text', e.target.value)}></textarea>
                                                  <div className="grid grid-cols-2 gap-2">
                                                      <input type="text" className={`w-full p-2 rounded border ${theme.input}`} placeholder={t('sectionImg')} value={section.image} onChange={e => updateContentSection(idx, 'image', e.target.value)} />
                                                      <input type="text" className={`w-full p-2 rounded border ${theme.input}`} placeholder={t('sectionCap')} value={section.caption} onChange={e => updateContentSection(idx, 'caption', e.target.value)} />
                                                  </div>
                                              </div>
                                          ))}
                                          <button type="button" onClick={addContentSection} className="text-sm text-amber-600 font-bold hover:underline">+ {t('addSection')}</button>
                                      </div>

                                      <div className="border-t pt-4 border-stone-200 dark:border-stone-700">
                                          <h4 className={`font-bold mb-2 ${theme.text}`}>{t('infobox')}</h4>
                                          {newItem.infobox.map((row, idx) => (
                                              <div key={idx} className="flex gap-2 mb-2">
                                                  <input type="text" className={`w-1/3 p-2 rounded border ${theme.input}`} placeholder="Label" value={row.label} onChange={e => updateInfoboxRow(idx, 'label', e.target.value)} />
                                                  <input type="text" className={`flex-1 p-2 rounded border ${theme.input}`} placeholder="Value" value={row.value} onChange={e => updateInfoboxRow(idx, 'value', e.target.value)} />
                                                  <button type="button" onClick={() => removeInfoboxRow(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                              </div>
                                          ))}
                                          <button type="button" onClick={addInfoboxRow} className="text-sm text-amber-600 font-bold hover:underline">+ {t('addRow')}</button>
                                      </div>

                                      <div className="flex justify-end gap-3 pt-2">
                                          <button type="button" onClick={() => setShowAddModal(false)} className={`px-4 py-2 rounded text-sm font-medium ${theme.textMuted} hover:bg-stone-200/50`}>{t('cancel')}</button>
                                          <button type="submit" className="px-4 py-2 rounded text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 shadow-md flex items-center gap-2"><Save className="w-4 h-4" /> {t('saveItem')}</button>
                                      </div>
                                  </form>
                              </div>
                          </div>
                      )}

                      {/* Resource Modal */}
                      {showResourceModal && (
                          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                              <div className={`w-full max-w-md p-6 rounded-xl shadow-2xl border ${theme.card}`}>
                                  <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>{t('uploadPdf')}</h3>
                                  <form onSubmit={handleSaveResource} className="space-y-4">
                                      <input type="text" required className={`w-full p-2 rounded border ${theme.input}`} placeholder={t('fileName')} value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} />
                                      <input type="text" required className={`w-full p-2 rounded border ${theme.input}`} placeholder="Author/Year" value={newResource.author} onChange={e => setNewResource({...newResource, author: e.target.value})} />
                                      <div className="flex items-center gap-2">
                                          <label className={`w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-stone-800 text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50 dark:hover:bg-stone-700`}>
                                              <Upload className="w-8 h-8 text-amber-500" />
                                              <span className={`mt-2 text-base leading-normal ${theme.text}`}>Select a file</span>
                                              <input type='file' id="resourceFile" className="hidden" onChange={(e) => {
                                                  if(e.target.files[0]) {
                                                      alert(`${t('msgSuccess')}: ${e.target.files[0].name}`);
                                                      setNewResource({...newResource, title: e.target.files[0].name.replace('.pdf', '')});
                                                  }
                                              }} />
                                          </label>
                                      </div>
                                      <select className={`w-full p-2 rounded border ${theme.input}`} value={newResource.type} onChange={e => setNewResource({...newResource, type: e.target.value})}>
                                          <option>Academic Paper</option>
                                          <option>Official Report</option>
                                      </select>
                                      <div className="flex justify-end gap-3">
                                          <button type="button" onClick={() => setShowResourceModal(false)} className={`px-4 py-2 rounded text-sm font-medium ${theme.textMuted}`}>{t('cancel')}</button>
                                          <button type="submit" className="px-4 py-2 rounded text-sm font-medium bg-amber-600 text-white">{t('saveItem')}</button>
                                      </div>
                                  </form>
                              </div>
                          </div>
                      )}

                      {/* CMS Editor Modal */}
                      {editingCms && (
                          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                              <div className={`w-full max-w-3xl p-6 rounded-xl shadow-2xl border ${theme.card} flex flex-col h-[80vh]`}>
                                  <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>Edit {t(editingCms === 'about' ? 'aboutProject' : editingCms === 'speech' ? 'authSpeech' : 'districtInfo')}</h3>
                                  <textarea className={`flex-1 w-full p-4 rounded border ${theme.input} font-mono text-sm resize-none`} value={tempCmsText} onChange={e => setTempCmsText(e.target.value)}></textarea>
                                  <div className="flex justify-end gap-3 pt-4">
                                      <button type="button" onClick={() => setEditingCms(null)} className={`px-4 py-2 rounded text-sm font-medium ${theme.textMuted}`}>{t('cancel')}</button>
                                      <button onClick={() => handleSaveCms(editingCms)} className="px-4 py-2 rounded text-sm font-medium bg-amber-600 text-white">{t('saveItem')}</button>
                                  </div>
                              </div>
                          </div>
                      )}

                      <div className="flex items-center justify-between mb-8">
                          <div>
                              <h2 className={`text-3xl font-serif font-bold ${theme.text}`}>{t('dashboard')}</h2>
                              <p className={theme.textMuted}>
                                Welcome back, Curator. 
                                <span className={`ml-2 text-sm font-bold flex items-center gap-1 inline-flex ${backendOnline ? "text-green-600" : "text-red-500"}`}>
                                    {backendOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                                    {backendOnline ? t('sysOnline') : t('sysOffline')}
                                </span>
                              </p>
                          </div>
                          <button onClick={() => { setIsLoggedIn(false); setView('grid'); }} className={`px-4 py-2 rounded-lg flex items-center gap-2 border hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors ${theme.textMuted} ${theme.divider}`}><LogOut className="w-4 h-4" /> Log Out</button>
                      </div>

                      <div className="flex gap-4 mb-6 border-b border-stone-200 dark:border-stone-700">
                          {['content', 'pages', 'resources', 'inbox', 'stats'].map(tab => (
                              <button 
                                key={tab}
                                onClick={() => setAdminTab(tab)}
                                className={`pb-2 px-4 text-sm font-bold uppercase tracking-wider ${adminTab === tab ? 'border-b-2 border-amber-500 text-amber-600' : 'text-stone-400 hover:text-stone-600'}`}
                              >
                                  {tab === 'content' ? t('manageContent') : tab === 'pages' ? t('managePages') : tab === 'resources' ? t('manageResources') : t(tab)}
                              </button>
                          ))}
                      </div>

                      {/* Content Tab */}
                      {adminTab === 'content' && (
                          <div className={`flex-1 overflow-auto rounded-xl border shadow-sm ${theme.card}`}>
                              <div className="p-4 border-b border-stone-200/20 flex justify-between items-center">
                                  <span className={`font-bold ${theme.text}`}>Artifact Registry</span>
                                  <button onClick={() => { setNewItem({ title: '', category: 'kings', year: '', summary: '', image: '', content: [{ header: '', text: '', image: '', caption: '' }], infobox: [{ label: '', value: '' }] }); setShowAddModal(true); }} className="bg-amber-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-amber-700 text-sm shadow-md"><Plus className="w-4 h-4" /> {t('addNew')}</button>
                              </div>
                              <table className="w-full text-left border-collapse">
                                  <thead className={`text-xs uppercase tracking-wider font-bold ${isDarkMode ? 'bg-stone-900 text-stone-400' : 'bg-stone-100 text-stone-500'}`}>
                                      <tr><th className="p-4">Title</th><th className="p-4">Category</th><th className="p-4">Year</th><th className="p-4 text-right">Actions</th></tr>
                                  </thead>
                                  <tbody className={`text-sm ${theme.text}`}>
                                      {db.map((item) => (
                                          <tr key={item.id} className="border-b border-stone-200/20 last:border-0 hover:bg-stone-500/5">
                                              <td className="p-4 font-medium">{item.title}</td>
                                              <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${theme.accentBg}`}>{item.category}</span></td>
                                              <td className="p-4">{item.year}</td>
                                              <td className="p-4 text-right">
                                                  <div className="flex items-center justify-end gap-2">
                                                      <button onClick={() => handleEditClick(item)} className="p-1.5 hover:bg-blue-100 text-blue-600 rounded"><Edit className="w-4 h-4" /></button>
                                                      <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                                                  </div>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      )}
                      
                      {/* Pages CMS Tab */}
                      {adminTab === 'pages' && (
                          <div className={`grid gap-4 ${theme.text}`}>
                              {['about', 'speech', 'district'].map(key => (
                                  <div key={key} className={`p-6 rounded-lg border ${theme.card} flex justify-between items-center`}>
                                      <div>
                                          <h3 className="font-bold text-lg mb-1">{t(key === 'about' ? 'aboutProject' : key === 'speech' ? 'authSpeech' : 'districtInfo')}</h3>
                                          <p className={`text-sm ${theme.textMuted} line-clamp-1`}>{cmsContent[key].text}</p>
                                      </div>
                                      <button onClick={() => { setEditingCms(key); setTempCmsText(cmsContent[key].text); }} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700">Edit Page</button>
                                  </div>
                              ))}
                          </div>
                      )}

                      {/* Resources Tab */}
                      {adminTab === 'resources' && (
                          <div className={`flex-1 overflow-auto rounded-xl border shadow-sm ${theme.card}`}>
                              <div className="p-4 border-b border-stone-200/20 flex justify-between items-center">
                                  <span className={`font-bold ${theme.text}`}>Digital Resources Library</span>
                                  <button onClick={() => setShowResourceModal(true)} className="bg-amber-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-amber-700 text-sm shadow-md"><Plus className="w-4 h-4" /> {t('uploadPdf')}</button>
                              </div>
                              <ul className="divide-y divide-stone-200 dark:divide-stone-700">
                                  {resources.map((res) => (
                                      <li key={res.id} className="p-4 flex justify-between items-center hover:bg-stone-500/5">
                                          <div>
                                              <div className={`font-bold text-sm ${theme.text}`}>{res.title}</div>
                                              <div className={`text-xs ${theme.textMuted}`}>{res.author} • {res.type}</div>
                                          </div>
                                          <button onClick={() => handleDeleteResource(res.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}

                      {/* Inbox Tab */}
                      {adminTab === 'inbox' && (
                          <div className={`grid gap-4 ${theme.text}`}>
                              {inbox.map(msg => (
                                  <div key={msg.id} className={`p-4 rounded-lg border ${theme.card} hover:shadow-md transition-shadow`}>
                                      <div className="flex justify-between mb-2">
                                          <span className="font-bold text-amber-600">{msg.from}</span>
                                          <span className="text-xs text-stone-400">{msg.date}</span>
                                      </div>
                                      <div className="font-bold text-sm mb-1">{msg.subject}</div>
                                      <p className="text-sm text-stone-500">{msg.msg}</p>
                                      <div className="mt-3 flex gap-2">
                                          <button className="text-xs bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded border hover:bg-stone-200">Reply</button>
                                          <button className="text-xs bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded border hover:bg-stone-200 text-red-500">Archive</button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}

                      {/* Stats Tab */}
                      {adminTab === 'stats' && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className={`p-6 rounded-xl border ${theme.card} text-center`}>
                                  <div className="text-4xl font-bold text-amber-600 mb-2">{db.length}</div>
                                  <div className={`text-sm ${theme.textMuted}`}>Total Artifacts</div>
                              </div>
                              <div className={`p-6 rounded-xl border ${theme.card} text-center`}>
                                  <div className="text-4xl font-bold text-blue-600 mb-2">1.2k</div>
                                  <div className={`text-sm ${theme.textMuted}`}>Monthly Visitors</div>
                              </div>
                              <div className={`p-6 rounded-xl border ${theme.card} text-center`}>
                                  <div className="text-4xl font-bold text-green-600 mb-2">15</div>
                                  <div className={`text-sm ${theme.textMuted}`}>Research Citations</div>
                              </div>
                          </div>
                      )}
                  </div>
              ) : view === 'timeline' ? (
                 <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
                  <div className="text-center mb-12">
                    <h2 className={`text-3xl font-serif font-bold mb-2 ${theme.text}`}>{t('timeline')} of the Ahom Kingdom</h2>
                    <p className={theme.textMuted}>A timeline of the 600-year glorious rule in the Brahmaputra Valley.</p>
                  </div>
                  <div className={`ml-4 md:ml-12 border-l-2 pl-8 space-y-0 ${isDarkMode ? 'border-stone-800' : 'border-stone-300'}`}>
                    {filteredData.map((item) => <TimelineItem key={item.id} item={item} isDarkMode={isDarkMode} onClick={() => handleArticleClick(item.id)} />)}
                    <div className="relative pl-8 pt-4">
                       <div className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full border-2 border-white ${isDarkMode ? 'bg-stone-700' : 'bg-stone-300'}`} />
                       <div className={`text-sm font-bold font-serif ${isDarkMode ? 'text-stone-600' : 'text-stone-400'}`}>1826 CE</div>
                       <div className={`text-sm mt-1 italic ${theme.textMuted}`}>Treaty of Yandabo marks the end of Ahom rule.</div>
                    </div>
                  </div>
                </div>
              ) : view === 'tree' ? (
                 <div className="max-w-5xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
                    <div className="text-center mb-16">
                        <h2 className={`text-3xl font-serif font-bold mb-2 ${theme.text}`}>{t('tree')} (Bongshawali)</h2>
                        <p className={theme.textMuted}>The unbroken lineage of the Swargadeos of the Ahom Dynasty.</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        {filteredData.map((king, index) => (
                            <div key={king.id} className="flex flex-col items-center group relative w-full">
                                {index > 0 && <div className={`h-8 w-0.5 ${isDarkMode ? 'bg-amber-800' : 'bg-amber-300'}`}></div>}
                                <div onClick={() => handleArticleClick(king.id)} className={`relative p-4 rounded-lg border-2 w-full max-w-md cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${isDarkMode ? 'bg-stone-900 border-amber-900/50 hover:border-amber-500' : 'bg-white border-amber-200 hover:border-amber-500 shadow-sm'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-stone-800 text-amber-600' : 'bg-amber-50 text-amber-700'}`}><Crown className="w-6 h-6" /></div>
                                        <div className="flex-1">
                                            <div className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${theme.accent}`}>{king.year} CE</div>
                                            <h3 className={`font-bold font-serif text-lg ${theme.text}`}>{king.title}</h3>
                                            <p className={`text-xs truncate ${theme.textMuted}`}>{king.summary}</p>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${theme.textMuted}`} />
                                    </div>
                                </div>
                                {index < filteredData.length - 1 && <ArrowDown className={`w-4 h-4 mt-2 ${isDarkMode ? 'text-amber-800' : 'text-amber-300'}`} />}
                            </div>
                        ))}
                        <div className={`mt-8 p-4 rounded border text-center text-sm ${isDarkMode ? 'bg-stone-900 border-stone-800 text-stone-500' : 'bg-stone-100 border-stone-200 text-stone-600'}`}>Continued... (Dynasty lasted until 1826)</div>
                    </div>
                </div>
              ) : view === 'gallery' ? (
                <div className="max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
                    <div className="text-center mb-12">
                        <h2 className={`text-3xl font-serif font-bold mb-2 ${theme.text}`}>{t('gallery')}</h2>
                        <p className={theme.textMuted}>A visual journey through the artifacts and monuments of the Ahom Kingdom.</p>
                    </div>
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {db.filter(i => i.image).map(item => (
                            <div key={item.id} onClick={() => handleArticleClick(item.id)} className={`break-inside-avoid rounded-xl overflow-hidden shadow-md cursor-pointer group relative border ${theme.card}`}>
                                <img src={item.image} alt={item.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <h3 className="text-white font-bold font-serif text-lg">{item.title}</h3>
                                    <p className="text-stone-300 text-sm">{item.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              ) : view === 'quiz' ? (
                <div className="max-w-3xl mx-auto p-6 md:p-12 animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col justify-center">
                    {!showQuizResult ? (
                      <div className={`rounded-2xl shadow-xl border overflow-hidden ${theme.card}`}>
                        <div className="bg-[#2C241B] p-6 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-amber-500">{t('quiz')}</h2>
                                <p className="text-stone-400 text-sm">Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</p>
                            </div>
                            <Brain className="w-8 h-8 text-amber-500 opacity-80" />
                        </div>
                        <div className="p-8 md:p-12">
                            <h3 className={`text-xl md:text-2xl font-bold mb-8 leading-snug ${theme.text}`}>{QUIZ_QUESTIONS[currentQuestion].question}</h3>
                            <div className="space-y-4">
                                {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                                    <button key={idx} onClick={() => handleQuizAnswer(idx)} disabled={selectedAnswer !== null} className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${selectedAnswer === null ? `${isDarkMode ? 'border-stone-700 hover:border-amber-600 hover:bg-stone-800 text-stone-300' : 'border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-stone-800'}` : selectedAnswer === idx ? idx === QUIZ_QUESTIONS[currentQuestion].correct ? 'border-green-500 bg-green-500/10 text-green-600' : 'border-red-500 bg-red-500/10 text-red-600' : idx === QUIZ_QUESTIONS[currentQuestion].correct ? 'border-green-500 bg-green-500/10 text-green-600' : 'border-stone-200 opacity-50'}`}>
                                        <span className="font-medium text-lg">{option}</span>
                                        {selectedAnswer === idx && (idx === QUIZ_QUESTIONS[currentQuestion].correct ? <CheckCircle className="w-6 h-6 text-green-600" /> : <AlertCircle className="w-6 h-6 text-red-600" />)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={`h-2 w-full ${isDarkMode ? 'bg-stone-800' : 'bg-stone-100'}`}><div className="h-full bg-amber-600 transition-all duration-300" style={{ width: `${((currentQuestion) / QUIZ_QUESTIONS.length) * 100}%` }} /></div>
                      </div>
                    ) : (
                      <div className={`rounded-2xl shadow-xl border overflow-hidden text-center p-12 ${theme.card}`}>
                         <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-amber-900/30' : 'bg-amber-100'}`}><Trophy className="w-12 h-12 text-amber-600" /></div>
                         <h2 className={`text-3xl font-serif font-bold mb-2 ${theme.text}`}>{t('quizCompleted')}</h2>
                         <p className={`mb-8 ${theme.textMuted}`}>{t('score')} <span className="font-bold text-amber-600 text-xl">{quizScore}</span> out of {QUIZ_QUESTIONS.length}</p>
                         <div className={`p-6 rounded-lg mb-8 max-w-md mx-auto ${isDarkMode ? 'bg-stone-800' : 'bg-stone-50'}`}><p className={`italic font-serif ${theme.text}`}>{quizScore === QUIZ_QUESTIONS.length ? "Incredible! You are truly a scholar of the Ahom Kingdom." : quizScore > 2 ? "Well done! You have a good grasp of the history." : "Keep exploring the archives to learn more about this golden era."}</p></div>
                         <button onClick={resetQuiz} className="bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-900/20">{t('retake')}</button>
                         <button onClick={() => setView('grid')} className={`block mt-4 text-sm mx-auto hover:underline ${theme.textMuted}`}>{t('return')}</button>
                      </div>
                    )}
                </div>
              ) : (
                // GRID / HERO VIEW
                <div className="animate-in fade-in duration-500 pb-12">
                  {!searchQuery && activeCategory === 'all' && (
                    <div className="relative py-20 px-6 md:px-12 mb-8 overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <img src={HERO_BG} alt="Hero" className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-black/50'}`} />
                        </div>
                        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
                            <div className="inline-flex items-center gap-2 text-amber-400 font-bold tracking-widest uppercase text-xs mb-4 border border-amber-400/50 px-3 py-1 rounded-full">{t('est')}</div>
                            <h1 className={`text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight drop-shadow-lg`}>{t('heroTitle')} <span className="text-amber-400">{t('heroSubtitle')}</span></h1>
                            <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8 text-stone-100 font-medium drop-shadow-md`}>{t('heroDesc')}</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button onClick={() => { setView('timeline'); setActiveCategory('all'); }} className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold shadow-lg flex items-center gap-2"><Clock className="w-4 h-4" /> {t('viewTimeline')}</button>
                                <button onClick={() => setView('quiz')} className="px-6 py-3 border border-white/50 hover:bg-white/10 text-white rounded font-bold flex items-center gap-2"><Brain className="w-4 h-4" /> {t('takeQuiz')}</button>
                            </div>
                        </div>
                    </div>
                  )}
                  <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredData.map(item => (
                          <div key={item.id} onClick={() => handleArticleClick(item.id)} className={`group rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full border ${theme.card}`}>
                            <div className={`h-48 overflow-hidden relative ${isDarkMode ? 'bg-stone-800' : 'bg-stone-200'}`}>
                              {item.image ? <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className={`w-full h-full flex items-center justify-center ${theme.textMuted}`}><Landmark className="w-12 h-12 opacity-20" /></div>}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-stone-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">{item.category.toUpperCase()}</div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                              <div className="text-xs font-bold text-amber-600 mb-2 font-serif">{item.year} CE</div>
                              <h2 className={`text-xl font-bold font-serif mb-3 leading-tight group-hover:text-amber-600 transition-colors ${theme.text}`}>{item.title}</h2>
                              <p className={`text-sm line-clamp-3 mb-4 flex-1 leading-relaxed ${theme.textMuted}`}>{item.summary}</p>
                              <div className={`pt-4 border-t flex items-center text-xs font-bold uppercase tracking-widest group-hover:text-amber-600 transition-colors ${theme.divider} ${theme.textMuted}`}>{t('readHistory')}<ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" /></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Professional Footer */}
            <footer className={`border-t mt-auto pt-12 pb-6 no-print notranslate ${isDarkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain" />
                            <span className={`font-serif font-bold text-lg ${theme.text}`}>{t('appTitle')}</span>
                        </div>
                        <p className={`text-sm ${theme.textMuted}`}>{t('subtitle')}</p>
                        <p className={`text-xs ${theme.textMuted}`}>{t('address')}</p>
                    </div>
                    <div>
                        <h4 className={`font-bold mb-4 ${theme.text}`}>{t('quickLinks')}</h4>
                        <ul className={`space-y-2 text-sm ${theme.textMuted}`}>
                            <li><button onClick={() => setView('about')} className="hover:text-amber-600">About Us</button></li>
                            <li><button onClick={() => setView('timeline')} className="hover:text-amber-600">Timeline</button></li>
                            <li><button onClick={() => setView('gallery')} className="hover:text-amber-600">Gallery</button></li>
                            <li><button onClick={() => setView('map')} className="hover:text-amber-600">Map</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className={`font-bold mb-4 ${theme.text}`}>{t('resources')}</h4>
                        <ul className={`space-y-2 text-sm ${theme.textMuted}`}>
                            <li><button onClick={() => setView('research')} className="hover:text-amber-600">Research Papers</button></li>
                            <li><a href="#" className="hover:text-amber-600">ASI Reports</a></li>
                            <li><a href="#" className="hover:text-amber-600">Digital Archives</a></li>
                            <li><button onClick={() => setView('speech')} className="hover:text-amber-600">Authority Speech</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className={`font-bold mb-4 ${theme.text}`}>{t('contactUs')}</h4>
                        <ul className={`space-y-2 text-sm ${theme.textMuted}`}>
                            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> {t('email')}</li>
                            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> {t('phone')}</li>
                            <li className="flex items-center gap-2"><Globe className="w-4 h-4" /> www.sibsagaruniversity.ac.in</li>
                            <li className="flex gap-4 mt-4">
                                <Facebook className="w-5 h-5 hover:text-blue-600 cursor-pointer" />
                                <Twitter className="w-5 h-5 hover:text-sky-500 cursor-pointer" />
                                <Instagram className="w-5 h-5 hover:text-pink-600 cursor-pointer" />
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={`border-t pt-6 text-center text-xs ${theme.divider} ${theme.textMuted}`}>
                    <p className="mb-2">{t('footerDev')}</p>
                    <p>{t('footerRights')}</p>
                </div>
            </footer>
        </div>
      </main>
    </div>
  );
};

export default App;