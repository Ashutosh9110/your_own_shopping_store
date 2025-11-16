import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  const pendingEmail = localStorage.getItem("pendingEmail");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(120); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleBackspace = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOTP = async () => {
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      return setMessage("Please enter a 6-digit OTP");
    }

    if (timeLeft <= 0) {
      return setMessage("OTP has expired. Please resend a new one.");
    }

    try {
      const result = await verifyOtp(pendingEmail, fullOtp);

      if (result.success) {
        localStorage.removeItem("pendingEmail");
        navigate("/");
      } else {
        setMessage(result.message || "Invalid OTP");
      }
    } catch (err) {
      setMessage("Failed to verify OTP");
    }
  };

  const resendOTP = async () => {
    try {
      await resendOtp(pendingEmail);

      setOtp(Array(6).fill(""));
      inputRefs.current[0].focus();
      setTimeLeft(120);
      setMessage("New OTP sent!");
    } catch {
      setMessage("Failed to resend OTP");
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 flex justify-center items-center text-white font-[Poppins]">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[#121212] bg-[radial-gradient(circle_at_25%_25%,rgba(166,86,246,0.1)_2%,transparent_0%),radial-gradient(circle_at_75%_75%,rgba(102,101,241,0.1)_2%,transparent_0%)] bg-[length:60px_60px]" />

      {/* CARD */}
      <div className="relative bg-[rgba(30,30,30,0.8)] backdrop-blur-xl 
        border border-white/10 px-10 py-8 rounded-2xl shadow-2xl w-[380px] text-center">

        <h1 className="text-3xl font-semibold mb-3">OTP Verification</h1>

        <p className="text-gray-300 mb-6">
          Enter the OTP sent to{" "}
          <span className="text-purple-400 font-medium">{pendingEmail}</span>
        </p>

        {/* OTP INPUTS */}
        <div className="flex justify-center mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleBackspace(i, e)}
              className="w-12 h-12 mx-2 text-center text-xl text-white
                bg-[rgba(42,42,42,0.8)] border-2 border-indigo-500 rounded-xl 
                focus:border-purple-400 focus:shadow-[0_0_0_3px_rgba(166,86,246,0.3)]
                outline-none transition-all"
            />
          ))}
        </div>

        {/* VERIFY BUTTON */}
        <button
          onClick={verifyOTP}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg
            hover:from-purple-500 hover:to-indigo-500 transition shadow-lg font-medium"
        >
          Verify
        </button>

        {/* RESEND SECTION */}
        <div className="mt-4 text-gray-400">
          Didn’t receive the code?{" "}
          <span
            onClick={resendOTP}
            className="text-indigo-400 cursor-pointer hover:text-purple-400 underline"
          >
            Resend Code
          </span>

          <span
            className={`ml-2 ${
              timeLeft <= 0 ? "text-red-500 animate-pulse" : "text-purple-400"
            }`}
          >
            ({minutes}:{seconds.toString().padStart(2, "0")})
          </span>
        </div>

        {message && (
          <p className="text-center mt-4 text-sm text-red-400">{message}</p>
        )}
      </div>
    </div>
  );
}
