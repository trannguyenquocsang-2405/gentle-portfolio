"use client";

import { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { skillService, skillCategoryService, uploadService } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [newCategory, setNewCategory] = useState({ vi: '', en: '' });
  
  const [newSkill, setNewSkill] = useState({ vi: '', en: '' });
  const [categoryId, setCategoryId] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [editLang, setEditLang] = useState<'vi' | 'en'>('vi');
  const { tData } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [skillsData, catsData] = await Promise.all([
        skillService.getAll(),
        skillCategoryService.getAll()
      ]);
      setSkills(skillsData);
      setCategories(catsData);
      if (catsData.length > 0 && !categoryId) {
        setCategoryId(catsData[0].id.toString());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.vi.trim()) return;
    try {
      await skillCategoryService.create({ name: newCategory });
      setNewCategory({ vi: '', en: '' });
      fetchData();
    } catch (error) {
      alert('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete this category? Skills inside it will lose their category.')) return;
    try {
      await skillCategoryService.delete(id);
      fetchData();
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      setIconUrl(res.url);
    } catch (error) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.vi.trim() || !categoryId) return;
    try {
      await skillService.create({ name: newSkill, categoryId: parseInt(categoryId), iconUrl });
      setNewSkill({ vi: '', en: '' });
      setIconUrl('');
      fetchData();
    } catch (error) {
      alert('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await skillService.delete(id);
      fetchData();
    } catch (error) {
      alert('Failed to delete skill');
    }
  };

  const groupedSkills = Array.isArray(skills) ? skills.reduce((acc, skill) => {
    const cat = skill.category?.name || 'Uncategorized';
    const catKey = typeof cat === 'object' ? JSON.stringify(cat) : cat;
    if (!acc[catKey]) acc[catKey] = [];
    acc[catKey].push(skill);
    return acc;
  }, {} as Record<string, any[]>) : {};

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* CATEGORY MANAGEMENT */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-serif text-[#4A4A4A]">Manage Categories</h2>
          <div className="flex bg-[#F5F5F5] rounded-lg p-1">
            <button onClick={() => setEditLang('vi')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editLang === 'vi' ? 'bg-white shadow-sm text-[#A3B18A]' : 'text-[#888888] hover:text-[#4A4A4A]'}`}>Tiếng Việt</button>
            <button onClick={() => setEditLang('en')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editLang === 'en' ? 'bg-white shadow-sm text-[#A3B18A]' : 'text-[#888888] hover:text-[#4A4A4A]'}`}>English</button>
          </div>
        </div>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            required={editLang === 'vi'}
            value={(newCategory as any)[editLang]}
            onChange={e => setNewCategory({...newCategory, [editLang]: e.target.value})}
            placeholder={`New Category (${editLang.toUpperCase()})...`}
            className="flex-1 px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
          />
          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors whitespace-nowrap">
            <Plus size={20} /> Add Category
          </button>
        </form>
        <div className="flex flex-wrap gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-3 px-5 py-2 bg-[#F5F5F5] rounded-full border border-[#E5E5E5]">
              <span className="text-[#4A4A4A]">{tData(cat.name)}</span>
              <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {categories.length === 0 && <p className="text-[#888888] text-sm">No categories. Please add one first.</p>}
        </div>
      </div>

      {/* SKILLS MANAGEMENT */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] space-y-8">
        <h2 className="text-2xl font-serif text-[#4A4A4A]">Manage Skills</h2>
        
        <form onSubmit={handleAddSkill} className="space-y-4 border-b border-[#E5E5E5] pb-8">
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            <input
              type="text"
              required={editLang === 'vi'}
              value={(newSkill as any)[editLang]}
              onChange={e => setNewSkill({...newSkill, [editLang]: e.target.value})}
              placeholder={`Skill name (${editLang.toUpperCase()})...`}
              className="flex-1 px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
            />
            <select
              required
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full md:w-64 px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] bg-white"
            >
              <option value="" disabled>Select Category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{tData(cat.name)}</option>)}
            </select>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-3 bg-[#F5F5F5] text-[#4A4A4A] rounded-xl hover:bg-[#E5E5E5] transition-colors whitespace-nowrap">
              <ImageIcon size={18} /> {uploading ? 'Uploading...' : 'Upload Icon'}
            </button>
            <input
              type="text"
              value={iconUrl}
              onChange={e => setIconUrl(e.target.value)}
              placeholder="Or paste icon URL"
              className="flex-1 px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
            />
            {iconUrl && <img src={iconUrl} alt="Preview" className="h-10 w-10 object-contain p-1 border border-[#E5E5E5] rounded-md" />}
            <button type="submit" disabled={uploading || !categoryId} className="flex items-center gap-2 px-8 py-3 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors disabled:opacity-50 h-[50px]">
              <Plus size={20} />
              Add Skill
            </button>
          </div>
        </form>

        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([catStr, catSkills]) => {
            const catObj = catStr.startsWith('{') ? JSON.parse(catStr) : catStr;
            return (
            <div key={catStr} className="space-y-4">
              <h3 className="text-lg font-serif text-[#4A4A4A] pb-2 border-b border-[#E5E5E5]">{tData(catObj)}</h3>
              <div className="flex flex-wrap gap-4">
                {(catSkills as any[]).map((skill: any) => (
                  <div key={skill.id} className="flex items-center gap-3 px-5 py-2 bg-[#FAF9F6] rounded-full border border-[#E5E5E5]">
                    {skill.iconUrl && <img src={skill.iconUrl} alt={tData(skill.name)} className="w-5 h-5 object-contain" />}
                    <span className="text-[#4A4A4A]">{tData(skill.name)}</span>
                    <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-400 hover:text-red-600 transition-colors ml-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
          {!Array.isArray(skills) && <p className="text-red-500">Failed to load skills (Backend returned non-array data).</p>}
          {Array.isArray(skills) && skills.length === 0 && <p className="text-[#888888]">No skills added yet.</p>}
        </div>
      </div>
    </div>
  );
}
