// src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddProduct from "../../components/Admin/AddProduct";
import EditProduct from "../../components/Admin/EditProduct";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      loadProducts();
    } catch (err) {
      alert("❌ Error deleting product");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-teal-100 to-green-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-teal-800 drop-shadow">
          🌿 Admin Dashboard
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl shadow-md transition-all"
          >
            + Add Product
          </button>

          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition-all"
          >
            Manage Orders
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-4 transition-all border border-teal-100"
          >
            <img
              src={p.image}
              alt={p.name}
              className="h-48 w-full object-cover rounded-xl mb-4"
            />
            <h3 className="font-bold text-lg text-teal-800">{p.name}</h3>
            <p className="text-gray-600 mb-1">₹{p.price}</p>
            <p className="text-sm text-gray-500 mb-3">Stock: {p.quantity}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingProduct(p)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddProduct onSuccess={() => { setShowAddModal(false); loadProducts(); }} />
      )}

      {editingProduct && (
        <EditProduct
          product={editingProduct}
          onClose={() => { setEditingProduct(null); loadProducts(); }}
        />
      )}
    </div>
  );
}
