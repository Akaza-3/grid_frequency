import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const UserChart = () => {
  const location = useLocation();
  const modelName = location.state.modelName;
  const [prediction, setPrediction] = useState(null);

  // Function to fetch user model prediction
  const fetchUserModelPrediction = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/getUserModelPrediction?modelName=${encodeURIComponent(
          modelName
        )}`
      );

      if (response.ok) {
        const data = await response.json();
        setPrediction(data.prediction);
      } else {
        console.error("Failed to fetch user model prediction");
      }
    } catch (error) {
      console.error("Error fetching user model prediction:", error);
    }
  };

  // useEffect hook to fetch data every 20 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchUserModelPrediction, 20000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [prediction]); // Empty dependency array to run the effect only once on mount

  return (
    <div style={{ marginTop: "200px" }}>
      <h1>{modelName}</h1>
      {prediction !== null && (
        <div>
          <h2>Prediction:</h2>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default UserChart;
