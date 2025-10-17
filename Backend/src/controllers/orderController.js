import { Order, OrderItem } from "../models/Order.js"
import { Cart, CartItem } from "../models/Cart.js";
import Product from "../models/Product.js";


export const placeOrder = async (req, res) => {
  const { cartItems, address } = req.body;
  const userId = req.user.id;

  try {
    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    if (!address)
      return res.status(400).json({ message: "Shipping address is required" });

    // Calculate total + check stock
    let totalAmount = 0;
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      if (!product)
        throw new Error(`Product not found: ${item.productId}`);
      if (product.quantity < item.quantity)
        throw new Error(`Insufficient stock for ${product.name}`);

      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      userId,
      totalAmount,
      address,
      status: "PENDING",
      paymentMethod: "COD",     
      paymentStatus: "PENDING", 
    });

    // Create order items + update stock
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

    // Clear cart after successful order
    const userCart = await Cart.findOne({ where: { userId } });
    if (userCart) await CartItem.destroy({ where: { cartId: userCart.id } });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["name", "price", "image"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["name", "price", "image"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

    if (order.userId !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({
      message: "Failed to update order status",
      error: err.message,
    });
  }
};