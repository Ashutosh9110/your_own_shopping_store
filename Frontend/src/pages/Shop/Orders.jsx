// src/pages/Orders.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await API.get("/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <p className="text-gray-500 text-lg">You haven’t placed any orders yet.</p>
        <a
          href="/products"
          className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-teal-700">
        My Orders
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold text-lg">
                  Order <span className="text-gray-600">#{order.id.slice(0, 8)}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="divide-y">
              {order.OrderItems.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`${item.Product.image}`}
                      alt={item.Product.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.Product.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="text-teal-700 font-semibold">
                  ₹{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-600">
                <span className="font-semibold">Shipping:</span> {order.address}
              </p>
              <p className="text-xl font-bold text-teal-700">
                Total: ₹{order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
