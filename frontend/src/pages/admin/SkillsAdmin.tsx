import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    axios.get(`${API_URL}/skill`).then(res => setSkills(res.data));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    try {
      await axios.post(`${API_URL}/skill`, { name: newSkill });
      setNewSkill('');
      fetchSkills();
    } catch (error) {
      alert('Failed to add skill');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await axios.delete(`${API_URL}/skill/${id}`);
      fetchSkills();
    } catch (error) {
      alert('Failed to delete skill');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] space-y-8">
      <h2 className="text-2xl font-serif text-[#4A4A4A]">Manage Skills</h2>
      
      <form onSubmit={handleAdd} className="flex gap-4">
        <input
          type="text"
          value={newSkill}
          onChange={e => setNewSkill(e.target.value)}
          placeholder="New skill name..."
          className="flex-1 px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
        />
        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors">
          <Plus size={20} />
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-4">
        {skills.map(skill => (
          <div key={skill.id} className="flex items-center gap-3 px-5 py-2 bg-[#FAF9F6] rounded-full border border-[#E5E5E5]">
            <span className="text-[#4A4A4A]">{skill.name}</span>
            <button onClick={() => handleDelete(skill.id)} className="text-red-400 hover:text-red-600 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
