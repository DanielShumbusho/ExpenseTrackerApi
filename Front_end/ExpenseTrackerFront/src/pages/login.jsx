import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';



export default function Login() {

    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const nav = useNavigate();

    const handleLogin = async () => {
    
        await axios
          .get(`http://localhost:8080/users/getUser?name=${userName}&password=${password}`)
          .then((response) => {
            const user = response.data//store credentials in a variable
            console.log(user);
            console.log("Redirecting...");
            sessionStorage.setItem("credential", JSON.stringify(user)),//keep credentials
            sessionStorage.setItem("userId", user.id);//keep the id separately inside session storage to make things easier
            toast.success("Login successful");
            console.log("Redirecting to dashboard");//to test because the login has some issues
            nav("/dashboard");
            }).catch((error) => {
                console.error("Login error:", error);
                toast.error("Invalid credentials or server error");
            });
      };


    return (
        <div className='flex items-center justify-center h-[100vh]'>
            <div className='flex flex-col bg-blue-100 p-8 px-16 gap-5 rounded-2xl lg:bg-green-500'>
                <h1 className='text-2xl text-center'>Login</h1>
                <label htmlFor="">Username</label>
                <input 
                    type="text" 
                    className='bg-white p-2 text-black rounded' 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                /><br></br><br></br>
                <label htmlFor="">Password</label>
                <input 
                    type="password" 
                    className='bg-white p-2 text-black rounded' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                /><br></br>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
                <p><a href="/register">Forgot your password?</a></p>
                <p>If youre not redirected to the dashboard after loging in reload and try again</p>
                <button 
                    className='bg-blue-700 text-white font-bold mx-5 p-2' 
                    onClick={handleLogin}
                >
                    LOGIN
                </button>
            </div>
        </div>
    )
}
























// document.getElementById("loginForm").addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const email = document.getElementById("loginEmail").value;
//     const password = document.getElementById("loginPassword").value;

//     try {
//         const response = await fetch("http://localhost:8080/users/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, password }),
//         });
//         if (response.ok) {
//             const user = await response.json();
//             localStorage.setItem("user", JSON.stringify(user)); // Store user data
//             console.log(JSON.stringify(user))//prnts the received information
//             window.location.href = "dashboard.html"; // Redirect to dashboard
//         } else {
//             alert("Login failed. Please check your credentials.");
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// });