import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";

function App() {
  const [authData, setAuthData] = useState(() => {
    return JSON.parse(sessionStorage.getItem("credential"));
  });

  // Listen for changes to sessionStorage across tabs (optional but good practice)
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthData(JSON.parse(sessionStorage.getItem("credential")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const Auth = () => {
    return authData ? <Outlet /> : <Navigate to="/" />;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route element={<Auth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
