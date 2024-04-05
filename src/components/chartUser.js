import React from "react";
import { useLocation } from "react-router-dom";

const UserChart = () => {
  const location = useLocation();
  const modelName = location.state.modelName;

  // Now you have access to modelName here and you can use it to make requests to the backend to fetch data

  return (
    <div style={{ marginTop: "200px" }}>
      <h1>{modelName}</h1>
      {/* Render other content based on modelName */}
    </div>
  );
};

export default UserChart;
