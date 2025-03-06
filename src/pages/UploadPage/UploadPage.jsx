import { useState } from "react";
import axios from "axios";
import "./UploadPage.scss";

const API_URL = import.meta.env.VITE_API_URL;

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select an image before uploading.");
      return;
    }

    // Clear any previous results or errors before starting the upload
    setLoading(true);
    setError("");
    setResult(null);

    // Create FormData and append the selected file and meal type
    const formData = new FormData();
    formData.append("image", selectedFile); // Assuming 'selectedFile' contains the image
    formData.append("mealType", mealType); // Ensure 'mealType' is the correct state variable from your dropdown

    try {
      // Send the form data to the backend
      const response = await axios.post(
        `${API_URL}/api/vision/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Check and log the backend response to see what you're receiving
      console.log("Backend response:", response.data);

      // Assuming the backend response contains the relevant data you want to display
      setResult(response.data); // You can set the result to display the data in the UI
    } catch (error) {
      console.error("Upload failed:", error); // Log the actual error if needed for debugging
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false); // Hide the loading spinner or loading state
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
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
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
              {mealType} {/* Display meal type */}
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
