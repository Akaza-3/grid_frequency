import React from 'react'
import { Link } from 'react-router-dom'

const Model = () => {
  return (
    <div className='mt-[64px] text-white p-2 bg-[#141514] w-full h-screen'>
    <ul >
        <li>
            <Link to="/models/advertising">See random value graph generation</Link>
        </li>
        <li>
            <Link to="/models/linearPrediction">Prediction using sliders</Link>
        </li>
        <li>
          <Link to="/models/modelUpload">See graph of user generated pickle model</Link>
        </li>
        <li>
          <Link to="/models/displayModels">See all the stored models in db</Link>
        </li>
    </ul>
        
    </div>
  )
}

export default Model
