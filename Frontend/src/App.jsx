import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";

import Welcome from "./pages/Welcome";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Checkout from "./pages/Shop/Checkout";

import Dashboard from "./pages/Admin/Dashboard";
import AddProduct from "./components/Admin/AddProduct";
import ManageOrders from "./pages/Admin/ManageOrders";

import ProductList from "./pages/Shop/ProductList";
import Cart from "./pages/Shop/Cart";
import Orders from "./pages/Shop/Orders";
import Profile from "./pages/Shop/Profile";

  
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";
import ProductPage from "./pages/Shop/ProductPage";

function App() {

  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return token && role === "admin" ? children : <Navigate to="/login" />;
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // duration for animation
    return () => clearTimeout(timer);
  }, [location.pathname]);
  return (
      <>
        {loading && <Loader message="Almost there, promise . . . 🫰" />}

        <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* User routes (protected) */}
            <Route path="/products" element={ <ProtectedRoute> <ProductList /> </ProtectedRoute> } />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/cart"  element={ <ProtectedRoute> <Cart /> </ProtectedRoute> } />
            <Route path="/orders" element={ <ProtectedRoute> <Orders /> </ProtectedRoute> } />
            <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute> } />
            <Route path="/checkout" element={ <ProtectedRoute> <Checkout /> </ProtectedRoute> } />
            {/* Admin routes (admin-only) */}
            <Route path="/admin/dashboard" element={ <AdminRoute><Dashboard /></AdminRoute> } />
            <Route path="/admin/add-product" element={ <AdminRoute> <AddProduct /> </AdminRoute> } />
            <Route path="/admin/orders" element={ <AdminRoute> <ManageOrders /> </AdminRoute> } />
          </Routes>
          <Footer />
      </>
  );
}

export default App;
