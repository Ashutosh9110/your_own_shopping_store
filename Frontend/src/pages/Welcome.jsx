// src/pages/Welcome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-green-200">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to E-Shop 🛍️</h1>
      <p className="text-gray-700 mb-6 text-md font-bold">Select how you want to continue:</p>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/login?role=user")}
          className="bg-gray-700 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer"
        >
          Login as User
        </button>

        <button
          onClick={() => navigate("/login?role=admin")}
          className="bg-gray-700 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer"
        >
          Login as Admin
        </button>
      </div>

      <p className="mt-8 text-sm text-gray-600">
        New user?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-teal-600 font-semibold cursor-pointer hover:underline"
        >
          Create a new account
        </span>
      </p>
    </div>
  );
}
