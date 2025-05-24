import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const handleSendCode = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/users/forgot-password?email=${email}`
      );
      alert("Verification code sent to your email");
      nav("/verify-reset-code", { state: { email } });
    } catch (err) {
      alert("User not found");
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="flex flex-col bg-blue-100 p-8 px-16 gap-5 rounded-2xl lg:bg-green-500">
        <h2>Forgot Password</h2>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button onClick={handleSendCode}>Send Code</button>
      </div>
    </div>
  );
}
