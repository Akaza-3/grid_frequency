import React from "react";

function Home() {
  return (
    <div className="min-h-screen bg-[#1c1a1b] pt-24 pl-6 overflow-hidden">
      <div className="w-full">
        <h1 className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 text-2xl md:text-5xl text-white font-bold">
          Framework for Grid Frequency Prediction...
        </h1>
        <p className="text-white pt-6 text-lg w-2/3">
          This website is a framework for visualizing Grid Frequency and Machine
          Learning models.
        </p>
      </div>
      <div className="flex justify-center items-center pt-16">
        <img src="/graphgif.gif" alt="graph GIF" className="lg:h-[300px]  " />
      </div>
    </div>
  );
}

export default Home;
