import { Link, Outlet, useNavigate } from 'react-router-dom';
import { User, Code, FolderGit2, PenTool, Link2, LogOut } from 'lucide-react';
import { useEffect } from 'react';

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
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col">
        <div className="p-6 border-b border-[#E5E5E5]">
          <h1 className="text-2xl font-serif text-[#4A4A4A]">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-[#6B6B6B] hover:text-[#4A4A4A] hover:bg-[#F5F5F5] rounded-xl transition-colors">
            <User size={20} />
            Profile
          </Link>
          <Link to="/admin/skills" className="flex items-center gap-3 px-4 py-3 text-[#6B6B6B] hover:text-[#4A4A4A] hover:bg-[#F5F5F5] rounded-xl transition-colors">
            <Code size={20} />
            Skills
          </Link>
          <Link to="/admin/projects" className="flex items-center gap-3 px-4 py-3 text-[#6B6B6B] hover:text-[#4A4A4A] hover:bg-[#F5F5F5] rounded-xl transition-colors">
            <FolderGit2 size={20} />
            Projects
          </Link>
          <Link to="/admin/blogs" className="flex items-center gap-3 px-4 py-3 text-[#6B6B6B] hover:text-[#4A4A4A] hover:bg-[#F5F5F5] rounded-xl transition-colors">
            <PenTool size={20} />
            Blogs
          </Link>
          <Link to="/admin/contact" className="flex items-center gap-3 px-4 py-3 text-[#6B6B6B] hover:text-[#4A4A4A] hover:bg-[#F5F5F5] rounded-xl transition-colors">
            <Link2 size={20} />
            Contact
          </Link>
        </nav>
        <div className="p-4 border-t border-[#E5E5E5]">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
