import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

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

function App() {
  return (
      <>
        <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* User routes (protected) */}
            <Route path="/products"
              element={ <ProtectedRoute> <ProductList /> </ProtectedRoute> } />
            <Route path="/cart"  element={ <ProtectedRoute> <Cart /> </ProtectedRoute> } />
            <Route path="/orders" element={ <ProtectedRoute> <Orders /> </ProtectedRoute> } />
            <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute> } />
            <Route path="/checkout" element={ <ProtectedRoute> <Checkout /> </ProtectedRoute> } />

            {/* Admin routes (admin-only) */}
            <Route path="/admin" element={ <AdminRoute> <Dashboard /> </AdminRoute> } />
            <Route path="/admin/add-product" element={ <AdminRoute> <AddProduct /> </AdminRoute> } />
            <Route path="/admin/orders" element={ <AdminRoute> <ManageOrders /> </AdminRoute> } />
          </Routes>
      </>
  );
}

export default App;
