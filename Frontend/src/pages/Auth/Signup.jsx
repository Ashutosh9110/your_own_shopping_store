// src/pages/Auth/Signup.jsx
import React, { useState } from "react";
import { signUpWithEmail } from "../../services/firebaseRest";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await signUpWithEmail(email, password);

      // After signup, create user doc in Firestore using REST
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
              role: { stringValue: "user" }, // default role
            },
          }),
        }
      );

      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500)
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
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
          className="w-full bg-teal-600 text-white py-2 rounded hover:bg-green-800 cursor-pointer"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <button
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 mt-2 rounded hover:bg-green-800 cursor-pointer"
          onClick={() => navigate("/login")}
          >Already a user? Want to Sign-In
        </button>
          {message && (
            <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
