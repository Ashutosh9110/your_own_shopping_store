import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API, { BASE_URL } from "../../api/api";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const res = await API.post(`/api/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(res.data.message);
      setSuccess(true);

      // Short delay for animation before redirect
      setTimeout(() => navigate("/login"), 2500);
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

        <AnimatePresence>
          {!success ? (
            <motion.form
              key="form"
              onSubmit={handleReset}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4"
            >
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
                className="mt-4 w-full py-3 font-semibold rounded-lg bg-white/90 text-black hover:bg-white transition-all cursor-pointer"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Password reset successful!
              </h3>
              <p className="text-gray-200 text-sm">Redirecting to login...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {message && !success && (
          <p className="mt-4 text-center text-yellow-300 font-medium">{message}</p>
        )}
      </motion.div>
    </div>
  );
}
