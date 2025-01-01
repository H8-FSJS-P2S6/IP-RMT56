import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/userSlice";
import Button from "./Button";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Button title="Home" onClick={() => navigate("/pub")} />
      <Button title="About" onClick={() => navigate("/about")} />
      <Button title="Ask-AI" onClick={() => navigate("/ask-ai")} />
      {accessToken ? (
        <>
          <Button title="My Favorite" onClick={() => navigate("/myfavorite")} />
          <Button title="Logout" onClick={handleLogout} />
        </>
      ) : (
        <>
          <Button title="Login" onClick={() => navigate("/login")} />
        </>
      )}
    </nav>
  );
}
