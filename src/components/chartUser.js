import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart } from "react-google-charts";
import axios from 'axios'
const UserChart = () => {
  const location = useLocation();
  const modelName = location.state.modelName;
  const [prediction, setPrediction] = useState(null);
  const [graphData, setGraphData] = useState([["time", "value"]]);
  const [info, setInfo] = useState(null)

  const fetchUserModelPrediction = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/getUserModelPrediction?modelName=${encodeURIComponent(
          modelName
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setInfo(data.ranges)
        setPrediction(data.prediction);
        const newData = data.prediction;
        const now = new Date();

        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const formattedTime = `${hour}:${minutes}:${seconds}`;
        setGraphData((prevData) => [...prevData, [formattedTime, newData]]);
        console.log(data);
      } else {
        console.error("Failed to fetch user model prediction");
      }
    } catch (error) {
      console.error("Error fetching user model prediction:", error);
    }
  };

  const roundNumber = (number) => {
    return number.toFixed(4);
  }

  useEffect(() => {
    const intervalId = setInterval(fetchUserModelPrediction, 2000);

    return () => clearInterval(intervalId);
  }, [prediction, graphData]); 

  return (
    <div className="pt-24 pl-3 bg-[#141514] text-white min-h-screen">
    {prediction===null && (
      <div className="animate-bounce pt-48 text-3xl grid items-center justify-center">Loading...</div>
    )}
      <br/>
      <br/>
      
      {prediction !== null && (
        <div className="flex flex-row">
        <div className="w-1/4 pr-5">
          <h1 className="text-5xl font-bold">{modelName}</h1>
          <br/>
          <br/>
          <br/>
          <p className="text-2xl">Parameters and their ranges</p>
          {info && info.map((item, index) => (
            <div key={index} className="flex flex-row">
              <h3 className="text-lg pr-2">{item.name} :  </h3>
              <p className="text-lg">{item.range.join(' - ')}</p>
            </div>
          ))}
      </div>
        <div className="w-3/4">
          <span className="flex flex-row text-xl">
            <h2>Prediction:</h2>
            <p className="pl-4 pb-4">{roundNumber(prediction)}</p>
          </span>
          <Chart
            className="h-[60vh] w-full"
            chartType="LineChart"
            data={graphData}
            options={{
              backgroundColor: "#141514",
              chartArea: {
                width: "90%",
                height: "90%"
              },
              colors: ["green"],
              legend: {
                textStyle: {
                  color: "white"
                },
                
              },
              hAxis: {
                textStyle: {
                  color: "white"
                },
                gridlines: {
                  color: "transparent" 
                },
                
              },
              vAxis: {
                textStyle: {
                  color: "white"
                },
                gridlines: {
                  color: "transparent" 
                },
                
              }
            }}
          />
        </div>
        </div>
      )}
    </div>
  );
};

export default UserChart;
