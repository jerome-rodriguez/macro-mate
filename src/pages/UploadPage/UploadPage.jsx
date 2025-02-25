import { useState } from "react";
import axios from "axios";
import "./UploadPage.scss";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mealType, setMealType] = useState("breakfast");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  // Handle meal type change
  const handleMealChange = (event) => {
    setMealType(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select an image before uploading.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("mealType", mealType);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/vision/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data);
    } catch (error) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="upload-page">
      <h2 className="upload-page__header">Upload Your Food Photo</h2>

      <div className="upload-page__container">
        <label className="upload-page__upload-zone">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <span>Click to upload an image</span>
        </label>

        {previewUrl && (
          <img
            className="upload-page__preview"
            src={previewUrl}
            alt="Preview"
          />
        )}

        <select
          className="upload-page__select"
          value={mealType}
          onChange={handleMealChange}
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>

        <button
          className="upload-page__button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Upload Photo"}
        </button>

        {error && <p className="upload-page__error">{error}</p>}

        {result && (
          <div className="upload-page__result">
            <h3 className="upload-page__analysis">Analysis Results</h3>
            <p className="upload-page__p">
              <strong className="upload-page__strong">Detected Food:</strong>{" "}
              {result.label}
            </p>
            <p className="upload-page__p">
              <strong className="upload-page__strong">Meal Type:</strong>{" "}
              {result.mealType}
            </p>
            <p className="upload-page__p">
              <strong className="upload-page__strong">Calories:</strong>{" "}
              {result.macros.calories} kcal
            </p>
            <p className="upload-page__p">
              <strong className="upload-page__strong">Protein:</strong>{" "}
              {result.macros.protein} g
            </p>
            <p className="upload-page__p">
              <strong className="upload-page__strong">Carbs:</strong>{" "}
              {result.macros.carbs} g
            </p>
            <p className="upload-page__p">
              <strong className="upload-page__strong">Fat:</strong>{" "}
              {result.macros.fat} g
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
