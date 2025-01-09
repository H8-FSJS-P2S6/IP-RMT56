import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import Navbar from "../components/Navbar";
import { p2Api } from "../helpers/http-client";
import formatterRp from "../helpers/FormatRp";
import { toast } from "react-toastify";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await p2Api.get("/cart", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCartItems(response.data); // Mengatur data produk ke state
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleDelete = async (itemId) => {
    setLoading(true);
    try {
      const { data } = await p2Api.delete(`/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(data.message);
      // Hapus item dari cartItems setelah berhasil dihapus
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      toast.success(data.message);
    } catch (error) {
      console.error("Error deleting item from cart", error);
    }
    setLoading(false);
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Jangan izinkan quantity kurang dari 1

    setLoading(true);
    try {
      // Kirim permintaan untuk memperbarui kuantitas
      await p2Api.put(
        `/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update item di state dengan harga per unit tetap
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity, // Hanya update kuantitas
            }
          : item
      );

      setCartItems(updatedCartItems); // Perbarui cartItems di state
    } catch (error) {
      console.error("Error updating quantity", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar isCartPage={true} />

      {/* Cart Section */}
      <div className="px-10 py-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 ml-5">
          My Cart
        </h2>
        {/* Loading Spinner */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin h-10 w-10 border-4 border-sky-300 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Card List */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {cartItems.length > 0 ? (
            cartItems.map((cartItem) => (
              <div
                key={cartItem.id}
                className="bg-white shadow-md rounded-md overflow-hidden p-1 "
              >
                <img
                  src={cartItem.Product.imgUrl}
                  alt={cartItem.Product.name}
                  className="w-full h-52 object-fill rounded-md"
                />
                <div className="p-3">
                  <h2 className="text-lg font-semibold text-gray-800 h-7 overflow-y-auto">
                    {cartItem.Product.name}
                  </h2>
                  <p className="text-sm font-medium text-gray-600">
                    {cartItem.Product.brand}
                  </p>
                  <p className="text-sm text-gray-600">
                    {cartItem.Product.type}
                  </p>
                  <p className="text-lg font-semibold text-gray-800 ">
                    {formatterRp.format(
                      cartItem.Product.price * cartItem.quantity
                    )}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(cartItem.id, cartItem.quantity - 1)
                      }
                      className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 focus:outline-none"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(cartItem.id, cartItem.quantity + 1)
                      }
                      className="bg-green-500 text-black py-2 px-6 rounded-md hover:bg-green-600 focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(cartItem.id)}
                    className="w-full bg-red-600 text-white mt-2 py-2 rounded-md hover:bg-red-500 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            (!loading &&  (
              <div className="flex justify-center items-center h-80 col-span-4">
                <span className="text-center py-20 text-xl font-semibold text-gray-600">
                  Your cart is empty
                </span>
              </div>
            ))
          )}
        </div>

        {!loading && (
          <div className="flex justify-start mt-3 ml-6">
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
