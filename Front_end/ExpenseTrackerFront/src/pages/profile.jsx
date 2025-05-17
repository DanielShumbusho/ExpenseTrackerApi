import React, { useEffect, useState } from "react";
import Sidebar from "../uiComponents/Sidebar";
import Footer from "../uiComponents/Footer";
import axios from "axios";
import { useUser } from "../hooks/userHook";
import { toast } from "react-toastify";

export default function Profile() {
  const { userId } = useUser();
  const sessionUser = JSON.parse(sessionStorage.getItem("credential"));
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // new field
  });

  // Fetch user info
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8080/users/${userId}`)
        .then((res) => {
          setUserInfo(res.data);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            password: "", // don't pre-fill password
          });
        })
        .catch((err) => {
          console.error("Failed to fetch user profile:", err);
          toast.error("Error loading profile.");
        });
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required.");
      return;
    }

    // Ensure password is always included (even if empty string, as per backend requirement)
    const requestBody = {
      name: formData.name,
      email: formData.email,
      password: formData.password || "", // send empty string if not changing
    };

    axios
      .put(`http://localhost:8080/users/${userId}`, requestBody)
      .then((res) => {
        setUserInfo(res.data);
        setEditMode(false);
        setFormData((prev) => ({ ...prev, password: "" })); // clear password field after update
        toast.success("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Failed to update profile:", err);
        toast.error("Failed to update profile.");
      });
  };

  return (
    <div className="grid grid-cols-20 grid-rows-20 h-[100vh]">
      <Sidebar />
      <main className="row-span-19 col-span-17 bg-blue-50 p-6 overflow-auto">
        <h2 className="text-2xl font-semibold text-black mb-2">User Profile</h2>
        <h1 className="text-3xl font-bold text-black mb-6">
          Welcome, {sessionUser?.name || "User"}!
        </h1>

        <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
          {userInfo ? (
            <>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-700">
                  Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 text-black border border-gray-300 rounded"
                  />
                ) : (
                  <p className="text-xl text-black mt-1">
                    {userInfo.name || "N/A"}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-700">
                  Email
                </label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 text-black border border-gray-300 rounded"
                  />
                ) : (
                  <p className="text-xl text-black mt-1">
                    {userInfo.email || "N/A"}
                  </p>
                )}
              </div>

              {/* Password (only in edit mode) */}
              {editMode && (
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 text-black border border-gray-300 rounded"
                    placeholder="Enter new password or leave blank"
                  />
                </div>
              )}

              {/* Created At */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-700">
                  Registered On
                </label>
                <p className="text-xl text-black mt-1">
                  {new Date(userInfo.created_at).toLocaleDateString() ||
                    "Unknown"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {editMode ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setFormData((prev) => ({ ...prev, password: "" }));
                      }}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-700">Loading user information...</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
