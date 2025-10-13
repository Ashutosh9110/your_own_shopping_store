import React, { useState } from "react";
import axios from "axios";

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [amount, setAmount] = useState(1000); // Example amount

  const handlePayment = async () => {
    if (paymentMethod === "COD") {
      alert("Order placed with Cash on Delivery!");
      // You’d create order with paymentStatus = "PENDING"
      return;
    }

    // Online payment flow
    const { data: order } = await axios.post("http://localhost:5000/api/payments/create-order", {
      amount,
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // frontend key
      amount: order.amount,
      currency: "INR",
      name: "Your Shop",
      description: "Order Payment",
      order_id: order.id,
      handler: function (response) {
        alert("Payment Successful! ✅");
        console.log(response);
        // Then call your backend to mark paymentStatus = "PAID"
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <label>
        <input
          type="radio"
          value="COD"
          checked={paymentMethod === "COD"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Cash on Delivery
      </label>

      <label>
        <input
          type="radio"
          value="ONLINE"
          checked={paymentMethod === "ONLINE"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Pay Online (UPI / Net Banking)
      </label>

      <button onClick={handlePayment}>Place Order</button>
    </div>
  );
}

export default Checkout;
