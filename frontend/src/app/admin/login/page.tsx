"use client";

import { useState } from 'react';
import { authService } from '@/services/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.login({ username, password });
      localStorage.setItem('admin_token', res.access_token);
      window.location.href = '/admin';
    } catch (error) {
      alert("Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#E5E5E5] w-full max-w-md">
        <h1 className="text-3xl font-serif text-center mb-8 text-[#4A4A4A]">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-[#6B6B6B] mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#A3B18A] transition-colors bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-[#6B6B6B] mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#A3B18A] transition-colors bg-transparent"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-[#A3B18A] text-white rounded-lg hover:bg-[#8A9A73] transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
