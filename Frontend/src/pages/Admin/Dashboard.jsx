import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddProduct from "../../components/Admin/AddProduct";
import EditProduct from "../../components/Admin/EditProduct";
import { motion } from "framer-motion";
import API, { BASE_URL } from "../../api/api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

 
  const formatImageUrl = (img) => {
    if (!img) return "/placeholder.png";
    return img.startsWith("http")
      ? img
      : `${BASE_URL.replace(/\/$/, "")}${img}`;
  };

  const loadProducts = async () => {
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;

      const res = await API.get("/api/products", { params });
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await API.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  // Delete a product
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadProducts();
      alert("Product deleted successfully!");
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Unauthorized. Please log in as admin.");
      } else {
        alert("Error deleting product");
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-teal-100 to-green-100 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 mt-25 gap-4">
        <h1 className="text-4xl font-extrabold text-teal-800 drop-shadow">
          🌿 Admin Dashboard
        </h1>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap justify-center mb-8 gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 shadow-sm cursor-pointer bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => {
          const firstImage = Array.isArray(p.image)           // pick the first available image
            ? p.image[0]
            : p.image || p.image1 || p.image2;

          return (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-4 transition-all border border-teal-100 flex flex-col items-center text-center"
            >
              <img
                src={formatImageUrl(firstImage)}
                alt={p.name}
                className="h-36 w-56 object-cover rounded-xl mb-4 mx-auto"
              />
              <h3 className="font-bold text-lg text-teal-800">{p.name}</h3>
              <p className="text-gray-600 mb-1">₹{p.price}</p>
              <p className="text-sm text-gray-500 mb-3">Stock: {p.quantity}</p>

              <div className="flex justify-center gap-3 mt-auto">
                <button
                  onClick={() => setEditingProduct(p)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddProduct
          onSuccess={() => {
            setShowAddModal(false);
            loadProducts();
          }}
        />
      )}

      {editingProduct && (
        <EditProduct
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            loadProducts();
          }}
        />
      )}
    </div>
  );
}
