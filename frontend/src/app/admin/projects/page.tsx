"use client";

import { useState, useEffect, useRef } from 'react';
import { Trash2, Edit2, Plus, Image as ImageIcon } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { projectService, uploadService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState({ id: null, title: {vi: '', en: ''}, description: {vi: '', en: ''}, details: {vi: '', en: ''}, imageUrl: '', demoUrl: '', sourceUrl: '', isFeatured: false });
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editLang, setEditLang] = useState<'vi' | 'en'>('vi');
  const { tData } = useLanguage();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      setFormData({ ...formData, imageUrl: res.url });
    } catch (error) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const { id, ...updateData } = formData;
        await projectService.update(formData.id, updateData);
      } else {
        const { id, ...postData } = formData;
        await projectService.create(postData);
      }
      setShowForm(false);
      setFormData({ id: null, title: {vi: '', en: ''}, description: {vi: '', en: ''}, details: {vi: '', en: ''}, imageUrl: '', demoUrl: '', sourceUrl: '', isFeatured: false });
      fetchProjects();
    } catch (error) {
      alert('Failed to save project');
    }
  };

  const ensureJson = (val: any) => typeof val === 'object' && val !== null ? val : { vi: val || '', en: '' };

  const handleEdit = (project: any) => {
    setFormData({
      ...project,
      title: ensureJson(project.title),
      description: ensureJson(project.description),
      details: ensureJson(project.details),
    });
    setShowForm(true);
  };

  const handleTextChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: {
        ...(prev[field] || { vi: '', en: '' }),
        [editLang]: value
      }
    }));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.delete(id);
      fetchProjects();
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]">
        <h2 className="text-2xl font-serif text-[#4A4A4A]">Manage Projects</h2>
        <button 
          onClick={() => { setShowForm(!showForm); setFormData({ id: null, title: {vi: '', en: ''}, description: {vi: '', en: ''}, details: {vi: '', en: ''}, imageUrl: '', demoUrl: '', sourceUrl: '', isFeatured: false }); }}
          className="flex items-center gap-2 px-6 py-2 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors"
        >
          <Plus size={20} /> {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] space-y-6">
          <div className="flex bg-[#F5F5F5] rounded-lg p-1 w-max mb-6">
            <button type="button" onClick={() => setEditLang('vi')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editLang === 'vi' ? 'bg-white shadow-sm text-[#A3B18A]' : 'text-[#888888] hover:text-[#4A4A4A]'}`}>Tiếng Việt</button>
            <button type="button" onClick={() => setEditLang('en')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editLang === 'en' ? 'bg-white shadow-sm text-[#A3B18A]' : 'text-[#888888] hover:text-[#4A4A4A]'}`}>English</button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6B6B6B]">Title ({editLang.toUpperCase()})</label>
              <input type="text" required={editLang==='vi'} value={(formData.title as any)?.[editLang] || ''} onChange={e => handleTextChange('title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Short Description ({editLang.toUpperCase()})</label>
              <textarea required={editLang==='vi'} value={(formData.description as any)?.[editLang] || ''} onChange={e => handleTextChange('description', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Detailed Work Description ({editLang.toUpperCase()})</label>
              <div data-color-mode="light">
                <MDEditor
                  value={(formData.details as any)?.[editLang] || ''}
                  onChange={val => handleTextChange('details', val || '')}
                  height={300}
                  className="rounded-xl overflow-hidden border border-[#E5E5E5] !shadow-none"
                />
              </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Live Demo URL (Optional)</label>
                <input type="text" value={formData.demoUrl || ''} onChange={e => setFormData({...formData, demoUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]" />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Source Code URL (Optional)</label>
                <input type="text" value={formData.sourceUrl || ''} onChange={e => setFormData({...formData, sourceUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-sm font-medium text-[#4A4A4A] bg-[#FAF9F6] p-4 rounded-xl border border-[#A3B18A] cursor-pointer hover:bg-[#F5F5F5] transition-colors">
                <input type="checkbox" checked={formData.isFeatured || false} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 rounded border-[#A3B18A] text-[#A3B18A] focus:ring-[#A3B18A]" />
                <span className="text-lg">🌟 Đánh dấu là dự án tâm huyết (Featured Masterpiece)</span>
              </label>
            </div>
            <div className="space-y-2">
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
            {project.imageUrl && <img src={project.imageUrl} alt={tData(project.title)} className="w-full h-48 object-cover" />}
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-serif text-[#4A4A4A]">{tData(project.title)}</h3>
              <p className="text-[#6B6B6B] text-sm line-clamp-3">{tData(project.description)}</p>
              
              <div className="flex gap-4 pt-2">
                {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#A3B18A] hover:text-[#8B9973]">Live Demo &rarr;</a>}
                {project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#A3B18A] hover:text-[#8B9973]">Source Code &rarr;</a>}
              </div>

              <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-[#E5E5E5]">
                <button onClick={() => handleEdit(project)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(project.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
        {!Array.isArray(projects) && <p className="text-red-500 col-span-2">Failed to load projects.</p>}
      </div>
    </div>
  );
}
