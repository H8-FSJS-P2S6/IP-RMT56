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
    <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col gap-6">
            <div className="text-center ">
            </div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">

                <form className="card-body" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input 
                            type="email" 
                            placeholder="email" 
                            className="input input-bordered" 
                            required 
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input 
                            type="password" 
                            placeholder="password" 
                            className="input input-bordered" 
                            required 
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>
                    <div className="form-control mt-6">
                        <div className="flex flex-col items-center w-full">
                            <button className="btn btn-primary w-full" type="submit"><b>Login</b></button>
                        </div>
                    </div>
                    <div className="text-center mt-3 font-semibold">Or</div>
                    <div id="buttonDiv" className="w-[100%] mt-3 flex justify-center"></div>
                    <p className="text-sm mt-4 text-center">Don't have an account? <Link to="/register"><a className="link link-primary">Create an account</a></Link></p>
                </form>
            </div>
        </div>
    </div>
  );
}
