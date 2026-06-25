"use client";

import { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Edit2, Image as ImageIcon } from 'lucide-react';
import { socialLinkService, uploadService } from '@/services/api';

export default function SocialLinksAdmin() {
  const [links, setLinks] = useState<any[]>([]);
  const [formData, setFormData] = useState({ id: null, platform: '', url: '', iconUrl: '' });
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const data = await socialLinkService.getAll();
      setLinks(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform || !formData.url) return;
    try {
      if (formData.id) {
        await socialLinkService.update(formData.id, formData);
      } else {
        const { id, ...postData } = formData;
        await socialLinkService.create(postData);
      }
      setFormData({ id: null, platform: '', url: '', iconUrl: '' });
      setShowForm(false);
      fetchLinks();
    } catch (error) {
      alert('Failed to save link');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      setFormData({ ...formData, iconUrl: res.url });
    } catch (error) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleEdit = (link: any) => {
    setFormData(link);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      await socialLinkService.delete(id);
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
          onClick={() => { setShowForm(!showForm); setFormData({ id: null, platform: '', url: '', iconUrl: '' }); }}
          className="flex items-center gap-2 px-6 py-2 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors"
        >
          <Plus size={20} /> {showForm ? 'Cancel' : 'Add Link'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5] space-y-4">
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Platform (e.g. Github)</label>
              <input type="text" required value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]" />
            </div>
            <div className="w-full md:flex-1">
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2">URL / Link</label>
              <input type="text" required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Icon Image (Optional)</label>
            <div className="flex items-center gap-4">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F5] text-[#4A4A4A] rounded-xl hover:bg-[#E5E5E5] transition-colors">
                <ImageIcon size={18} /> {uploading ? 'Uploading...' : 'Upload Icon'}
              </button>
              <input
                type="text"
                value={formData.iconUrl || ''}
                onChange={e => setFormData({...formData, iconUrl: e.target.value})}
                placeholder="Or paste icon URL"
                className="flex-1 px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] transition-colors"
              />
            </div>
            {formData.iconUrl && <img src={formData.iconUrl} alt="Icon Preview" className="h-10 w-10 object-contain mt-4 border border-[#E5E5E5] p-1 rounded-lg" />}
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={uploading} className="px-8 py-2 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors h-[42px] disabled:opacity-50">
              {formData.id ? 'Save Changes' : 'Add Link'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
        {Array.isArray(links) && links.map((link, index) => (
          <div key={link.id} className={`p-6 flex items-center justify-between ${index !== links.length - 1 ? 'border-b border-[#E5E5E5]' : ''}`}>
            <div className="flex items-center gap-4">
              {link.iconUrl && <img src={link.iconUrl} alt={link.platform} className="w-10 h-10 object-contain rounded-md" />}
              <div>
                <h3 className="text-lg font-medium text-[#4A4A4A]">{link.platform}</h3>
                <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-[#888888] hover:text-[#A3B18A] mt-1 block">{link.url}</a>
              </div>
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
