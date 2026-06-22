import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [newCategory, setNewCategory] = useState('');
  
  const [newSkill, setNewSkill] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [skillsRes, catsRes] = await Promise.all([
        axios.get(`${API_URL}/skill`),
        axios.get(`${API_URL}/skill-category`)
      ]);
      setSkills(skillsRes.data);
      setCategories(catsRes.data);
      if (catsRes.data.length > 0 && !categoryId) {
        setCategoryId(catsRes.data[0].id.toString());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await axios.post(`${API_URL}/skill-category`, { name: newCategory });
      setNewCategory('');
      fetchData();
    } catch (error) {
      alert('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete this category? Skills inside it will lose their category.')) return;
    try {
      await axios.delete(`${API_URL}/skill-category/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete category');
    }
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
      setIconUrl(res.data.url);
    } catch (error) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || !categoryId) return;
    try {
      await axios.post(`${API_URL}/skill`, { name: newSkill, categoryId: parseInt(categoryId), iconUrl });
      setNewSkill('');
      setIconUrl('');
      fetchData();
    } catch (error) {
      alert('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await axios.delete(`${API_URL}/skill/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete skill');
    }
  };

  const groupedSkills = Array.isArray(skills) ? skills.reduce((acc, skill) => {
    const cat = skill.category?.name || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, any[]>) : {};

  return (
    <div className="space-y-8">
      
      {/* CATEGORY MANAGEMENT */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] space-y-6">
        <h2 className="text-2xl font-serif text-[#4A4A4A]">Manage Categories</h2>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            required
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="New Category (e.g. Databases)..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
          />
          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors whitespace-nowrap">
            <Plus size={20} /> Add Category
          </button>
        </form>
        <div className="flex flex-wrap gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-3 px-5 py-2 bg-[#F5F5F5] rounded-full border border-[#E5E5E5]">
              <span className="text-[#4A4A4A]">{cat.name}</span>
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
              required
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              placeholder="Skill name (e.g. React)..."
              className="flex-1 px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
            />
            <select
              required
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full md:w-64 px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] bg-white"
            >
              <option value="" disabled>Select Category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
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
          {Object.entries(groupedSkills).map(([cat, catSkills]) => (
            <div key={cat} className="space-y-4">
              <h3 className="text-lg font-serif text-[#4A4A4A] pb-2 border-b border-[#E5E5E5]">{cat}</h3>
              <div className="flex flex-wrap gap-4">
                {(catSkills as any[]).map((skill: any) => (
                  <div key={skill.id} className="flex items-center gap-3 px-5 py-2 bg-[#FAF9F6] rounded-full border border-[#E5E5E5]">
                    {skill.iconUrl && <img src={skill.iconUrl} alt={skill.name} className="w-5 h-5 object-contain" />}
                    <span className="text-[#4A4A4A]">{skill.name}</span>
                    <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-400 hover:text-red-600 transition-colors ml-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!Array.isArray(skills) && <p className="text-red-500">Failed to load skills (Backend returned non-array data).</p>}
          {Array.isArray(skills) && skills.length === 0 && <p className="text-[#888888]">No skills added yet.</p>}
        </div>
      </div>
    </div>
  );
}
