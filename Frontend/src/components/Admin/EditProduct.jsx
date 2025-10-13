import React, { useState } from "react";
import { patchDocument } from "../../services/firestoreRest";
import { uploadProductImage } from "../../services/storageRest";

export default function EditProduct({ product, onClose, onSuccess }) {
  const [updated, setUpdated] = useState(product);
  const [loading, setLoading] = useState(false);
  const idToken = localStorage.getItem("idToken");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product.image;

      if (updated.imageFile) {
        imageUrl = await uploadProductImage(updated.imageFile, idToken, product.id);
      }

      await patchDocument(
        "products",
        product.id,
        {
          name: updated.name,
          price: Number(updated.price),
          quantity: Number(updated.quantity),
          image: imageUrl,
        },
        idToken
      );

      alert("Product updated!");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="bg-white p-4 shadow rounded mb-4">
      <h2 className="font-bold mb-4 text-xl">Edit Product</h2>
      <input
        type="text"
        value={updated.name}
        className="border p-2 w-full mb-2"
        onChange={(e) => setUpdated({ ...updated, name: e.target.value })}
      />
      <input
        type="number"
        value={updated.price}
        className="border p-2 w-full mb-2"
        onChange={(e) => setUpdated({ ...updated, price: e.target.value })}
      />
      <input
        type="number"
        value={updated.quantity}
        className="border p-2 w-full mb-2"
        onChange={(e) => setUpdated({ ...updated, quantity: e.target.value })}
      />
      <input
        type="file"
        className="border p-2 w-full mb-2"
        onChange={(e) => setUpdated({ ...updated, imageFile: e.target.files[0] })}
      />

      <div className="flex gap-2">
        <button
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
