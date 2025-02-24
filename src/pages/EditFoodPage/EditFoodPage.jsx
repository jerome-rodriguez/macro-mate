import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditFoodPage.scss";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditFoodPage() {
  const defaultDataset = {
    meal_type: "",
    amount: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const [mealLog, setMealLog] = useState(defaultDataset);
  const [error, setError] = useState({});
  const [disableAmount, setDisableAmount] = useState(false);
  const [disableMacros, setDisableMacros] = useState(false);

  // Track which field is being edited
  const [editingAmount, setEditingAmount] = useState(false);
  const [editingMacros, setEditingMacros] = useState(false);

  useEffect(() => {
    const fetchMealLog = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/meal-logs/${id}`);
        setMealLog(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError({ message: "Failed to load meal data" });
      }
    };

    fetchMealLog();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      setDisableMacros(!!value);
      setDisableAmount(false);
      setEditingAmount(true);
      setEditingMacros(false);
    } else if (["calories", "protein", "carbs", "fat"].includes(name)) {
      setDisableAmount(!!value);
      setDisableMacros(false);
      setEditingAmount(false);
      setEditingMacros(true);
    }

    setMealLog((prevMealLog) => ({
      ...prevMealLog,
      [name]: value,
    }));
  };

  const handleSubmitEditFood = async (e) => {
    e.preventDefault();
    setError({});

    const numericFields = ["calories", "protein", "carbs", "fat"];
    let newErrors = {};

    Object.entries(mealLog).forEach(([key, value]) => {
      if (typeof value === "string" && !value.trim()) {
        newErrors[key] = "This field is required";
      }
      if (numericFields.includes(key) && value && isNaN(value)) {
        newErrors[key] = `${key} must be a number`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    const { amount, calories, protein, carbs, fat, ...otherFields } = mealLog;

    let payload = { ...otherFields };
    if (editingAmount) payload.amount = amount;
    if (editingMacros) payload.calories = calories;
    if (editingMacros) payload.protein = protein;
    if (editingMacros) payload.carbs = carbs;
    if (editingMacros) payload.fat = fat;

    if (confirm("Are you sure you want to save the changes?")) {
      try {
        console.log("Sending payload:", payload); // Debugging log
        const response = await axios.put(
          `${API_URL}/api/meal-logs/${mealLog.id}`,
          payload
        );
        if (response.status === 200) {
          navigate(-1);
        }
      } catch (error) {
        console.error(
          "Error updating meal log:",
          error.response?.data || error.message
        );
        setError({ message: "Failed to save changes." });
      }
    }
  };

  if (!mealLog || !mealLog.meal_type) {
    return <p className="editFoodPage__loading">Loading meal log details...</p>;
  }

  return (
    <section className="editFoodPage">
      <h1 className="editFoodPage__title">Edit Meal Log</h1>
      <form className="editFoodPage__form" onSubmit={handleSubmitEditFood}>
        <label className="editFoodPage__label">
          Meal Type
          <select
            className="editFoodPage__select"
            name="meal_type"
            value={mealLog.meal_type}
            onChange={handleInputChange}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </label>

        <label className="editFoodPage__label">
          Amount
          <input
            className="editFoodPage__input"
            type="text"
            name="amount"
            value={mealLog.amount}
            onChange={handleInputChange}
            disabled={disableAmount}
          />
        </label>

        <label className="editFoodPage__label">
          Calories
          <input
            className="editFoodPage__input"
            type="text"
            name="calories"
            value={mealLog.calories}
            onChange={handleInputChange}
            disabled={disableMacros}
          />
        </label>

        <label className="editFoodPage__label">
          Protein
          <input
            className="editFoodPage__input"
            type="text"
            name="protein"
            value={mealLog.protein}
            onChange={handleInputChange}
            disabled={disableMacros}
          />
        </label>

        <label className="editFoodPage__label">
          Carbs
          <input
            className="editFoodPage__input"
            type="text"
            name="carbs"
            value={mealLog.carbs}
            onChange={handleInputChange}
            disabled={disableMacros}
          />
        </label>

        <label className="editFoodPage__label">
          Fat
          <input
            className="editFoodPage__input"
            type="text"
            name="fat"
            value={mealLog.fat}
            onChange={handleInputChange}
            disabled={disableMacros}
          />
        </label>

        <div className="editFoodPage__button-container">
          <button className="editFoodPage__button" type="submit">
            Save
          </button>
          <button
            className="editFoodPage__button editFoodPage__button--secondary"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
