import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./SingleLogPage.scss";

const API_URL = import.meta.env.VITE_API_URL;

function SingleLogPage() {
  const { date } = useParams();
  const [mealLogs, setMealLogs] = useState([]);

  useEffect(() => {
    const fetchMealLogs = async () => {
      try {
        const formattedDate = new Date(date).toISOString().split("T")[0];
        const { data } = await axios.get(
          `${API_URL}/api/meal-logs/date/${formattedDate}`
        );
        setMealLogs(data);
      } catch (err) {
        console.error("Error fetching meal logs:", err);
      }
    };

    if (date) {
      fetchMealLogs();
    }
  }, [date]);

  const handleDeleteByDate = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/meal-logs/${id}`);
      alert("Delete Successful");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting logs by date:", err);
    }
  };

  return (
    <div className="single-log">
      <h2 className="single-log__header">Food Logs</h2>
      <ul className="single-log__list">
        {mealLogs.map((item, index) => (
          <li key={index} className="single-log__item">
            <div className="single-log__content">
              <div className="single-log__content-type">{item.meal_type}</div>
              <div className="single-log__content-details">
                <strong>{item.name}</strong> - Calories: {item.calories} kcal,
                Protein: {item.protein}g, Fat: {item.fat}g, Serving Size:{" "}
                {item.amount}g
              </div>
            </div>
            <div className="single-log__actions">
              <Link
                to={`/view-logs/${item.date}/${item.id}`}
                className="single-log__button single-log__button--edit"
              >
                Edit
              </Link>
              <button
                className="single-log__button single-log__button--delete"
                onClick={() => handleDeleteByDate(item.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SingleLogPage;
