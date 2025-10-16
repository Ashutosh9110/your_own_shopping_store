// src/pages/Auth/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Read role from URL query (e.g., /login?role=admin)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paramRole = params.get("role");
    console.log(localStorage.getItem("role"));
    if (paramRole) setRole(paramRole);
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {

      await login(email, password, role)

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (err) {     
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-100 to-green-200">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {role === "admin" ? "Admin Login" : "User Login"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="border p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 mb-2 rounded hover:bg-teal-800 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          className="text-black text-sm mt-3 text-center cursor-pointer"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>

        <button
          type="button"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 mt-2 rounded hover:bg-teal-800 cursor-pointer"
          onClick={() => navigate("/register")}
        >
          New User? Sign Up
        </button>

        {message && <p className="text-center mt-4 text-sm text-red-600">{message}</p>}
      </form>
    </div>
  );
}
