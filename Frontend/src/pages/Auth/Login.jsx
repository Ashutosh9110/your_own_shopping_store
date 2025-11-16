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
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden font-[Inter] z-0">

      {/* SAME VIDEO AS SIGNUP */}
      <video
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.35]"
        autoPlay
        loop
        muted
        playsInline
        src="https://res.cloudinary.com/djm65usjg/video/upload/v1763285155/login6_prwtwb.mp4"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex min-h-screen justify-center items-center px-6 md:px-16">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm backdrop-blur-md p-8 rounded-lg"
        >
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-2 text-green-600">
              Login
            </h2>

            <p className="text-sm text-white mb-6">
              Enter your credentials to continue
            </p>
          </div>

          <input
            type="email"
            placeholder="Email"
            className="border-b border-gray-300 mb-6 w-full p-2 focus:outline-none focus:border-green-600 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border-b border-gray-300 mb-6 w-full p-2 focus:outline-none focus:border-green-600 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-800 transition-colors duration-300 cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p
            className="text-center text-sm text-gray-400 mt-4 cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>

          <p className="text-center text-sm text-gray-400 mt-4">
            New user?{" "}
            <span
              className="font-semibold cursor-pointer hover:underline text-white"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </span>
          </p>

          {message && (
            <p className="text-center mt-4 text-sm text-red-500">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
