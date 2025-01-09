import { useNavigate } from "react-router";
import { baseURLApi } from "../helpers/http-client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import uniqloLogo from "../../public/uniqloLogo.png";

export default function RegisterPage() {
  const [email, setEmail] = useState("user30@mail.com");
  const [password, setPassword] = useState("user30");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await baseURLApi.post("/register", {
        email,
        password,
      });
      toast.success("Register successful! Now, please log in.");
      navigate("/login");
    } catch (error) {
      console.log("🚀 ~ handleRegister ~ error:", error);
      toast.error(error.response?.data?.message || "Failed to register");
    }
  };
  return (
    <>
      <section className="container" id="login-section">
        <div className="row">
          <div className="col-12 col-lg-8 offset-lg-2 my-5">
            <div className="row">
              <div className="col-12 col-md-6 border-end p-5 text-left">
                <img src={uniqloLogo} width="200px" alt="uniqlo" />
              </div>
              <div className="col-12 col-md-6 p-5 text-left">
                <div className="form-signin m-auto">
                  <form onSubmit={handleRegister} id="login-form">
                    <h1 className="h3 mb-3 display-1">Register</h1>
                    <span>
                      Sign up to enjoy all the benefits of an Unikloh account.
                    </span>
                    <div className="mb-3 mt-3">
                      <div className="d-flex justify-content-between">
                        <label htmlFor="login-email">Email</label>
                        <label
                          className="text-danger text-end fw-bold"
                          style={{ color: "red" }}
                        >
                          *
                        </label>
                      </div>
                      <input
                        type="email"
                        className="form-control"
                        id="login-email"
                        placeholder="Enter email address ..."
                        autoComplete="off"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between">
                        <label htmlFor="login-password">Password</label>
                        <label
                          className="text-danger text-end fw-bold"
                          style={{ color: "red" }}
                        >
                          *
                        </label>
                      </div>
                      <input
                        type="password"
                        className="form-control"
                        id="login-password"
                        placeholder="Enter your password ..."
                        autoComplete="off"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn btn-lg btn-primary rounded-pill w-100 p-2"
                      type="submit"
                    >
                      Register
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
