import React from 'react';

const ModelCard = ({ title, onClick }) => {
  return (
    <div className="w-1/3 p-4 cursor-pointer text-white transform transition-transform hover:scale-105 overflow-hidden" onClick={onClick}>
      <div className="shadow-md rounded-lg h-full bg-[#575757]">
        <div className="p-4 h-full grid items-center justify-center">
          <h1 className="text-lg font-semibold mb-2 md:text-2xl lg:text-4xl">{title}</h1>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
