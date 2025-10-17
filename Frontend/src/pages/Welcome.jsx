import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Shirt, Apple, Cpu, ShoppingBasket } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Clothing",
      icon: <Shirt className="w-8 h-8 text-white" />,
      color: "bg-blue-500",
    },
    {
      name: "Grocery",
      icon: <ShoppingBasket className="w-8 h-8 text-white" />,
      color: "bg-green-500",
    },
    {
      name: "Fruits",
      icon: <Apple className="w-8 h-8 text-white" />,
      color: "bg-orange-500",
    },
    {
      name: "Electronics",
      icon: <Cpu className="w-8 h-8 text-white" />,
      color: "bg-purple-500",
    },
  ];

  const handleCategoryClick = (cat) => {
    navigate(`/products?category=${cat.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-100 via-white to-green-100">
      {/* Hero Banner */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-r from-teal-600 to-green-500 text-white shadow-lg">
        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold mb-4"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Your Own Shopping Store 🛍️
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Explore the best deals and shop across your favorite categories — all in one place.
        </motion.p>

        <motion.button
          onClick={() => navigate("/products")}
          className="mt-8 bg-white text-teal-700 px-8 py-3 rounded-full font-semibold hover:bg-teal-50 shadow-lg transition-all cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          Start Shopping
        </motion.button>
      </section>

      {/* Category Shortcuts */}
      <section className="py-16 px-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Shop by Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.05 }}
              className={`cursor-pointer flex flex-col items-center justify-center p-8 rounded-2xl shadow-md hover:shadow-xl text-center ${cat.color}`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="mb-4">{cat.icon}</div>
              <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-gray-800 text-gray-300 text-center text-sm">
        © {new Date().getFullYear()} Your Own Shopping Store — All rights reserved.
      </footer>
    </div>
  );
}
