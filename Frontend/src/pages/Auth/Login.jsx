// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { signInWithEmail } from "../../services/firebaseRest";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Step 1: Auth
      const data = await signInWithEmail(email, password);

      // Step 2: Fetch role from Firestore
      const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${
          import.meta.env.VITE_FIREBASE_PROJECT_ID
        }/databases/(default)/documents/users/${data.localId}`,
        {
          headers: { Authorization: `Bearer ${data.idToken}` },
        }
      );

      const userData = await res.json();
      const role = userData?.fields?.role?.stringValue || "user";

      // Step 3: Save in localStorage
      localStorage.setItem("idToken", data.idToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("uid", data.localId);
      localStorage.setItem("role", role);

      // Step 4: Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/shop");
      }
    } catch (err) {
      setMessage("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
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
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p
          className="text-blue-600 text-sm mt-3 text-center cursor-pointer"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>
        {message && (
          <p className="text-center mt-4 text-sm text-red-600">{message}</p>
        )}
      </form>
    </div>
  );
}
