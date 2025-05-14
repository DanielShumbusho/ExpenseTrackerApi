import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../uiComponents/Navbar';
import Sidebar from '../uiComponents/Sidebar';
import Footer from '../uiComponents/Footer';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import { useUser } from "../hooks/userHook";
import axios from 'axios';


const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("credential"));
  const [expenses, setExpenses] = useState([]); 
  const { userId } = useUser();// get the stored user ID taken in login


  const handleLogout = () => {
    sessionStorage.removeItem("credential");
    navigate("/");
  };

  //the most annoying part i call the information fetching
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8080/expenses/user/${userId}`)
        .then((res) => {
          const expenses = res.data
          console.log(expenses);
          setExpenses(expenses);
        })
        .catch((err) => {
          console.error("Failed to fetch expenses:", err);
        });
    }
  }, [userId]);

  //category shenanigans
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/categories/user/${userId}`)
      .then(res => {setCategories(res.data); console.log(res)})
      .catch(err => console.error("Failed to fetch categories:", err));
  }, [userId]);
  //the category data mapping part
  const categoryMap = categories.reduce((map, cat) => {
  map[cat.id] = cat.name;
  return map;
  }, {});

  // Expense data and stuff
  const expenseData = expenses.reduce((acc, curr) => {
  const categoryName = categoryMap[curr.categoryId] || "Unknown";
  const existing = acc.find(e => e.name === categoryName);

  if (existing) {
    existing.value += curr.amount;
  } else {
    acc.push({ name: categoryName, value: curr.amount });
  }

  return acc;
  }, []);

//   const expenseData = expenses.reduce((acc, curr) => {
//   const category = curr.description; // assuming description is the category
//   const existing = acc.find(e => e.name === category);

//   if (existing) {
//     existing.value += curr.amount;
//   } else {
//     acc.push({ name: category, value: curr.amount });
//   }

//   return acc;
// }, []);

  const budgetVsExpenseData = [
    { category: 'Food', budget: 500, expense: 400 },
    { category: 'Transport', budget: 300, expense: 280 },
    { category: 'Bills', budget: 400, expense: 350 }
  ];

  const savingsData = [
    { month: 'Jan', savings: 200 },
    { month: 'Feb', savings: 300 },
    { month: 'Mar', savings: 500 }
  ];

  return (
    <div className='grid grid-cols-20 grid-rows-20 h-[100vh]'>
      <Sidebar />
      <main className='row-span-19 col-span-16 bg-blue-50 p-6 overflow-auto'>
        <h2 className="text-2xl font-semibold mb-2">ExpenseTracker</h2>
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name || "User"}! user ID: {userId}</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {["Budgets", "Expenses", "Savings", "Categories"].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold">{item}</h3>
              <p className="text-2xl font-bold">{Math.floor(Math.random() * 10) + 1}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Expenses by Category</h4>
            <PieChart width={250} height={250}>
              <Pie
                data={expenseData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {expenseData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Budget vs Expenses</h4>
            <BarChart width={300} height={250} data={budgetVsExpenseData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#8884d8" />
              <Bar dataKey="expense" fill="#82ca9d" />
            </BarChart>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Savings Over Time</h4>
            <LineChart width={300} height={250} data={savingsData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke="#ff8042" />
            </LineChart>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
