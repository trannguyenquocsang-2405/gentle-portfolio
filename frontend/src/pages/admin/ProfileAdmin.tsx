import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function ProfileAdmin() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/profile`).then(res => setProfile(res.data[0]));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.patch(`${API_URL}/profile/${profile.id}`, profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
    setSaving(false);
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
          <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Avatar URL (Optional)</label>
          <input
            type="text"
            value={profile.avatarUrl || ''}
            onChange={e => setProfile({...profile, avatarUrl: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#A3B18A] transition-colors"
          />
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
