// FoodContext.js
import React, { createContext, useState, useContext } from "react";

// Create the context
const FoodContext = createContext();

// Create a provider for the context
export const FoodProvider = ({ children }) => {
  const [selectedFoods, setSelectedFoods] = useState([]);

  const addFood = (foodItem) => {
    setSelectedFoods((prevFoods) => [...prevFoods, foodItem]);
  };

  return (
    <FoodContext.Provider value={{ selectedFoods, addFood }}>
      {children}
    </FoodContext.Provider>
  );
};

// Custom hook to use the context
export const useFoodContext = () => {
  return useContext(FoodContext);
};
