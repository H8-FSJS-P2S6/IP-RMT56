import { Outlet } from "react-router";
import "../app.css";
import SideBar from "../components/SideBar";

export default function RootLayout() {
  return (
    <>
      <SideBar />
      <div>
        <Outlet />
      </div>
    </>
  );
}
