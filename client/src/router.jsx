import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

export default router;
