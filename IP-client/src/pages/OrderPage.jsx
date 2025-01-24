import { useEffect, useState } from "react";
import "../assets/styles/global.css";
import OrderCard from "../components/OrderCard";
import { baseURLApi } from "../helpers/http-client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await baseURLApi.get("/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setOrders(data); // Set the orders data
        console.log("🚀 ~ OrderPage ~ orders:", data); // Log the data directly
      } catch (err) {
        console.log("🚀 ~ fetchOrders ~ err:", err);
        toast.error("Failed to fetch Orders");
      }
    };

    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h2>No order has been made.</h2>
        <div className="card-footer text-center">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/products")}
          >
            Back to Home Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="vh-100 gradient-custom-2">
      <div className="container py-5 h-100">
        <h3 style={{ marginBottom: "20px" }}>My Orders</h3>
        {/* <div className="row d-flex justify-content-center align-items-center h-100"> */}
        <div className="col-md-10 col-lg-8 col-xl-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={{
                id: order.id,
                UserId: order.UserId,
                transactionId: order.transactionId,
                orderId: order.orderId,
                grossAmount: order.grossAmount,
                paymentType: order.paymentType,
                transactionStatus: order.transactionStatus,
                transactionTime: order.transactionTime,
              }}
            />
          ))}
        </div>
        {/* </div> */}
      </div>
    </section>
  );
}
