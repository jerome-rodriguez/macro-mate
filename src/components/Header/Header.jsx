import "./Header.scss";
import logo from "../../assets/logos/macromate-logo.svg";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <section className="header">
      <div className="header__logo">
        <Link to="/" className="header__link">
          <img className="header__img" src={logo} alt="macromate logo" />
          <h4 className="header___title">MacroMate</h4>
        </Link>
      </div>
    </section>
  );
}
