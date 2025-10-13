import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (search) params.search = search;

      const res = await axios.get("http://localhost:5000/api/products", { params });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  // Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Refetch when filters/search change
  useEffect(() => {
    const timeout = setTimeout(() => fetchProducts(), 400);
    return () => clearTimeout(timeout);
  }, [selectedCategory, search]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-teal-700">Browse Products</h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center mb-8 gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 rounded-lg w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition"
          >
            <img
              src={`http://localhost:5000${p.image}`}
              alt={p.name}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-gray-500">{p.Category?.name}</p>
            <p className="text-teal-700 font-bold">${p.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}




// import React, { useEffect, useState } from "react";
// import { listDocuments } from "../../services/firestoreRest";

// export default function ProductList() {
//   const [products, setProducts] = useState([]);
//   const idToken = localStorage.getItem("idToken");

//   useEffect(() => {
//     async function load() {
//       try {
//         const data = await listDocuments("products", idToken);
//         const docs = data.documents?.map((doc) => ({
//           id: doc.name.split("/").pop(),
//           ...Object.fromEntries(
//             Object.entries(doc.fields).map(([k, v]) => [k, Object.values(v)[0]])
//           ),
//         })) || [];
//         setProducts(docs);
//       } catch (err) {
//         console.error("Error loading products:", err);
//       }
//     }
//     load();
//   }, []);

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">Shop Products</h1>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {products.map((p) => (
//           <div
//             key={p.id}
//             className="bg-white shadow-md p-4 rounded-lg flex flex-col"
//           >
//             <img
//               src={p.imageUrl}
//               alt={p.name}
//               className="h-40 w-full object-cover rounded-md mb-3"
//             />
//             <h3 className="text-lg font-semibold">{p.name}</h3>
//             <p className="text-gray-600 text-sm">{p.description}</p>
//             <p className="mt-2 font-bold">${p.price}</p>
//             <button className="bg-teal-600 text-white py-2 mt-3 rounded hover:bg-teal-700">
//               Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
