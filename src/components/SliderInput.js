import React, { useState } from "react";

function SliderInput({ min, max, step, value, onChange }) {
  // State to track if tooltip should be shown
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="slider-container">
      {/* Slider input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        onMouseEnter={() => setShowTooltip(true)} // Show tooltip on mouse enter
        onMouseLeave={() => setShowTooltip(false)} // Hide tooltip on mouse leave
      />

      {/* Displaying current value */}
      <p>Current Value: {value}</p>

      {/* Tooltip */}
      {showTooltip && (
        <div className="tooltip">
          {Number(value).toFixed(2)}{" "}
          {/* Convert value to number and show with 2 decimal places */}
        </div>
      )}
    </div>
  );
}

export default SliderInput;
