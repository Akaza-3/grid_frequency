import React, { useEffect, useState } from "react";
import axios from "axios";
import SquareCard from "../../components/SquareCard";

const DisplayModels = () => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/getModels")
      .then((response) => {
        console.log(response);
        setModels(response.data.models);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="pt-24 bg-[#141514] min-h-screen text-white flex flex-wrap ">
      <p className="text-center text-3xl w-full">
        All Publicly Available Models
      </p>
      {models.map((model, index) => (
        <SquareCard key={index} name={model.modelName} time={model.time} />
      ))}
      <div>
        <a href="/models/addModels">
          <button>Go to Add Models</button>
        </a>
      </div>
    </div>
  );
};

export default DisplayModels;
