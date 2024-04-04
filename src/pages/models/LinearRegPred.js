import React, { useState, useEffect } from "react";
import axios from "axios";
import SliderInput from "./SliderInput";
import { Chart } from "react-google-charts";

function LinearRegPred() {
  const [qideka, setqideka] = useState(0.5);
  const [f50deol, setf50deol] = useState(50);
  const [qideol, setqideol] = useState(0.5);
  const [f50pt, setf50pt] = useState(50);
  const [qipt, setqipt] = useState(0.5);
  const [f50tr, setf50tr] = useState(50);
  const [qitr, setqitr] = useState(0.5);

  const [selectedOption, setSelectedOption] = useState(1000);
  const [graphData, setGraphData] = useState([["time", "value"]]);

  const handleOptionChange = (event) => {
    setSelectedOption(parseInt(event.target.value));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("http://127.0.0.1:5000/predict1/", {
          responseType: "json",
          params: {
            qideka: qideka,
            f50deol: f50deol,
            qideol: qideol,
            f50pt: f50pt,
            qipt: qipt,
            f50tr: f50tr,
            qitr: qitr,
          },
        })
        .then((response) => {
          const responseData = response.data.prediction;
          const newLabels = Date.now();
          setGraphData((prevData) => [
            ...prevData,
            [newLabels, responseData],
          ]);
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [qideka, f50deol, qideol, f50pt, qipt, f50tr, qitr]);

  const handleSliderChange1 = (event) => {
    setqideka(event.target.value);
  };
  const handleSliderChange2 = (event) => {
    setf50deol(event.target.value);
  };
  const handleSliderChange3 = (event) => {
    setqideol(event.target.value);
  };
  const handleSliderChange4 = (event) => {
    setf50pt(event.target.value);
  };
  const handleSliderChange5 = (event) => {
    setqipt(event.target.value);
  };
  const handleSliderChange6 = (event) => {
    setf50tr(event.target.value);
  };
  const handleSliderChange7 = (event) => {
    setqitr(event.target.value);
  };
  return (
    <div className="grid items-center justify-center text-white h-screen bg-[#141514] pt-[75px]">
      <div className="grid items-center justify-center">
        <label htmlFor="dropdown">Max points to select:</label>
        <select
          className="bg-black"
          id="dropdown"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={1000}>All</option>
        </select>
      </div>
      <Chart
        className="h-[45vh] w-full"
        chartType="LineChart"
        data={graphData}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label>qideka</label>
          <SliderInput
            label="qideka"
            min={0}
            max={1}
            step={0.01}
            value={qideka}
            onChange={handleSliderChange1}
          />
        </div>
        <div>
        <label>f50deol</label>
          <SliderInput
            label="f50deol"
            min={0}
            max={100}
            value={f50deol}
            onChange={handleSliderChange2}
          />
        </div>
        <div>
        <label>qideol</label>
          <SliderInput
            label="qideol"
            min={0}
            max={1}
            step={0.01}
            value={qideol}
            onChange={handleSliderChange3}
          />
        </div>
        <div>
        <label>f50pt</label>
          <SliderInput
            label="f50pt"
            min={0}
            max={100}
            value={f50pt}
            onChange={handleSliderChange4}
          />
        </div>
        <div>
        <label>qipt</label>
          <SliderInput
            label="qipt"
            min={0}
            max={1}
            step={0.01}
            value={qipt}
            onChange={handleSliderChange5}
          />
        </div>
        <div>
        <label>f50tr</label>
          <SliderInput
            label="f50tr"
            min={0}
            max={100}
            value={f50tr}
            onChange={handleSliderChange6}
          />
        </div>
        <div>
        <label>qitr</label>
          <SliderInput
            label="qitr"
            min={0}
            max={1}
            step={0.01}
            value={qitr}
            onChange={handleSliderChange7}
          />
        </div>
      </div>
    </div>
  );
}

export default LinearRegPred;
