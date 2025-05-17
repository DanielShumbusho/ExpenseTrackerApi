import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("credential");
    navigate("/");
  };
  return (
    <>
      <section className="row-span-19 col-span-3 p-4 bg-green-700 text-white">
        <div>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                to="/dashboard"
                className="block hover:bg-black p-2 w-50 rounded"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/savings"
                className="block hover:bg-black p-2 w-50 rounded"
              >
                Savings
              </Link>
            </li>
            <li>
              <Link
                to="/budgetsVexpenses"
                className="block hover:bg-black p-2 w-50 rounded"
              >
                Budgets vs Expenses
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                className="block hover:bg-black p-2 w-50 rounded"
              >
                Overview of tables
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="block hover:bg-black p-2 w-50 rounded"
              >
                Profile
              </Link>
            </li>
          </ul>
          <br></br>
          <div className="h-65"></div>
          <button onClick={handleLogout} class="critical">
            Logout
          </button>
        </div>
      </section>
    </>
  );
};

export default Sidebar;
