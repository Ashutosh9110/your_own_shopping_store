// src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { listDocuments, deleteDocument } from "../../services/firestoreRest";
import { useNavigate } from "react-router-dom";
import AddProduct from "../../components/Admin/AddProduct";
import EditProduct from "../../components/Admin/EditProduct";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const idToken = localStorage.getItem("idToken");
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const res = await listDocuments("products", idToken);
      const docs = res.documents || [];
      const parsed = docs.map((d) => ({
        id: d.name.split("/").pop(),
        ...Object.fromEntries(
          Object.entries(d.fields || {}).map(([k, v]) => [k, v.stringValue || v.integerValue || v.doubleValue])
        ),
      }));
      setProducts(parsed);
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
      await deleteDocument("products", productId, idToken);
      loadProducts();
    } catch (err) {
      alert("Error deleting product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
          >
            <div>
              <img
                src={p.imageUrl}
                alt={p.name}
                className="h-48 w-full object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-gray-600">₹{p.price}</p>
              <p className="text-gray-500 text-sm mt-1">Stock: {p.stock}</p>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setEditingProduct(p)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddProduct onClose={() => { setShowAddModal(false); loadProducts(); }} />
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
