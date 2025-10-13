import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on auth pages
  const hideOnAuthPages = ["/login", "/signup", "/forgot-password", "/reset-password"];
  if (hideOnAuthPages.some((path) => location.pathname.startsWith(path))) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* === Left section === */}
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-xl text-yellow-400">
          ShopEase
        </Link>

        {/* === User Navbar Links === */}
        {user?.role === "user" && (
          <>
            <Link to="/products" className="hover:text-yellow-300">Products</Link>
            <Link to="/cart" className="hover:text-yellow-300">Cart</Link>
            <Link to="/orders" className="hover:text-yellow-300">My Orders</Link>
          </>
        )}

        {/* === Admin Navbar Links === */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin" className="hover:text-green-300">Dashboard</Link>
            <Link to="/admin/add-product" className="hover:text-green-300">Add Product</Link>
            <Link to="/admin/orders" className="hover:text-green-300">Manage Orders</Link>
          </>
        )}
      </div>

      {/* === Right section === */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* User or Admin Profile */}
            {user.role === "user" && (
              <Link to="/profile" className="hover:text-yellow-300">Profile</Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 px-3 py-1 rounded hover:bg-green-500"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
