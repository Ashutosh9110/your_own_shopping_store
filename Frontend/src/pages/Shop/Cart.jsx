import React, { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

export default function Cart() {
  const { cart, updateCartItem, removeFromCart, fetchCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const [address, setAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

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

      const res = await api.post("/orders", { cartItems, address });

      alert("✅ Order placed successfully!");
      console.log("Order response:", res.data);

      await fetchCart(); // Refresh or clear the cart after order
      setAddress("");
    } catch (err) {
      console.error("Order failed:", err);
      alert(err.response?.data?.message || "❌ Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!cart || cart.length === 0) {
    return <p className="text-center mt-20">🛒 Your cart is empty.</p>;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.Product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-teal-700">Your Cart</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border-b py-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={`http://localhost:5000${item.Product.image}`}
              alt={item.Product.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div>
              <p className="font-semibold">{item.Product.name}</p>
              <p className="text-gray-600">${item.Product.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={(e) => updateCartItem(item.id, e.target.value)}
              className="border p-1 w-16 text-center rounded"
            />
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 border-t pt-4">
        <h3 className="text-xl font-semibold mb-4">
          Total: <span className="text-teal-700">${total.toFixed(2)}</span>
        </h3>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
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
          className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
        >
          {placingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
