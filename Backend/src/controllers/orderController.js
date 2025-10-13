import { Order, OrderItem } from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// 📦 Place an Order
export const placeOrder = async (req, res) => {
  const { cartItems, address } = req.body;
  const userId = req.user.id;

  try {
    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });
    if (!address)
      return res.status(400).json({ message: "Shipping address is required" });

    // Calculate total
    let totalAmount = 0;
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      if (product.quantity < item.quantity)
        throw new Error(`Insufficient stock for ${product.name}`);
      totalAmount += product.price * item.quantity;
    }

    // Create Order
    const order = await Order.create({
      userId,
      totalAmount,
      address,
    });

    // Create OrderItems + update product stock
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
      product.quantity -= item.quantity;
      await product.save();
    }

    res.status(201).json({ message: "Order placed successfully", orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 👀 Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["id", "email", "name"] },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["name", "price"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧾 Get User's Orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["name", "price"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get Single Order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["name", "price", "image"] }],
        },
      ],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Allow only owner or admin
    if (order.userId !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🚚 Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
