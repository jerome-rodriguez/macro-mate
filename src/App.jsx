import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import AddFoodPage from "./pages/AddFoodPage/AddFoodPage";
import ViewPage from "./pages/ViewPage/ViewPage";
import SingleLogPage from "./pages/SingleLogPage/SingleLogPage";
import EditFoodPage from "./pages/EditFoodPage/EditFoodPage";
import GoalsPage from "./pages/GoalsPage/GoalsPAge";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/add-food" element={<AddFoodPage />} />
          <Route path="/view-logs" element={<ViewPage />} />
          <Route path="/view-logs/:id" element={<SingleLogPage />} />
          <Route path="/view-logs/:id/edit" element={<EditFoodPage />} />
          <Route path="/goals" element={<GoalsPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
