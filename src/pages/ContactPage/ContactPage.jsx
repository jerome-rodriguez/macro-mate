import "./ContactPage.scss";

import Github from "../../../public/images/github.png";
import LinkedIn from "../../../public/images/linkedin.png";
import githubQR from "../../assets/icons/github.svg";
import linkedinQR from "../../assets/icons/linkedin.svg";

function ContactPage() {
  return (
    <section className="contact-page">
      <h1 className="contact-page__title">Contact Me!</h1>

      <div className="contact-page__item">
        <img className="contact-page__icon" src={Github} alt="GitHub" />
        <article className="contact-page__article">
          <h4 className="contact-page__heading">GitHub</h4>
          <img className="contact-page__qr" src={githubQR} alt="GitHub QR" />
          <p className="contact-page__link">github.com/jerome-rodriguez</p>
        </article>
      </div>

      <div className="contact-page__item">
        <img className="contact-page__icon" src={LinkedIn} alt="LinkedIn" />
        <article className="contact-page__article">
          <h4 className="contact-page__heading">LinkedIn</h4>
          <img
            className="contact-page__qr"
            src={linkedinQR}
            alt="LinkedIn QR"
          />
          <p className="contact-page__link">linkedin.com/in/rodriguezjerome</p>
        </article>
      </div>

      <h4 className="contact-page__email">
        Email: jerome.rodriguez@torontomu.ca
      </h4>
    </section>
  );
}

export default ContactPage;
