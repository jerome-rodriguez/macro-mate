import "./DateWidget.scss";

export default function DateWidget() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // Optional: Set to `false` for 24-hour format
  });

  return (
    <article className="date">
      <h2 className="date__header">{currentDate} </h2>
      <h2 className="date__header">{currentTime}</h2>
    </article>
  );
}
