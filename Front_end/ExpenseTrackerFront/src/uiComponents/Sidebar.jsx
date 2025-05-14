import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("credential");
    navigate("/");
  }
  return (
    <>
    {/* <section className='row-span-19 col-span-4 p-4 bg-gray-700 text-white'>
      <div>
            <ul className='flex flex-col gap-3'>
              <li><Link to="/dashboard">DASHBOARD</Link></li>
              <li>STUDENT</li>
              <li> <Link to="/students">STUDENT LIST</Link></li>
              <li>COURSES</li>
            </ul>
          </div>
    </section> */}
     <section className='row-span-19 col-span-4 p-4 bg-green-700 text-white'>
         <div>
             <ul className='flex flex-col gap-3'>
                 <li><Link to="/dashboard" className="block hover:bg-blue-600 p-2 rounded">Dashboard</Link></li>
                 <li><Link to="/budgets" className="block hover:bg-blue-600 p-2 rounded">Budgets</Link></li>
                 <li><Link to="/expenses" className="block hover:bg-blue-600 p-2 rounded">Expenses</Link></li>
                 <li><Link to="/savings" className="block hover:bg-blue-600 p-2 rounded">Savings</Link></li>
                 <li><Link to="/categories" className="block hover:bg-blue-600 p-2 rounded">Categories</Link></li>
                 <li><Link to="/profile" className="block hover:bg-blue-600 p-2 rounded">Profile</Link></li>
                 <li><Link to="/settings" className="block hover:bg-blue-600 p-2 rounded">Settings</Link></li>
             </ul>
             <button onClick={handleLogout}className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
        </div>
    </section>
    </>
  );
};

export default Sidebar;
