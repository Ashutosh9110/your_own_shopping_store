// src/contexts/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  async function fetchCart() {
    if (!token) return;
    const res = await api.get("/cart");
    setCart(res.data);
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
