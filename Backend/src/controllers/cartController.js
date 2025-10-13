import { Cart, CartItem } from "../models/Cart.js";
import Product from "../models/Product.js";



export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        include: [{ model: Product }],
      },
    });
    if (!cart) {
      cart = await Cart.create({ userId });
    }
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) cart = await Cart.create({ userId });

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({ cartId: cart.id, productId, quantity });
    }
    res.json({ message: "Product added to cart", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const item = await CartItem.findByPk(itemId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.quantity = quantity;
    await item.save();

    res.json({ message: "Quantity updated", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await CartItem.findByPk(itemId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    await item.destroy();
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await CartItem.destroy({ where: { cartId: cart.id } });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
