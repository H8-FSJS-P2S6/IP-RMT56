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

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

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
  return (
    <section className="h-100" style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol md="10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <MDBTypography tag="h3" className="fw-normal mb-0 text-black">
                Shopping Cart
              </MDBTypography>
              <div>
                <p className="mb-0">
                  <span className="text-muted">Sort by:</span>
                  <a href="#!" className="text-body">
                    price <i className="fas fa-angle-down mt-1"></i>
                  </a>
                </p>
              </div>
            </div>

            {cartItems.length > 0 ? (
              cartItems.map((cartItem) => (
                <Cart
                  key={cartItem.id}
                  product={{
                    id: cartItem.Product.id,
                    price: cartItem.Product.price, // Assuming cart item has a 'Product' field
                    stock: cartItem.Product.stock,
                    name: cartItem.Product.name,
                    imgUrl: cartItem.Product.imgUrl,
                    categoryId: cartItem.Product.CategoryId,
                    quantity: cartItem.quantity, // Assuming the cart item stores quantity
                  }}
                />
              ))
            ) : (
              <MDBTypography tag="h5" className="text-center">
                Your cart is empty.
              </MDBTypography>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
