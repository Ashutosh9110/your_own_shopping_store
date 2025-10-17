import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import axios from "axios";
import { Shirt, Apple, Cpu, ShoppingBasket } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Welcome() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

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

  // Fetch featured products (or first few)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products?limit=6")
      .then((res) => setFeatured(res.data))
      .catch((err) => console.error("Failed to load featured products:", err));
  }, []);

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 800,
    slidesToShow: 5,
    slidesToScroll: 1,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
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

      {/* Featured Products Carousel */}
      {featured.length > 0 && (
        <section className="py-16 px-8 bg-white">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Featured Products
          </h2>

          <Slider {...settings}>
            {featured.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.05 }}
                className="p-4 cursor-pointer"
                onClick={() => navigate("/products")}
              >
                <div className="p-4 flex justify-center">
                  <div className="bg-gray-50 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col items-center p-4 w-64 h-[360px] justify-between">
                    <img
                      src={`${BASE_URL}${p.image}`}
                      alt={p.name}
                      className="w-48 h-48 object-cover rounded-lg mb-3"
                    />
                    <div className="flex flex-col items-center flex-grow justify-center text-center">
                      <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                      <p className="text-teal-700 font-bold mt-1">₹{p.price?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Slider>

        </section>
      )}

      {/* Category Shortcuts */}
      <section className="py-16 px-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Shop by Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl">
          {categories.map((cat) => (
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
