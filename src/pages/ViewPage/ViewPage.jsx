import "./ViewPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

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

  // Safely format date to avoid timezone issues
  const formatDateString = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Format date for display
  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group logs by date - normalize all dates to ensure consistency
  const groupedLogs = mealLogs.reduce((acc, log) => {
    // Use a consistent date format for grouping
    const dateKey = formatDateString(log.date);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(log);
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
    <section className="view-page">
      <h2 className="view-page__header">Food Logs</h2>
      <div>
        {Object.entries(groupedLogs).map(([dateKey, logs]) => (
          <div key={dateKey} className="view-page__date-group">
            <div className="view-page__date-header">
              <h3 className="view-page__date-header-date">
                {formatDisplayDate(dateKey)}
              </h3>
              <div className="view-page__actions">
                <Link to={`/view-logs/${dateKey}`}>
                  <button className="view-page__button">Edit</button>
                </Link>
                <button
                  className="view-page__button view-page__button--delete"
                  onClick={() => handleDeleteByDate(dateKey)}
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
    </section>
  );
}
