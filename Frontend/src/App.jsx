// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
// import Home from "./pages/Shop/Home";
// import Dashboard from "./pages/Admin/Dashboard";
// import ProductList from "./pages/Shop/ProductList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/products" element={<ProductList />} /> */}
        {/* <Route path="/admin" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
