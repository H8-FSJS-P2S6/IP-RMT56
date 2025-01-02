import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useState } from "react";

export default function Cart({ product, onUpdate, onDelete }) {
  const [quantity, setQuantity] = useState(product.quantity);

  // Handle increment
  const handleIncrement = () => {
    if (quantity < product.stock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onUpdate(product.id, newQuantity); // Update cart quantity on server
    }
  };

  // Handle decrement
  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdate(product.id, newQuantity); // Update cart quantity on server
    } else {
      onDelete(product.id); // Delete the cart item if quantity reaches 0
    }
  };

  // Handle trash button
  const handleTrash = () => {
    onDelete(product.id); // Delete the cart item
  };
  // Calculate total price for the product
  const totalPrice = product.price * quantity;

  return (
    <MDBCard className="rounded-3 mb-4">
      <MDBCardBody className="p-4">
        <MDBRow className="justify-content-between align-items-center">
          <MDBCol md="2" lg="2" xl="2">
            <MDBCardImage
              className="rounded-3"
              fluid
              src={product.imgUrl}
              alt={product.name}
            />
          </MDBCol>
          <MDBCol md="3" lg="3" xl="3">
            <p className="lead fw-normal mb-2">{product.name}</p>
          </MDBCol>
          <MDBCol
            md="3"
            lg="3"
            xl="2"
            className="d-flex align-items-center justify-content-around"
          >
            <button
              color="link"
              style={{ width: "100px" }}
              className="px-2"
              onClick={handleDecrement}
              disabled={quantity <= 0}
            >
              -
            </button>

            <MDBInput
              style={{ alignItems: "center", width: "50px" }}
              min={0}
              value={quantity}
              type="number"
              size="sm"
              disabled
            />

            <button
              // color="link"
              style={{ width: "100px" }}
              className="px-2"
              onClick={handleIncrement}
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </MDBCol>
          <MDBCol md="3" lg="2" xl="2" className="text-center">
            <MDBTypography tag="h6" className="mb-0">
              {product.price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </MDBTypography>
            <small className="text-muted">Price per item</small>
          </MDBCol>

          <MDBCol md="3" lg="2" xl="2" className="text-center">
            <MDBTypography tag="h6" className="mb-0">
              {totalPrice.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </MDBTypography>
            <small className="text-muted">Total</small>
          </MDBCol>

          <MDBCol md="1" lg="1" xl="1" className="text-end">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleTrash}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
              </svg>
            </button>
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  );
}
