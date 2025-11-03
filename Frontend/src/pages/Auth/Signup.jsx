import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
// import signupImg from "../../assets/signup2.gif"
// import "inter-ui/inter.css"; // ensure Inter font is imported globally or here

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await signup(email, password, role);
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate(`/login?role=${role}`), 1500);
    } catch (err) {
      console.error("Signup error:", err);
      setMessage(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-[Inter]">
      {/* Left image section */}
      <div className="hidden md:flex w-1/2 justify-center items-center">
        <img
          src="/assets/signup2.gif"
          alt="Shopping cart and phone"
          className="w-3/4 max-w-lg object-contain"
        />
      </div>

      {/* Right form section */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-10">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-3xl font-semibold mb-2 text-gray-900">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your details below
          </p>

          <input
            type="email"
            placeholder="Email or Phone Number"
            className="border-b border-gray-300 mb-6 w-full p-2 focus:outline-none focus:border-red-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border-b border-gray-300 mb-6 w-full p-2 focus:outline-none focus:border-red-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="border border-gray-300 mb-6 w-full p-2 rounded-md focus:outline-none focus:border-red-600 cursor-pointer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-500 transition-colors duration-300 cursor-pointer"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-red-700 font-medium hover:underline cursor-pointer"
            >
              Log In
            </span>
          </p>

          {message && (
            <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
