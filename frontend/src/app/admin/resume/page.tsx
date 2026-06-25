"use client";

import { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, FileText, Download } from 'lucide-react';
import { resumeService, uploadService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

export default function ResumeAdmin() {
  const [resumes, setResumes] = useState<any[]>([]);
  
  const [title, setTitle] = useState({ vi: '', en: '' });
  const [fileUrl, setFileUrl] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [editLang, setEditLang] = useState<'vi' | 'en'>('vi');
  const { tData } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await resumeService.getAll();
      setResumes(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      setFileUrl(res.url);
    } catch (error) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.vi.trim() || !fileUrl) return;
    
    try {
      await resumeService.create({ title, fileUrl });
      setTitle({ vi: '', en: '' });
      setFileUrl('');
      fetchData();
    } catch (error) {
      alert('Failed to add resume');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumeService.delete(id);
      fetchData();
    } catch (error) {
      alert('Failed to delete resume');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif text-[#4A4A4A]">Manage Resumes (CVs)</h2>
          <div className="flex bg-[#F5F5F5] rounded-lg p-1">
            <button onClick={() => setEditLang('vi')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editLang === 'vi' ? 'bg-white shadow-sm text-[#A3B18A]' : 'text-[#888888] hover:text-[#4A4A4A]'}`}>Tiếng Việt</button>
            <button onClick={() => setEditLang('en')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editLang === 'en' ? 'bg-white shadow-sm text-[#A3B18A]' : 'text-[#888888] hover:text-[#4A4A4A]'}`}>English</button>
          </div>
        </div>
        
        <form onSubmit={handleAdd} className="space-y-4 border-b border-[#E5E5E5] pb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              required={editLang === 'vi'}
              value={(title as any)[editLang]}
              onChange={e => setTitle({...title, [editLang]: e.target.value})}
              placeholder={`Job Title (${editLang.toUpperCase()})...`}
              className="flex-1 px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={handleFileUpload} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-[#F5F5F5] text-[#4A4A4A] rounded-xl hover:bg-[#E5E5E5] transition-colors whitespace-nowrap border border-[#E5E5E5]">
              <FileText size={18} /> {uploading ? 'Uploading PDF...' : 'Select PDF File'}
            </button>
            <input
              type="text"
              value={fileUrl}
              onChange={e => setFileUrl(e.target.value)}
              placeholder="Or paste PDF URL directly"
              className="flex-1 px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
            />
            <button type="submit" disabled={uploading || !fileUrl || !title} className="flex items-center gap-2 px-8 py-3 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors disabled:opacity-50 h-[50px]">
              <Plus size={20} /> Add CV
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumes.length > 0 ? resumes.map(cv => (
            <div key={cv.id} className="flex justify-between items-center p-6 bg-[#FAF9F6] rounded-xl border border-[#E5E5E5] group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#E5E5E5] flex items-center justify-center text-[#A3B18A]">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A4A4A]">{tData(cv.title)}</h3>
                  <p className="text-sm text-[#888888]">Uploaded {new Date(cv.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={cv.fileUrl} target="_blank" rel="noreferrer" className="text-[#A3B18A] hover:text-[#8B9973] transition-colors p-2 bg-white rounded-lg shadow-sm border border-[#E5E5E5]">
                  <Download size={20} />
                </a>
                <button onClick={() => handleDelete(cv.id)} className="text-red-400 hover:text-red-600 transition-colors p-2 bg-white rounded-lg shadow-sm border border-[#E5E5E5]">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          )) : (
            <p className="text-[#888888] py-4 col-span-full">No CVs added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
