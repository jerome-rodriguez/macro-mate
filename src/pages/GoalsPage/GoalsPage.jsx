import "./GoalsPage.scss";

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

// Register required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const API_URL = import.meta.env.VITE_API_URL; // Update this with your API

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
        const { data } = await axios.get(
          `${API_URL}/api/meal-logs/date/${date}`
        );

        let totalProtein = 0,
          totalCarbs = 0,
          totalFat = 0,
          totalCalories = 0;

        data.forEach(({ protein, carbs, fat, calories }) => {
          totalProtein += protein;
          totalCarbs += carbs;
          totalFat += fat;
          totalCalories += calories;
        });

        setTotals({
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat,
          totalCalories,
        });
        setLoading(false);
      } catch (error) {
        setError(error.message);
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

  // Bar Chart Data for Calories (with bars on top of each other, not stacked)
  const barData = {
    labels: ["Calories"],
    datasets: [
      {
        label: "Calories Consumed",
        data: [totals.totalCalories],
        backgroundColor: "#66b3ff",
      },
      {
        label: "Goal Calories",
        data: [goalCalories],
        backgroundColor: "#ffcc00",
      },
    ],
  };

  // Bar Chart Configuration (not stacked)
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.dataset.label + ": " + tooltipItem.raw + " kcal";
          },
        },
      },
    },
    scales: {
      x: {
        // No stacking here, just regular bar chart
        stacked: false,
      },
      y: {
        stacked: false,
      },
    },
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h2>Macronutrient Breakdown</h2>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div style={{ width: "400px" }}>
          <Pie data={pieData} />
        </div>

        <div style={{ width: "400px" }}>
          <h3>Calories Progress</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}

export default GoalsPage;
