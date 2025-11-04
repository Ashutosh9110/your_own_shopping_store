import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import {
  Shirt,
  Footprints,
  Gem,
  FlaskConical,
  Brush,
  Glasses,
  Handbag,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/api";

const iconMap = {
  Clothing: <Shirt className="w-5 h-5 text-teal-600" />,
  Footwear: <Footprints className="w-5 h-5 text-blue-600" />,
  Jewelry: <Gem className="w-5 h-5 text-yellow-600" />,
  Perfume: <FlaskConical className="w-5 h-5 text-pink-600" />,
  Cosmetics: <Brush className="w-5 h-5 text-orange-600" />,
  Glasses: <Glasses className="w-5 h-5 text-indigo-600" />,
  Bags: <Handbag className="w-5 h-5 text-red-600" />,
};


export default function SidebarCategories({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState({});
  const { addToCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = async (cat) => {
    const isOpen = openCategory === cat.id;
    setOpenCategory(isOpen ? null : cat.id);

    if (!isOpen) {
      if (onCategorySelect) onCategorySelect(cat.name);

      // Load products only once for that category
      if (!productsByCategory[cat.id]) {
        try {
          const res = await axios.get(`${BASE_URL}/api/products`, {
            params: { category: cat.name },
          });
          setProductsByCategory((prev) => ({
            ...prev,
            [cat.id]: res.data,
          }));
        } catch (err) {
          console.error("Error loading products:", err);
        }
      }
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      alert("Please log in to add products to your cart.");
      navigate("/login");
      return;
    }

    try {
      await addToCart(productId, 1);
      alert("Product added to cart!");
    } catch (err) {
      console.error("Failed to add product:", err);
      alert("Error adding to cart.");
    }
  };

  return (
    <div className="w-72 bg-white rounded-2xl shadow-md p-5">
      <h2 className="font-bold text-gray-800 mb-4 text-lg">CATEGORY</h2>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-sm">Loading categories...</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              {/* Category Header */}
              <button
                onClick={() => handleCategoryClick(cat)}
                className="flex items-center justify-between w-full text-left px-2 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  {iconMap[cat.name] || (
                    <Handbag className="w-5 h-5 text-gray-600" />
                  )}
                  <span className="font-medium text-gray-700">
                    {cat.name}
                  </span>
                </div>

                {openCategory === cat.id ? (
                  <ChevronDown className="w-4 h-4 text-gray-600 cursor-pointer" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600 cursor-pointer" />
                )}
              </button>

              {/* Expanded Product List */}
              {openCategory === cat.id && (
                <ul className="ml-6 mt-2 border-l border-gray-200 pl-3 space-y-2 animate-fadeIn">
                  {productsByCategory[cat.id]?.length > 0 ? (
                    productsByCategory[cat.id].map((p) => (
                      <li
                        key={p.id}
                        className="flex justify-between items-center text-sm text-gray-700 hover:bg-gray-50 px-2 py-1 rounded-md"
                      >
                        <span>
                          {p.name}{" "}
                          <span className="text-gray-500">({p.quantity})</span>
                        </span>
                        <button
                          onClick={() => handleAddToCart(p.id)}
                          className="p-1 bg-teal-100 hover:bg-teal-200 rounded-md cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-teal-600" />
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 text-sm italic px-2">
                      {/* No products found */}
                    </li>
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
