import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!access_token) {
      navigate("/login", { replace: true });
    } else {
      setLoading(false);
    }
  }, [access_token, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}
