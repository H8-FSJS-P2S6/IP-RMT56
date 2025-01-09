import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import banner from "../assets/banner.png";
import Navbar from "../components/Navbar";
import { addToCart, fetchCartItems } from "../features/cartSlice";
import { fetchProducts } from "../features/productSlice";
import formatterRp from "../helpers/FormatRp";

export default function Homepage() {
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    dispatch(
      fetchProducts({ q: searchQuery, brand: brandFilter, type: typeFilter })
    );
  }, [searchQuery, brandFilter, typeFilter, dispatch]);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleAddToCart = (productId) => {
    dispatch(addToCart(productId));
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

  return (
    <>
      <Navbar />
      <div className="w-full h-[22rem] bg-gray-200 flex items-center justify-center">
        <img src={banner} alt="Banner" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between px-12 py-6">
        <input
          type="text"
          placeholder="Search"
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md mb-4 md:mb-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-4">
          <select
            className="border border-gray-300 rounded-md p-2 pr-4"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="">Filter by Brand</option>
            <option value="ibanez">Ibanez</option>
            <option value="gibson">Gibson</option>
            <option value="squier">Squier</option>
            <option value="fender">Fender</option>
            <option value="rickenbacker">Rickenbacker</option>
            <option value="taylor">Taylor Guitars</option>
            <option value="prs">PRS Guitars</option>
          </select>
          <select
            className="border border-gray-300 rounded-md p-2 pr-4"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Filter by Type</option>
            <option value="acoustic">Acoustic</option>
            <option value="electric">Electric</option>
            <option value="bass">Bass</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin h-10 w-10 border-4 border-sky-300 border-t-transparent rounded-full"></div>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-20 text-xl font-semibold text-gray-600">
          Product not found
        </div>
      )}

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 px-10">
        {products.map((product) => (
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
    </>
  );
}
