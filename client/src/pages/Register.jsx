import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(registerUser({ email, password }))
      .unwrap()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Registration successful!",
          text: "You can now login with your credentials.",
        }).then(() => {
          navigate("/login");
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message || "Registration failed!",
        });
      });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <br />
      <button onClick={() => navigate("/login")}>
        Already have an account? Login here
      </button>
    </div>
  );
}
