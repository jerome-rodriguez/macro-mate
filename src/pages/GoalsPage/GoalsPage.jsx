import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import axios from "axios";
import "./GoalsPage.scss";

// Register required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const API_URL = import.meta.env.VITE_API_URL;

function GoalsPage() {
  const [totals, setTotals] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
    totalCalories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goalCalories = 2000; // Goal calories for the day

  useEffect(() => {
    const fetchMealLogs = async () => {
      try {
        const date = new Date().toLocaleDateString("en-CA");
        console.log(
          "📡 Fetching data from:",
          `${API_URL}/api/meal-logs/date/${date}`
        );

        const { data } = await axios.get(
          `${API_URL}/api/meal-logs/date/${date}`
        );
        console.log("📊 Fetched Data:", data);

        let totalProtein = 0,
          totalCarbs = 0,
          totalFat = 0,
          totalCalories = 0;

        data.forEach(({ protein, carbs, fat, calories }) => {
          totalProtein += parseFloat(protein) || 0; // ✅ Convert string to number
          totalCarbs += parseFloat(carbs) || 0; // ✅ Convert string to number
          totalFat += parseFloat(fat) || 0; // ✅ Convert string to number
          totalCalories += Number(calories) || 0; // ✅ Convert to number safely
        });

        console.log("📈 Corrected Totals Calculated:", {
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat,
          totalCalories,
        });

        setTotals({
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat,
          totalCalories,
        });
        setLoading(false);
      } catch (err) {
        console.error("❌ API Fetch Error:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMealLogs();
  }, []);

  // Pie Chart Data for Macronutrients
  const pieData = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [
      {
        data: [totals.protein, totals.carbs, totals.fat],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        hoverBackgroundColor: ["#4BC0C0", "#FF9F40", "#FF6384"],
      },
    ],
  };

  // Pie Chart Configuration
  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: "white", // White legend text
        },
      },
      tooltip: {
        displayColors: true, // Keep the colored square
        padding: 10, // Adds space around tooltip
        boxPadding: 4, // Space between color box and text
        titleAlign: "center", // Center align the title text
        bodyAlign: "center", // Center align the tooltip body text
      },
    },
  };

  if (loading) {
    return <div className="goals-page__loading">Loading data...</div>;
  }

  if (error) {
    return <div className="goals-page__error">Error: {error}</div>;
  }

  return (
    <section className="goals-page">
      <div className="goals-page__charts">
        <article className="goals-page__chart goals-page__chart--pie">
          <h2 className="goals-page__chart-title">Macronutrient Breakdown</h2>
          <Pie data={pieData} options={pieOptions} />
        </article>
      </div>
    </section>
  );
}

export default GoalsPage;
