import PropTypes from "prop-types";
import { useNavigate } from "react-router";
export default function Card({ product }) {
  const navigate = useNavigate();
  return (
    <div
      className="card"
      style={{
        width: "270px", // Fixed width for the card
        height: "450px", // Fixed height for the card
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Ensures space is distributed correctly
        overflow: "hidden",
        position: "relative", // Position the elements inside the card relative to this container
      }}
    >
      <img
        src={product.imgUrl}
        className="card-img-top"
        alt={product.name}
        style={{
          width: "100%", // Ensures the image takes up the full width of the card
          height: "200px", // Fixed height for the image
          objectFit: "contain", // Ensures the entire image is visible, maintaining its aspect ratio
          backgroundColor: "#f3f3f3", // Fallback background color to avoid empty space if the image doesn't fill the container
        }}
      />
      <div
        className="card-body d-flex flex-column"
        style={{
          padding: "10px", // Add padding for spacing
          flexGrow: 1, // Ensures the body section grows to fill space
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Distribute content evenly
        }}
      >
        <h5
          className="card-title fs-6"
          style={{ marginBottom: "10px", flexGrow: 1 }}
        >
          {product.name}
        </h5>
        <h6
          className="card-title fs-6"
          style={{
            fontWeight: "bold",
            marginBottom: "auto", // Ensures price stays above the button
            flexGrow: 1, // This will make sure the price grows to fill space and stays aligned
          }}
        >
          {product.price.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </h6>

        <button
          className="btn btn-primary"
          style={{
            alignSelf: "center", // Centers the button horizontally
            padding: "5px 10px", // Adjusts the button padding for better spacing
          }}
          onClick={() => navigate(`/pub/products/${product.id}`)}
        >
          See Detail
        </button>
      </div>
    </div>
  );
}

Card.propTypes = {
  product: PropTypes.exact({
    id: PropTypes.number,
    name: PropTypes.string,
    imgUrl: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.number,
    stock: PropTypes.number,
    description: PropTypes.string,
  }),
};
