import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Chart } from "react-google-charts";

const UserChart = () => {
  const location = useLocation();
  const modelName = location.state.modelName;
  const [prediction, setPrediction] = useState(null);
  const [graphData, setGraphData] = useState([["Time", "Prediction", "Mean", "Standard Deviation"]]); // Initialize with header
  const [info, setInfo] = useState(null)
  const [dataHolder, setDataHolder] = useState([])
  const [histogramData, setHistogramData] = useState([["Prediction", "Value"]])
  let sum=0
  let size=1;
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
        
        setPrediction(data.prediction); // Store prediction value directly

        //storing data for standard deviation
        setDataHolder(prevData => {
          return [...prevData, data.prediction];
        });

        
        //adding all the values for mean
        const newData = data.prediction;
        sum=sum+ newData

        //setting the x axis label for lineGraph
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        // Calculating mean value and standard deviation
        const meanValue = calculateMean(sum);
        const standardDeviation = calculateDeviation(meanValue)

        // Update graph data
        setGraphData(prevData => [...prevData, [formattedTime, newData, meanValue, standardDeviation]]);
        
        console.log(data);
      } else {
        console.error("Failed to fetch user model prediction");
      }
    } catch (error) {
      console.error("Error fetching user model prediction:", error);
    }
  };

  const calculateDeviation = (mean) => {
    let total=0;
    for(let i=0; i<dataHolder.length; i++){
      total += Math.pow((dataHolder[i] - mean),2)
    }
    total = total/size;
    total = Math.sqrt(total)
    return total;
  }

  const calculateMean = (sum) => {
    console.log("mean function", sum)
    return sum/(size++);
  }

  

  useEffect(() => {
    const intervalId = setInterval(fetchUserModelPrediction, 2000);
    
    const newLabel = `prediction${histogramData.length}`;
    setHistogramData(prevData => [...prevData, [newLabel, prediction]]);

    return () => clearInterval(intervalId);
  }, [dataHolder]); 

  return (
    <div className="pt-[80px] pl-3 bg-[#141514] text-white min-h-screen">
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
          <Chart
            className="h-1/2 pb-8 w-full"
            chartType="LineChart"
            data={graphData}
            options={{
              backgroundColor: "#141514",
              chartArea: {
                width: "90%",
                height: "70%"
              },
              colors: ["green", "blue", "red"], // Prediction in green, mean in blue, standard deviation in red
              legend: {
                position: 'bottom', 
                textStyle: {
                  color: "white"
                }
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
          <Chart
          className="pt-24"
  chartType="Histogram"
  data={histogramData}
  options={{
    backgroundColor: "#141514",
    chartArea: {
      width: "90%",
      height: "70%"
    },
    colors: ["white"], 
    legend: {
      position: 'none' 
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
