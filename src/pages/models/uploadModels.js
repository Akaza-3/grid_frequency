import React, { useState } from "react";

const PickleUploadForm = () => {
  const [modelName, setModelName] = useState("");
  const [inputs, setInputs] = useState([{ name: "", range: [0, 0] }]);

  const handleAddInput = () => {
    setInputs([...inputs, { name: "", range: [0, 0] }]);
  };

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
        body: formData,
        "Content-Type": "application/json",
      });

      if (response.ok) {
        console.log("Pickle file uploaded successfully!");
        // You can optionally clear the form here
        setModelName("");
        setInputs([{ name: "", range: [0, 0] }]);
        setPickleFile(null);
      } else {
        console.error("Error uploading pickle file:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading pickle file:", error);
    }
  };

  const [pickleFile, setPickleFile] = useState(null);

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "100px" }}>
      <div>
        <label htmlFor="modelName">Model Name:</label>
        <input
          type="text"
          id="modelName"
          name="modelName"
          value={modelName}
          onChange={(event) => setModelName(event.target.value)}
          required
        />
      </div>
      <div>
        <h2>Input Fields</h2>
        {inputs.map((input, index) => (
          <div key={index}>
            <label htmlFor={`inputName-${index}`}>Input Name:</label>
            <input
              type="text"
              id={`inputName-${index}`}
              name="name"
              value={input.name}
              onChange={(event) => handleInputChange(event, index)}
              required
            />
            <label htmlFor={`inputMin-${index}`}>Min Range:</label>
            <input
              type="number"
              id={`inputMin-${index}`}
              name="min"
              value={input.range[0]}
              onChange={(event) => handleInputChange(event, index)}
              required
            />
            <label htmlFor={`inputMax-${index}`}>Max Range:</label>
            <input
              type="number"
              id={`inputMax-${index}`}
              name="max"
              value={input.range[1]}
              onChange={(event) => handleInputChange(event, index)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddInput}>
          Add Input Field
        </button>
      </div>
      <div>
        <label htmlFor="pickleFile">Pickle File:</label>
        <input
          type="file"
          id="pickleFile"
          name="pickleFile"
          accept=".pkl"
          onChange={(event) => setPickleFile(event.target.files[0])}
        />
      </div>
      <button type="submit">Upload Pickle</button>
    </form>
  );
};

export default PickleUploadForm;
