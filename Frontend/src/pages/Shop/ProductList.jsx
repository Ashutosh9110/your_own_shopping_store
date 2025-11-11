// src/components/Products.jsx
import React, { useEffect, useState } from "react";
import API, { BASE_URL } from "../../api/api";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProducts = async () => {
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (search) params.search = search;
      const res = await API.get("/api/products", { params });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchProducts(), 400);
    return () => clearTimeout(timeout);
  }, [selectedCategory, search]);

  useEffect(() => {
    const categoryParam = new URLSearchParams(location.search).get("category");
    const category = categoryParam?.replace(/\s+/g, "").toLowerCase();
    setSelectedCategory(category);
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6 font-[Poppins]">
      <h2 className="text-4xl font-semibold mb-12 text-center text-gray-800 mt-15">
        Explore Our <span className="text-green-600">Latest Products</span>
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center mb-12 gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 bg-white rounded-xl px-5 py-2 text-gray-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 transition"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search for a product..."
          className="border border-gray-300 bg-white px-5 py-2 rounded-xl w-72 text-gray-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {products.map((p, idx) => {
          // normalize images to array (backend should already return array)
          const imgs = Array.isArray(p.image) ? p.image : p.image ? [p.image] : [];
          // choose first and fallback second
          const img1 = imgs[0] || "/placeholder.png";
          const img2 = imgs[1] || imgs[0] || "/placeholder.png";

          return (
            <motion.div
              key={p.id}
              onClick={() => navigate(`/products/${p.id}`)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, type: "spring", stiffness: 80 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              {/* Card image area */}
              <div className="relative group">
                {/* background accent (changes on hover) */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-transparent to-transparent transition-all duration-500 pointer-events-none group-hover:from-green-50 group-hover:to-green-100" />

                {/* two images stacked, fade & translate on hover */}
                <div className="relative w-full h-56 flex items-center justify-center p-6">
      {/* Utility function to ensure correct image URL */}
      {(() => {
        const formatUrl = (url) =>
          url?.startsWith("http")
            ? url
            : `${BASE_URL.replace(/\/$/, "")}${url}`;

        const imgSrc1 = img1 ? formatUrl(img1) : "/placeholder.png";
        const imgSrc2 = img2 ? formatUrl(img2) : imgSrc1;

        console.log("🖼️ Image for product:", p.name, "| imgSrc1:", imgSrc1);

        return (
          <>
            <img
              src={imgSrc1}
              alt={p.name}
              className="w-full h-full object-contain transition-transform duration-700 transform group-hover:scale-95"
              style={{ position: "absolute", inset: 0, margin: "auto" }}
              onError={() => console.warn("❌ Failed to load image:", imgSrc1)}
            />
            <img
              src={imgSrc2}
              alt={`${p.name}-alt`}
              className="w-full h-full object-contain opacity-0 translate-y-2 transition-all duration-700 group-hover:opacity-100 group-hover:translate-y-0"
              style={{ position: "absolute", inset: 0, margin: "auto" }}
            />
          </>
        );
      })()}

                </div>

                {/* subtle overlay & border change */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover:border-green-500 transition-colors duration-300" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/0 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-800 truncate">
                  {p.name}
                </h3>

                <div className="flex items-center mt-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < 4
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-lg font-semibold">
                    ₹{Number(p.price).toFixed(2)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${p.id}`);
                    }}
                    className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-green-800 transition cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
