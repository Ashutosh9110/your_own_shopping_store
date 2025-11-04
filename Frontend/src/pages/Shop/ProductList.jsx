import React, { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
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
  const [addingProductId, setAddingProductId] = useState(null);

  const { user, token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
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

  const handleAddToCart = async (productId) => {
    if (!token) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      setAddingProductId(productId);
      await addToCart(productId, 1);
      alert("Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart.");
    } finally {
      setAddingProductId(null);
    }
  };

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gray-50 rounded-2xl transition-all duration-300 flex flex-col text-center cursor-pointer"
          >
            <div className="relative">
              <img
                src={`${BASE_URL}${p.image}`}
                alt={p.name}
                className="w-full h-64 object-contain bg-white rounded-t-2xl p-6 transition-transform duration-300 hover:scale-105"
              />
              {p.quantity < 1 && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  Out of Stock
                </div>
              )}
            </div>

            <div className="p-5 flex flex-col flex-1 items-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {p.name}
              </h3>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-900 font-bold text-lg mb-3">
                ₹{p.price.toFixed(2)}
              </p>

              <button
                onClick={() => handleAddToCart(p.id)}
                disabled={addingProductId === p.id || p.quantity < 1}
                className={`mt-auto py-2.5 px-6 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                  p.quantity < 1
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-green-700 text-white hover:bg-teal-700"
                } ${addingProductId === p.id ? "opacity-70" : ""}`}
              >
                {p.quantity < 1
                  ? "Out of Stock"
                  : addingProductId === p.id
                  ? "Adding..."
                  : "Add to Cart"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
