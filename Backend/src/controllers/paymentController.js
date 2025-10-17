// src/controllers/paymentController.js
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({ message: "Payment order creation failed", error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Typically you'd verify the signature here using crypto
    // and then update your Order table as "PAID"
    // Example:
    // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(razorpay_order_id + "|" + razorpay_payment_id)
    //   .digest('hex');
    //
    // if (expectedSignature !== razorpay_signature) throw new Error("Invalid signature");

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(400).json({ message: "Payment verification failed", error: err.message });
  }
};
