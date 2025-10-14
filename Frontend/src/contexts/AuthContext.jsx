// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email, role }
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  // 🧍 Login
  async function login(email, password, loginRole = "user") {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password, loginRole });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      setUser({ email, role: res.data.role });
      return res.data.role;
    } finally {
      setLoading(false);
    }
  }

  //  Logout
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  // Auto-login (if token present)
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedToken = localStorage.getItem("token");
    if (savedToken && savedRole) {
      setToken(savedToken);
      setUser({ role: savedRole });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => useContext(AuthContext);
