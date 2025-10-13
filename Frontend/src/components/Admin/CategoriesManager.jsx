// src/components/Admin/CategoryManager.jsx
import React, { useState, useEffect } from "react";
import { createDocument, listDocuments, deleteDocument } from "../../services/firestoreRest";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const idToken = localStorage.getItem("idToken");

  const loadCategories = async () => {
    const res = await listDocuments("categories", idToken);
    const docs = res.documents || [];
    const parsed = docs.map((d) => ({
      id: d.name.split("/").pop(),
      name: d.fields.name.stringValue,
    }));
    setCategories(parsed);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    await createDocument(
      "categories",
      { name: newCategory.trim() },
      idToken,
      crypto.randomUUID()
    );
    setNewCategory("");
    loadCategories();
  };

  const handleDelete = async (id) => {
    await deleteDocument("categories", id, idToken);
    loadCategories();
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
          <li
            key={cat.id}
            className="flex justify-between items-center border-b py-2"
          >
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
