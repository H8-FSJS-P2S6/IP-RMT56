import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Home1 from "./pages/Home1";
import AIAsk from "./pages/AIAsk";
import MyPokemon from "./pages/MyPokemon";
import AddMyPokemon from "./pages/AddMyPokemon";
import MyPokemonById from "./pages/MyPokemonById";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/pub", element: <Home /> },
      { path: "/pub1", element: <Home1 /> },
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/ask-ai", element: <AIAsk /> },
    ],
  },
  {
    path: "/mypokemons",
    element: (
      <MainLayout>
        <ProtectedRoute>
          <MyPokemon />
        </ProtectedRoute>
      </MainLayout>
    ),
    children: [
      { path: "", element: <MyPokemon /> },
      { path: "add", element: <AddMyPokemon /> },
      { path: ":pokemonId", element: <MyPokemonById /> },
    ],
  },
]);

export default router;
