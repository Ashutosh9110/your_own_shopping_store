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

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (item) {
      const newQty = item.quantity + quantity;
      if (product.quantity < quantity) {
        return res.status(400).json({ message: "Not enough stock" });
      }
      item.quantity = newQty;
      await item.save();
    } else {
      item = await CartItem.create({ cartId: cart.id, productId, quantity });
    }

    product.quantity -= quantity;
    await product.save();

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

    const product = await Product.findByPk(item.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Calculate difference in quantity
    const diff = quantity - item.quantity;

    // If increasing quantity, check stock
    if (diff > 0 && product.quantity < diff) {
      return res.status(400).json({ message: "Not enough stock available" });
    }
    // Adjust stock based on diff
    product.quantity -= diff;
    await product.save();

    // Update item quantity
    item.quantity = quantity;
    await item.save();

    res.json({ message: "Cart item updated", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await CartItem.findByPk(itemId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    const product = await Product.findByPk(item.productId);
    if (product) {
      product.quantity += item.quantity;
      await product.save();
    }

    await item.destroy();
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: CartItem, include: [Product] }],
      order: [[{ model: CartItem }, "id", "ASC"]],
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await CartItem.destroy({ where: { cartId: cart.id } });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
