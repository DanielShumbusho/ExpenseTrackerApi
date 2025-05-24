import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const nav = useNavigate();

  const handleRegister = async () => {
    if (!userName || !email || !password) {
      toast.error("All fields are required");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/users/register",
        {
          name: userName,
          email: email,
          password: password,
        }
      );
      console.log(response.data);
      sessionStorage.setItem("credential", JSON.stringify(response.data));
      toast.success("Registration successful");
      nav("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        "Registration failed: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="flex flex-col bg-blue-100 p-8 px-16 gap-5 rounded-2xl lg:bg-green-500">
        <h1 className="text-2xl text-center">Register</h1>
        <label htmlFor="">Username: </label>
        <input
          type="text"
          className="bg-white p-2 text-black rounded"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label htmlFor="">Email: </label>
        <input
          type="text"
          className="bg-white p-2 text-black rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="">Password: </label>
        <input
          type="password"
          className="bg-white p-2 text-black rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-700 text-white font-bold mx-5 p-2"
          onClick={handleRegister}
        >
          REGISTER
        </button>
      </div>
    </div>
  );
}
