import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Edit2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function SocialLinksAdmin() {
  const [links, setLinks] = useState<any[]>([]);
  const [formData, setFormData] = useState({ id: null, platform: '', url: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = () => {
    axios.get(`${API_URL}/social-link`).then(res => setLinks(res.data));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform || !formData.url) return;
    try {
      if (formData.id) {
        await axios.patch(`${API_URL}/social-link/${formData.id}`, formData);
      } else {
        await axios.post(`${API_URL}/social-link`, formData);
      }
      setFormData({ id: null, platform: '', url: '' });
      setShowForm(false);
      fetchLinks();
    } catch (error) {
      alert('Failed to save link');
    }
  };

  const handleEdit = (link: any) => {
    setFormData(link);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      await axios.delete(`${API_URL}/social-link/${id}`);
      fetchLinks();
    } catch (error) {
      alert('Failed to delete link');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]">
        <h2 className="text-2xl font-serif text-[#4A4A4A]">Manage Contacts / Social Links</h2>
        <button 
          onClick={() => { setShowForm(!showForm); setFormData({ id: null, platform: '', url: '' }); }}
          className="flex items-center gap-2 px-6 py-2 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors"
        >
          <Plus size={20} /> {showForm ? 'Cancel' : 'Add Link'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5] flex flex-wrap md:flex-nowrap gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Platform (e.g. Github, Email)</label>
            <input type="text" required value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]" />
          </div>
          <div className="w-full md:flex-1">
            <label className="block text-sm font-medium text-[#6B6B6B] mb-2">URL / Link</label>
            <input type="text" required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]" />
          </div>
          <button type="submit" className="w-full md:w-auto px-8 py-2 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors whitespace-nowrap h-[42px]">
            {formData.id ? 'Save' : 'Add'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
        {Array.isArray(links) && links.map((link, index) => (
          <div key={link.id} className={`p-6 flex items-center justify-between ${index !== links.length - 1 ? 'border-b border-[#E5E5E5]' : ''}`}>
            <div>
              <h3 className="text-lg font-medium text-[#4A4A4A]">{link.platform}</h3>
              <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-[#888888] hover:text-[#A3B18A] mt-1 block">{link.url}</a>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(link)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(link.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {(!Array.isArray(links) || links.length === 0) && (
          <div className="p-12 text-center text-[#888888]">No contact links added yet.</div>
        )}
      </div>
    </div>
  );
}
