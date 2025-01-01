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
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data } = await baseURLApi.get(`/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        console.log("🚀 ~ fetchCartItems ~ data:", data);
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
  return (
    <section className="h-100" style={{ backgroundColor: "#eee" }}>
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
      </MDBContainer>
    </section>
  );
}
