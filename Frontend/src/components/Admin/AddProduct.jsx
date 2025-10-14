import React, { useState } from "react";
import axios from "axios";

export default function AddProduct({ onSuccess }) {
  const [product, setProduct] = useState({
    category: "",
    name: "",
    price: "",
    quantity: "",
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("category", product.category);
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("quantity", product.quantity);
      if (product.imageFile) formData.append("image", product.imageFile);

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added successfully!");
      setProduct({ category: "", name: "", price: "", quantity: "", imageFile: null });
      onSuccess?.();
    } catch (err) {
      console.error("Add product error:", err);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6">
      <h2 className="font-bold mb-4 text-xl">Add New Product</h2>

      <input
        type="text"
        placeholder="Category"
        className="border p-2 w-full mb-2"
        value={product.category}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Product Name"
        className="border p-2 w-full mb-2"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Price"
        className="border p-2 w-full mb-2"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        className="border p-2 w-full mb-2"
        value={product.quantity}
        onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
        required
      />
      <input
        type="file"
        className="border p-2 w-full mb-2"
        onChange={(e) => setProduct({ ...product, imageFile: e.target.files[0] })}
      />

      <button disabled={loading} className="bg-teal-600 text-white px-4 py-2 rounded">
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
