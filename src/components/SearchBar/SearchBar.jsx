import { useState } from "react";
import "./SearchBar.scss";
import axios from "axios";
import { useFoodContext } from "../../context/FoodContext";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const API_ID = import.meta.env.VITE_API_ID;

export default function SearchBar() {
  const [food, setFood] = useState("");
  const [results, setResults] = useState([]);
  const { addFood } = useFoodContext();

  async function searchFood() {
    try {
      const response = await axios.get(
        `${API_URL}/api/food-database/v2/parser?app_id=${API_ID}&app_key=${API_KEY}&ingr=${food}&nutrition-type=cooking`
      );

      setResults(response.data.hints);
    } catch (e) {
      console.error(`Could not search food. Please try a different food.`);
    }
  }

  function handleSelect(foodItem) {
    addFood(foodItem); // Add the food to the shared context
  }

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
      <ul>
        {results.map((item, index) => (
          <li key={index} onClick={() => handleSelect(item.food)}>
            {item.food.label} - Calories:{" "}
            {Math.round(item.food.nutrients.ENERC_KCAL)} kcal, Protein:{" "}
            {Math.round(item.food.nutrients.PROCNT)} g, Fat:{" "}
            {Math.round(item.food.nutrients.FAT)} g
          </li>
        ))}
      </ul>
    </>
  );
}
