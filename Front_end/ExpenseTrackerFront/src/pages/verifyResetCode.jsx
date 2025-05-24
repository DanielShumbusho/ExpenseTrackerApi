import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyResetCode() {
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState(null);
  const { state } = useLocation();
  const nav = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/users?email=${state.email}`
      );
      const user = res.data.find((u) => u.email === state.email); // Get the user ID

      const result = await axios.post(
        "http://localhost:8080/users/verify-reset-code",
        {
          userId: user.id,
          code,
        }
      );

      if (result.status === 200) {
        nav("/reset-password", { state: { userId: user.id } });
      }
    } catch (err) {
      alert("Invalid or expired code");
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="flex flex-col bg-blue-100 p-8 px-16 gap-5 rounded-2xl lg:bg-green-500">
        <h2>Enter Verification Code</h2>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={handleVerify}>Verify</button>
      </div>
    </div>
  );
}
