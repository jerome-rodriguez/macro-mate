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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous message
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/api/food-items`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Success message
      setMessage(`Food item added successfully: ${response.data.foodName}`);
    } catch (error) {
      // Error handling
      if (error.response) {
        setMessage(`Error: ${error.response.data.error}`);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <div>
        <input
          className="searchbar"
          type="text"
          id="searchbar"
          placeholder="Search for a food"
          value={food}
          onChange={(e) => setFood(e.target.value)}
        />
        <button onClick={searchFood}>Search</button>
      </div>
      <div>
        <label>Select Meal Type:</label>
        <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </div>
      <ul>
        {results.map((item, index) => (
          <li key={index}>
            {item.name} - Calories: {Math.round(item.calories)} kcal, Protein:{" "}
            {Math.round(item.protein)} g, Fat: {Math.round(item.fat)} g
            <button onClick={() => handleSelect(item)}>
              Add to {mealType}
            </button>
          </li>
        ))}
      </ul>
      <div>
        <h2>Add Food Item</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="calories">Calories</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="protein">Protein</label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="carbs">Carbs</label>
            <input
              type="number"
              id="carbs"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="fat">Fat</label>
            <input
              type="number"
              id="fat"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="mealType">Meal Type</label>
            <select
              id="mealType"
              name="mealType"
              value={formData.mealType || mealType} // Default mealType to mealType state
              onChange={handleChange}
              required
            >
              <option value="">Select Meal Type</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <button type="submit">Add Food Item</button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </>
  );
}

export default AddFoodPage;
