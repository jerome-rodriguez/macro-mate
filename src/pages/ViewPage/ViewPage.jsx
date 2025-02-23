import "./ViewPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL; // Use backend API URL

export default function FoodLog() {
  const [mealLogs, setMealLogs] = useState([]);

  useEffect(() => {
    const fetchMealLogs = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/meal-logs`);
        // Sort logs by date (newest first)
        const sortedLogs = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setMealLogs(sortedLogs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMealLogs();
  }, []);

  // Group logs by date
  const groupedLogs = mealLogs.reduce((acc, log) => {
    const date = new Date(log.date).toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  // Handle deleting all logs for a specific date
  const handleDeleteByDate = async (date) => {
    try {
      await axios.delete(`${API_URL}/api/meal-logs/date/${date}`);

      // Show success message
      alert("Delete Successful");

      // Auto-refresh the page
      window.location.reload();
    } catch (err) {
      console.error("Error deleting logs by date:", err);
    }
  };

  return (
    <>
      <h2>Food Logs</h2>
      <div>
        {Object.entries(groupedLogs).map(([date, logs]) => (
          <div key={date} style={{ marginBottom: "20px" }}>
            <h3
              style={{ borderBottom: "2px solid #ccc", paddingBottom: "5px" }}
            >
              {date}
              <Link to={`/view-logs/${date}`}>
                <button>Edit</button>
              </Link>
              <button
                onClick={() => handleDeleteByDate(date)} // Pass formatted date
                style={{ marginLeft: "10px" }}
              >
                Delete All
              </button>
            </h3>
            <ul>
              {logs.map((item, index) => (
                <li key={index}>
                  <strong>{item.meal_type}:</strong> {item.name} - Calories:{" "}
                  {item.calories} kcal, Protein: {item.protein} g, Fat:{" "}
                  {item.fat} g, Serving Size: {item.amount} g
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
