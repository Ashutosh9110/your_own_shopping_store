// src/pages/Auth/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import loginImg from "../../assets/login.gif";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paramRole = params.get("role");
    if (paramRole) setRole(paramRole);
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await login(email, password, role);
      if (role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-50 px-6 md:px-0">
      {/* Left Image Section */}
      <div className="hidden md:flex w-1/2 justify-center items-center">
        <img
          src={loginImg}
          alt="Login illustration"
          className="max-w-lg w-full h-auto rounded-lg object-contain"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex w-full md:w-1/2 justify-center py-10">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-lg rounded-xl p-8 md:p-12 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">
            {role === "admin" ? "Admin Login" : "User Login"}
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Log in to access your account
          </p>

          {/* Email Input */}
          <div className="mb-6">
            <input
              type="email"
              placeholder="Email"
              className="border-b-2 border-gray-300 w-full py-2 px-1 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="border-b-2 border-gray-300 w-full py-2 px-1 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Dropdown */}
          <div className="mb-6">
            <select
              className="border-b-2 border-gray-300 w-full py-2 text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer bg-transparent"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Forgot Password */}
          <p
            className="text-sm text-blue-600 hover:underline mt-4 text-center cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200"></div>

          {/* Signup Link */}
          <button
            type="button"
            disabled={loading}
            onClick={() => navigate("/register")}
            className="w-full bg-gray-100 text-blue-700 py-2.5 rounded-md font-semibold hover:bg-blue-50 transition"
          >
            New User? Sign Up
          </button>

          {message && (
            <p className="text-center mt-4 text-sm text-red-600">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}
