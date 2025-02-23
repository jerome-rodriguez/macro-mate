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
    <div className="upload-container">
      <h2>Upload Your Food Photo</h2>

      {/* File Input */}
      <label className="file-upload">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <span>Select Image</span>
      </label>

      {/* Image Preview */}
      {previewUrl && <img className="preview" src={previewUrl} alt="Preview" />}

      {/* Meal Type Dropdown */}
      <select
        className="meal-select"
        value={mealType}
        onChange={handleMealChange}
      >
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
      </select>

      {/* Submit Button */}
      <button className="upload-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Display Results */}
      {result && (
        <div className="result">
          <h3>Results:</h3>
          <p>
            <strong>Detected Food:</strong> {result.label}
          </p>
          <p>
            <strong>Meal Type:</strong> {result.mealType}
          </p>
          <p>
            <strong>Calories:</strong> {result.macros.calories} kcal
          </p>
          <p>
            <strong>Protein:</strong> {result.macros.protein} g
          </p>
          <p>
            <strong>Carbs:</strong> {result.macros.carbs} g
          </p>
          <p>
            <strong>Fat:</strong> {result.macros.fat} g
          </p>
        </div>
      )}
    </div>
  );
}
