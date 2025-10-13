// src/pages/Auth/Signup.jsx
import React, { useState } from "react";
import { signUpWithEmail } from "../../services/firebaseRest";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // 👈 role selector
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await signUpWithEmail(email, password);

      // Store user in Firestore with selected role
      await fetch(
        `https://firestore.googleapis.com/v1/projects/${
          import.meta.env.VITE_FIREBASE_PROJECT_ID
        }/databases/(default)/documents/users?documentId=${data.localId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.idToken}`,
          },
          body: JSON.stringify({
            fields: {
              email: { stringValue: email },
              role: { stringValue: role },
            },
          }),
        }
      );

      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login?role=admin"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ " + (err.message || "Signup failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-100 to-green-200">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-teal-700">
          Create Account
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
          disabled={loading}
          className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-all"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg mt-3 hover:bg-gray-300"
        >
          Already have an account? Log In
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
