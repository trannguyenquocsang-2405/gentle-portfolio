import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Trash2, Edit2, Plus, Image as ImageIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, title: '', description: '', imageUrl: '', link: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios.get(`${API_URL}/project`).then(res => setProjects(res.data));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    setUploading(true);
    try {
      const res = await axios.post(`${API_URL}/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, imageUrl: res.data.url });
    } catch (error) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.patch(`${API_URL}/project/${formData.id}`, formData);
      } else {
        await axios.post(`${API_URL}/project`, formData);
      }
      setShowForm(false);
      setFormData({ id: null, title: '', description: '', imageUrl: '', link: '' });
      fetchProjects();
    } catch (error) {
      alert('Failed to save project');
    }
  };

  const handleEdit = (project: any) => {
    setFormData(project);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`${API_URL}/project/${id}`);
      fetchProjects();
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]">
        <h2 className="text-2xl font-serif text-[#4A4A4A]">Manage Projects</h2>
        <button 
          onClick={() => { setShowForm(!showForm); setFormData({ id: null, title: '', description: '', imageUrl: '', link: '' }); }}
          className="flex items-center gap-2 px-6 py-2 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors"
        >
          <Plus size={20} /> {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6B6B6B]">Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6B6B6B]">Link URL</label>
              <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-[#6B6B6B]">Description</label>
              <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] resize-none" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-[#6B6B6B]">Image</label>
              <div className="flex items-center gap-4">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F5] text-[#4A4A4A] rounded-xl hover:bg-[#E5E5E5] transition-colors">
                  <ImageIcon size={18} /> {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="Or paste image URL" className="flex-1 px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]" />
              </div>
              {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="h-32 object-cover rounded-xl mt-4" />}
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={uploading} className="px-8 py-2 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors disabled:opacity-50">
              {formData.id ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.isArray(projects) && projects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E5E5]">
            {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif text-[#4A4A4A]">{project.title}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(project)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
              <p className="text-[#6B6B6B] text-sm mb-4 line-clamp-2">{project.description}</p>
              <a href={project.link} target="_blank" rel="noreferrer" className="text-[#A3B18A] text-sm hover:underline">View Link</a>
            </div>
          </div>
        ))}
        {!Array.isArray(projects) && <p className="text-red-500 col-span-2">Failed to load projects.</p>}
      </div>
    </div>
  );
}
