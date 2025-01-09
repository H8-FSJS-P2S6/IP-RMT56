import { useNavigate } from "react-router";
import { baseURLApi } from "../helpers/http-client";
import { useState } from "react";

export default function OrderCard(order) {
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState("");

  const fetchOrderDetails = async (orderId) => {
    console.log("🚀 ~ fetchOrderDetails ~ orderId:", orderId);
    try {
      const response = await baseURLApi.get(`orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      navigate(`/orders/${orderId}`, {
        state: { orderDetails: response.data },
      });
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000); // Clear the "Copied!" message after 2 seconds
      })
      .catch(() => setCopySuccess("Failed to copy"));
  };
  return (
    <div
      className="card card-stepper"
      style={{ borderRadius: 16, width: "100vh", marginBottom: "20px" }}
    >
      <div className="card-header p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div style={{ textAlign: "left" }}>
            <p className="text-muted mb-2">
              Order ID{" "}
              <span className="fw-bold text-body">{order.order.orderId}</span>
              <button
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={() => handleCopy(order.order.orderId)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-copy"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                  />
                </svg>
              </button>
            </p>
            <p className="text-muted mb-2">
              Transaction ID{" "}
              <span className="fw-bold text-body">
                {order.order.transactionId}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={() => handleCopy(order.order.transactionId)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-copy"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                  />
                </svg>
              </button>
            </p>
            <p className="text-muted mb-2">
              Place On{" "}
              <span className="fw-bold text-body">
                {new Date(order.order.transactionTime)
                  .toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })
                  .replace(",", "")}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={() => handleCopy(order.order.transactionTime)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-copy"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                  />
                </svg>
              </button>
            </p>
            <p className="text-muted mb-2">
              Total Amount{" "}
              <span className="fw-bold text-body">
                {order.order.grossAmount.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={() =>
                  handleCopy(
                    order.order.grossAmount.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-copy"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                  />
                </svg>
              </button>
            </p>
            <p className="text-muted mb-2">
              Payment Method{" "}
              <span className="fw-bold text-body">
                {order.order.paymentType.toUpperCase().replace(/_/g, " ")}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={() =>
                  handleCopy(
                    order.order.paymentType.toUpperCase().replace(/_/g, " ")
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-copy"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                  />
                </svg>
              </button>
            </p>
          </div>
          <div>
            <h6 className="mb-0" style={{ textAlign: "right" }}>
              <button onClick={() => fetchOrderDetails(order.order.id)}>
                View Details
              </button>
            </h6>
          </div>
          {copySuccess && <p className="text-success">{copySuccess}</p>}
        </div>
      </div>

      {/* <div className="card-footer p-4">
        <div className="d-flex justify-content-center">
          <div className="border-start h-100" />
          <h5 className="fw-normal mb-0">
            <a href="#!" style={{ textAlign: "center" }}>
              Cancel
            </a>
          </h5>
          <div className="border-start h-100" />
          <h5 className="fw-normal mb-0">
            <a href="#!" className="text-muted">
              <i className="fas fa-ellipsis-v" />
            </a>
          </h5>
        </div>
      </div> */}
    </div>
  );
}
