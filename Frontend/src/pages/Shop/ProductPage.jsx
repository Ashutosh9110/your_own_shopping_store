import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import { CartContext } from "../../contexts/CartContext";
import { Star, ShoppingCart } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Failed to load product:", err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg p-6">
          <img
            src={`${BASE_URL}${product.image}`}
            alt={product.name}
            className="w-full h-auto max-w-sm object-contain"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-slate-800 mb-2">
            {product.name}
          </h1>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < 4 ? "text-green-500 fill-green-500" : "text-gray-300"
                }`}
              />
            ))}
            <p className="ml-3 text-gray-500 text-sm">
              {product.rating?.length || 0} reviews
            </p>
          </div>
          <div className="text-2xl font-semibold text-slate-800 mb-4">
            ₹{product.price.toFixed(2)}
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <button
            onClick={() => addToCart(product.id, 1)}
            className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded hover:bg-slate-900 transition cursor-pointer"
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
