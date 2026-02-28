import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'app.name': 'GraminSeva',
    'app.tagline': 'Healthcare for Rural India',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',

    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.loginButton': 'Sign In',
    'auth.registerButton': 'Sign Up',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.loginSuccess': 'Login successful',
    'auth.registerSuccess': 'Registration successful',
    'auth.loginError': 'Login failed',
    'auth.registerError': 'Registration failed',
    'auth.pendingApproval': 'Your doctor account is pending admin approval',
    'auth.awaitingApproval': 'Registration successful! Awaiting admin approval.',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.consultations': 'Consultations',
    'nav.prescriptions': 'Prescriptions',
    'nav.medicalRecords': 'Medical Records',
    'nav.aiChat': 'AI Assistant',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin Panel',
    'nav.patients': 'Patients',
    'nav.doctors': 'Doctors',
    'nav.settings': 'Settings',

    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.stats': 'Statistics',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.upcomingConsultations': 'Upcoming Consultations',

    // Consultations
    'consultation.new': 'New Consultation',
    'consultation.type': 'Consultation Type',
    'consultation.type.video': 'Video Call',
    'consultation.type.voice': 'Voice Call',
    'consultation.type.chat': 'Chat',
    'consultation.type.inPerson': 'In Person',
    'consultation.symptoms': 'Symptoms',
    'consultation.diagnosis': 'Diagnosis',
    'consultation.notes': 'Notes',
    'consultation.status': 'Status',
    'consultation.pending': 'Pending',
    'consultation.inProgress': 'In Progress',
    'consultation.completed': 'Completed',
    'consultation.cancelled': 'Cancelled',
    'consultation.aiChat': 'AI Chat',
    'consultation.voice': 'Voice Call',
    'consultation.video': 'Video Call',
    'consultation.arDiagnosis': 'AR Diagnosis',
    'consultation.manage': 'Manage your medical consultations',
    'consultation.manageDoctor': 'Manage your patient consultations',
    'consultation.my': 'My Consultations',
    'consultation.pendingRequests': 'Pending Requests',
    'consultation.all': 'All',
    'consultation.notFound': 'No consultations found',
    'consultation.notFoundDesc': 'You haven\'t booked any consultations yet',
    'consultation.noPending': 'No pending consultations',
    'consultation.noInProgress': 'No active consultations',
    'consultation.noCompleted': 'No completed consultations',
    'consultation.bookFirst': 'Book your first consultation',
    'consultation.viewDetails': 'View Details',
    'consultation.cancelConfirm': 'Are you sure you want to cancel this consultation?',
    'consultation.cancelSuccess': 'Consultation cancelled successfully',
    'consultation.cancelError': 'Failed to cancel consultation',
    'consultation.loadError': 'Failed to load consultations',
    'consultation.noConsultations': 'No consultations yet',
    'consultation.noConsultationsDesc': 'You haven\'t accepted any consultations yet. Check the pending requests tab.',
    'consultation.medicalHistory': 'Medical History',
    'consultation.accept': 'Accept Consultation',
    'consultation.noPendingRequests': 'No pending requests',
    'consultation.noPendingRequestsDesc': 'There are no pending consultation requests at this time.',
    'consultation.acceptSuccess': 'Consultation accepted',
    'consultation.acceptError': 'Failed to accept consultation',
    'consultation.unknownPatient': 'Unknown Patient',
    'consultation.newRequest': 'New Request',

    // Prescriptions
    'prescription.new': 'New Prescription',
    'prescription.medications': 'Medications',
    'prescription.instructions': 'Instructions',
    'prescription.validUntil': 'Valid Until',
    'prescription.qrCode': 'QR Code',
    'prescription.scanQR': 'Scan QR Code',

    // Medical Records
    'record.new': 'New Record',
    'record.title': 'Title',
    'record.description': 'Description',
    'record.type': 'Type',
    'record.image': 'Image',
    'record.video': 'Video',
    'record.document': 'Document',
    'record.note': 'Note',

    // Symptoms
    'symptom.checker': 'Symptom Checker',
    'symptom.search': 'Search symptoms',
    'symptom.category': 'Category',
    'symptom.severity': 'Severity',
    'symptom.recommendations': 'Recommendations',

    // Language
    'language.select': 'Select Language',
    'language.en': 'English',
    'language.hi': 'हिंदी',
    'language.mr': 'मराठी',
  },
  hi: {
    // Common
    'app.name': 'ग्रामीणसेवा',
    'app.tagline': 'ग्रामीण भारत के लिए स्वास्थ्य सेवा',
    'common.loading': 'लोड हो रहा है...',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.view': 'देखें',
    'common.submit': 'जमा करें',
    'common.search': 'खोजें',
    'common.filter': 'फ़िल्टर',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.close': 'बंद करें',
    'common.confirm': 'पुष्टि करें',
    'common.yes': 'हां',
    'common.no': 'नहीं',

    // Auth
    'auth.login': 'लॉगिन',
    'auth.register': 'पंजीकरण',
    'auth.logout': 'लॉगआउट',
    'auth.username': 'उपयोगकर्ता नाम',
    'auth.password': 'पासवर्ड',
    'auth.fullName': 'पूरा नाम',
    'auth.loginButton': 'साइन इन करें',
    'auth.registerButton': 'साइन अप करें',
    'auth.noAccount': 'खाता नहीं है?',
    'auth.hasAccount': 'पहले से खाता है?',
    'auth.loginSuccess': 'लॉगिन सफल',
    'auth.registerSuccess': 'पंजीकरण सफल',
    'auth.loginError': 'लॉगिन विफल',
    'auth.registerError': 'पंजीकरण विफल',
    'auth.pendingApproval': 'आपका डॉक्टर खाता व्यवस्थापक अनुमोदन की प्रतीक्षा कर रहा है',
    'auth.awaitingApproval': 'पंजीकरण सफल! व्यवस्थापक अनुमोदन की प्रतीक्षा है।',

    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.consultations': 'परामर्श',
    'nav.prescriptions': 'नुस्खे',
    'nav.medicalRecords': 'चिकित्सा रिकॉर्ड',
    'nav.aiChat': 'एआई सहायक',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.admin': 'व्यवस्थापक पैनल',
    'nav.patients': 'मरीज',
    'nav.doctors': 'डॉक्टर',
    'nav.settings': 'सेटिंग्स',

    // Dashboard
    'dashboard.welcome': 'स्वागत है',
    'dashboard.stats': 'आंकड़े',
    'dashboard.recentActivity': 'हाल की गतिविधि',
    'dashboard.upcomingConsultations': 'आगामी परामर्श',

    // Consultations
    'consultation.new': 'नया परामर्श',
    'consultation.type': 'परामर्श प्रकार',
    'consultation.type.video': 'वीडियो कॉल',
    'consultation.type.voice': 'वॉयस कॉल',
    'consultation.type.chat': 'चैट',
    'consultation.type.inPerson': 'इन-पर्सन',
    'consultation.symptoms': 'लक्षण',
    'consultation.diagnosis': 'निदान',
    'consultation.notes': 'नोट्स',
    'consultation.status': 'स्थिति',
    'consultation.pending': 'लंबित',
    'consultation.inProgress': 'प्रगति में',
    'consultation.completed': 'पूर्ण',
    'consultation.cancelled': 'रद्द',
    'consultation.aiChat': 'एआई चैट',
    'consultation.voice': 'वॉयस कॉल',
    'consultation.video': 'वीडियो कॉल',
    'consultation.arDiagnosis': 'एआर निदान',
    'consultation.manage': 'अपने चिकित्सा परामर्श प्रबंधित करें',
    'consultation.manageDoctor': 'अपने रोगी परामर्श प्रबंधित करें',
    'consultation.my': 'मेरे परामर्श',
    'consultation.pendingRequests': 'लंबित अनुरोध',
    'consultation.all': 'सभी',
    'consultation.notFound': 'कोई परामर्श नहीं मिला',
    'consultation.notFoundDesc': 'आपने अभी तक कोई परामर्श बुक नहीं किया है',
    'consultation.noPending': 'कोई लंबित परामर्श नहीं',
    'consultation.noInProgress': 'कोई सक्रिय परामर्श नहीं',
    'consultation.noCompleted': 'कोई पूर्ण परामर्श नहीं',
    'consultation.bookFirst': 'अपना पहला परामर्श बुक करें',
    'consultation.viewDetails': 'विवरण देखें',
    'consultation.cancelConfirm': 'क्या आप वाकई इस परामर्श को रद्द करना चाहते हैं?',
    'consultation.cancelSuccess': 'परामर्श रद्द कर दिया गया',
    'consultation.cancelError': 'परामर्श रद्द करने में विफल',
    'consultation.loadError': 'परामर्श लोड करने में विफल',
    'consultation.noConsultations': 'अभी तक कोई परामर्श नहीं',
    'consultation.noConsultationsDesc': 'आपने अभी तक कोई परामर्श स्वीकार नहीं किया है। लंबित अनुरोध टैब देखें।',
    'consultation.medicalHistory': 'चिकित्सा इतिहास',
    'consultation.accept': 'परामर्श स्वीकार करें',
    'consultation.noPendingRequests': 'कोई लंबित अनुरोध नहीं',
    'consultation.noPendingRequestsDesc': 'इस समय कोई लंबित परामर्श अनुरोध नहीं है।',
    'consultation.acceptSuccess': 'परामर्श स्वीकार किया गया',
    'consultation.acceptError': 'परामर्श स्वीकार करने में विफल',
    'consultation.unknownPatient': 'अज्ञात रोगी',
    'consultation.newRequest': 'नया अनुरोध',

    // Prescriptions
    'prescription.new': 'नया नुस्खा',
    'prescription.medications': 'दवाएं',
    'prescription.instructions': 'निर्देश',
    'prescription.validUntil': 'वैध तक',
    'prescription.qrCode': 'क्यूआर कोड',
    'prescription.scanQR': 'क्यूआर कोड स्कैन करें',

    // Medical Records
    'record.new': 'नया रिकॉर्ड',
    'record.title': 'शीर्षक',
    'record.description': 'विवरण',
    'record.type': 'प्रकार',
    'record.image': 'छवि',
    'record.video': 'वीडियो',
    'record.document': 'दस्तावेज़',
    'record.note': 'नोट',

    // Symptoms
    'symptom.checker': 'लक्षण जांचकर्ता',
    'symptom.search': 'लक्षण खोजें',
    'symptom.category': 'श्रेणी',
    'symptom.severity': 'गंभीरता',
    'symptom.recommendations': 'सिफारिशें',

    // Language
    'language.select': 'भाषा चुनें',
    'language.en': 'English',
    'language.hi': 'हिंदी',
    'language.mr': 'मराठी',
  },
  mr: {
    // Common
    'app.name': 'ग्रामीणसेवा',
    'app.tagline': 'ग्रामीण भारतासाठी आरोग्य सेवा',
    'common.loading': 'लोड होत आहे...',
    'common.save': 'जतन करा',
    'common.cancel': 'रद्द करा',
    'common.delete': 'हटवा',
    'common.edit': 'संपादित करा',
    'common.view': 'पहा',
    'common.submit': 'सबमिट करा',
    'common.search': 'शोधा',
    'common.filter': 'फिल्टर',
    'common.back': 'मागे',
    'common.next': 'पुढे',
    'common.previous': 'मागील',
    'common.close': 'बंद करा',
    'common.confirm': 'पुष्टी करा',
    'common.yes': 'होय',
    'common.no': 'नाही',

    // Auth
    'auth.login': 'लॉगिन',
    'auth.register': 'नोंदणी',
    'auth.logout': 'लॉगआउट',
    'auth.username': 'वापरकर्ता नाव',
    'auth.password': 'पासवर्ड',
    'auth.fullName': 'पूर्ण नाव',
    'auth.loginButton': 'साइन इन करा',
    'auth.registerButton': 'साइन अप करा',
    'auth.noAccount': 'खाते नाही?',
    'auth.hasAccount': 'आधीच खाते आहे?',
    'auth.loginSuccess': 'लॉगिन यशस्वी',
    'auth.registerSuccess': 'नोंदणी यशस्वी',
    'auth.loginError': 'लॉगिन अयशस्वी',
    'auth.registerError': 'नोंदणी अयशस्वी',
    'auth.pendingApproval': 'आपले डॉक्टर खाते प्रशासकीय मान्यतेची प्रतीक्षा करत आहे',
    'auth.awaitingApproval': 'नोंदणी यशस्वी! प्रशासक मान्यतेची प्रतीक्षा आहे.',

    // Navigation
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.consultations': 'सल्लामसलत',
    'nav.prescriptions': 'प्रिस्क्रिप्शन',
    'nav.medicalRecords': 'वैद्यकीय नोंदी',
    'nav.aiChat': 'एआय सहाय्यक',
    'nav.profile': 'प्रोफाइल',
    'nav.admin': 'प्रशासक पॅनेल',
    'nav.patients': 'रुग्ण',
    'nav.doctors': 'डॉक्टर',
    'nav.settings': 'सेटिंग्ज',

    // Dashboard
    'dashboard.welcome': 'स्वागत आहे',
    'dashboard.stats': 'आकडेवारी',
    'dashboard.recentActivity': 'अलीकडील क्रियाकलाप',
    'dashboard.upcomingConsultations': 'आगामी सल्लामसलत',

    // Consultations
    'consultation.new': 'नवीन सल्लामसलत',
    'consultation.type': 'सल्लामसलत प्रकार',
    'consultation.type.video': 'व्हिडिओ कॉल',
    'consultation.type.voice': 'व्हॉइस कॉल',
    'consultation.type.chat': 'चॅट',
    'consultation.type.inPerson': 'इन पर्सन',
    'consultation.symptoms': 'लक्षणे',
    'consultation.diagnosis': 'निदान',
    'consultation.notes': 'नोट्स',
    'consultation.status': 'स्थिती',
    'consultation.pending': 'प्रलंबित',
    'consultation.inProgress': 'प्रगतीपथावर',
    'consultation.completed': 'पूर्ण',
    'consultation.cancelled': 'रद्द',
    'consultation.aiChat': 'एआय चॅट',
    'consultation.voice': 'व्हॉइस कॉल',
    'consultation.video': 'व्हिडिओ कॉल',
    'consultation.arDiagnosis': 'एआर निदान',
    'consultation.manage': 'तुमचे वैद्यकीय सल्लामसलत व्यवस्थापित करा',
    'consultation.manageDoctor': 'तुमचे रुग्ण सल्लामसलत व्यवस्थापित करा',
    'consultation.my': 'माझे सल्लामसलत',
    'consultation.pendingRequests': 'प्रलंबित विनंत्या',
    'consultation.all': 'सर्व',
    'consultation.notFound': 'कोणतीही सल्लामसलत आढळली नाही',
    'consultation.notFoundDesc': 'तुम्ही अद्याप कोणतीही सल्लामसलत बुक केलेली नाही',
    'consultation.noPending': 'कोणतीही प्रलंबित सल्लामसलत नाही',
    'consultation.noInProgress': 'कोणतीही सक्रिय सल्लामसलत नाही',
    'consultation.noCompleted': 'कोणतीही पूर्ण सल्लामसलत नाही',
    'consultation.bookFirst': 'तुमची पहिली सल्लामसलत बुक करा',
    'consultation.viewDetails': 'तपशील पहा',
    'consultation.cancelConfirm': 'तुम्हाला नक्की ही सल्लामसलत रद्द करायची आहे का?',
    'consultation.cancelSuccess': 'सल्लामसलत यशस्वीरित्या रद्द केली',
    'consultation.cancelError': 'सल्लामसलत रद्द करण्यात अयशस्वी',
    'consultation.loadError': 'सल्लामसलत लोड करण्यात अयशस्वी',
    'consultation.noConsultations': 'अद्याप कोणतीही सल्लामसलत नाही',
    'consultation.noConsultationsDesc': 'तुम्ही अद्याप कोणतीही सल्लामसलत स्वीकारलेली नाही. प्रलंबित विनंत्या टॅब तपासा.',
    'consultation.medicalHistory': 'वैद्यकीय इतिहास',
    'consultation.accept': 'सल्लामसलत स्वीकारा',
    'consultation.noPendingRequests': 'कोणत्याही प्रलंबित विनंत्या नाहीत',
    'consultation.noPendingRequestsDesc': 'या क्षणी कोणतीही प्रलंबित सल्लामसलत विनंती नाही.',
    'consultation.acceptSuccess': 'सल्लामसलत स्वीकारली',
    'consultation.acceptError': 'सल्लामसलत स्वीकारण्यात अयशस्वी',
    'consultation.unknownPatient': 'अज्ञात रुग्ण',
    'consultation.newRequest': 'नवीन विनंती',

    // Prescriptions
    'prescription.new': 'नवीन प्रिस्क्रिप्शन',
    'prescription.medications': 'औषधे',
    'prescription.instructions': 'सूचना',
    'prescription.validUntil': 'वैध पर्यंत',
    'prescription.qrCode': 'क्यूआर कोड',
    'prescription.scanQR': 'क्यूआर कोड स्कॅन करा',

    // Medical Records
    'record.new': 'नवीन नोंद',
    'record.title': 'शीर्षक',
    'record.description': 'वर्णन',
    'record.type': 'प्रकार',
    'record.image': 'प्रतिमा',
    'record.video': 'व्हिडिओ',
    'record.document': 'दस्तऐवज',
    'record.note': 'नोंद',

    // Symptoms
    'symptom.checker': 'लक्षण तपासक',
    'symptom.search': 'लक्षणे शोधा',
    'symptom.category': 'श्रेणी',
    'symptom.severity': 'तीव्रता',
    'symptom.recommendations': 'शिफारसी',

    // Language
    'language.select': 'भाषा निवडा',
    'language.en': 'English',
    'language.hi': 'हिंदी',
    'language.mr': 'मराठी',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Initialize from localStorage on mount
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang && ['en', 'hi', 'mr'].includes(savedLang) ? savedLang : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
