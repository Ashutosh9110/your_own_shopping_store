import React, { useEffect, useState } from "react";
import { listDocuments } from "../../services/firestoreRest";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const idToken = localStorage.getItem("idToken");

  useEffect(() => {
    async function load() {
      try {
        const data = await listDocuments("products", idToken);
        const docs = data.documents?.map((doc) => ({
          id: doc.name.split("/").pop(),
          ...Object.fromEntries(
            Object.entries(doc.fields).map(([k, v]) => [k, Object.values(v)[0]])
          ),
        })) || [];
        setProducts(docs);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    }
    load();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Shop Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md p-4 rounded-lg flex flex-col"
          >
            <img
              src={p.imageUrl}
              alt={p.name}
              className="h-40 w-full object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-gray-600 text-sm">{p.description}</p>
            <p className="mt-2 font-bold">${p.price}</p>
            <button className="bg-teal-600 text-white py-2 mt-3 rounded hover:bg-teal-700">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
