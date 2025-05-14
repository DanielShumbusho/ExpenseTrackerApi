import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import Login from './components/login'
import Register from './components/register'
import Dashboard from './components/dashboard';

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
        <Route path='/' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route element={<Auth />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
