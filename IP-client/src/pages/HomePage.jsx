import { useEffect, useState } from "react";
import { baseURLApi } from "../helpers/http-client";
import Card from "../components/Card";
import { toast } from "react-toastify";
import "../assets/styles/global.css";
import { useNavigate } from "react-router";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("ASC");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await baseURLApi.get("/categories");
        setCategories(data);
      } catch (err) {
        console.log("🚀 ~ fetchCategories ~ err:", err);
        toast.error(`Failed to fetch Categories`);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await baseURLApi.get(`/products`, {
          params: {
            q: searchQuery,
            category: selectedCategory,
            sort,
            limit,
            page,
          },
        });
        setProducts(data.data);
        setCount(data.totalProducts);
      } catch (err) {
        console.log("🚀 ~ fetchProducts ~ err:", err);
        toast.error(`Failed to fetch Products`);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, sort, page, limit]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  // Handle limit input change
  const handleLimitChange = (event) => {
    const newLimit = Number(event.target.value);
    if (newLimit >= 4 && newLimit <= 12) {
      setLimit(newLimit);
    }
  };
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleNextPage = () => {
    if (page * limit < count) {
      setPage((prevPage) => prevPage + 1);
    } else if (page * limit >= count) {
      // If the current page exceeds the number of products, adjust to last valid page
      setPage(Math.ceil(count / limit));
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await baseURLApi.post(
        `/cart/${productId}`,
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      ); // Add with quantity of 1
      toast.success("Item added to cart");
      navigate("/cart");
    } catch (err) {
      console.error("Error adding item to cart", err);
    }
  };

  return (
    <section className="container-fluid" id="home-section">
      <div className="row">
        {/* Product Section */}

        <section
          className="col-md-9 ms-sm-auto col-lg-10 px-md-4"
          id="product-section"
        >
          <div style={{ paddingTop: "5%" }}>
            {/* Search Bar */}
            <div style={{ display: "flex", gap: "20px", width: "100%" }}>
              <div style={{ flex: "1" }}>
                <h5>Search Product Name:</h5>
                <div className="d-flex mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              <div style={{ flex: "1" }}>
                <div className="mb-3">
                  <h5>Select Category:</h5>
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Limit Input Field */}
            <div className="mb-3">
              <small className="form-text text-muted">
                Results in {count} products
              </small>
            </div>

            <div style={{ display: "flex", gap: "20px", width: "100%" }}>
              <div style={{ flex: "1" }}>
                {/* Sort Dropdown */}
                <div className="mb-3">
                  <h5>Sort By:</h5>
                  <select
                    className="form-select"
                    value={sort}
                    onChange={handleSortChange}
                  >
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                  </select>
                </div>
              </div>

              <div style={{ flex: "1" }}>
                <label htmlFor="limit" className="form-label">
                  Showing per page is
                </label>
                <input
                  type="number"
                  id="limit"
                  className="form-control"
                  value={limit}
                  onChange={handleLimitChange}
                  min="4"
                  max="12"
                  placeholder="Enter a number between 4 and 12"
                />
              </div>
            </div>

            {/* Product Cards */}
            <div
              className="d-flex gap-3 flex-wrap"
              style={{
                justifyContent: "center", // Centers the cards horizontally
                alignItems: "center", // Optionally, centers them vertically if needed
                marginTop: "20px", // Optional: Adjust spacing from other content
              }}
            >
              {products.map((product) => (
                <Card
                  key={product.id}
                  product={{
                    id: product.id,
                    price: product.price,
                    stock: product.stock,
                    name: product.name,
                    imgUrl: product.imgUrl,
                    category: product.Category.name,
                  }}
                  onAdd={() => handleAddToCart(product.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button onClick={handlePreviousPage} disabled={page === 1}>
                Previous
              </button>
              <span> Page {page} </span>
              <button onClick={handleNextPage} disabled={page * limit >= count}>
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
