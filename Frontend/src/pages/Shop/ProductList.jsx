import React, { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarCategories from "../../components/SidebarCategories";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    const params = new URLSearchParams(location.search);
    const category = params.get("category") || "";
    setSelectedCategory(category);
  }, [location]);

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">
        Latest Products
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center mb-10 gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
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
          placeholder="Search products..."
          className="border border-gray-300 px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {products.map((p, idx) => (
          <motion.div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-[#F5F5F5] rounded-lg p-4 cursor-pointer hover:scale-105 transition duration-300"
          >
            <div className="flex flex-col items-center">
              <img
                src={`${BASE_URL}${p.image}`}
                alt={p.name}
                className="w-auto h-48 object-contain mb-3"
              />
              <div className="flex justify-between w-full text-slate-800 text-sm font-medium">
                <div>
                  <p>{p.name}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < 4
                            ? "text-green-500 fill-green-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="font-semibold">₹{p.price.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
