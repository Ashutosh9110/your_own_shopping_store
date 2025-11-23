import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser && savedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        API.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      } catch {
        localStorage.removeItem("user");
      }
    } 
    setLoading(false);
  }, []);

  async function login(emailOrPhone, password) {
    const res = await API.post("/api/auth/login", { emailOrPhone, password });
    
    if (res.data.isDummy) {
      localStorage.setItem("isDummy", "true");
      localStorage.setItem("dummyOtp", res.data.dummyOtp);
      localStorage.setItem("pendingEmail", emailOrPhone);
      return {
        otpRequired: true,
        isDummy: true,
        dummyOtp: res.data.dummyOtp,
      };
    }

    if (res.data.otpRequired) {
      localStorage.setItem("pendingEmail", emailOrPhone);
      return "OTP_REQUIRED";
    }
    const { token, role } = res.data;
    const finalUser = { email: emailOrPhone, role };

    setUser(finalUser);
    setToken(token);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(finalUser));
    localStorage.setItem("role", role);

    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // if (role === "admin") navigate("/admin/dashboard");
    // else navigate("/");

    return {
      success: true,
      otpRequired: false,
      role,
    };
  }


  async function verifyOtp(emailOrPhone, otp) {

    const isDummy = localStorage.getItem("isDummy") === "true";
    const dummyOtp = localStorage.getItem("dummyOtp");

    if (isDummy) {
      if (otp === dummyOtp) {
        const finalUser = { email: emailOrPhone, role: "user" };

        setUser(finalUser);
        setToken("DUMMY_TOKEN");

        localStorage.setItem("token", "DUMMY_TOKEN");
        localStorage.setItem("user", JSON.stringify(finalUser));
        localStorage.setItem("role", "user");

        // Cleanup
        localStorage.removeItem("isDummy");
        localStorage.removeItem("dummyOtp");

        return { success: true, role: "user" };
      } else {
        return { success: false, message: "Invalid dummy OTP" };
      }
    }

    const res = await API.post("/api/auth/verify-otp", {
      emailOrPhone,
      otp
    });
  
    if (!res.data.success) {
      return { success: false, message: res.data.message };
    }
  
    const { token, role } = res.data;
    const finalUser = { email: emailOrPhone, role };
  
    setUser(finalUser);
    setToken(token);
  
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(finalUser));
    localStorage.setItem("role", role);
  
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
    return { success: true, role };
  }

  async function resendOtp(emailOrPhone) {
    const res = await API.post("/api/auth/resend-otp", { emailOrPhone });
    return res.data;
  }


  async function signup(email, phone, password, role = "user") {
    const res = await API.post("/api/auth/register", { email, phone, password, role });
    return res.data;
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("isDummy");
    localStorage.removeItem("dummyOtp");
    delete API.defaults.headers.common["Authorization"];
    navigate("/login");
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, signup, loading, resendOtp, verifyOtp }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}





export const useAuth = () => useContext(AuthContext);
