// src/components/Admin/CategoryManager.jsx
import React, { useState, useEffect } from "react";
import API from "../api/api";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const token = localStorage.getItem("token");

  const loadCategories = async () => {
    try {
      const res = await API.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories:", err);
      alert("Failed to load categories.");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await API.post(
        "/api/categories",
        { name: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewCategory("");
      loadCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      alert(err.response?.data?.message || "Failed to add category. Make sure you are logged in as admin.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      loadCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category. Only admin can delete.");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg mt-6">
      <h2 className="text-xl font-bold mb-3 text-teal-700">Manage Categories</h2>

      <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
          Add
        </button>
      </form>

      <ul>
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center border-b py-2">
            <span>{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
