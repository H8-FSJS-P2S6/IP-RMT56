import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import Cart from "../components/Cart";
import { toast } from "react-toastify";
import { baseURLApi } from "../helpers/http-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Assuming the user is stored as an object
  const userId = user?.id; // Safely access the user ID
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data } = await baseURLApi.get(`/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        // console.log("🚀 ~ fetchCartItems ~ data:", data);
        setCartItems(data);
      } catch (err) {
        console.log("🚀 ~ fetchCartItems ~ err:", err);
        toast.error(`Failed to fetch cart items`);
      }
    };

    fetchCartItems();
  }, []);

  // Update cart item quantity
  const handleUpdateCart = async (productId, newQuantity) => {
    try {
      await baseURLApi.put(
        `/cart/${productId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.Product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );

        // Recalculate total price immediately
        const newTotalPrice = updatedItems.reduce(
          (sum, item) =>
            sum + (item.Product?.price || 0) * (item.quantity || 0),
          0
        );
        setTotalPrice(newTotalPrice);

        return updatedItems;
      });
    } catch (err) {
      console.error("Error updating cart item", err);
      toast.error("Failed to update cart item");
    }
  };

  // Delete cart item
  const handleDeleteCart = async (cartItemId) => {
    try {
      await baseURLApi.delete(`/cart/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartItemId)
      );
      toast.success("Item deleted successfully");
    } catch (err) {
      console.error("Error deleting cart item", err);
      toast.error("Failed to delete cart item");
    }
  };

  // Calculate total price
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + (item.Product?.price || 0) * (item.quantity || 0),
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handlePay = async () => {
    try {
      const { data } = await baseURLApi.post(
        "/generate-midtrans-token",
        {
          totalAmount: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      //   console.log("🚀 ~ handlePay ~ data:", data);

      // Trigger snap popup. @TODO: Replace TRANSACTION_TOKEN_HERE with your transaction token
      window.snap.pay(data.token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          toast.success("payment success!");
          handleCreateOrder(result);
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          toast.error("wating your payment!");
          console.log(result);
        },
        onError: function (result) {
          /* You may add your own implementation here */
          toast.error("payment failed!");
          console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          toast.error("you closed the popup without finishing the payment");
        },
      });
    } catch (error) {
      console.log("🚀 ~ handlePay ~ error:", error);
      toast.error("Failed to initialize payment");
    }
  };

  const handleCreateOrder = async (transactionDetails) => {
    console.log(
      "🚀 ~ handleCreateOrder ~ transactionDetails:",
      transactionDetails
    );
    try {
      const response = await baseURLApi.post(
        "/orders",
        { transactionDetails, UserId: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success("Order created successfully!");
      await clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Failed to create order!");
    }
  };

  const clearCart = async () => {
    try {
      await baseURLApi.delete("/cart/clear", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setCartItems([]); // Clear local cart items
      toast.success("Cart cleared successfully!");
    } catch (err) {
      console.error("Error clearing cart", err);
      toast.error("Failed to clear cart");
    }
  };
  return (
    <section className="h-100" style={{ backgroundColor: "#eee" }}>
      {/* Snap Embed Container */}
      <div
        id="snap-container"
        style={{ marginTop: "20px", paddingLeft: "200px" }}
      ></div>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol md="10">
            <div className="d-flex justify-content-center align-items-center mb-4">
              <MDBTypography
                tag="h3"
                className="fw-normal mb-0 text-black text-center"
              >
                Shopping Cart
              </MDBTypography>
            </div>

            {cartItems.length > 0 ? (
              cartItems.map((cartItem) => (
                <Cart
                  key={cartItem.id}
                  product={{
                    id: cartItem.Product.id,
                    price: cartItem.Product.price,
                    stock: cartItem.Product.stock,
                    name: cartItem.Product.name,
                    imgUrl: cartItem.Product.imgUrl,
                    categoryId: cartItem.Product.CategoryId,
                    quantity: cartItem.quantity,
                  }}
                  onUpdate={handleUpdateCart}
                  onDelete={() => handleDeleteCart(cartItem.id)}
                />
              ))
            ) : (
              <MDBTypography tag="h5" className="text-center">
                Your cart is empty.
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate("/products")}
                >
                  Back to Homepage
                </button>
              </MDBTypography>
            )}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBTypography tag="h5" className="mt-3">
            Total Price:{" "}
            {totalPrice.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </MDBTypography>
        </MDBRow>
        {totalPrice > 0 && (
          <MDBRow>
            <button onClick={handlePay}>Pay</button>
          </MDBRow>
        )}
      </MDBContainer>
    </section>
  );
}
