import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../uiComponents/Navbar";
import Sidebar from "../uiComponents/Sidebar";
import Footer from "../uiComponents/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMemo } from "react";
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
  //how to create a new category before creating a new budget
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/categories", {
        name: newCategoryName,
        user_id: userId,
      });

      toast.success("Category created!");
      setNewCategoryName("");

      // Refresh category list
      const updatedCategories = await axios.get(
        `http://localhost:8080/categories/user/${userId}`
      );
      setCategories(updatedCategories.data);
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category.");
    }
  };

  const { userId } = useUser();
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchBudgetsWithExpenses = async () => {
      if (!userId) return;

      try {
        const budgetRes = await axios.get(
          `http://localhost:8080/budget/user/${userId}`
        );
        const budgetsData = budgetRes.data;

        // Fetch updated expenses for each budget's category
        const updatedBudgets = await Promise.all(
          budgetsData.map(async (budget) => {
            const expenseRes = await axios.get(
              `http://localhost:8080/expenses/category/${budget.category.id}`
            );
            return {
              ...budget,
              category: {
                ...budget.category,
                expenses: expenseRes.data,
              },
            };
          })
        );

        setBudgets(updatedBudgets);
      } catch (err) {
        console.error("Failed to fetch budgets with expenses:", err);
      }
    };

    fetchBudgetsWithExpenses();
  }, [userId]);

  const budgetVsExpenseData = useMemo(() => {
    return budgets.slice(-5).map((budget) => {
      const { amount: budgetAmount, category, user } = budget;
      const actualExpenses = category.expenses.filter(
        (expense) => typeof expense === "object" && expense.user?.id === userId
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
  }, [budgets]);
  //when it comes to creating a new entry the user will interact with both budget and expense tables as in
  //he will insert a new budget and the expenses made in that budget
  //then from a dropdown menu he will select in a list of available categories fetched in from the database
  //finally submit the new entry
  //the test code snippet for adding a new entry starts here
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/categories/user/${userId}`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategoryId || !budgetAmount || !expenseAmount) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Step 1: Create Budget
      const budgetResponse = await axios.post("http://localhost:8080/budget", {
        user_id: userId,
        category_id: selectedCategoryId,
        amount: parseFloat(budgetAmount),
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
      });

      const newBudget = budgetResponse.data;

      // Step 2: Create Expense linked to that budget's category
      await axios.post("http://localhost:8080/expenses", {
        user_id: userId,
        category_id: selectedCategoryId,
        amount: parseFloat(expenseAmount),
        description: expenseDescription,
        date: new Date().toISOString().split("T")[0],
      });

      toast.success("Budget and expense successfully added!");
      const refreshedBudgets = await axios.get(
        `http://localhost:8080/budget/user/${userId}`
      );
      setBudgets(refreshedBudgets.data);
      // Reset fields
      setSelectedCategoryId("");
      setBudgetAmount("");
      setExpenseAmount("");
      setExpenseDescription("");
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error adding budget and expense.");
    }
  };

  //now to increase the expenses per budget as you go
  const [selectedBudgetId, setSelectedBudgetId] = useState("");
  const [additionalExpenseAmount, setAdditionalExpenseAmount] = useState("");
  const [additionalExpenseDescription, setAdditionalExpenseDescription] =
    useState("");
  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (
      !selectedBudgetId ||
      !additionalExpenseAmount ||
      !additionalExpenseDescription
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      console.log("Fetched again", budgets);
      const selectedBudget = budgets.find((b) => b.id == selectedBudgetId);
      if (!selectedBudget) {
        toast.error("Selected budget not found.");
        return;
      }

      await axios.post("http://localhost:8080/expenses", {
        user_id: userId,
        category_id: selectedBudget.category.id,
        amount: parseFloat(additionalExpenseAmount),
        description: additionalExpenseDescription,
        date: new Date().toISOString().split("T")[0],
      });

      toast.success("Expense successfully added!");
      setAdditionalExpenseAmount("");
      setAdditionalExpenseDescription("");
      setSelectedBudgetId("");

      const refreshedBudgets = await axios.get(
        `http://localhost:8080/budget/user/${userId}`
      );
      console.log("Refreshed Budgets:", refreshedBudgets.data);
      setBudgets(refreshedBudgets.data);
    } catch (err) {
      console.error("Failed to add expense:", err);
      toast.error("Failed to add expense.");
    }
  };

  return (
    <div className="grid grid-cols-20 grid-rows-20 h-[100vh]">
      <Sidebar />
      <main className="row-span-19 col-span-17 bg-blue-50 p-6 overflow-auto">
        <ToastContainer />
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
        <div className="bg-white p-4 rounded shadow mb-6 grid gap-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Create New Category
          </h2>
          <input
            type="text"
            placeholder="New Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="p-2 text-black border rounded"
          />
          <button
            type="button"
            onClick={handleCreateCategory}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Category
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-6 grid gap-4"
        >
          <h2 className="text-xl font-semibold text-gray-700">
            Add New Budget Entry
          </h2>

          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="p-2 border rounded text-black"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="text-black">
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Budget Amount"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            className="p-2 text-black border rounded"
            required
          />

          <input
            type="number"
            placeholder="Initial Expense Amount"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            className="p-2 text-black border rounded"
            required
          />
          <input
            type="text"
            placeholder="Initial expense Description"
            value={expenseDescription}
            onChange={(e) => setExpenseDescription(e.target.value)}
            className="p-2 text-black border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
        <form
          onSubmit={handleAddExpense}
          className="bg-white p-4 rounded shadow mb-6 grid gap-4"
        >
          <h2 className="text-xl font-semibold text-gray-700">
            Add Expense to Existing Budget
          </h2>

          <select
            value={selectedBudgetId}
            onChange={(e) => setSelectedBudgetId(e.target.value)}
            className="p-2 border rounded text-black"
            required
          >
            <option value="">Select Budget (by Category)</option>
            {budgets.map((budget) => (
              <option key={budget.id} value={budget.id}>
                {budget.category.name} (Current:{" "}
                {budget.category.expenses.reduce(
                  (sum, ex) => sum + (ex.user?.id === userId ? ex.amount : 0),
                  0
                )}{" "}
                / {budget.amount})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Additional Expense Amount"
            value={additionalExpenseAmount}
            onChange={(e) => setAdditionalExpenseAmount(e.target.value)}
            className="p-2 text-black border rounded"
            required
          />
          <input
            type="text"
            placeholder="Expense Description"
            value={additionalExpenseDescription}
            onChange={(e) => setAdditionalExpenseDescription(e.target.value)}
            className="p-2 text-black border rounded"
            required
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Add Expense
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
