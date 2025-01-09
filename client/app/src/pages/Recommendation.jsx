import { NavLink } from "react-router";
import Navbar from "../components/Navbar";
import { p2Api } from "../helpers/http-client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import formatterRp from "../helpers/FormatRp";

export default function Recommendation() {
  const [recommend, setRecommend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const accessToken = localStorage.getItem("access_token");

  const fetchRecommend = async () => {
    setLoading(true);
    try {
      const response = await p2Api.get("/products/recommendation", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setRecommend(response.data);
    } catch (error) {
      console.error("Error fetching recommend:", error);
      // console.log(errorMessage);
    }
    setLoading(false); 
  };

  const fetchCartItems = async () => {
    try {
      const response = await p2Api.get("/cart", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("tes isi:",response.data);
      setCartItems(response.data); // Menyimpan cart items
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };

  const handleAddToCart = async (productId) => {
    setLoading(true);
    try {
      const response = await p2Api.post(
        "/cart",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      await fetchCartItems(); // Refresh seluruh data keranjang
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
    setLoading(false);
  };

  const isProductInCart = (productId) => {
    try {
      return cartItems.some((item) => {
        // console.log("Item in cart:", item);
        return item.productId === productId;
      });
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    fetchRecommend();
    fetchCartItems();
  }, []);
  return (
    <>
      {/* Navbar */}
      <Navbar isRecommendationPage={true} />
      {/* Recommendation Section */}
      <div className="px-10 py-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Recommendation with AI
        </h2>
  
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin h-10 w-10 border-4 border-sky-300 border-t-transparent rounded-full"></div>
          </div>
        )}
  
        {/* Product Cards or No Products Found */}
        {/* Card List */}
        {recommend.length > 0 ? (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 px-10">
            {recommend.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-md overflow-hidden flex flex-col p-2"
              >
                <img
                  src={product.imgUrl}
                  alt={product.name}
                  className="w-full h-52 object-fill rounded-md"
                />
                <div className="px-4 py-3 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800 h-7 overflow-y-auto">
                    {product.name}
                  </h2>
                  <p className="text-sm font-semibold text-gray-600">
                    {product.brand}
                  </p>
                  <p className="text-sm text-gray-600">{product.type}</p>
                  <p className="text-lg font-bold text-gray-800">
                    {formatterRp.format(product.price)}
                  </p>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={isProductInCart(product.id)}
                  className={`w-full mt-auto py-2 rounded-md ${
                    isProductInCart(product.id)
                      ? "bg-sky-300 text-white"
                      : "bg-sky-700 text-white hover:bg-sky-600"
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          (!loading && (
            <div className="text-center py-[166px] text-xl font-semibold text-gray-600">
              Product not found
            </div>
          ))
        )}
  
        {!loading && (
          <div className="flex justify-start ml-6 mt-5">
            <NavLink
              to="/"
              className="bg-sky-700 text-white px-6 py-3 rounded-md hover:bg-sky-600"
            >
              Back to Home
            </NavLink>
          </div>
        )}
      </div>
    </>
  );
  
}
