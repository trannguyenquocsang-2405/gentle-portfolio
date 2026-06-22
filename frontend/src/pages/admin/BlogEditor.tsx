import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<string | undefined>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/blog/${id}`).then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!title.trim() || !content?.trim()) {
      alert('Title and content are required');
      return;
    }
    setSaving(true);
    try {
      const data = { title, content };
      if (id) {
        await axios.patch(`${API_URL}/blog/${id}`, data);
      } else {
        await axios.post(`${API_URL}/blog`, data);
      }
      navigate('/admin/blogs');
    } catch (error) {
      alert('Failed to save blog');
    }
    setSaving(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Insert image markdown at cursor position or end
      const imageMarkdown = `\n![Image](${res.data.url})\n`;
      setContent(prev => (prev || '') + imageMarkdown);
    } catch (error) {
      alert('Upload failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/blogs')} className="p-2 bg-white rounded-xl shadow-sm text-[#4A4A4A] hover:bg-[#F5F5F5] transition-colors border border-[#E5E5E5]">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-serif text-[#4A4A4A]">{id ? 'Edit Blog' : 'New Blog'}</h2>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] space-y-6">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Blog Title..."
          className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] text-xl font-serif"
        />

        <div className="flex items-center gap-4 bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E5E5]">
          <span className="text-sm text-[#6B6B6B]">Insert Image:</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
        </div>

        <div data-color-mode="light">
          <MDEditor
            value={content}
            onChange={setContent}
            height={500}
            className="rounded-xl overflow-hidden border border-[#E5E5E5] !shadow-none"
          />
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Publish Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
