import { useEffect, useState } from "react";
import { p2Api } from "../helpers/http-client";
import { toast } from "react-toastify";

export default function ProfileModal({ isOpen, onClose }) {
  const [profile, setProfile] = useState(null); // To store profile data
  const [isLoading, setIsLoading] = useState(false); // To track loading state
  const [preferences, setPreferences] = useState({
    brand: '',
    type: '',
    minPrice: '',
    maxPrice: ''
  });
  const accessToken = localStorage.getItem('access_token'); // Access token for authorization

  useEffect(() => {
    if (isOpen) {
      // Disable scrolling when modal is open
      document.body.style.overflow = 'hidden';
      
      // Fetch profile data when modal opens
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const { data } = await p2Api.get('/profile', {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Passing access token
            },
          });
          setProfile(data); // Save profile data
          console.log(data);
  
          // Initialize state with profile preferences
          setPreferences({
            brand: data.brand || '',
            type: data.type || '',
            minPrice: data.price_range?.min_price || '',
            maxPrice: data.price_range?.max_price || '',
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
        } 
        setIsLoading(false); // Turn off loading spinner once data is fetched
      };
  
      fetchProfile();
    } else {
      // Enable scrolling when modal is closed
      document.body.style.overflow = 'auto';
    }
  
    // Cleanup to enable scrolling when component is unmounted or modal closes
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);  // Fetch profile only when modal is open

  // Generalized input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdatePreferences = async () => {
    setIsLoading(true);
    try {
      const response = await p2Api.put(
        '/profile/preference',
        {
          brand: preferences.brand,
          type: preferences.type,
          price_range: {
            min_price: preferences.minPrice,
            max_price: preferences.maxPrice,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Passing access token for authorization
          },
        }
      );

      // Display success message
      toast.success(response.data.message);
      console.log('Preference updated successfully:', response.data);
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating preferences:', error);
      const errorMessage = error.response.data.message;
      // console.log(errorMessage);
      toast.error(errorMessage)
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg px-6 py-4 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Profile</h2>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin h-10 w-10 border-4 border-sky-300 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="text-gray-800 bg-slate-100 rounded-md p-2">
                {profile?.name || 'Not Provided'}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-800 bg-slate-100 rounded-md p-2">
                {profile?.email || 'Not Provided'}
              </p>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Preference</h3>
            <div className="mb-4">
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <select
                id="brand"
                name="brand"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={preferences.brand}
                onChange={handleChange} // Using generalized handler
              >
                <option value="">Select Brand</option>
                <option value="ibanez">Ibanez</option>
                <option value="gibson">Gibson</option>
                <option value="squier">Squier</option>
                <option value="fender">Fender</option>
                <option value="rickenbacker">Rickenbacker</option>
                <option value="taylor">Taylor Guitars</option>
                <option value="prs">PRS Guitars</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                name="type"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={preferences.type}
                onChange={handleChange} // Using generalized handler
              >
                <option value="">Select Type</option>
                <option value="acoustic">Acoustic</option>
                <option value="electric">Electric</option>
                <option value="bass">Bass</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="min-price" className="block text-sm font-medium text-gray-700">
                Min Price
              </label>
              <input
                type="number"
                id="min-price"
                name="minPrice"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={preferences.minPrice}
                onChange={handleChange} // Using generalized handler
              />
            </div>
            <div className="mb-4">
              <label htmlFor="max-price" className="block text-sm font-medium text-gray-700">
                Max Price
              </label>
              <input
                type="number"
                id="max-price"
                name="maxPrice"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={preferences.maxPrice}
                onChange={handleChange} // Using generalized handler
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePreferences}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}