import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
const useAuth = () => {
  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");

  //useEffect
  useEffect(() => {
    if (!access_token) {
      toast.error("Please login first");

      const timer = setTimeout(() => {
        navigate("/login");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [access_token, navigate]);

  // if there is no access token
  if (!access_token) {
    return false;
  }

  // if there is access token
  return true;
};

export default useAuth;
