import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function BlogAdmin() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    axios.get(`${API_URL}/blog`).then(res => setBlogs(res.data));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`${API_URL}/blog/${id}`);
      fetchBlogs();
    } catch (error) {
      alert('Failed to delete blog');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]">
        <h2 className="text-2xl font-serif text-[#4A4A4A]">Manage Blogs</h2>
        <button 
          onClick={() => navigate('/admin/blogs/new')}
          className="flex items-center gap-2 px-6 py-2 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors"
        >
          <Plus size={20} /> Write Post
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
        {Array.isArray(blogs) && blogs.map((blog, index) => (
          <div key={blog.id} className={`p-6 flex items-center justify-between ${index !== blogs.length - 1 ? 'border-b border-[#E5E5E5]' : ''}`}>
            <div>
              <h3 className="text-xl font-serif text-[#4A4A4A]">{blog.title}</h3>
              <p className="text-sm text-[#888888] mt-1">{new Date(blog.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {(!Array.isArray(blogs) || blogs.length === 0) && (
          <div className="p-12 text-center text-[#888888]">No blog posts yet or failed to load. Click "Write Post" to start.</div>
        )}
      </div>
    </div>
  );
}
