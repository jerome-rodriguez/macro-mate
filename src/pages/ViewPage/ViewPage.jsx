import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Use backend API URL

export default function FoodLog() {
  const [logs, setLogs] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  useEffect(() => {
    async function fetchLogs() {
      try {
        const [breakfastRes, lunchRes, dinnerRes] = await Promise.all([
          axios.get(`${API_URL}/logs?mealType=breakfast`),
          axios.get(`${API_URL}/logs?mealType=lunch`),
          axios.get(`${API_URL}/logs?mealType=dinner`),
        ]);

        setLogs({
          breakfast: breakfastRes.data,
          lunch: lunchRes.data,
          dinner: dinnerRes.data,
        });
      } catch (error) {
        console.error("Failed to fetch food logs:", error);
      }
    }

    fetchLogs();
  }, []);

  return (
    <div>
      <h2>Food Logs</h2>
      <div>
        <h3>Breakfast</h3>
        <ul>
          {logs.breakfast.map((item, index) => (
            <li key={index}>
              {item.name} - Calories: {item.calories} kcal, Protein:{" "}
              {item.protein} g, Fat: {item.fat} g
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Lunch</h3>
        <ul>
          {logs.lunch.map((item, index) => (
            <li key={index}>
              {item.name} - Calories: {item.calories} kcal, Protein:{" "}
              {item.protein} g, Fat: {item.fat} g
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Dinner</h3>
        <ul>
          {logs.dinner.map((item, index) => (
            <li key={index}>
              {item.name} - Calories: {item.calories} kcal, Protein:{" "}
              {item.protein} g, Fat: {item.fat} g
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
