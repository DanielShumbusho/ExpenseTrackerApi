import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

export default function Login() {
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [verificationCode, setVerificationCode] = React.useState("");
  const [userId, setUserId] = React.useState(null);
  const [step, setStep] = React.useState(1);
  const nav = useNavigate();

  // Step 1: Submit username + password
  const handleLogin = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/users/getUser?name=${userName}&password=${password}`
      );

      const data = response.data;
      toast.success("Verification code sent to your email");
      setUserId(data.userId); // Store userId for step 2
      setStep(2); // Move to next step
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid credentials or server error");
    }
  };

  // Step 2: Submit verification code
  const handleVerify = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/users/verify-code",
        {
          userId: userId,
          code: verificationCode,
        }
      );

      const user = response.data;
      sessionStorage.setItem("credential", JSON.stringify(user));
      sessionStorage.setItem("userId", user.id);
      toast.success("Login successful!");
      nav("/dashboard");
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Invalid or expired verification code");
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="flex flex-col bg-blue-100 p-8 px-16 gap-5 rounded-2xl lg:bg-green-500">
        <h1 className="text-2xl text-center">Login</h1>

        {/* Step 1: Username + Password */}
        {step === 1 && (
          <>
            <label>Username</label>
            <input
              type="text"
              className="bg-white p-2 text-black rounded"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              className="bg-white p-2 text-black rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-blue-700 text-white font-bold p-2"
              onClick={handleLogin}
            >
              LOGIN
            </button>
          </>
        )}

        {/* Step 2: Code Input */}
        {step === 2 && (
          <>
            <label>Enter verification code</label>
            <input
              type="text"
              className="bg-white p-2 text-black rounded"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button
              className="bg-green-700 text-white font-bold p-2"
              onClick={handleVerify}
            >
              VERIFY CODE
            </button>
          </>
        )}

        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot your password?</Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

// document.getElementById("loginForm").addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const email = document.getElementById("loginEmail").value;
//     const password = document.getElementById("loginPassword").value;

//     try {
//         const response = await fetch("[http://localhost:8080/users/login](http://localhost:8080/users/login)", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, password }),
//         });
//         if (response.ok) {
//             const user = await response.json();
//             localStorage.setItem("user", JSON.stringify(user)); // Store user data
//             console.log(JSON.stringify(user))//prnts the received information
//             window\.location.href = "dashboard.html"; // Redirect to dashboard
//         } else {
//             alert("Login failed. Please check your credentials.");
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// });
