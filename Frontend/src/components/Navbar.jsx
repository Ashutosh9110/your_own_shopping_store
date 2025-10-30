import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setRole(user?.role || localStorage.getItem("role"));
  }, [user]);

  const hideOnAuthPages = ["/login", "/signup", "/forgot-password", "/reset-password"];
  if (hideOnAuthPages.some((path) => location.pathname.startsWith(path))) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 text-gray-300 shadow-lg backdrop-blur-md outlined-heading text-[1.5em]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight flex items-center gap-2 hover:opacity-90 transition"
        >
          🛍️ <span className="font-heading">ShopEase</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-[20px] font-medium">
          {role === "user" && (
            <>
              <Link to="/products" className="hover:text-yellow-200 transition">Products</Link>
              <Link to="/cart" className="hover:text-yellow-200 transition">Cart</Link>
              <Link to="/orders" className="hover:text-yellow-200 transition">My Orders</Link>
              <Link to="/profile" className="hover:text-yellow-200 transition">Profile</Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link to="/admin" className="hover:text-green-200 transition">Dashboard</Link>
              <Link to="/admin/add-product" className="hover:text-green-200 transition">Add Product</Link>
              <Link to="/admin/orders" className="hover:text-green-200 transition">Manage Orders</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-400 px-4 py-1.5 rounded-full text-sm font-semibold shadow-md transition-all duration-300 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="font-semibold px-3 py-1.5 rounded-full hover:bg-yellow-300 transition-all shadow-md text-[20px]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="ont-semibold px-3 py-1.5 rounded-full hover:bg-yellow-300 transition-all shadow-md text-[20px]"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
