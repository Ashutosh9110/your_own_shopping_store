// src/pages/Auth/Login.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginRole, setLoginRole] = useState("user");
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get("role");
    if (role) setLoginRole(role);
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); 

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, loginRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token and role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Redirect
      if (data.role === "admin") navigate("/admin");
      else navigate("/products");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-100 to-green-200">
      <form onSubmit={handleLogin} className="p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {loginRole === "admin" ? "Admin Login" : "User Login"}
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 mb-2 rounded hover:bg-green-700 cursor-pointer"
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
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 mt-2 rounded hover:bg-green-800 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          New User? Sign Up
        </button>
        {message && <p className="text-center mt-4 text-sm text-red-600">{message}</p>}
      </form>
    </div>
  );
}