import React from 'react'

function Home() {
  return (
    <div className="flex min-h-screen  bg-[#141514] pt-64 pl-8">
      <div className="w-full md:w-2/3 lg:w-4/5">
        <h1 className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 text-2xl md:text-7xl text-white font-bold ">Grid Frequency Predictor...</h1>
        <p className='text-white pt-6 text-lg w-2/3'>The Grid Frequency Predictor is trying to solve the problem of predicting the frequency via Machine Learning. </p>
      </div>
    </div>

  )
}

export default Home
