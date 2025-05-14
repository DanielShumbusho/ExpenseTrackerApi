import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../uiComponents/Navbar";
import Sidebar from "../uiComponents/Sidebar";
import Footer from "../uiComponents/Footer";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useUser } from "../hooks/userHook";
import axios from "axios";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("credential"));
  const [expenses, setExpenses] = useState([]);
  const { userId } = useUser(); // get the stored user ID taken in login

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
          const expenses = res.data;
          console.log(expenses);
          setExpenses(expenses);
        })
        .catch((err) => {
          console.error("Failed to fetch expenses:", err);
        });
    }
  }, [userId]);

  // Expense data and stuff
  const expenseData = expenses.reduce((acc, curr) => {
    const categoryName = curr.category?.name || "Unknown";
    const existing = acc.find((e) => e.name === categoryName);

    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: categoryName, value: curr.amount });
    }

    return acc;
  }, []);
  //basically this chart should compare the budget in a certain category and the expense made in that category
  //budget fetching and stuff
  const [budgets, setBudget] = useState([]);
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8080/budget/user/${userId}`)
        .then((res) => {
          console.log("Fetched budget:", res.data);
          setBudget(res.data); // Rename to setBudgets() if it's budget data
        })
        .catch((err) => {
          console.error("Failed to fetch budget:", err);
        });
    }
  }, [userId]);
  const budgetVsExpenseData = budgets.slice(-2).map((budget) => {
    const { amount: budgetAmount, category, user } = budget;

    // Ensure all entries in category.expenses are objects (some may be strings/IDs)
    const actualExpenses = category.expenses.filter(
      (expense) => typeof expense === "object" && expense.user?.id === user.id
    );

    const totalExpenses = actualExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return {
      name: category.name,
      budget: budgetAmount,
      expense: totalExpenses,
    };
  });
  //Saving chart fetching, calculations and display
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8080/savings/user/${userId}`)
        .then((res) => {
          console.log("Fetched savings:", res.data);
          setSavings(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch savings:", err);
        });
    }
  }, [userId]);
  //the actual transformation
  const savingsComparisonData = savings
    .slice(-2) // last 3 entries
    .map((goal) => ({
      name: goal.description,
      current: goal.current_amount,
      goal: goal.goal_amount,
    }));

  return (
    <div className="grid grid-cols-20 grid-rows-20 h-[100vh]">
      <Sidebar />
      <main className="row-span-19 col-span-16 bg-blue-50 p-6 overflow-auto">
        <h2 className="text-2xl font-semibold text-black mb-2">
          ExpenseTracker
        </h2>
        <h1 className="text-3xl font-bold text-black mb-4">
          Welcome, {user?.name || "User"}! user ID: {userId}
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {["Budgets", "Expenses", "Savings", "Categories"].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold">{item}</h3>
              <p className="text-2xl font-bold">
                {Math.floor(Math.random() * 10) + 1}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold text-black mb-2">
              Expenses by Category
            </h4>
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold text-black mb-2">
              Budget vs Expenses
            </h4>
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
            <h4 className="font-semibold text-black mb-2">Savings Over Time</h4>
            <BarChart width={300} height={250} data={savingsComparisonData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="goal" fill="#8884d8" name="Goal Amount" />
              <Bar dataKey="current" fill="#82ca9d" name="Current Savings" />
            </BarChart>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
