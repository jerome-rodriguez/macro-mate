import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import axios from "axios";
import "./SingleLogPage.scss";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL; // Use backend API URL

function SingleLogPage() {
  const { date } = useParams(); // Access the dynamic date parameter
  const [mealLogs, setMealLogs] = useState([]);

  useEffect(() => {
    const fetchMealLogs = async () => {
      try {
        // Normalize date to YYYY-MM-DD format
        const formattedDate = new Date(date).toISOString().split("T")[0];

        const { data } = await axios.get(
          `${API_URL}/api/meal-logs/date/${formattedDate}` // Use the formatted date
        );
        setMealLogs(data);
      } catch (err) {
        console.error("Error fetching meal logs:", err);
      }
    };

    if (date) {
      fetchMealLogs();
    }
  }, [date]); // Depend on 'date' to refetch logs when it changes

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
      <h2>Food Logs</h2>
      <div>
        <ul>
          {mealLogs.map((item, index) => (
            <li key={index}>
              <strong>{item.meal_type}:</strong> {item.name} - Calories:{" "}
              {item.calories} kcal, Protein: {item.protein} g, Fat: {item.fat}{" "}
              g, Serving Size: {item.amount} g
              <Link to={`/view-logs/${date}/${item.id}`}>
                <button>Edit</button>
              </Link>
              <button
                onClick={() => handleDeleteByDate(item.id)} // Pass formatted date
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SingleLogPage;
