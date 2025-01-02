import { useEffect, useState } from "react";
import "../assets/styles/global.css";
import OrderCard from "../components/OrderCard";
import { baseURLApi } from "../helpers/http-client";
import { toast } from "react-toastify";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);

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

  return (
    <section className="vh-100 gradient-custom-2">
      <div className="container py-5 h-100">
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
