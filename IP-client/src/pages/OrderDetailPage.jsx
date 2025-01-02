import { useLocation } from "react-router";

export default function OrderDetailPage() {
  const { state } = useLocation();
  const orderDetails = state ? state.orderDetails : null;

  return (
    <div>
      <h1>Order Details</h1>
      {orderDetails ? (
        <div>
          <p>Order ID: {orderDetails.orderId}</p>
          <p>Transaction Status: {orderDetails.transactionStatus}</p>
          <p>Payment Status: {orderDetails.paymentStatus}</p>

          <h3>Products in Order:</h3>
          <ul>
            {orderDetails.products && orderDetails.products.length > 0 ? (
              orderDetails.products.map((product, index) => (
                <li key={index}>
                  <p>Product Name: {product.productName}</p>
                  <p>Price: ${product.productPrice}</p>
                </li>
              ))
            ) : (
              <p>No products found for this order.</p>
            )}
          </ul>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
}
