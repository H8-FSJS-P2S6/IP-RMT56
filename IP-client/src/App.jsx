import { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import useAuth from "./helpers/useAuth";
import { toast, ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import DetailProductPage from "./pages/DetailProductPage";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ChatbotPage from "./pages/ChatbotPage";

function ProtectedRoutes({ children }) {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function LoginWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      navigate("/", { state: { showToast: true } });
    }
  }, [navigate]);

  return <LoginPage />;
}

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Public: Register and Login */}
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <RootLayout />
              </ProtectedRoutes>
            }
          >
            {/* below routes are protected */}
            <Route index element={<HomePage />} />
            <Route path="/products" element={<HomePage />} />
            <Route path="/products/:id" element={<DetailProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/chat" element={<ChatbotPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
