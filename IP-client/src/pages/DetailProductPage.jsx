import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { baseURLApi } from "../helpers/http-client";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "../assets/styles/global.css";

export default function DetailProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({});
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await baseURLApi.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.log("🚀 ~ fetchCategories ~ err:", err);
        toast.error(`Failed to fetch Products`);
      }
    };

    fetchProduct();
  }, [id]);

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
              display: "block", // Ensures that the image behaves like a block element
              marginLeft: "auto", // Automatically calculate left margin to center
              marginRight: "auto", // Automatically calculate right margin to center
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
              || <span>Stock: {product.stock}</span>
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
