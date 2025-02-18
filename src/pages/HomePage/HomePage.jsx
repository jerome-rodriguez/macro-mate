import "./HomePage.scss";
import { Link } from "react-router-dom";

import AddFoodWidget from "../../components/AddFoodWidget/AddFoodWidget";
import DateWidget from "../../components/DateWidget/DateWidget";
import GoalWidget from "../../components/GoalWidget/GoalWidget";
import TodaysWidget from "../../components/TodaysWidget/TodaysWidget";
import UserWidget from "../../components/UserWidget/UserWidget";
import ViewLogsWidget from "../../components/ViewLogsWidget/ViewLogsWidget";

function HomePage() {
  return (
    <>
      <DateWidget />
      <UserWidget />
      <Link to="/view-logs/:id">
        <TodaysWidget />
      </Link>
      <Link to="/add-food">
        <AddFoodWidget />
      </Link>
      <Link to="/view-logs">
        <ViewLogsWidget />
      </Link>
      <Link to="/goals">
        <GoalWidget />
      </Link>
    </>
  );
}

export default HomePage;
