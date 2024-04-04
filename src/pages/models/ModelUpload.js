import React, { useState } from 'react';
import SliderInput from '../../components/SliderInput';
import axios from 'axios';

const ModelUpload = () => {

    const [number, setNumber] = useState(1);
    const [file, setFile] = useState(null);

    const fileSaveHandler = () => {
        const formData = new FormData();
        formData.append('file', file);

        axios.post('http://127.0.0.1:5000/fileSave', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          console.log(response);
        }).catch((err) => {
          console.log(err);
        });
    };


  return (
    <div className='pt-24 bg-[#141514] w-full h-screen text-white'>
        <form>
            <label>Enter file here: </label>
            <input type="file" onChange={(e) => {setFile(e.target.files[0])}}/>
            <br/>
            
            <span className='flex flex-row '>
              <p className='pr-3'>Do you wish to save the model for public use? (click the yes button if you want to, else ignore)</p>
              <button className="border-2 p-1 " type="button" onClick={fileSaveHandler}>Save to database</button>
            </span>
        </form>
    </div>
  );
};

export default ModelUpload;
