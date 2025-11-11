import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { BASE_URL } from "../../api/api";
import { CartContext } from "../../contexts/CartContext";
import { Star, ShoppingCart, Zap } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [discount, setDiscount] = useState(0);

  const formatImageUrl = (img) => {   // Utility to ensure consistent image URL logic
    if (!img) return "/placeholder.png";
    return img.startsWith("http")
      ? img
      : `${BASE_URL.replace(/\/$/, "")}${img}`;
  };

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/api/products/${id}`);
      const p = res.data;
      setProduct(p);

      
      const firstImage = Array.isArray(p.image) //  Handle array or separate image fields gracefully
        ? p.image[0]
        : p.image || p.image1 || p.image2;

      setSelectedImage(formatImageUrl(firstImage));
      setDiscount(p.discount || 15);
    } catch (err) {
      console.error("Failed to load product:", err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500 text-lg">
        Loading product details...
      </div>
    );
  }

  const discountedPrice = (
    product.price -
    (product.price * discount) / 100
  ).toFixed(2);

  const imageList = Array.isArray(product.image)
    ? product.image
    : [product.image, product.image2, product.image3, product.image4].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 py-18 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">

          <div>
            <div className="bg-gray-100 rounded-2xl p-6 flex items-center justify-center mb-4">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-auto max-h-[420px] object-contain"
              />
            </div>

            <div className="flex justify-center gap-3 flex-wrap">
              {imageList.map((img, i) => {
                const fullUrl = formatImageUrl(img);
                return (
                  <img
                    key={i}
                    src={fullUrl}
                    alt={`thumb-${i}`}
                    onClick={() => setSelectedImage(fullUrl)}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                      selectedImage === fullUrl
                        ? "border-slate-800"
                        : "border-transparent"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  ({product.reviews?.length || 25} reviews)
                </span>
              </div>

              {/* Price and Discount */}
              <div className="flex items-baseline gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-600">
                  ₹{discountedPrice}
                </h2>
                <span className="text-gray-600 line-through text-md">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full text-sm">
                  Save {discount}%
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description ||
                  "This product is made from premium quality materials ensuring durability and comfort. Perfect choice for everyday use."}
              </p>

              {/* Highlights */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Highlights
                </h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Durable and premium build quality</li>
                  <li>Ergonomic design for comfort</li>
                  <li>Lightweight and easy to use</li>
                  <li>Fast delivery within 3-5 business days</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={() => {
                  addToCart(product.id, 1);
                  navigate("/cart");
                }}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-slate-700 transition cursor-pointer"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>

              <button
                onClick={() => {
                  addToCart(product.id, 1);
                  navigate("/checkout");
                }}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition cursor-pointer"
              >
                <Zap size={18} /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
