import { ToastContainer } from "react-toastify";
import UnAuthLayout from "./layouts/UnAuthLayout";
import Cart from "./pages/Cart";
import Homepage from "./pages/Homepage";
import Login from "./pages/login";
import Recommendation from "./pages/Recommendation";
import Register from "./pages/register";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import {Provider} from "react-redux"
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <ToastContainer />
      <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Homepage />}/>
        <Route path="/cart" element={<Cart />}/>
          <Route path="/recommend" element={<Recommendation />} />
        </Route>

          <Route element={<UnAuthLayout />}>
        <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />} />
          </Route>
      </Routes>
      </BrowserRouter>
      </Provider>
  );
}

export default App;
