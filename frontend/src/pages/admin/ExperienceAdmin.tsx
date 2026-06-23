import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<any[]>([]);
  
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/experience`);
      setExperiences(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !startDate) return;
    
    try {
      const payload = {
        company,
        role,
        startDate: new Date(`${startDate}-01`).toISOString(),
        endDate: isCurrent || !endDate ? null : new Date(`${endDate}-01`).toISOString(),
        isCurrent,
        description
      };
      
      await axios.post(`${API_URL}/experience`, payload);
      
      // Reset form
      setCompany('');
      setRole('');
      setStartDate('');
      setEndDate('');
      setIsCurrent(false);
      setDescription('');
      fetchData();
    } catch (error) {
      alert('Failed to add experience');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      await axios.delete(`${API_URL}/experience/${id}`);
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
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] space-y-8">
        <h2 className="text-2xl font-serif text-[#4A4A4A]">Manage Work Experience</h2>
        
        <form onSubmit={handleAdd} className="space-y-4 border-b border-[#E5E5E5] pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Company name..."
              className="px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
            />
            <input
              type="text"
              required
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="Role/Job Title..."
              className="px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-[#6B6B6B] px-1">Start Date</label>
              <input
                type="month"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm text-[#6B6B6B]">End Date</label>
                <label className="text-sm text-[#4A4A4A] flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={e => setIsCurrent(e.target.checked)}
                    className="accent-[#A3B18A]"
                  />
                  Hiện tại đang làm
                </label>
              </div>
              <input
                type="month"
                required={!isCurrent}
                disabled={isCurrent}
                value={isCurrent ? '' : endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] disabled:opacity-50 disabled:bg-gray-100"
              />
            </div>
          </div>

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optional)..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] resize-y"
          />

          <button type="submit" className="flex items-center justify-center gap-2 w-full py-3 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors">
            <Plus size={20} /> Add Experience
          </button>
        </form>

        <div className="space-y-4">
          {experiences.length > 0 ? experiences.map(exp => (
            <div key={exp.id} className="flex justify-between items-start p-6 bg-[#FAF9F6] rounded-xl border border-[#E5E5E5]">
              <div>
                <h3 className="text-lg font-bold text-[#4A4A4A]">{exp.role}</h3>
                <p className="text-[#A3B18A] font-medium">{exp.company}</p>
                <p className="text-sm text-[#6B6B6B] mt-1">
                  {formatMonthYear(exp.startDate)} - {exp.isCurrent ? 'Present' : (exp.endDate ? formatMonthYear(exp.endDate) : 'Present')}
                </p>
                {exp.description && <p className="text-[#6B6B6B] mt-3 whitespace-pre-wrap">{exp.description}</p>}
              </div>
              <button onClick={() => handleDelete(exp.id)} className="text-red-400 hover:text-red-600 transition-colors shrink-0 p-2">
                <Trash2 size={20} />
              </button>
            </div>
          )) : (
            <p className="text-[#888888] text-center py-8">No experiences added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
