import { useState } from "react";
import ProfileModal from "./ProfileModal";
import { NavLink, useNavigate } from "react-router";

export default function Navbar({ isCartPage, isRecommendationPage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate()

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    };
    
    const handleLogout = () => {
      try {
        localStorage.removeItem("access_token");
        navigate("/login");
      } catch (error) {
        console.log("handleLogin error:", error);
      }
    };

  if (isCartPage) {
    return (
      <nav className="bg-orange-200 px-6 py-4 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gray-800">Your Guitar</h1>
          <NavLink to="/recommend" className="text-gray-800 font-medium text-xl hover:bg-orange-300 rounded py-1 px-2">
            Recommendation with AI
          </NavLink>
        </div>
      </nav>
    );
  }

  if (isRecommendationPage) {
    return (
      <nav className="bg-orange-200 px-6 py-4 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gray-800">Your Guitar</h1>
          <NavLink to="/cart" className="text-gray-800 font-medium text-xl hover:bg-orange-300 rounded py-1 px-2">
            Cart
          </NavLink>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-orange-200 px-6 py-4 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gray-800">Your Guitar</h1>
          <NavLink to="/cart" className="text-gray-800 font-medium text-xl hover:bg-orange-300 rounded py-1 px-2">
            Cart
          </NavLink>
          <NavLink to="/recommend" className="text-gray-800 font-medium text-xl hover:bg-orange-300 rounded py-1 px-2">
            Recommendation with AI
          </NavLink>
        </div>
        {/* Right Section */}
        <div className="flex items-center gap-10">
          <button
            id="profileButton"
            onClick={() => setIsModalOpen(true)}
            className="text-gray-800 font-medium text-xl hover:bg-orange-300 rounded py-1 px-2"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
