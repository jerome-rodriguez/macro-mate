import React, { useState, useEffect } from "react";
import axios from "axios";

const FoodImageRecognition = () => {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

  // Load and convert image to base64 on component mount
  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch("/food-image.jpg");
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          // Remove the "data:image/jpeg;base64," prefix
          const base64String = reader.result.split(",")[1];
          setImageBase64(base64String);
        };

        reader.readAsDataURL(blob);
      } catch (err) {
        setError("Error loading image");
        console.error("Error loading image:", err);
      }
    };

    loadImage();
  }, []);

  const analyzeImage = async () => {
    if (!imageBase64) {
      setError("Image not yet loaded");
      return;
    }

    setLoading(true);
    setError("");
    setLabels([]);

    try {
      const requestBody = {
        requests: [
          {
            image: {
              content: imageBase64,
            },
            features: [
              {
                type: "LABEL_DETECTION",
                maxResults: 5,
              },
            ],
          },
        ],
      };

      const response = await axios.post(VISION_API_URL, requestBody);

      if (response.data?.responses?.[0]?.labelAnnotations) {
        const detectedLabels = response.data.responses[0].labelAnnotations;
        setLabels(detectedLabels);
      } else {
        setError("No labels detected, or API response format is incorrect.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Error analyzing image, please try again."
      );
      console.error("Error during API call:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Food Image Recognition</h2>

      <div className="space-y-4">
        <div className="w-full aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
          <img
            src="/food-image.jpg"
            alt="Food to analyze"
            className="w-full h-full object-cover"
          />
        </div>

        <button
          onClick={analyzeImage}
          disabled={loading || !imageBase64}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : "Analyze Image"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {labels.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Detected Labels:</h3>
            <ul className="space-y-2">
              {labels.map((label, index) => (
                <li key={index} className="flex justify-between border-b pb-2">
                  <span>{label.description}</span>
                  <span className="text-gray-500">
                    {(label.score * 100).toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodImageRecognition;
