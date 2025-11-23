import React, { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (paymentMethod === "COD") {
        alert("Order placed successfully with Cash on Delivery!");
        navigate("/orders");
        setLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const { data: order } = await API.post(
        "/api/payments/create-order",
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "ShopEasy",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          alert("Payment Successful!");
          console.log("Payment response:", response);
          await API.post(
            "/api/payments/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          navigate("/orders")
        },
        prefill: {
          name: "Ashutosh Singh",
          email: "ashutoshadhikari@outlook.com",
          contact: "9871437696",
        },
        theme: { color: "#4F46E5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Checkout
        </h2>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Select Payment Method
          </label>

          <div className="flex flex-col gap-3">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Cash on Delivery</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Pay Online (UPI / Net Banking)</span>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium transition cursor-pointer
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
