import { NavLink, useNavigate } from "react-router";
import iconGuitar from "../assets/icon guitar.png";
import { toast } from "react-toastify";
import { useState } from "react";
import { p2Api } from "../helpers/http-client";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await p2Api.post("/register", { name, email, password });
      // console.log(data);

      toast.success("register successful");

      setTimeout(() => {
        navigate("/login");
      }, 400);
    } catch (error) {
      console.error("handleRegister error:", error.message);
      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Left Section (Image and Illustration) */}
        <div className="hidden lg:flex items-center justify-center w-1/2 bg-orange-200">
          <h2 className="absolute top-12  text-center text-4xl font-bold text-black">
            Your Guitar
          </h2>
          <img src={iconGuitar} alt="Guitar Illustration" className="mr-16 " />
        </div>
        {/* Right Section (Form) */}
        <div className="flex items-center justify-center w-full lg:w-1/2 bg-slate-50">
          <div className="max-w-md w-full px-8 py-8 bg-orange-200 shadow-lg rounded-md">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Your Guitar
            </h2>
            <form onSubmit={handleRegister}>
              {/* Name Input */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full py-2 pl-2 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500  focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full py-2 pl-2 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500  focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full py-2 pl-2 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500  focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 mb-4"
              >
                Register
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?
              <NavLink
                to="/login"
                className="text-blue-500 hover:underline ml-1"
              >
                Login
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
