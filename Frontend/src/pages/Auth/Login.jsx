// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await login(email, password);

      // ✅ Redirect based on backend role
      if (response.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-50 px-6 md:px-0">
      <div className="hidden md:flex w-1/2 justify-center items-center">
        <img
          src="/assets/login.gif"
          alt="Login illustration"
          className="max-w-lg w-full h-auto rounded-lg object-contain"
        />
      </div>

      <div className="flex w-full md:w-1/2 justify-center py-10">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-lg rounded-xl p-8 md:p-12 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-green-600">
            Login
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Enter your credentials to continue
          </p>

          <div className="mb-6">
            <input
              type="email"
              placeholder="Email"
              className="border-b-2 border-gray-300 w-full py-2 px-1 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-600 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="border-b-2 border-gray-300 w-full py-2 px-1 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-600 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-md font-semibold hover:bg-green-800 transition disabled:opacity-70 cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p
            className="text-sm text-gray-500 hover:underline mt-4 text-center cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>

          <div className="my-6 border-t border-gray-200"></div>

          <button
            type="button"
            disabled={loading}
            onClick={() => navigate("/register")}
            className="w-full text-sm text-gray-600 py-2.5 rounded-md font-semibold transition cursor-pointer"
          >
            New User? <span className="text-gray-800">Sign Up</span>
          </button>

          {message && (
            <p className="text-center mt-4 text-sm text-red-600">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}
