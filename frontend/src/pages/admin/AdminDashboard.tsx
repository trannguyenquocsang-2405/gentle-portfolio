import { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-[#FAF9F6]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-serif text-[#4A4A4A]">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/admin/profile" className="block px-4 py-2 text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#A3B18A] rounded-lg transition-colors">Profile</Link>
          <Link to="/admin/skills" className="block px-4 py-2 text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#A3B18A] rounded-lg transition-colors">Skills</Link>
          <Link to="/admin/projects" className="block px-4 py-2 text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#A3B18A] rounded-lg transition-colors">Projects</Link>
          <Link to="/admin/blogs" className="block px-4 py-2 text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#A3B18A] rounded-lg transition-colors">Blogs</Link>
          <Link to="/admin/links" className="block px-4 py-2 text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#A3B18A] rounded-lg transition-colors">Social Links</Link>
        </nav>
        <div className="p-4 border-t border-[#E5E5E5]">
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-[#D4A373] hover:bg-[#F5F5F5] rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <Routes>
          <Route path="/" element={<div className="text-[#6B6B6B]">Welcome to Admin Dashboard. Select a module from the sidebar.</div>} />
          <Route path="/profile" element={<div>Profile Editor Coming Soon</div>} />
          <Route path="/skills" element={<div>Skills Editor Coming Soon</div>} />
          <Route path="/projects" element={<div>Projects Editor Coming Soon</div>} />
          <Route path="/blogs" element={<div>Blog Editor Coming Soon</div>} />
          <Route path="/links" element={<div>Links Editor Coming Soon</div>} />
        </Routes>
      </main>
    </div>
  );
}
