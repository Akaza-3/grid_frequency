import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Chart } from "react-google-charts";

const UserChart = () => {
  const location = useLocation();
  const modelName = location.state.modelName;
  const [prediction, setPrediction] = useState(null);
  const [graphData, setGraphData] = useState([
    ["Time", "Prediction","Mean", "Mean + a * SD", "Mean - a * SD"],
  ]); // Initialize with header
  const [info, setInfo] = useState(null);
  const [dataHolder, setDataHolder] = useState([]);
  const [histogramData, setHistogramData] = useState([["Prediction", "Prediction Count"]]);
  let sum = 0;
  let size = 1;
  const fetchUserModelPrediction = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/getUserModelPrediction?modelName=${encodeURIComponent(
          modelName
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setInfo(data.ranges);

        setPrediction(data.prediction); // Store prediction value directly

        //storing data for standard deviation
        setDataHolder((prevData) => {
          return [...prevData, data.prediction];
        });

        //adding all the values for mean
        const newData = data.prediction;
        sum = sum + newData;

        //setting the x axis label for lineGraph
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        // Calculating mean value and standard deviation
        const meanValue = calculateMean(sum);
        const standardDeviation = calculateDeviation(meanValue);
        // Update graph data
        setGraphData((prevData) => [
            ...prevData,
            [
              formattedTime, 
              newData,
              meanValue,
              meanValue + 0.2 * standardDeviation,
              meanValue - 0.2 * standardDeviation,
            ],
          ]);

        console.log(data);
      } else {
        console.error("Failed to fetch user model prediction");
      }
    } catch (error) {
      console.error("Error fetching user model prediction:", error);
    }
  };

  const calculateDeviation = (mean) => {
    let total = 0;
    for (let i = 0; i < dataHolder.length; i++) {
      total += Math.pow(dataHolder[i] - mean, 2);
    }
    total = total / size;
    total = Math.sqrt(total);
    return total;
  };

  const calculateMean = (sum) => {
    console.log("mean function", sum);
    return sum / size++;
  };

  useEffect(() => {
    const intervalId = setInterval(fetchUserModelPrediction, 2000);

    const newLabel = `prediction${histogramData.length}`;
    setHistogramData((prevData) => [...prevData, [newLabel, prediction]]);

    return () => clearInterval(intervalId);
  }, [dataHolder]);


  const handleModelName = (name) => {
    const words = name.split(" ");
    const capitalizedWords = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
     });

    const capitalizedModelName = capitalizedWords.join(" ");
    return capitalizedModelName;
  }

  return (
    <div className="pt-[80px] pl-3 bg-[#141514] text-white min-h-screen">
      {prediction === null && (
        <div className="animate-bounce pt-48 text-3xl grid items-center justify-center">
          Loading...
        </div>
      )}
      <br />
      <br />

      {prediction !== null && (
        <div>
          <div className="w-full pr-5 text-center justify-center">
            <h1 className="text-5xl font-bold">{handleModelName(modelName)}</h1>
            <br />
            <br />
            <br />
            <p className="text-2xl">Parameters and their ranges</p>
            {info &&
              info.map((item, index) => (
                <div key={index} className="flex flex-row text-center justify-center">
                  <h3 className="text-lg pr-2">{item.name} : </h3>
                  <p className="text-lg">{item.range.join(" - ")}</p>
                </div>
              ))}
          </div>
          <div className="w-full">
            <Chart
              className="h-[60vh] pb-8 w-full"
              chartType="LineChart"
              data={graphData}
              options={{
                backgroundColor: "#141514",
                chartArea: {
                  width: "90%",
                  height: "70%",
                },
                series: {
                  0: { color: "green" }, // Prediction line
                  1: { color: "blue", type: "line" }, // Mean + 0.2 * SD line
                  2: { color: "red", type: "line" }, // Mean - 0.2 * SD line
                  3: { color: "lightblue", type: "line"}, // Shaded area
                },
                legend: {
                  position: "bottom",
                  textStyle: {
                    color: "white",
                  },
                },
                hAxis: {
                  title: "Time",
                  titleTextStyle: {
                    color: 'white'
                  },
                  textStyle: {
                    color: "white",
                  },
                  gridlines: {
                    color: "transparent",
                  },
                },
                vAxis: {
                  title: "Value",
                  titleTextStyle: {
                    color: 'white'
                  },
                  textStyle: {
                    color: "white",
                  },
                  gridlines: {
                    color: "transparent",
                  },
                  viewWindow: {
                    max: 700
                  }
                },
              }}
              
            />

            <Chart
              className="pt-24 h-[60vh]"
              chartType="Histogram"
              data={histogramData}
              options={{
                backgroundColor: "#141514",
                chartArea: {
                  width: "90%",
                  height: "70%",
                },
                colors: ["white"],
                legend: {
                  position: "bottom",
                  textStyle: {
                    color: "white",
                  },
                },
                hAxis: {
                  title: "Prediction",
                  titleTextStyle: {
                    color: 'white'
                  },
                  textStyle: {
                    color: "white",
                  },
                  gridlines: {
                    color: "transparent",
                  },
                },
                vAxis: {
                  title: "Prediction Count",
                  titleTextStyle: {
                    color: 'white'
                  },
                  textStyle: {
                    color: "white",
                  },
                  gridlines: {
                    color: "transparent",
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserChart;
