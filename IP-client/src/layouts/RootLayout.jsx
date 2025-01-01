import { Outlet } from "react-router";
import "../app.css";
import NavBar from "../components/NavBar";

export default function RootLayout() {
  return (
    <>
      <NavBar />
      <div>
        <Outlet />
      </div>
    </>
  );
}
