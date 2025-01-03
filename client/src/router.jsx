import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"
import AIAsk from "./pages/AIAsk";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/pub", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/ask-ai", element: <AIAsk /> },
    ],
  },
]);

export default router;
