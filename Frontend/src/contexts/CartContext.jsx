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
  
    const isDummy = localStorage.getItem("isDummy") === "true";
  
    if (isDummy) {
      let local = JSON.parse(localStorage.getItem("dummyCart") || "[]");
    
      const enriched = await Promise.all(
        local.map(async (item) => {
          const res = await API.get(`/api/products/${item.productId}`);
          return {
            ...item,
            Product: res.data,
          };
        })
      );
    
      setCart(enriched);
      return;
    }
    
  
    const res = await API.get("/api/cart");
    const items = res.data?.CartItems || [];
    const sorted = [...items].sort((a, b) => a.id - b.id);
    setCart(sorted);
  }
  

  async function addToCart(productId, quantity = 1) {
    const isDummy = localStorage.getItem("isDummy") === "true";
  
    if (isDummy) {
      let cartItems = JSON.parse(localStorage.getItem("dummyCart") || "[]");
  
      const existing = cartItems.find((item) => item.productId === productId);
  
      if (existing) {
        existing.quantity += quantity;
      } else {
        cartItems.push({ id: Date.now(), productId, quantity });
      }
  
      localStorage.setItem("dummyCart", JSON.stringify(cartItems));
      const enriched = await Promise.all(
        cartItems.map(async (item) => {
          const res = await API.get(`/api/products/${item.productId}`);
          return { ...item, Product: res.data };
        })
      );
      
      setCart(enriched);
      return;
    }
    const res = await API.post("/api/cart/add", { productId, quantity });
    await fetchCart();
    return res.data;
  }
  

  async function updateCartItem(id, quantity) {
    const isDummy = localStorage.getItem("isDummy") === "true";
  
    if (isDummy) {
      let cartItems = JSON.parse(localStorage.getItem("dummyCart") || "[]");
      cartItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      localStorage.setItem("dummyCart", JSON.stringify(cartItems));
      const enriched = await Promise.all(
        cartItems.map(async (item) => {
          const res = await API.get(`/api/products/${item.productId}`);
          return { ...item, Product: res.data };
        })
      );
      
      setCart(enriched);
      return;
    }
  
    const res = await API.put(`/api/cart/update/${id}`, { quantity });
    await fetchCart();
    return res.data;
  }
  

  async function removeFromCart(id) {
    const isDummy = localStorage.getItem("isDummy") === "true";
  
    if (isDummy) {
      let cartItems = JSON.parse(localStorage.getItem("dummyCart") || "[]");
      cartItems = cartItems.filter(item => item.id !== id);
      localStorage.setItem("dummyCart", JSON.stringify(cartItems));
      const enriched = await Promise.all(
        cartItems.map(async (item) => {
          const res = await API.get(`/api/products/${item.productId}`);
          return { ...item, Product: res.data };
        })
      )
      setCart(enriched);
      
      return;
    }
  
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
