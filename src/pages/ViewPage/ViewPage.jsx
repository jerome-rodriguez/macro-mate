import "./ViewPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function FoodLog() {
  const [mealLogs, setMealLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMealLogs = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${API_URL}/api/meal-logs`);

        // Ensure each log has a standardized date format
        const processedLogs = data.map((log) => {
          // Extract just the date part (YYYY-MM-DD) if it has a time component
          const dateOnly = log.date.split("T")[0];
          return { ...log, dateOnly };
        });

        // Sort logs by date (newest first)
        const sortedLogs = processedLogs.sort(
          (a, b) => new Date(b.dateOnly) - new Date(a.dateOnly)
        );

        setMealLogs(sortedLogs);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMealLogs();
  }, []);

  // Group logs by date using the extracted date part
  const groupedLogs = mealLogs.reduce((acc, log) => {
    // Use the extracted date part
    const date = log.dateOnly;
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="view-page">
      <h2 className="view-page__header">Food Logs</h2>
      {Object.keys(groupedLogs).length === 0 ? (
        <p>No food logs found.</p>
      ) : (
        <div>
          {Object.entries(groupedLogs).map(([date, logs]) => (
            <div key={date} className="view-page__date-group">
              <div className="view-page__date-header">
                <h3 className="view-page__date-header-date">
                  {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
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
      )}
    </section>
  );
}
