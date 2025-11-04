// src/contexts/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  async function fetchCart() {
    if (!token) return;
    const res = await API.get("/api/cart");
    const items = res.data?.CartItems || [];

    const sorted = [...items].sort((a, b) => a.id - b.id);
    setCart(sorted);
  }

  async function addToCart(productId, quantity = 1) {
    if (!token) throw new Error("Not authenticated");
    const res = await API.post("/api/cart/add", { productId, quantity });
    await fetchCart(); // refresh cart
    return res.data;
  }

  async function updateCartItem(id, quantity) {
    const res = await API.put(`/api/cart/update/${id}`, { quantity });
    await fetchCart();
    return res.data;
  }

  async function removeFromCart(id) {
    await API.delete(`/api/cart/remove/${id}`);
    await fetchCart();
  }

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}
