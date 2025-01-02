import { useState } from "react";
import { api } from "../helpers/http-client";

import Swal from "sweetalert2";
import { useNavigate } from "react-router";

function EditProfile() {
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("profile"))
  );

  const navigate = useNavigate();

  const editProfile = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are all data correct?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.put(
            `/ip/profile`,
            {
              name: profile.name,
              age: profile.age,
              personalHistory: profile.personalHistory,
              familyHistory: profile.familyHistory,
              foodAllergy: profile.foodAllergy,
              drugAllergy: profile.drugAllergy,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
          console.log(response.data);
          Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "Your profile has been updated successfully.",
          });
          navigate("/profile");
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Failed to update profile",
            text: `${error.response.data.message}`,
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-600 to-teal-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Hi, <span className="text-teal-600">{profile.name}!</span> <br />{" "}
          <span className="text-gray-400 text-lg">Edit Your Profile</span>{" "}
        </h2>
        <form className="space-y-6" onSubmit={editProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your age"
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal History
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
              placeholder="Enter your personal medical history or current symptoms"
              value={profile.personalHistory}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  personalHistory: e.target.value,
                })
              }></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Family History
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
              placeholder="Enter your family medical history"
              value={profile.familyHistory}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  familyHistory: e.target.value,
                })
              }></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Food Allergy
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
              placeholder="List any food allergies"
              value={profile.foodAllergy}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  foodAllergy: e.target.value,
                })
              }></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Drug Allergy
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
              placeholder="List any drug allergies"
              value={profile.drugAllergy}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  drugAllergy: e.target.value,
                })
              }></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-teal-400 hover:text-white active:bg-teal-400 transition duration-300 shadow-lg hover:shadow-xl">
            Edit Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;