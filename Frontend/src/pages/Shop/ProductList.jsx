// src/pages/Shop/ProductList.jsx  (or Products.jsx)
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_BASE_URL

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

      const res = await axios.get("http://localhost:5000/api/products", { params });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
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
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-teal-700">Browse Products</h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center mb-8 gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg p-2 cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 rounded-lg w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition flex flex-col"
          >
          <div className="flex justify-center">
            <img
              src={`${BASE_URL}${p.image}`}
              alt={p.name}
              className="w-48 h-36 object-cover rounded-md mb-3"
            />
          </div>
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-gray-500">{p.Category?.name}</p>
            <p className="text-teal-700 font-bold mb-2">₹{p.price.toFixed(2)}</p>

            <button
              onClick={() => handleAddToCart(p.id)}
              disabled={addingProductId === p.id}
              className="mt-auto bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50 cursor-pointer"
            >
              {addingProductId === p.id ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
