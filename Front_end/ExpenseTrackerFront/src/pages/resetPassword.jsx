import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const { state } = useLocation();
  const nav = useNavigate();

  const handleReset = async () => {
    try {
      await axios.post(
        `http://localhost:8080/users/reset-password?userId=${state.userId}&newPassword=${newPassword}`
      );
      alert("Password reset successfully");
      nav("/");
    } catch (err) {
      alert("Error resetting password");
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="flex flex-col bg-blue-100 p-8 px-16 gap-5 rounded-2xl lg:bg-green-500">
        <h2>Enter New Password</h2>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleReset}>Reset Password</button>
      </div>
    </div>
  );
}
