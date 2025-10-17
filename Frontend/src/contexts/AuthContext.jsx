// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser && savedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
        localStorage.removeItem("user");
      }
    } else {
      localStorage.removeItem("user"); // cleanup invalid values
    }
    setLoading(false);
  }, []);

  async function login(email, password, role = "user") {
    const res = await api.post("/auth/login", { email, password, role });
    const { token, user: userData } = res.data;
  
    // Fallback user info if backend doesn't send one
    const finalUser = userData || { email, role };
  
    setUser(finalUser);
    setToken(token);
  
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(finalUser));
    localStorage.setItem("role", finalUser.role);
  
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  

  async function signup(email, password, role = "user") {
    const res = await api.post("/auth/register", { email, password, role });
    return res.data;
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
