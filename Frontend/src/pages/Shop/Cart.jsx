import React, { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { formatUrl } from "../../utils/formatUrl";


export default function Cart() {
  const { cart, updateCartItem, removeFromCart, fetchCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const [address, setAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!token) {
      alert("Please log in to place an order.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter a shipping address.");
      return;
    }

    try {
      setPlacingOrder(true);
      const cartItems = cart.map((item) => ({
        productId: item.productId || item.Product?.id,
        quantity: item.quantity,
      }));

      const res = await API.post("/api/orders", { cartItems, address });
      console.log("Order response:", res.data);

      await fetchCart();
      setAddress("");
      navigate("/checkout");
    } catch (err) {
      console.error("Order failed:", err);
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!cart || cart.length === 0) {
    return <p className="text-center mt-20">🛒 Your cart is empty.</p>;
  }

  const total = cart.reduce(
    (sum, item) => sum + (item.Product?.price || 0) * item.quantity,
    0
  ); 
  

  return (
    <div className="max-w-4xl mx-auto mt-30 bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-600">
        Your Cart
      </h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border-b py-4"
        >
          {/* Product Info */}
          <div className="flex items-center gap-4">
          <img
            src={formatUrl(item.Product?.image)}
            alt={item.Product?.name || "Product"}
            className="w-20 h-20 object-cover rounded-md"
          />
            
            <div>
              <p className="font-semibold">{item.Product?.name || "Unnamed Product"}</p>
              <p className="text-gray-600">
                ₹{item.Product?.price ? item.Product.price.toFixed(2) : "0.00"}
              </p>            
            </div>
          </div>
          

          {/* Quantity + Delete */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (item.quantity === 1) {
                    removeFromCart(item.id);
                  } else {
                    updateCartItem(item.id, item.quantity - 1);
                  }
                }}
                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-600 cursor-pointer"
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => updateCartItem(item.id, item.quantity + 1)}
                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-600 cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="ml-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 border-t pt-4">
        <h3 className="text-xl font-semibold mb-4">
          <span className="text-gray-600">Total: </span><span className="text-gray-600">₹{total.toFixed(2)}</span>
        </h3>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-600">
            Shipping Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows="3"
            placeholder="Enter your delivery address..."
            className="w-full border rounded p-2"
          />
        </div>

        <button
          onClick={handleCheckout}
          disabled={placingOrder}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
        >
          {placingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
