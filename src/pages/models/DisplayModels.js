import React, { useEffect, useState } from "react";
import axios from "axios";
import SquareCard from "../../components/SquareCard";

const DisplayModels = () => {
  const [models, setModels] = useState(null);

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
    <div className="pt-24 bg-[#141514] min-h-screen text-white items-start flex-wrap">
      <p className="text-center text-5xl w-full mb-8">
        All Saved Models
      </p>
      {
        models===null && (
          <div className="animate-bounce pt-24 text-3xl grid items-center justify-center">Loading...</div>
        )
      }
      {models!==null && models.map((model, index) => (
        <SquareCard key={index} name={model.modelName} time={model.time} />
      ))}
    </div>
  );
};

export default DisplayModels;
