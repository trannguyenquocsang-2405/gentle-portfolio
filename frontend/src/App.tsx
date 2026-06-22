import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { BlogDetail } from './pages/BlogDetail';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { useEffect, useState } from 'react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FAF9F6]/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif tracking-wide text-[#4A4A4A]">
          MyPortfolio
        </Link>
        <div className="hidden md:flex gap-8 text-[#4A4A4A] font-medium">
          <a href="/#about" className="hover:text-[#A3B18A] transition-colors">About</a>
          <a href="/#skills" className="hover:text-[#A3B18A] transition-colors">Skills</a>
          <a href="/#projects" className="hover:text-[#A3B18A] transition-colors">Projects</a>
          <a href="/#blog" className="hover:text-[#A3B18A] transition-colors">Blog</a>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAF9F6] text-[#4A4A4A] font-sans selection:bg-[#A3B18A]/30">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/blog/:id" element={<><Navbar /><BlogDetail /></>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
