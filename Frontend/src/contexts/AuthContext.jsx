// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate(); 
  const location = useLocation();

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  async function login(email, password, role = "user") {
    const res = await api.post("/auth/login", { email, password, role });
    const { token, role: userRole } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    setUser({ email, role: userRole });
    setToken(token);
  }


    async function signup(email, password, role = "user") {
    const res = await api.post("/auth/register", { email, password, role });  
    return res.data

  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedToken = localStorage.getItem("token");

    if (savedToken && savedRole) {
      setToken(savedToken);
      setUser({ role: savedRole });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
