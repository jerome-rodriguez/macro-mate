import AddFoodWidget from "../../components/AddFoodWidget/AddFoodWidget";
import DateWidget from "../../components/DateWidget/DateWidget";
import GoalWidget from "../../components/GoalWidget/GoalWidget";
import TodaysWidget from "../../components/TodaysWidget/TodaysWidget";
import UserWidget from "../../components/UserWidget/UserWidget";
import ViewLogsWidget from "../../components/ViewLogsWidget/ViewLogsWidget";
import "./HomePage.scss";

function HomePage() {
  return (
    <>
      <DateWidget />
      <UserWidget />
      <TodaysWidget />
      <AddFoodWidget />
      <ViewLogsWidget />
      <GoalWidget />
    </>
  );
}

export default HomePage;
