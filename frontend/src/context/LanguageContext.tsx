import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'vi';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  tData: (data: any) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'hero.getInTouch': 'Get in touch',
    'hero.downloadCV': 'Download CV',
    'skills.title': 'My Skills',
    'skills.empty': 'No skills added yet.',
    'experience.title': 'Work Experience',
    'experience.present': 'Present',
    'experience.empty': 'No experience records added yet.',
    'experience.demo': 'Product / Demo',
    'projects.title': 'Featured Projects',
    'projects.liveDemo': 'Live Demo',
    'projects.sourceCode': 'Source Code',
    'projects.empty': 'Loading projects...',
    'blog.title': 'Blog',
    'blog.empty': 'Loading blogs...',
    'contact.title': 'Let\'s Connect',
    'contact.empty': 'No contact info available.',
    'modal.overview': 'Overview',
    'modal.whatIdid': 'What I Did',
    'blogDetail.back': 'Back to Home',
  },
  vi: {
    'nav.about': 'Giới thiệu',
    'nav.skills': 'Kỹ năng',
    'nav.experience': 'Kinh nghiệm',
    'nav.projects': 'Dự án',
    'nav.blog': 'Bài viết',
    'nav.contact': 'Liên hệ',
    'hero.getInTouch': 'Liên hệ ngay',
    'hero.downloadCV': 'Tải CV',
    'skills.title': 'Kỹ Năng',
    'skills.empty': 'Chưa có kỹ năng nào.',
    'experience.title': 'Kinh Nghiệm Làm Việc',
    'experience.present': 'Hiện tại',
    'experience.empty': 'Chưa có kinh nghiệm nào.',
    'experience.demo': 'Sản phẩm / Demo',
    'projects.title': 'Dự Án Tiêu Biểu',
    'projects.liveDemo': 'Xem Demo',
    'projects.sourceCode': 'Mã Nguồn',
    'projects.empty': 'Đang tải dự án...',
    'blog.title': 'Bài Viết',
    'blog.empty': 'Đang tải bài viết...',
    'contact.title': 'Kết Nối Với Tôi',
    'contact.empty': 'Chưa có thông tin liên hệ.',
    'modal.overview': 'Tổng quan',
    'modal.whatIdid': 'Chi tiết công việc',
    'blogDetail.back': 'Trở về Trang chủ',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>('vi');

  useEffect(() => {
    const saved = localStorage.getItem('app_lang');
    if (saved === 'vi' || saved === 'en') {
      setLangState(saved as Language);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_lang', newLang);
    }
  };

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  const tData = (data: any) => {
    if (!data) return '';
    if (typeof data === 'string') return data;
    return data[lang] || data['en'] || data['vi'] || '';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tData }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
