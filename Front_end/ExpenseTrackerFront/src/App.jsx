import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Savings from "./pages/savings";
import BudgetsVexpenses from "./pages/budgetVsExpenses";
import ForgotPassword from "./pages/forgotPassword";
import VerifyResetCode from "./pages/verifyResetCode";
import ResetPassword from "./pages/resetPassword";

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-code" element={<VerifyResetCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<Auth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/budgetsVexpenses" element={<BudgetsVexpenses />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
