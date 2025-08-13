import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login, API_BASE, setLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading?.(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });      
      
      if (res.data?.token) {
        login({ tokenValue: res.data.token, userData: res.data.user });          // saves to context & localStorage
        navigate('/dashboard');         // go to dashboard
      } else {
        setErr('Invalid response from server');
      }
    } catch (error) {
      setErr(error.response?.data?.msg || error.response?.data?.message || 'Login failed');
    } finally {
      setLoading?.(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
        {err && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{err}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input value={email} onChange={e=>setEmail(e.target.value)} required
              className="mt-1 block w-full rounded border px-3 py-2" type="email" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input value={password} onChange={e=>setPassword(e.target.value)} required
              className="mt-1 block w-full rounded border px-3 py-2" type="password" />
          </label>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Sign In</button>
        </form>
      </div>
    </div>
  );
}
