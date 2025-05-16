import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../uiComponents/Navbar";
import Sidebar from "../uiComponents/Sidebar";
import Footer from "../uiComponents/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

export default function BudgetsVexpenses() {
  //budgets are meant for short term planning like vacations etc
  const { userId } = useUser();
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8080/budget/user/${userId}`)
        .then((res) => {
          console.log("Fetched budget:", res.data);
          setBudgets(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch budget:", err);
        });
    }
  }, [userId]);

  const budgetVsExpenseData = budgets.slice(-5).map((budget) => {
    const { amount: budgetAmount, category, user } = budget;
    const actualExpenses = category.expenses.filter(
      (expense) => typeof expense === "object" && expense.user?.id === user.id
    );
    const totalExpenses = actualExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return {
      category: category.name,
      budget: budgetAmount,
      expense: totalExpenses,
    };
  });

  return (
    <div className="grid grid-cols-20 grid-rows-20 h-[100vh]">
      <Sidebar />
      <main className="row-span-19 col-span-17 bg-blue-50 p-6 overflow-auto">
        <h1 className="text-3xl font-bold text-black mb-6">
          Budget vs Expense Overview
        </h1>

        <div className="bg-white p-4 rounded shadow">
          <BarChart width={500} height={300} data={budgetVsExpenseData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" />
            <Bar dataKey="expense" fill="#82ca9d" />
          </BarChart>
        </div>
      </main>
      <Footer />
    </div>
  );
}
