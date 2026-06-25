"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Save } from 'lucide-react';
import { blogService, uploadService } from '@/services/api';

export default function BlogEditor() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const navigate = router.push.bind(router);
  const [title, setTitle] = useState({ vi: '', en: '' });
  const [content, setContent] = useState({ vi: '', en: '' });
  const [saving, setSaving] = useState(false);
  const [editLang, setEditLang] = useState<'vi' | 'en'>('vi');

  const ensureJson = (val: any) => typeof val === 'object' && val !== null ? val : { vi: val || '', en: '' };

  useEffect(() => {
    if (id) {
      blogService.getById(id).then(data => {
        setTitle(ensureJson(data.title));
        setContent(ensureJson(data.content));
      }).catch(e => console.error(e));
    }
  }, [id]);

  const handleSave = async () => {
    if (!title.vi.trim() || !content.vi.trim()) {
      alert('Title and content are required (at least in Vietnamese)');
      return;
    }
    setSaving(true);
    try {
      const data = { title, content };
      if (id) {
        await blogService.update(id, data);
      } else {
        await blogService.create(data);
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

    try {
      const res = await uploadService.uploadImage(file);
      // Insert image markdown at cursor position or end
      const imageMarkdown = `\n![Image](${res.url})\n`;
      setContent(prev => ({ ...prev, [editLang]: prev[editLang] + imageMarkdown }));
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
        <div className="flex bg-[#F5F5F5] rounded-lg p-1 w-max mb-6">
          <button type="button" onClick={() => setEditLang('vi')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editLang === 'vi' ? 'bg-white shadow-sm text-[#A3B18A]' : 'text-[#888888] hover:text-[#4A4A4A]'}`}>Tiếng Việt</button>
          <button type="button" onClick={() => setEditLang('en')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editLang === 'en' ? 'bg-white shadow-sm text-[#A3B18A]' : 'text-[#888888] hover:text-[#4A4A4A]'}`}>English</button>
        </div>
        <input
          type="text"
          value={(title as any)[editLang]}
          onChange={e => setTitle({...title, [editLang]: e.target.value})}
          placeholder={`Blog Title (${editLang.toUpperCase()})...`}
          className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] text-xl font-serif"
        />

        <div className="flex items-center gap-4 bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E5E5]">
          <span className="text-sm text-[#6B6B6B]">Insert Image:</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
        </div>

        <div data-color-mode="light">
          <MDEditor
            value={(content as any)[editLang]}
            onChange={val => setContent({...content, [editLang]: val || ''})}
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
