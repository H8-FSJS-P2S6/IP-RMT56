import { useLocation, useNavigate } from "react-router";

export default function OrderDetailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log("🚀 ~ OrderDetailPage ~ state:", state);

  // Check if state or orderDetails exist to prevent crashes
  const orderDetails = state?.orderDetails;

  if (!orderDetails) {
    return (
      <div className="container text-center mt-5">
        <h2>No order details available</h2>
      </div>
    );
  }

  // Calculate the total price
  const totalPrice = orderDetails.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white text-center">
          <h2>Order Details</h2>
        </div>
        <div className="card-body">
          <p>
            <strong>Order ID:</strong> {orderDetails[0].OrderId}
          </p>
          <h3 className="mt-4">Products in Order:</h3>

          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price (IDR)</th>
                <th>Total (IDR)</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.Product.name}</td>
                  <td>{product.quantity}</td>
                  <td>
                    {product.price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                  <td>
                    {(product.price * product.quantity).toLocaleString(
                      "id-ID",
                      {
                        style: "currency",
                        currency: "IDR",
                      }
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="text-end">
                  <strong>Total Price:</strong>
                </td>
                <td>
                  <strong>
                    {totalPrice.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="card-footer text-center">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
}
