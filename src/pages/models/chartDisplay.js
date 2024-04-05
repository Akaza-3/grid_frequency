import React from "react";

const GraphData = ({ data }) => {
  return (
    <div className="graph-container">
      <h2>Graph Data</h2>
      <div className="graph">
        {/* Render your graph using data */}
        {/* For simplicity, let's just render data as JSON */}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default GraphData;
