import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({});
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
    <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col">
            <div className="text-center lg:text-left">
            </div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <form className="card-body" onSubmit={handleSubmit}>
                    <p className="text-2xl font-bold">Create your account</p>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Full Name</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            className="input input-bordered" 
                            required
                            onChange={(e) => setData(e.target.value)} 
                            value={data}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input 
                            type="email" 
                            placeholder="Email" 
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
                            placeholder="Password" 
                            className="input input-bordered" 
                            required 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password}
                        />
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn btn-primary" type="submit">Register</button>
                    </div>
                    <p className="text-sm text-center mt-4">You have account? <Link to={"/login"}><a className="link link-primary">Login</a></Link></p>
                </form>
            </div>
        </div>
    </div>
   );
}
