import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL; // Use backend API URL

export default function TodaysPage() {
  const [todaysLog, setTodaysLog] = useState([]);

  useEffect(() => {
    const fetchTodaysLog = async () => {
      const date = new Date().toLocaleDateString("en-CA"); // Get today's date in 'YYYY-MM-DD' format
      try {
        const { data } = await axios.get(
          `${API_URL}/api/meal-logs/date/${date}`
        );
        setTodaysLog(data); // Update state with today's logs
      } catch (err) {
        console.error(err);
      }
    };

    fetchTodaysLog();
  }, []);

  const handleDeleteByDate = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/meal-logs/${id}`);

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
      <h2>Today's Logs</h2>
      <div>
        {todaysLog.length > 0 ? (
          todaysLog.map((log, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <ul>
                <li>
                  <strong>{log.meal_type}:</strong> {log.name} - Calories:{" "}
                  {log.calories} kcal, Protein: {log.protein} g, Fat: {log.fat}{" "}
                  g, Serving Size: {log.amount} g
                  <Link to={`/view-logs/${log.date}/${log.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteByDate(log.id)} // Pass formatted date
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          ))
        ) : (
          <p>No logs for today.</p>
        )}
      </div>
    </>
  );
}
