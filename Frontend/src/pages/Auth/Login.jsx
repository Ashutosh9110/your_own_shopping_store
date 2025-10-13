// src/pages/Auth/Login.jsx
import React, { useEffect, useState } from "react";
import { signInWithEmail } from "../../services/firebaseRest";
import { useLocation, useNavigate } from "react-router-dom";

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
      const roleFromDB = userData?.fields?.role?.stringValue || "user";

      // Step 3: Check if admin is logging into admin panel
      if (loginRole === "admin" && roleFromDB !== "admin") {
        throw new Error("Unauthorized: You are not an admin.");
      }

      // Step 4: Save session
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("idToken", data.idToken);
      localStorage.setItem("uid", data.localId);
      localStorage.setItem("role", roleFromDB);

     // Step 5: Redirect
      if (roleFromDB === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (err) {
      const msg = err?.error?.message || err.message || "Login failed.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-100 to-green-200">
      <form
        onSubmit={handleLogin}
        className="p-8 rounded-lg w-96"
      >
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
        {loading
            ? "Logging in..."
            : loginRole === "admin"
            ? "Login"
            : "Login"}
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
        >New User? Want to Sign-Up
        </button>
        {message && (
          <p className="text-center mt-4 text-sm text-red-600">{message}</p>
        )}
      </form>
    </div>
  );
}
