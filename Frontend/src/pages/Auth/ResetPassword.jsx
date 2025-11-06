import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API, { BASE_URL } from "../../api/api";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await API.post(`/api/auth/reset-password/${token}`, { newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background video */}
      <video
        src={`${BASE_URL}/uploads/shopping.webm`}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70"></div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white/15 backdrop-blur-md p-10 rounded-2xl border border-white/20 w-[90%] max-w-md text-left"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Reset Password
        </h2>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3 font-semibold rounded-lg bg-white/90 text-black hover:bg-white transition-all"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-yellow-300 font-medium">{message}</p>
        )}
      </motion.div>
    </div>
  );
}
