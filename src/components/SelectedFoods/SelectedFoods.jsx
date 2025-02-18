// SelectedFoods.js
import { useFoodContext } from "../../context/FoodContext"; // Import the context

export default function SelectedFoods() {
  const { selectedFoods } = useFoodContext(); // Access selected foods from the context

  return (
    <div>
      <h3>Selected Foods</h3>
      <ul>
        {selectedFoods.map((foodItem, index) => (
          <li key={index}>
            {foodItem.label} - Calories:{" "}
            {Math.round(foodItem.nutrients.ENERC_KCAL)} kcal, Protein:{" "}
            {Math.round(foodItem.nutrients.PROCNT)} g, Fat:{" "}
            {Math.round(foodItem.nutrients.FAT)} g
          </li>
        ))}
      </ul>
    </div>
  );
}
