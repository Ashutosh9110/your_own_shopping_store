// src/components/Admin/AddProduct.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddProduct({ onSuccess }) {
  const [product, setProduct] = useState({
    categoryId: "",
    name: "",
    price: "",
    quantity: "",
    imageFile: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        alert("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("categoryId", product.categoryId);
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("quantity", product.quantity);
      if (product.imageFile) formData.append("image", product.imageFile);

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Product added successfully!");
      setProduct({ categoryId: "", name: "", price: "", quantity: "", imageFile: null });
      onSuccess?.();
    } catch (err) {
      console.error("Add product error:", err);
      alert(err.response?.data?.message || "❌ Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6">
      <h2 className="font-bold mb-4 text-xl">Add New Product</h2>

      {/* Category dropdown */}
      <label className="block mb-2 font-medium">Category</label>
      <select
        className="border p-2 w-full mb-4 rounded"
        value={product.categoryId}
        onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Product Name</label>
      <input
        type="text"
        placeholder="Product Name"
        className="border p-2 w-full mb-4 rounded"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        required
      />

      <label className="block mb-2 font-medium">Price</label>
      <input
        type="number"
        placeholder="Price"
        className="border p-2 w-full mb-4 rounded"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        required
      />

      <label className="block mb-2 font-medium">Quantity</label>
      <input
        type="number"
        placeholder="Quantity"
        className="border p-2 w-full mb-4 rounded"
        value={product.quantity}
        onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
        required
      />

      <label className="block mb-2 font-medium">Image</label>
      <input
        type="file"
        className="border p-2 w-full mb-4 rounded"
        onChange={(e) => setProduct({ ...product, imageFile: e.target.files[0] })}
      />

      <button
        disabled={loading}
        className={`w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
