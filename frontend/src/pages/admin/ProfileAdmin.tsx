import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { profileService, uploadService } from '../../services/api';

export function ProfileAdmin() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    profileService.get().then(res => setProfile(res[0]));
  }, []);

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
      <h2 className="text-2xl font-serif mb-6 text-[#4A4A4A]">Edit Profile</h2>
      <form onSubmit={handleSave} className="space-y-6">
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
          <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Greeting</label>
          <input
            type="text"
            value={profile.greeting || ''}
            onChange={e => setProfile({...profile, greeting: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6B6B6B] mb-2">About</label>
          <textarea
            rows={5}
            value={profile.about}
            onChange={e => setProfile({...profile, about: e.target.value})}
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
