import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

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
  const [seeding, setSeeding] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        alert("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);


  const handleSeedCategories = async () => {
    try {
      setSeeding(true);
      await API.post(
        "/api/categories/seed",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res = await API.get("/api/categories");
      setCategories(res.data);
      alert("Default categories seeded!");
    } catch (err) {
      console.error("Error seeding categories:", err);
      alert(
        err.response?.data?.message ||
          "Failed to seed categories. Make sure you are logged in as admin."
      );
    } finally {
      setSeeding(false);
    }
  };


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

      await API.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Product added successfully!");
      setProduct({ categoryId: "", name: "", price: "", quantity: "", imageFile: null });
      onSuccess?.();
      navigate("/admin")
    } catch (err) {
      console.error("Add product error:", err);
      alert(err.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
 
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6 pt-30">
      <h2 className="font-bold mb-4 text-xl">Add New Product</h2>

      {/* Category dropdown */}
      <label className="block mb-2 font-medium">Category</label>
      {categories.length === 0 && (
        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-2 mb-2">
          <span>No categories found.</span>
          <button
            type="button"
            onClick={handleSeedCategories}
            disabled={seeding}
            className={`ml-3 px-3 py-1 rounded text-white ${
              seeding ? "bg-yellow-400" : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            {seeding ? "Seeding..." : "Seed defaults"}
          </button>
        </div>
      )}
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
        className={`w-full bg-gray-600 text-white py-2 rounded cursor-pointer hover:bg-gray-500 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
