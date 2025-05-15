import React, { useEffect, useState } from "react";
import Sidebar from "../uiComponents/Sidebar";
import Footer from "../uiComponents/Footer";
import axios from "axios";
import { useUser } from "../hooks/userHook";
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

export default function Savings() {
  //what i will use to create a new saving
  const [goal, setGoal] = React.useState("");
  const [current, setCurrent] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { userId } = useUser();
  const [savings, setSavings] = useState([]);
  //fetch the savings from the database
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
  //the actual transformation and shows the 5 latest savings
  const savingsComparisonData = savings.slice(-5).map((goal) => ({
    name: goal.description,
    current: goal.current_amount,
    goal: goal.goal_amount,
  }));

  //Function I use to add a new saving
  const addSaving = async () => {
    if (!goal || !current || !description) {
      toast.error("All fields are required");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/savings", {
        goal_amount: goal,
        current_amount: current,
        description: description,
        user_id: userId,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error while adding:", error);
      toast.error(
        "Error while adding: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  return (
    <div className="grid grid-cols-20 grid-rows-20 h-[100vh]">
      <Sidebar />
      <main className="row-span-19 col-span-16 bg-blue-50 p-6 overflow-auto">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold text-black mb-2">
            latest Savings Over Time
          </h4>
          <BarChart
            width={800}
            height={350}
            data={savingsComparisonData}
            barSize={30}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="goal" fill="#8884d8" name="Goal Amount" />
            <Bar dataKey="current" fill="#82ca9d" name="Current Savings" />
          </BarChart>
        </div>
        <br></br>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold text-black mb-2">Add a new saving</h4>
          <label className="text-black"> Saving name: </label>
          <input
            type="text"
            className="bg-gray-300 p-2 text-black rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="text-black"> Current amount: </label>
          <input
            type="text"
            className="bg-gray-300 p-2 text-black rounded"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <label className="text-black"> Goal amount: </label>
          <input
            type="text"
            className="bg-gray-300 p-2 text-black rounded"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <button
            className="bg-blue-700 text-white font-bold mx-5 p-2"
            onClick={addSaving}
          >
            Add
          </button>
        </div>
        <br></br>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold text-black mb-2">Delete saving</h4>
        </div>
      </main>
    </div>
  );
}
