import React, { useEffect, useState } from "react";
import Sidebar from "../uiComponents/Sidebar";
import Footer from "../uiComponents/Footer";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from sessionStorage
    const user = sessionStorage.getItem("credential");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("credential");
    window.location.href = "/login"; // Redirect to login or homepage
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="grid grid-cols-20 grid-rows-20 h-[100vh]">
      <Sidebar />
      <main className="row-span-19 col-span-16 bg-blue-50 p-6 overflow-auto"></main>
    </div>
  );
};

export default Profile;
