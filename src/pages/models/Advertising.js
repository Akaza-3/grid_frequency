import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";


function Advertising() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Real-Time Data",
        data: [],
        fill: false,
        borderColor: "rgb(0, 151, 67)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("http://127.0.0.1:5000/prediction-data", {
          responseType: "json",
        })
        .then((response) => {
          console.log(response);
          const newData = JSON.parse(response.data.data);
          console.log(newData);
          setA(newData.a);
          setB(newData.b);
          setC(newData.c);
          setValue(newData.value);
          const newLabels = [...data.labels, newData.time];
          const newDataPoints = [...data.datasets[0].data, newData.value];
          setData({
            labels: newLabels,
            datasets: [
              {
                ...data.datasets[0],
                data: newDataPoints,
              },
            ],
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }, [1000]);

    return () => clearInterval(interval);
  }, [data]);

  const options = {
    scales: {
      x: {
        ticks: {
          color: "#ffffff", // x-axis labels color
        },
      },
      y: {
        ticks: {
          color: "#ffffff", // y-axis labels color
        },
      },
    },
  };

  return (
    <>
      <div className=" w-full h-screen pt-24 bg-[#141514]">
        <div className="text-white p-3">
          <h2>TV = {a}</h2>
          <h2>Radio = {b}</h2>
          <h2>Newspaper = {c}</h2>
          <br />
          <h1>Predicted sales value: {value}</h1>

          <div className="sm:h-full sm:w-screen md:h-5/6 md:w-1/2">
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Advertising;
