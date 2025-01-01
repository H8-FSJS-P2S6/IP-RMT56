import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { baseURLApi } from "../../helpers/http-client";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "../../assets/styles/global.css";

export default function DetailProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await baseURLApi.get(`/products/${productId}`);
        setProduct(data.data);
      } catch (err) {
        console.log("🚀 ~ fetchCategories ~ err:", err);
        toast.error(`Failed to fetch Products`);
      }
    };

    fetchProduct();
  }, [productId]);

  const DescriptionWithReadMore = ({ description }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 300;

    return (
      <div>
        {description.length > maxLength && !isExpanded ? (
          <>
            {description.substring(0, maxLength)}...
            <button
              className="btn btn-link p-0"
              onClick={() => setIsExpanded(true)}
            >
              Read More
            </button>
          </>
        ) : (
          <>
            {description}
            {description.length > maxLength && (
              <button
                className="btn btn-link p-0"
                onClick={() => setIsExpanded(false)}
              >
                Read Less
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  DescriptionWithReadMore.propTypes = {
    description: PropTypes.string.isRequired,
  };
  return (
    <>
      <section
        className="col-md-9 ms-sm-auto col-lg-10 px-md-4"
        id="detail-product-section"
      >
        <button
          data-variant="subtle"
          data-size="xl"
          type="button"
          aria-label="Button Back"
          style={{
            position: "absolute",
            top: "1%",
            left: "1%",
          }}
          onClick={() => navigate("/pub/products")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="tabler-icon tabler-icon-arrow-left"
            style={{ width: "70%", height: "70%" }}
          >
            <path d="M5 12l14 0" />
            <path d="M5 12l6 6" />
            <path d="M5 12l6 -6" />
          </svg>{" "}
          Back
        </button>
        <div className="row">
          <div className="col-12 col-md-12"></div>
          <h3
            style={{
              fontWeight: "700",
              textTransform: "uppercase",
              marginBottom: "20px",
              paddingTop: "2%",
            }}
          >
            Product Details
          </h3>
          <p
            style={{
              fontWeight: "900",
              textTransform: "uppercase",
            }}
          >
            {product.name}
          </p>
          <img
            src={product.imgUrl}
            style={{
              height: "300px",
              width: "auto",
              marginBottom: "20px",
            }}
            alt={product.name}
          />

          <div
            style={{
              float: "center",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <span>Category: {product.Category?.name}</span> ||{" "}
              <span>
                Price: Rp
                {product.price ? product.price.toLocaleString() : "N/A"}
              </span>{" "}
              || <span>Stock: {product.stock}</span> ||{" "}
              <span>Added by: {product.User?.email}</span>{" "}
            </div>
            <div
              style={{
                marginBottom: "20px",
                maxWidth: "calc(37.5rem * var(--mantine-scale))",
                whiteSpace: "pre-line",
              }}
            >
              <h4>Product Description</h4>
              <DescriptionWithReadMore
                description={product.description || ""}
              />
            </div>

            <div data-size="sm" id="mantine-u38l00kmm" style={{}}></div>
          </div>

          <div data-portal="true">
            <div style={{}}>
              <div />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
