import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Verify() {
  const [inputCode, setInputCode] = useState("");
  const nav = useNavigate();

  const handleVerify = () => {
    const storedCode = sessionStorage.getItem("verificationCode");
    if (inputCode === storedCode) {
      nav("/dashboard");
    } else {
      alert("Incorrect code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl">
        Enter the verification code sent to your email
      </h2>
      <input
        type="text"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        className="border p-2 my-4"
      />
      <button
        onClick={handleVerify}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Verify
      </button>
    </div>
  );
}
