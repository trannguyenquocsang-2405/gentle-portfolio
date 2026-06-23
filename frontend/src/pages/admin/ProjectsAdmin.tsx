import { useState, useEffect, useRef } from 'react';
import { Trash2, Edit2, Plus, Image as ImageIcon } from 'lucide-react';
import { projectService, uploadService } from '../../services/api';

export function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState({ id: null, title: '', description: '', details: '', imageUrl: '', demoUrl: '', sourceUrl: '' });
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

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
        await projectService.update(formData.id, formData);
      } else {
        const { id, ...postData } = formData;
        await projectService.create(postData);
      }
      setShowForm(false);
      setFormData({ id: null, title: '', description: '', details: '', imageUrl: '', demoUrl: '', sourceUrl: '' });
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
      await projectService.delete(id);
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
          onClick={() => { setShowForm(!showForm); setFormData({ id: null, title: '', description: '', details: '', imageUrl: '', demoUrl: '', sourceUrl: '' }); }}
          className="flex items-center gap-2 px-6 py-2 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors"
        >
          <Plus size={20} /> {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6B6B6B]">Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A]" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Short Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Detailed Work Description (Optional)</label>
              <textarea value={formData.details || ''} onChange={e => setFormData({...formData, details: e.target.value})} placeholder="What did you do in this project? Technologies used, problems solved..." className="w-full px-4 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] min-h-[150px] whitespace-pre-wrap" />
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
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-serif text-[#4A4A4A]">{project.title}</h3>
              <p className="text-[#6B6B6B] text-sm line-clamp-3">{project.description}</p>
              
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
