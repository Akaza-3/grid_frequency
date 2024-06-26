import React from 'react'
import ModelCard from '../../components/ModelCard'
import {useNavigate} from 'react-router-dom'

const Model = () => {

  const navigate = useNavigate();

  const uploadModelHandler = () => {
    navigate('/models/modelUpload')
  }

  const viewModelHandler = () =>{
    navigate('/models/displayModels')
  }

  return (
    <div className='pt-24 text-white p-2 bg-[#141514] w-full h-screen flex flex-col items-center justify-center'>
    <ModelCard title={"Upload Models"} onClick={uploadModelHandler}/>
    <ModelCard title={"View Models"} onClick={viewModelHandler}/>
    </div>
  )
}

export default Model
