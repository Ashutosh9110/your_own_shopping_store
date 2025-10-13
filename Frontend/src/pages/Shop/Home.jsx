// src/pages/Shop/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-green-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to the Shop 
      </h1>
      <p className="text-gray-600 mb-4">You’re successfully logged in!</p>
      <button
        onClick={() => navigate("/products")}
        className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700"
      >
        Browse Products
      </button>
    </div>
  );
}
