import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'token';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function parseJwt(token) {
  if (!token) return null;
  try {
    return jwtDecode ? jwtDecode(token) : JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
  const userJson = sessionStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
});
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (token && user) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem('user', JSON.stringify(user));
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem('user');
    setUser(null);
  }
}, [token, user]);


 const login = ({ tokenValue, userData }) => {
  setToken(tokenValue);
  setUser(userData);
  sessionStorage.setItem(TOKEN_KEY, tokenValue);
  sessionStorage.setItem('user', JSON.stringify(userData));
};

  const logout = () => setToken(null);

  const value = {
    token,
    user,
    setUser, // contains decoded payload { id, role, iat, exp ... }
    loading,
    setLoading,
    login,
    logout,
    API_BASE
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
