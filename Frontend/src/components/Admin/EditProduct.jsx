// src/components/Admin/EditProduct.jsx
import React, { useState } from "react";
import API from "../api/api";

export default function EditProduct({ product, onClose }) {
  const [updated, setUpdated] = useState(product);
  const token = localStorage.getItem("token");

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await API.put(
        `/api/products/${product.id}`,
        {
          category: updated.category,
          name: updated.name,
          price: Number(updated.price),
          quantity: Number(updated.quantity),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Product updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form className="bg-white p-6 rounded-xl shadow-lg w-96" onSubmit={handleSave}>
        <h2 className="text-xl font-bold mb-4 text-teal-700">Edit Product</h2>

        <input
          type="text"
          placeholder="Category"
          value={updated.category}
          onChange={(e) => setUpdated({ ...updated, category: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Name"
          value={updated.name}
          onChange={(e) => setUpdated({ ...updated, name: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={updated.price}
          onChange={(e) => setUpdated({ ...updated, price: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={updated.quantity}
          onChange={(e) => setUpdated({ ...updated, quantity: e.target.value })}
          className="border p-2 w-full mb-4 rounded"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
