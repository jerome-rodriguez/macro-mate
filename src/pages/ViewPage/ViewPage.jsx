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
      alert("Delete Successful");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting logs by date:", err);
    }
  };

  return (
    <div className="view-page">
      <h2 className="view-page__header">Food Logs</h2>
      <div>
        {Object.entries(groupedLogs).map(([date, logs]) => (
          <div key={date} className="view-page__date-group">
            <div className="view-page__date-header">
              <h3 className="view-page__date-header-date">
                {new Date(date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              <div className="view-page__actions">
                <Link to={`/view-logs/${date}`}>
                  <button className="view-page__button">Edit</button>
                </Link>
                <button
                  className="view-page__button view-page__button--delete"
                  onClick={() => handleDeleteByDate(date)}
                >
                  Delete All
                </button>
              </div>
            </div>
            <ul className="view-page__meal-list">
              {logs.map((item, index) => (
                <li className="view-page__meal-list-item" key={index}>
                  <strong className="view-page__strong">
                    {item.meal_type}
                  </strong>{" "}
                  {item.name} - Calories: {item.calories} kcal, Protein:{" "}
                  {item.protein} g, Fat: {item.fat} g, Serving Size:{" "}
                  {item.amount} g
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
