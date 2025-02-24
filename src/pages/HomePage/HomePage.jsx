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
  const date = new Date().toLocaleDateString("en-CA");
  return (
    <section className="home-page">
      <div className="home-page__user-widget">
        <UserWidget />
      </div>

      <article className="home-page__group1">
        <div className="home-page__date-widget">
          <DateWidget />
        </div>

        <Link to="/view-logs" className="home-page__view-logs-widget">
          <ViewLogsWidget />
        </Link>
      </article>

      <article className="home-page__group2">
        <Link to={`/view-logs/${date}`} className="home-page__todays-widget">
          <TodaysWidget />
        </Link>
        <div className="home-page__group2-bottom">
          <Link to="/add-food" className="home-page__add-food-widget">
            <AddFoodWidget />
          </Link>

          <Link to="/upload" className="home-page__upload-widget">
            <UploadWidget />
          </Link>
        </div>
      </article>

      <Link to="/goals" className="home-page__goal-widget">
        <GoalWidget />
      </Link>
    </section>
  );
}

export default HomePage;
