import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import PaymentHistory from "./pages/PaymentHistory";
import Wishlist from "./pages/Wishlist";
import Invoice from "./pages/Invoice";

import Dashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/AddProduct";
import ManageProducts from "./pages/admin/ManageProducts";
import EditProduct from "./pages/admin/EditProduct";
import Orders from "./pages/admin/Orders";
import OrderDetails from "./pages/admin/OrderDetails";
import Payments from "./pages/admin/Payments";
import Users from "./pages/admin/Users";
import { ToastContainer } from "react-toastify";
import Analytics from "./pages/admin/Analytics";

<Route
  path="/admin/analytics"
  element={
    <ProtectedRoute adminOnly>
      <Analytics />
    </ProtectedRoute>
  }
/>

function App() {
  return (
    <BrowserRouter>
      <Navbar />
       <>
      {/* your BrowserRouter code */}
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/invoice/:id" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/add-product" element={<ProtectedRoute adminOnly><AddProduct /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute adminOnly><ManageProducts /></ProtectedRoute>} />
        <Route path="/admin/edit-product/:id" element={<ProtectedRoute adminOnly><EditProduct /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute adminOnly><Orders /></ProtectedRoute>} />
        <Route path="/admin/orders/:id" element={<ProtectedRoute adminOnly><OrderDetails /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute adminOnly><Payments /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
        <Route path="/admin/analytics"element={<ProtectedRoute adminOnly><Analytics /></ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;