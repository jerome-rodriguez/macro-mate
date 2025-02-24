import "./AddFoodPage.scss";
import axios from "axios";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function AddFoodPage() {
  const [food, setFood] = useState("");
  const [results, setResults] = useState([]);
  const [mealType, setMealType] = useState("breakfast"); // Default meal category

  async function searchFood() {
    try {
      const response = await axios.get(`${API_URL}/api/search/search`, {
        params: { query: food },
      });
      setResults(response.data);
    } catch (e) {
      console.error(`Could not search food. Please try a different food.`);
    }
  }

  async function handleSelect(foodItem) {
    const date = new Date().toISOString().split("T")[0]; // Get today's date

    try {
      await axios.post(`${API_URL}/api/search/add`, {
        name: foodItem.name,
        calories: foodItem.calories,
        protein: foodItem.protein,
        fat: foodItem.fat,
        carbs: foodItem.carbs,
        image: foodItem.image,
        mealType,
        date,
      });
      alert(`Added ${foodItem.name} to ${mealType}!`);
    } catch (error) {
      console.error(`Failed to log food:`, error);
    }
  }

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    amount: "",
  });

  // State for error and success messages
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/api/food-items`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMessage(`Food item added successfully: ${response.data.foodName}`);
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.error}`);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="add-food-page">
      <section className="add-food-page__search">
        <h2 className="add-food-page__form-header">Search Food Item</h2>
        <div className="add-food-page__search-container">
          <input
            className="add-food-page__input"
            type="text"
            placeholder="Search for a food"
            value={food}
            onChange={(e) => setFood(e.target.value)}
          />
          <button className="add-food-page__button" onClick={searchFood}>
            Search
          </button>
        </div>
        <div className="add-food-page__form-group">
          <label className="add-food-page__form-label">Select Meal Type</label>
          <select
            className="add-food-page__select"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          >
            <option className="add-food-page__option" value="breakfast">
              Breakfast
            </option>
            <option className="add-food-page__option" value="lunch">
              Lunch
            </option>
            <option className="add-food-page__option" value="dinner">
              Dinner
            </option>
          </select>
        </div>
      </section>

      {results.length > 0 && (
        <ul className="add-food-page__results">
          {results.map((item, index) => (
            <li className="add-food-page__results-item" key={index}>
              <div>
                <strong>{item.name}</strong>
                <p>
                  Calories: {Math.round(item.calories)} kcal | Protein:{" "}
                  {Math.round(item.protein)}g | Fat: {Math.round(item.fat)}g
                </p>
              </div>
              <button
                className="add-food-page__button"
                onClick={() => handleSelect(item)}
              >
                Add to {mealType}
              </button>
            </li>
          ))}
        </ul>
      )}

      <section className="add-food-page__form">
        <h2 className="add-food-page__form-header">Add Custom Food Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="add-food-page__form-grid">
            <div className="add-food-page__form-group">
              <label className="add-food-page__form-label" htmlFor="name">
                Name
              </label>
              <input
                className="add-food-page__input"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-food-page__form-group">
              <label className="add-food-page__form-label" htmlFor="calories">
                Calories
              </label>
              <input
                className="add-food-page__input"
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="add-food-page__form-group">
            <label className="add-food-page__form-label" htmlFor="protein">
              Protein
            </label>
            <input
              className="add-food-page__input"
              type="number"
              id="protein"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-food-page__form-group">
            <label className="add-food-page__form-label" htmlFor="carbs">
              Carbs
            </label>
            <input
              className="add-food-page__input"
              type="number"
              id="carbs"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-food-page__form-group">
            <label className="add-food-page__form-label" htmlFor="fat">
              Fat
            </label>
            <input
              className="add-food-page__input"
              type="number"
              id="fat"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-food-page__form-group">
            <label className="add-food-page__form-label" htmlFor="amount">
              Amount
            </label>
            <input
              className="add-food-page__input"
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-food-page__form-group">
            <label className="add-food-page__form-label">
              Select Meal Type
            </label>
            <select
              className="add-food-page__select"
              id="mealType"
              name="mealType"
              value={formData.mealType || mealType}
              onChange={handleChange}
              required
            >
              <option className="add-food-page__option" value="breakfast">
                Breakfast
              </option>
              <option className="add-food-page__option" value="lunch">
                Lunch
              </option>
              <option className="add-food-page__option" value="dinner">
                Dinner
              </option>
            </select>
          </div>

          <button
            className="add-food-page__button"
            type="submit"
            style={{ marginTop: "2rem" }}
          >
            Add Food Item
          </button>
        </form>

        {message && (
          <div
            className={`add-food-page__message ${
              message.includes("Error")
                ? "add-food-page__message--error"
                : "add-food-page__message--success"
            }`}
          >
            {message}
          </div>
        )}
      </section>
    </div>
  );
}

export default AddFoodPage;
