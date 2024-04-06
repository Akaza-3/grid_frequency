import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart } from "react-google-charts";

const UserChart = () => {
  const location = useLocation();
  const modelName = location.state.modelName;
  const [prediction, setPrediction] = useState(null);
  const [graphData, setGraphData] = useState([["time", "value"]]);

  // const options = {
  //   scales: {
  //     x: {
  //       ticks: {
  //         color: "#ffffff", // x-axis labels color
  //       },
  //     },
  //     y: {
  //       ticks: {
  //         color: "#ffffff", // y-axis labels color
  //       },
  //     },
  //   },
  // };
  // const [data, setData] = useState({
  //   labels: [],
  //   datasets: [
  //     {
  //       label: "Real-Time Data",
  //       data: [],
  //       fill: false,
  //       borderColor: "rgb(0, 151, 67)",
  //       tension: 0.1,
  //     },
  //   ],
  // });
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
        const newData = data.prediction;
        const now = Date.now();

        setGraphData((prevData) => [...prevData, [now, newData]]);

        // let newLabels = [];
        // if (Array.isArray(data.labels)) {
        //   newLabels = [...data.labels, now];
        // } else {
        //   newLabels = [now]; // or handle it in a way that suits your application
        // }
        // const newDataPoints = [...data.datasets[0].data, newData];
        // setData({
        //   labels: newLabels,
        //   datasets: [
        //     {
        //       ...data.datasets[0],
        //       data: newDataPoints,
        //     },
        //   ],
        // });
        console.log(data);
      } else {
        console.error("Failed to fetch user model prediction");
      }
    } catch (error) {
      console.error("Error fetching user model prediction:", error);
    }
  };

  // useEffect hook to fetch data every 20 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchUserModelPrediction, 2000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [prediction, graphData]); // Empty dependency array to run the effect only once on mount

  return (
    <div style={{ marginTop: "200px" }}>
      <h1>{modelName}</h1>
      {prediction !== null && (
        <div>
          <h2>Prediction:</h2>
          <p>{prediction}</p>
          <Chart
            className="h-[45vh] w-full"
            chartType="LineChart"
            data={graphData}
          />
        </div>
      )}
    </div>
  );
};

export default UserChart;
