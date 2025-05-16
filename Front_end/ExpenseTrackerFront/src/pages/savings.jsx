import React, { useEffect, useState } from "react";
import Sidebar from "../uiComponents/Sidebar";
import Footer from "../uiComponents/Footer";
import axios from "axios";
import { useUser } from "../hooks/userHook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { fetchSaving } from "../axios_functions/savings/fetchSaving";

//savings are there for long term projects
export default function Savings() {
  //what i will use to create a new saving
  const [goal, setGoal] = React.useState("");
  const [current, setCurrent] = React.useState("");
  const [description, setDescription] = React.useState("");
  //what i use to update a saving
  const [toBeUpdated, setToBeUpdated] = React.useState("");
  const [upGoal, setUpgoal] = React.useState("");
  const [upCurrent, setUpcurrent] = React.useState("");
  const [upDescription, setUpdescription] = React.useState("");
  //what i use to delete a saving
  const [toBeDeleted, setToBeDeleted] = React.useState("");
  //what i use everywhere
  const { userId } = useUser();
  const [savings, setSavings] = useState([]);
  useEffect(() => {
    if (userId) {
      fetchSaving(userId).then(setSavings);
    }
  }, [userId]);

  // After adding or deleting
  useEffect(() => {
    if (userId) {
      fetchSaving(userId).then(setSavings);
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
      toast.success("New saving added");
      // Clear inputs and refresh chart
      setGoal("");
      setCurrent("");
      setDescription("");
      fetchSaving();
    } catch (error) {
      console.error("Error while adding:", error);
      toast.error(
        "Error while adding: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };
  //Function to update a saving
  const updateSaving = async () => {
    try {
      const encodedUpDescription = encodeURIComponent(toBeUpdated);
      await axios.put(
        `http://localhost:8080/savings/updateByName/${userId}/${encodedUpDescription}`,
        {
          goal_amount: upGoal,
          current_amount: upCurrent,
          description: upDescription,
          user_id: userId,
        }
      );
      toast.success("Saving updated");
      setToBeUpdated("");
      setUpgoal("");
      setUpcurrent("");
      setUpdescription("");
      fetchSaving();
    } catch (error) {
      toast.error("Update failed");
    }
  };
  //Function to delete saving by its name
  const deleteSaving = async () => {
    if (!toBeDeleted) {
      toast.error("Description is required");
      return;
    }

    try {
      const encodedDescription = encodeURIComponent(toBeDeleted);
      const response = await axios.delete(
        `http://localhost:8080/savings/deleteByName/${userId}/${encodedDescription}`
      );
      console.log("Deleted saving:", response.data);
      toast.success("Saving deleted successfully");
      // Clear inputs and refresh chart
      setToBeDeleted("");
      fetchSaving();
    } catch (error) {
      console.error("Error while deleting:", error);
      toast.error(
        "Error while deleting: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  return (
    <div className="grid grid-cols-20 grid-rows-20 h-[100vh]">
      <Sidebar />
      <main className="row-span-19 col-span-17 bg-blue-50 p-6 overflow-auto">
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
          <h4 className="font-semibold text-black mb-2">Update saving</h4>
          <label className="text-black">
            Enter the name of the saving to be updated
          </label>
          <br></br>
          <input
            type="text"
            className="bg-gray-300 p-2 text-black rounded"
            value={toBeUpdated}
            onChange={(e) => setToBeUpdated(e.target.value)}
          />
          <br></br>
          <br></br>
          <label className="text-black">New Saving name: </label>
          <input
            type="text"
            className="bg-gray-300 p-2 text-black rounded"
            value={upDescription}
            onChange={(e) => setUpdescription(e.target.value)}
          />
          <br></br>
          <br></br>
          <label className="text-black">New Goal amount: </label>
          <input
            type="text"
            className="bg-gray-300 p-2 text-black rounded"
            value={upGoal}
            onChange={(e) => setUpgoal(e.target.value)}
          />
          <br></br>
          <br></br>
          <label className="text-black">New Current amount: </label>
          <input
            type="text"
            className="bg-gray-300 p-2 text-black rounded"
            value={upCurrent}
            onChange={(e) => setUpcurrent(e.target.value)}
          />
          <br></br>
          <button
            className="bg-blue-700 text-white font-bold mx-5 p-2"
            onClick={updateSaving}
          >
            Update
          </button>
        </div>
        <br></br>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold text-red-600 mb-2">Delete saving</h4>
          <label className="text-black">
            Enter the name of the saving to be deleted
          </label>
          <br></br>
          <input
            type="text"
            className="bg-gray-300 p-2 text-black rounded"
            value={toBeDeleted}
            onChange={(e) => setToBeDeleted(e.target.value)}
          />
          <button
            className="bg-blue-700 text-white font-bold mx-5 p-2"
            onClick={deleteSaving}
          >
            Delete
          </button>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
