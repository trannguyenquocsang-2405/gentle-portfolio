"use client";

import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { experienceService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

export default function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null as number | null,
    company: '',
    role: { vi: '', en: '' },
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: { vi: '', en: '' },
    productUrl: ''
  });
  const [editLang, setEditLang] = useState<'vi'|'en'>('vi');
  const { tData } = useLanguage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await experienceService.getAll();
      setExperiences(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.vi.trim() || !formData.startDate) return;
    
    try {
      const payload = {
        company: formData.company,
        role: formData.role,
        startDate: new Date(`${formData.startDate}-01`).toISOString(),
        endDate: formData.isCurrent || !formData.endDate ? null : new Date(`${formData.endDate}-01`).toISOString(),
        isCurrent: formData.isCurrent,
        description: formData.description,
        productUrl: formData.productUrl
      };
      
      if (formData.id) {
        await experienceService.update(formData.id, payload);
      } else {
        await experienceService.create(payload);
      }
      
      // Reset form
      setFormData({ id: null, company: '', role: { vi: '', en: '' }, startDate: '', endDate: '', isCurrent: false, description: { vi: '', en: '' }, productUrl: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      alert('Failed to save experience');
    }
  };

  const ensureJson = (val: any) => typeof val === 'object' && val !== null ? val : { vi: val || '', en: '' };

  const handleEdit = (exp: any) => {
    const startObj = new Date(exp.startDate);
    const endObj = exp.endDate ? new Date(exp.endDate) : null;
    
    setFormData({
      id: exp.id,
      company: exp.company,
      role: ensureJson(exp.role),
      startDate: `${startObj.getFullYear()}-${String(startObj.getMonth() + 1).padStart(2, '0')}`,
      endDate: endObj ? `${endObj.getFullYear()}-${String(endObj.getMonth() + 1).padStart(2, '0')}` : '',
      isCurrent: exp.isCurrent,
      description: ensureJson(exp.description),
      productUrl: exp.productUrl || ''
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
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      await experienceService.delete(id);
      fetchData();
    } catch (error) {
      alert('Failed to delete experience');
    }
  };

  const formatMonthYear = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]">
        <h2 className="text-2xl font-serif text-[#4A4A4A]">Manage Work Experience</h2>
        <button 
          onClick={() => { setShowForm(!showForm); setFormData({ id: null, company: '', role: {vi:'', en:''}, startDate: '', endDate: '', isCurrent: false, description: {vi:'', en:''}, productUrl: '' }); }}
          className="flex items-center gap-2 px-6 py-2 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors"
        >
          <Plus size={20} /> {showForm ? 'Cancel' : 'Add Experience'}
        </button>
      </div>
        
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] space-y-4">
          <div className="flex bg-[#F5F5F5] rounded-lg p-1 w-max mb-6">
            <button type="button" onClick={() => setEditLang('vi')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editLang === 'vi' ? 'bg-white shadow-sm text-[#A3B18A]' : 'text-[#888888] hover:text-[#4A4A4A]'}`}>Tiếng Việt</button>
            <button type="button" onClick={() => setEditLang('en')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editLang === 'en' ? 'bg-white shadow-sm text-[#A3B18A]' : 'text-[#888888] hover:text-[#4A4A4A]'}`}>English</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={formData.company}
              onChange={e => setFormData({...formData, company: e.target.value})}
              placeholder="Company name..."
              className="px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
            />
            <input
              type="text"
              required={editLang === 'vi'}
              value={(formData.role as any)[editLang] || ''}
              onChange={e => handleTextChange('role', e.target.value)}
              placeholder={`Role/Job Title (${editLang.toUpperCase()})...`}
              className="px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-[#6B6B6B] px-1">Start Date</label>
              <input
                type="month"
                required
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm text-[#6B6B6B]">End Date</label>
                <label className="text-sm text-[#4A4A4A] flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={e => setFormData({...formData, isCurrent: e.target.checked})}
                    className="accent-[#A3B18A]"
                  />
                  Hiện tại đang làm
                </label>
              </div>
              <input
                type="month"
                required={!formData.isCurrent}
                disabled={formData.isCurrent}
                value={formData.isCurrent ? '' : formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] disabled:opacity-50 disabled:bg-gray-100"
              />
            </div>
          </div>

          <textarea
            value={(formData.description as any)[editLang] || ''}
            onChange={e => handleTextChange('description', e.target.value)}
            placeholder={`Description (${editLang.toUpperCase()})...`}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] resize-y"
          />

          <input
            type="url"
            value={formData.productUrl}
            onChange={e => setFormData({...formData, productUrl: e.target.value})}
            placeholder="Product URL / Demo URL (optional)..."
            className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
          />

          <div className="flex justify-end pt-2">
            <button type="submit" className="flex items-center justify-center gap-2 px-8 py-3 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors">
              <Plus size={20} /> {formData.id ? 'Save Changes' : 'Add Experience'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
        {experiences.length > 0 ? experiences.map((exp, index) => (
          <div key={exp.id} className={`flex justify-between items-start p-6 ${index !== experiences.length - 1 ? 'border-b border-[#E5E5E5]' : ''}`}>
            <div>
              <h3 className="text-lg font-bold text-[#4A4A4A]">{tData(exp.role)}</h3>
              <p className="text-[#A3B18A] font-medium">{exp.company}</p>
              <p className="text-sm text-[#6B6B6B] mt-1">
                {formatMonthYear(exp.startDate)} - {exp.isCurrent ? 'Present' : (exp.endDate ? formatMonthYear(exp.endDate) : 'Present')}
              </p>
              {exp.description && <p className="text-[#6B6B6B] mt-3 whitespace-pre-wrap">{tData(exp.description)}</p>}
              {exp.productUrl && (
                <a href={exp.productUrl} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm text-[#A3B18A] hover:underline">
                  🌐 Demo/Product Link
                </a>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(exp)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        )) : (
          <p className="text-[#888888] text-center py-12">No experiences added yet.</p>
        )}
      </div>
    </div>
  );
}
