"use client";

import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

function Navbar({ darkMode, setDarkMode }: { darkMode: boolean, setDarkMode: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FAF9F6]/90 dark:bg-[#121212]/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif tracking-wide text-[#4A4A4A] dark:text-[#EAEAEA]">
          Tran Nguyen Quoc Sang
        </Link>
        <div className="hidden md:flex items-center gap-8 text-[#4A4A4A] dark:text-[#EAEAEA] font-medium">
          <Link href="/#about" className="hover:text-[#A3B18A] transition-colors">{t('nav.about')}</Link>
          <Link href="/#skills" className="hover:text-[#A3B18A] transition-colors">{t('nav.skills')}</Link>
          <Link href="/#experience" className="hover:text-[#A3B18A] transition-colors">{t('nav.experience')}</Link>
          <Link href="/#projects" className="hover:text-[#A3B18A] transition-colors">{t('nav.projects')}</Link>
          <Link href="/#blog" className="hover:text-[#A3B18A] transition-colors">{t('nav.blog')}</Link>
          <Link href="/#contact" className="hover:text-[#A3B18A] transition-colors">{t('nav.contact')}</Link>

          <div className="flex items-center gap-4 border-l border-gray-300 dark:border-gray-700 pl-4">
            <button
              onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
              className="px-2 py-1 text-sm rounded-md font-bold hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {lang === 'en' ? 'EN' : 'VI'}
            </button>
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
              }}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(localStorage.getItem('theme') === 'dark');
  }, []);

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#FAF9F6] text-[#4A4A4A] dark:bg-[#121212] dark:text-[#EAEAEA] font-sans selection:bg-[#A3B18A]/30 transition-colors duration-300">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        {children}
      </div>
    </div>
  );
}
