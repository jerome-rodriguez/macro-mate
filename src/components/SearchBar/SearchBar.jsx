// import { useState } from "react";
// import "./SearchBar.scss";
// import axios from "axios";
// import { useFoodContext } from "../../context/FoodContext";

// const API_URL = import.meta.env.VITE_API_URL;
// const API_KEY = import.meta.env.VITE_API_KEY;
// const API_ID = import.meta.env.VITE_API_ID;

// export default function SearchBar() {
//   const [food, setFood] = useState("");
//   const [results, setResults] = useState([]);
//   const { addFood } = useFoodContext();

//   async function searchFood() {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/food-database/v2/parser?app_id=${API_ID}&app_key=${API_KEY}&ingr=${food}&nutrition-type=cooking`
//       );

//       setResults(response.data.hints);
//     } catch (e) {
//       console.error(`Could not search food. Please try a different food.`);
//     }
//   }

//   function handleSelect(foodItem) {
//     addFood(foodItem); // Add the food to the shared context
//   }

//   return (
//     <>
//       <div>
//         <input
//           className="searchbar"
//           type="text"
//           id="searchbar"
//           placeholder="Search for a food"
//           value={food}
//           onChange={(e) => setFood(e.target.value)}
//         />
//         <button onClick={searchFood}>Search</button>
//       </div>
//       <ul>
//         {results.map((item, index) => (
//           <li key={index} onClick={() => handleSelect(item.food)}>
//             {item.food.label} - Calories:{" "}
//             {Math.round(item.food.nutrients.ENERC_KCAL)} kcal, Protein:{" "}
//             {Math.round(item.food.nutrients.PROCNT)} g, Fat:{" "}
//             {Math.round(item.food.nutrients.FAT)} g
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }

import { useState } from "react";
import "./SearchBar.scss";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Use backend API URL

export default function SearchBar() {
  const [food, setFood] = useState("");
  const [results, setResults] = useState([]);
  const [mealType, setMealType] = useState("breakfast"); // Default meal category

  async function searchFood() {
    try {
      const response = await axios.get(`${API_URL}/search`, {
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
      await axios.post(`${API_URL}/food/log`, {
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
            {item.name} - Calories: {item.calories} kcal, Protein:{" "}
            {item.protein} g, Fat: {item.fat} g
            <button onClick={() => handleSelect(item)}>
              Add to {mealType}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
