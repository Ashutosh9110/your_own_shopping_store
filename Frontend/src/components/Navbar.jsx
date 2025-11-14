import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
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

  // Base class for NavLink items
  const linkBase =
    "relative pb-1 transition-all duration-300 hover:text-green-600 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-green-600 after:transition-all after:duration-300";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 text-white transition-all duration-300
        ${location.pathname === "/" ? "bg-transparent backdrop-blur-sm" : "bg-white text-gray-800 shadow-md"}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight flex items-center hover:opacity-90 transition"
        >
          <span className="text-gray-600">Your</span><span className="text-green-600">Store</span><span className="text-green-600 text-3xl leading-8">.</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[18px] font-medium text-gray-600">
          {role === "user" && (
            <>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                Cart
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                My Orders
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                Profile
              </NavLink>
            </>
          )}

          {role === "admin" && (
            <>
              <NavLink
                to="/admin/dashboard"
                end
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/add-product"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                Add Product
              </NavLink>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "text-green-600 after:w-full" : ""}`
                }
              >
                Manage Orders
              </NavLink>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={handleLogout}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-md transition-all duration-300 cursor-pointer 
                ${
                  location.pathname === "/"
                    ? "bg-gray-600 hover:bg-gray-500 text-white"
                    : "bg-gray-600 hover:bg-gray-500 text-white"
                }`}
            >
              Logout
            </button>
          ) : (
            <>

            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
