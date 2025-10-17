// src/pages/Admin/ManageOrders.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useContext(AuthContext);

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Error updating order status.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-teal-50 p-8">
      <h1 className="text-4xl font-bold text-teal-700 mb-8 text-center">
        📦  Manage Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    👤 User ID: {order.userId}
                  </p>
                </div>

                {/* Status */}
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="border border-teal-500 rounded-lg p-2 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Items */}
              <div className="divide-y border-t mt-4 bg-gray-50 rounded-lg p-3">
                {order.OrderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`http://localhost:5000${item.Product.image}`}
                        alt={item.Product.name}
                        className="w-16 h-16 object-cover rounded-md shadow"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.Product.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-teal-700">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 flex justify-between items-center text-gray-700">
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {order.address}
                </p>
                <p className="text-lg font-bold text-teal-700">
                  Total: ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
