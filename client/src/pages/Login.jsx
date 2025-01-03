import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, googleLogin } from "../features/userSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate("/about");
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message || "Login failed!",
        });
      });
  };

  async function handleCredentialResponse(response) {
    try {
      dispatch(googleLogin({ idToken: response.credential }));
      navigate("/about");
    } catch (err) {
      // console.log(err, "<--- err google login client");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Google login failed!",
      });
    }
  }

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(document.getElementById("google-login"), {
      theme: "outline",
      size: "full",
      shape: "pill",
      width: "100%",
    });
  }, [dispatch]);

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div id="google-login"></div>
      <br />
      <div>
        <button onClick={() => navigate("/register")}>
          Don't have an account? Register here
        </button>
      </div>
    </div>
  );
}
