import "./HomePage.scss";
import { Link } from "react-router-dom";

import AddFoodWidget from "../../components/AddFoodWidget/AddFoodWidget";
import DateWidget from "../../components/DateWidget/DateWidget";
import GoalWidget from "../../components/GoalWidget/GoalWidget";
import TodaysWidget from "../../components/TodaysWidget/TodaysWidget";
import UserWidget from "../../components/UserWidget/UserWidget";
import ViewLogsWidget from "../../components/ViewLogsWidget/ViewLogsWidget";
import UploadWidget from "../../components/UploadWidget/UploadWidget";

function HomePage() {
  return (
    <div className="home-container">
      <div className="date-widget">
        <DateWidget />
      </div>

      <div className="user-widget">
        <UserWidget />
      </div>

      <Link to="/view-logs/today" className="todays-widget">
        <TodaysWidget />
      </Link>

      <Link to="/add-food" className="add-food-widget">
        <AddFoodWidget />
      </Link>

      <Link to="/view-logs" className="view-logs-widget">
        <ViewLogsWidget />
      </Link>

      <Link to="/goals" className="goal-widget">
        <GoalWidget />
      </Link>

      <Link to="/upload" className="upload-widget">
        <UploadWidget />
      </Link>
    </div>
  );
}

export default HomePage;
