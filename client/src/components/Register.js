import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { login, API_BASE, setLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  
  // const [role, setRole] = useState('user'); // let admin creation be manual or protected
  const role = 'user';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading?.(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, {
        name, email, password, role
      });
      // If backend returns token and user
      if (res.data?.token) {
        login(res.data.token);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      setErr(error.response?.data?.msg || error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading?.(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create account</h2>
        {err && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{err}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={name} onChange={e=>setName(e.target.value)} required placeholder="Full name" className="w-full border rounded px-3 py-2" />
          <input value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Email" type="email" className="w-full border rounded px-3 py-2" />
          <input value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Password" type="password" className="w-full border rounded px-3 py-2" />
          {/* optional role select — hide if you don't want users to choose role
          <div className="flex gap-2 items-center">
            <label className="text-sm">Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)} className="border rounded px-2 py-1">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div> */}

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Register</button>
        </form>
      </div>
    </div>
  );
}
