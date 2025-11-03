import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import SidebarCategories from "../components/SidebarCategories";
import { Shirt, Apple, Cpu, ShoppingBasket } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import API from "../api/api";


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
    API
      .get("/api/products?limit=6")
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
    <div className="min-h-screen flex flex-col">
      {/* Hero Banner */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 text-gray-800 shadow-lg">
        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold mb-4 outlined-heading text-[1.5em] text-gray-800"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Your Own Shopping Store
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl max-w-2xl outlined-heading text-[1.5em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Explore the best deals and shop across your favorite categories — all in one place.
        </motion.p>

        <motion.button
          onClick={() => navigate("/products")}
          className="mt-8 text-teal-700 px-8 py-3 rounded-full font-semibold hover:bg-[#ce3b3b] shadow-lg transition-all cursor-pointer outlined-heading text-[1.5em]"
          whileHover={{ scale: 1.05 }}
        >
          Start Shopping
        </motion.button>
      </section>

      {/* Featured Products Carousel */}
      {/* {featured.length > 0 && (
        <section className="py-16 px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center outlined-heading text-[1.5em]">
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
                  <div className="rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col items-center p-4 w-64 h-[360px] justify-between bg-[#fff8dc]">
                    <img
                      src={`${BASE_URL}${p.image}`}
                      alt={p.name}
                      className="w-48 h-48 object-cover rounded-lg mb-3"
                    />
                    <div className="flex flex-col items-center flex-grow justify-center text-center ">
                      <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                      <p className="text-gray-800 font-bold mt-1">₹{p.price?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Slider>

        </section>
      )} */}

      {/* Category Shortcuts */}
      {/* Category Showcase Section */}
<section className="py-20 px-4 md:px-12 bg-white">
  <h2 className="text-4xl font-heading font-bold text-center mb-12 text-gray-800">
    Shop by Category
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
    {/* Category Card 1 */}
    <div
      className="relative group overflow-hidden rounded-2xl h-[400px]"
      onClick={() => handleCategoryClick("Fruits")}
    >
      <video
        src="/assets/categories/videos/fruits2.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
      />
      <button className="absolute bottom-8 left-8 bg-white/30 backdrop-blur-md px-6 py-2 rounded-md text-gray-800 font-semibold border border-gray-200 
        transition-all duration-300 group-hover:bg-white/60 group-hover:scale-105 relative overflow-hidden">
        <span className="relative z-10">Fruits</span>
        <span className="absolute inset-0 border-2 border-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
      </button>
    </div>

    {/* Category Card 2 */}
    <div
      className="relative group overflow-hidden rounded-2xl h-[400px]"
      onClick={() => handleCategoryClick("vegetables")}
    >
      <video
        src="/assets/categories/videos/vegetables.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
      ></video>
      <button className="absolute bottom-8 left-8 bg-white/30 backdrop-blur-md px-6 py-2 rounded-md text-gray-800 font-semibold border border-gray-200 
        transition-all duration-300 group-hover:bg-white/60 group-hover:scale-105 relative overflow-hidden">
        <span className="relative z-10">vegetables</span>
        <span className="absolute inset-0 border-2 border-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
      </button>
    </div>

    {/* Category Card 3 */}
    <div
      className="relative group overflow-hidden rounded-2xl h-[400px]"
      onClick={() => handleCategoryClick("Dresses")}
    >
      <video
        src="/assets/categories/videos/vegetables.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
      ></video>
      <button className="absolute bottom-8 left-8 bg-white/30 backdrop-blur-md px-6 py-2 rounded-md text-gray-800 font-semibold border border-gray-200 
        transition-all duration-300 group-hover:bg-white/60 group-hover:scale-105 relative overflow-hidden">
        <span className="relative z-10">Dresses</span>
        <span className="absolute inset-0 border-2 border-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
      </button>
    </div>
        {/* Category Card 4 */}
        <div
      className="relative group overflow-hidden rounded-2xl h-[400px]"
      onClick={() => handleCategoryClick("Watches")}
    >
      <video
        src="/assets/categories/videos/watches.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
      ></video>
      <button className="absolute bottom-8 left-8 bg-white/30 backdrop-blur-md px-6 py-2 rounded-md text-gray-800 font-semibold border border-gray-200 
        transition-all duration-300 group-hover:bg-white/60 group-hover:scale-105 relative overflow-hidden">
        <span className="relative z-10">Watches</span>
        <span className="absolute inset-0 border-2 border-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
      </button>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-gray-800 text-gray-300 text-center text-sm">
        © {new Date().getFullYear()} Your Own Shopping Store — All rights reserved.
      </footer>
    </div>
  );
}
