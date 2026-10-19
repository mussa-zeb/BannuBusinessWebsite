import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import SellerLayout from "./components/SellerLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./components/Chat"; // NEW

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import PublicSellerProfile from "./pages/SellerProfile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";

import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import AddProduct from "./pages/seller/AddProduct";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerCustomers from "./pages/seller/SellerCustomers";
import SellerPayments from "./pages/seller/SellerPayments";
import SellerProfile from "./pages/seller/SellerProfile";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminSellers from "./pages/admin/Sellers";
import AdminSellerDetail from "./pages/admin/SellerDetail";
import AdminUsers from "./pages/admin/Users";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminSettings from "./pages/admin/Settings";

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-6xl font-black text-heading">404</h1>
      <p className="mt-3 text-sm font-semibold text-body">
        Page not found
      </p>
    </div>
  );
}

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/seller/:id" element={<PublicSellerProfile />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Chat /> {/* NEW: sirf public pages par chatbot */}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="sellers/:id" element={<AdminSellerDetail />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<AddProduct />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="payments" element={<SellerPayments />} />
          <Route path="customers" element={<SellerCustomers />} />
          <Route path="profile" element={<SellerProfile />} />
        </Route>

        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </CartProvider>
  );
}