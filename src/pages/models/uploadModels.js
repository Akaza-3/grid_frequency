import React, { useState } from "react";
import GraphData from "./chartDisplay";
import { useNavigate } from "react-router-dom";

const PickleUploadForm = () => {
  const [modelName, setModelName] = useState("");
  const [inputs, setInputs] = useState([{ name: "", range: [0, 0] }]);
  const [graphData, setGraphData] = useState(null);
  const handleAddInput = () => {
    setInputs([...inputs, { name: "", range: [0, 0] }]);
  };
  const history = useNavigate();

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedInputs = [...inputs];
    if (name === "name") {
      updatedInputs[index].name = value;
    } else if (name === "min" || name === "max") {
      updatedInputs[index].range[name === "min" ? 0 : 1] = parseFloat(value);
    }
    setInputs(updatedInputs);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("pickleFile", pickleFile);
    formData.append("modelName", modelName);
    formData.append("inputs", JSON.stringify(inputs));

    try {
      const response = await fetch("http://localhost:5000/uploadPickle", {
        method: "POST",
        body: formData, // Use the formData object here
      });

      if (response.ok) {
        console.log("Pickle file uploaded successfully!");
        // You can optionally clear the form here
        setModelName("");
        setInputs([{ name: "", range: [0, 0] }]);
        setPickleFile(null);
        history("/models/userChart", {
          state: { modelName: modelName }, // Pass modelName as props using state
        });
      } else {
        console.error("Error uploading pickle file:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading pickle file:", error);
    }
  };

  const [pickleFile, setPickleFile] = useState(null);

  return (
    <div className="bg-[#141514] min-h-screen flex items-center pt-12 justify-center">
      <form
        onSubmit={handleSubmit}
        className="m-4 md:m-12 p-6 md:p-8 text-white max-w-lg w-full rounded-lg"
      >
        <div className="mb-4">
          <span className="">
            <label htmlFor="modelName" className="block text-white mb-2">
              Model Name:
            </label>
            <input
              type="text"
              id="modelName"
              name="modelName"
              value={modelName}
              onChange={(event) => setModelName(event.target.value)}
              required
              className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </span>
        </div>
        <div className="mb-4">
          <h2 className="text-lg mb-2">Input Fields</h2>
          {inputs.map((input, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center gap-2 md:gap-4"
            >
              <label
                htmlFor={`inputName-${index}`}
                className="block text-white w-full max-w-xs"
              >
                Input Name:
              </label>
              <input
                type="text"
                id={`inputName-${index}`}
                name="name"
                value={input.name}
                onChange={(event) => handleInputChange(event, index)}
                required
                className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <label
                htmlFor={`inputMin-${index}`}
                className="block text-white w-full max-w-xs"
              >
                Min Range:
              </label>
              <input
                type="number"
                id={`inputMin-${index}`}
                name="min"
                value={input.range[0]}
                onChange={(event) => handleInputChange(event, index)}
                required
                className="text-black first:w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <label
                htmlFor={`inputMax-${index}`}
                className="block text-white w-full max-w-xs"
              >
                Max Range:
              </label>
              <input
                type="number"
                id={`inputMax-${index}`}
                name="max"
                value={input.range[1]}
                onChange={(event) => handleInputChange(event, index)}
                required
                className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddInput}
            className="mt-2 md:mt-4 bg-[#575757] text-white py-2 px-4 rounded hover:bg-[#313030]"
          >
            Add Input Field
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="pickleFile" className="block text-white">
            Pickle File:
          </label>
          <input
            type="file"
            id="pickleFile"
            name="pickleFile"
            accept=".pkl"
            onChange={(event) => setPickleFile(event.target.files[0])}
            required
            className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-[#575757] text-white py-2 px-4 rounded hover:bg-[#313030]"
        >
          Upload Pickle
        </button>
      </form>
      {graphData === null ? (
        <div style={{ color: "red" }}>
          Upload the model or wait for response to come
        </div>
      ) : (
        <GraphData data={graphData} />
      )}
    </div>
  );
};

export default PickleUploadForm;
