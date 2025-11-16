import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
// import signupImg from "../../assets/signup2.gif"
// import "inter-ui/inter.css"; // ensure Inter font is imported globally or here

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ role ] = useState("user");
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
    <div className="fixed inset-0 w-full h-full overflow-hidden font-[Inter] z-0">  
      <video
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.35]"
        autoPlay
        loop
        muted
        playsInline
        src="https://res.cloudinary.com/djm65usjg/video/upload/v1763281058/signup2_eaho2j.mp4"
      />
  
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex min-h-screen justify-center items-center px-6 md:px-16">
          <form
            onSubmit={handleSignup}
            className="w-full max-w-sm backdrop-blur-md p-8 rounded-lg"
          >
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-2 text-green-600">
                Create Account
              </h2>
              <p className="text-sm text-white mb-6">
                Enter your details below
              </p>
            </div>
  
            <input
              type="email"
              placeholder="Email or Phone Number"
              className="border-b border-gray-300 mb-6 w-full p-2 focus:outline-none focus:border-green-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
  
            <input
              type="password"
              placeholder="Password"
              className="border-b border-gray-300 mb-6 w-full p-2 focus:outline-none focus:border-green-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
  
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-800 transition-colors duration-300 cursor-pointer"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
  
            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-semibold cursor-pointer hover:underline text-white"
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
