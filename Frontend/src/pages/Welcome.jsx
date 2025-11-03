import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import SidebarCategories from "../components/SidebarCategories";
import { Shirt, Apple, Cpu, ShoppingBasket } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import API from "../api/api";
import AnimatedCategoryButton from "../components/AnimatedCategoryButton";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Welcome() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);



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
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden">
        {/* Background Video */}
        <video
          src="/assets/categories/videos/shopping.mp4" 
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <motion.div
          className="relative z-10 px-6 max-w-4xl"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6">
            Welcome to Your Own Shopping Store
          </h1>

          <motion.p
            className="text-lg sm:text-xl mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Explore the best deals and shop across your favorite categories — all in one place.
          </motion.p>

          <motion.button
            onClick={() => navigate("/products")}
            whileHover={{ scale: 1.05 }}
            className="relative inline-block px-10 py-3 font-semibold text-black rounded-md bg-white/80 backdrop-blur-md border border-white/30 overflow-hidden transition-all duration-300 group"
          >
            <span className="relative z-10 cursor-pointer">Start Shopping</span>
            {/* Button hover border animation (like your custom-btn grid-button) */}
            <span className="absolute inset-0 border-2 border-transparent group-hover:border-white rounded-md transition-all duration-300"></span>
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
          </motion.button>
        </motion.div>
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

      
<section className="py-20 px-4 md:px-8 bg-white">
  <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
    Shop by Category
  </h2>

  <div className="flex flex-col gap-4">
    {/* --- ROW 1 --- */}
    <div className="flex flex-col md:flex-row w-full gap-4">
      <div
        className="relative group overflow-hidden rounded-2xl h-[400px] md:w-1/3 w-full cursor-pointer"
        onClick={() => handleCategoryClick("fruits")}
      >
        <video
          src="/assets/categories/videos/fruits2.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        <AnimatedCategoryButton 
          label="Fruits"
          onClick={() => handleCategoryClick("fruits")}
          className="absolute bottom-20 left-15"
        />
      </div>

      <div
        className="relative group overflow-hidden rounded-2xl h-[400px] md:w-2/3 w-full cursor-pointer"
        onClick={() => handleCategoryClick("vegetables")}
      >
        <video
          src="/assets/categories/videos/vegetables.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
       <AnimatedCategoryButton 
          label="Vegetables"
          onClick={() => handleCategoryClick("vegetables")}
          className="absolute bottom-20 left-190"
        />
      </div>
    </div>

    {/* --- ROW 2 --- */}
    <div className="flex flex-col md:flex-row w-full gap-4">
      <div
        className="relative group overflow-hidden rounded-2xl h-[400px] md:w-2/3 w-full cursor-pointer"
        onClick={() => handleCategoryClick("Electronics")}
      >
        <video
          src="/assets/categories/videos/electronics.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        <AnimatedCategoryButton 
            label="Electronics"
            onClick={() => handleCategoryClick("electronics")}
            className="absolute bottom-20 left-15"
          />
      </div>

  
      <div
        className="relative group overflow-hidden rounded-2xl h-[400px] md:w-1/3 w-full cursor-pointer"
        onClick={() => handleCategoryClick("watches")}
      >
        <video
          src="/assets/categories/videos/watches.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
         <AnimatedCategoryButton 
            label="Watches"
            onClick={() => handleCategoryClick("watches")}
            className="absolute bottom-20 left-75"
          />
      </div>
    </div>

     {/* --- ROW 3 --- */}
     <div className="flex flex-col md:flex-row w-full gap-4">
      <div
        className="relative group overflow-hidden rounded-2xl h-[400px] md:w-1/3 w-full cursor-pointer"
        onClick={() => handleCategoryClick("grocery")}
      >
        <video
          src="/assets/categories/videos/grocery.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        <AnimatedCategoryButton 
          label="Grocery"
          onClick={() => handleCategoryClick("grocery")}
          className="absolute bottom-20 left-15"
        />
      </div>

      <div
        className="relative group overflow-hidden rounded-2xl h-[400px] md:w-2/3 w-full cursor-pointer"
        onClick={() => handleCategoryClick("personalCare")}
      >
        <video
          src="/assets/categories/videos/personalCare.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
       <AnimatedCategoryButton 
          label="Personal Care"
          onClick={() => handleCategoryClick("personalCare")}
          className="absolute bottom-20 left-190"
        />
      </div>
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
