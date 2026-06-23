import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Home } from './pages/Home';
import { BlogDetail } from './pages/BlogDetail';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProfileAdmin } from './pages/admin/ProfileAdmin';
import { SkillsAdmin } from './pages/admin/SkillsAdmin';
import { ProjectsAdmin } from './pages/admin/ProjectsAdmin';
import { BlogAdmin } from './pages/admin/BlogAdmin';
import { BlogEditor } from './pages/admin/BlogEditor';
import { SocialLinksAdmin } from './pages/admin/SocialLinksAdmin';
import { ExperienceAdmin } from './pages/admin/ExperienceAdmin';
import { ResumeAdmin } from './pages/admin/ResumeAdmin';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Navbar({ darkMode, setDarkMode }: { darkMode: boolean, setDarkMode: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);

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
        <Link to="/" className="text-2xl font-serif tracking-wide text-[#4A4A4A] dark:text-[#EAEAEA]">
          Tran Nguyen Quoc Sang
        </Link>
        <div className="hidden md:flex items-center gap-8 text-[#4A4A4A] dark:text-[#EAEAEA] font-medium">
          <a href="/#about" className="hover:text-[#A3B18A] transition-colors">About</a>
          <a href="/#skills" className="hover:text-[#A3B18A] transition-colors">Skills</a>
          <a href="/#experience" className="hover:text-[#A3B18A] transition-colors">Experience</a>
          <a href="/#projects" className="hover:text-[#A3B18A] transition-colors">Projects</a>
          <a href="/#blog" className="hover:text-[#A3B18A] transition-colors">Blog</a>
          <a href="/#contact" className="hover:text-[#A3B18A] transition-colors">Contact</a>

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
    </nav>
  );
}

function PublicLayout({ children, darkMode, setDarkMode }: { children: React.ReactNode, darkMode: boolean, setDarkMode: (v: boolean) => void }) {
  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#FAF9F6] text-[#4A4A4A] dark:bg-[#121212] dark:text-[#EAEAEA] font-sans selection:bg-[#A3B18A]/30 transition-colors duration-300">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        {children}
      </div>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  return (
    <BrowserRouter>
      {/* Container without styling to hold Routes */}
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout darkMode={darkMode} setDarkMode={setDarkMode}><Home /></PublicLayout>} />
          <Route path="/blog/:id" element={<PublicLayout darkMode={darkMode} setDarkMode={setDarkMode}><BlogDetail /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<ProfileAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="blogs" element={<BlogAdmin />} />
            <Route path="blogs/new" element={<BlogEditor />} />
            <Route path="blogs/edit/:id" element={<BlogEditor />} />
            <Route path="contact" element={<SocialLinksAdmin />} />
            <Route path="experience" element={<ExperienceAdmin />} />
            <Route path="resume" element={<ResumeAdmin />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
