import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { profileService, uploadService } from '../../services/api';

export function ProfileAdmin() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editLang, setEditLang] = useState<'vi' | 'en'>('vi');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    profileService.get().then(res => {
      // Ensure JSON structure if missing
      const data = res[0] || {};
      const ensureJson = (val: any) => typeof val === 'object' && val !== null ? val : { vi: val || '', en: '' };
      setProfile({
        ...data,
        greeting: ensureJson(data.greeting),
        about: ensureJson(data.about),
      });
    });
  }, []);

  const handleTextChange = (field: string, value: string) => {
    setProfile((prev: any) => ({
      ...prev,
      [field]: {
        ...(prev[field] || { vi: '', en: '' }),
        [editLang]: value
      }
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileService.update(profile.id, profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      setProfile({ ...profile, avatar: res.url });
    } catch (error) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-[#4A4A4A]">Edit Profile</h2>
        <div className="flex bg-[#F5F5F5] rounded-lg p-1">
          <button
            onClick={() => setEditLang('vi')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editLang === 'vi' ? 'bg-white shadow-sm text-[#A3B18A]' : 'text-[#888888] hover:text-[#4A4A4A]'}`}
          >
            Tiếng Việt
          </button>
          <button
            onClick={() => setEditLang('en')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editLang === 'en' ? 'bg-white shadow-sm text-[#A3B18A]' : 'text-[#888888] hover:text-[#4A4A4A]'}`}
          >
            English
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSave} className="space-y-6">
        {/* Name is usually universal, kept as normal string. If you want it bilingual, just use handleTextChange */}
        <div>
          <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={e => setProfile({...profile, name: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Greeting ({editLang.toUpperCase()})</label>
          <input
            type="text"
            value={profile.greeting?.[editLang] || ''}
            onChange={e => handleTextChange('greeting', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6B6B6B] mb-2">About ({editLang.toUpperCase()})</label>
          <textarea
            rows={5}
            value={profile.about?.[editLang] || ''}
            onChange={e => handleTextChange('about', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Avatar Image</label>
          <div className="flex items-center gap-4">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-3 bg-[#F5F5F5] text-[#4A4A4A] rounded-xl hover:bg-[#E5E5E5] transition-colors whitespace-nowrap">
              <ImageIcon size={18} /> {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <input
              type="text"
              value={profile.avatar || ''}
              onChange={e => setProfile({...profile, avatar: e.target.value})}
              placeholder="Or paste image URL"
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] transition-colors"
            />
          </div>
          {profile.avatar && <img src={profile.avatar} alt="Avatar Preview" className="h-24 w-24 object-cover rounded-full mt-4 border border-[#E5E5E5]" />}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#A3B18A] text-white rounded-xl hover:bg-[#8B9973] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
