// src/contexts/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const api = API.create({
    baseURL: "/api",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  async function fetchCart() {
    if (!token) return;
    const res = await api.get("/cart");
    const items = res.data?.CartItems || [];

    const sorted = [...items].sort((a, b) => a.id - b.id);
    setCart(sorted);
  }

  async function addToCart(productId, quantity = 1) {
    if (!token) throw new Error("Not authenticated");
    const res = await api.post("/cart/add", { productId, quantity });
    await fetchCart(); // refresh cart
    return res.data;
  }

  async function updateCartItem(id, quantity) {
    const res = await api.put(`/cart/update/${id}`, { quantity });
    await fetchCart();
    return res.data;
  }

  async function removeFromCart(id) {
    await api.delete(`/cart/remove/${id}`);
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
