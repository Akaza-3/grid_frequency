import axios from 'axios';
import React, { useState } from 'react'

const PyToPkl = () => {

    const [file, setFile] = useState(null);

    const submitHandler = () => {
        const formData = new FormData()
        formData.append("file", file);
        axios.post("http://127.0.0.1:5000/pytopickle", formData)
        .then((response) => {
            console.log("file successfully received", response)
        })
        .catch((err) => {
            console.log(err)
        })
    }   

  return (
    <div className='pt-24'>
        <h4>Keep the name of python model : <b>"MODEL"</b></h4>
      <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
      <button onClick={submitHandler}>Click me</button>
    </div>
  )
}

export default PyToPkl
