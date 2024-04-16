// import axios from 'axios';
// import React, { useState } from 'react';
// import { saveAs } from 'file-saver';

// const PyToPkl = () => {
//     const [file, setFile] = useState(null);

//     const submitHandler = () => {
//         if (!file) {
//             console.log("No file selected");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("file", file);
//         axios.post("http://127.0.0.1:5000/pytopickle", formData, {
//             responseType: 'blob' // Set the response type to blob
//         })
//         .then((response) => {
//             const fileName = file.name.split('.').slice(0, -1).join('.');
//             const blob = new Blob([response.data]);
//             saveAs(blob, `${fileName}.pkl`);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
//     };

//     return (
//         <div className='flex flex-col md:flex-row min-h-screen bg-[#141514] text-white p-4'>
//             <div className='w-full md:w-1/2 flex flex-col justify-center items-center'>
//                 <h4 className='text-2xl text-center mb-4'>Keep the name of python model: <b>"MODEL"</b></h4>
//                 <div className='items-center'>
//                     <input type="file" onChange={(e) => setFile(e.target.files[0])} className='mb-2'/>
//                     <button onClick={submitHandler} className='border-2 p-1 font-bold bg-white text-black rounded-md'>Click me</button>
//                 </div>
//             </div>
//             <div className='w-full md:w-1/2 flex justify-center items-center'>
//                 <div className='text-center'>
//                     <h2 className='text-2xl pb-2'>Sample model for understanding</h2>
//                     <img className='rounded-xl mx-auto' src="modelImage.png" alt="model" />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PyToPkl;

import axios from 'axios';
import React, { useState } from 'react';
import { saveAs } from 'file-saver';

const PyToPkl = () => {
    const [modelFile, setModelFile] = useState(null);
    const [csvFiles, setCsvFiles] = useState([]);

    const handleModelFileChange = (e) => {
        setModelFile(e.target.files[0]);
    };

    const handleCsvFilesChange = (e) => {
        setCsvFiles([...e.target.files]);
    };

    const submitHandler = () => {
        if (!modelFile) {
            console.log("No model file selected");
            return;
        }

        const formData = new FormData();
        formData.append("modelFile", modelFile);
        csvFiles.forEach((file) => {
            formData.append("csvFiles", file);
        });

        axios.post("http://127.0.0.1:5000/pytopickle", formData, {
            responseType: 'blob' 
        })
        .then((response) => {
            const fileName = modelFile.name.split('.').slice(0, -1).join('.');
             const blob = new Blob([response.data]);
             saveAs(blob, `${fileName}.pkl`);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    return (
        <div className='flex flex-col md:flex-row min-h-screen bg-[#141514] text-white pt-24 md:pt-12 p-4'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center'>
                <h4 className='text-2xl text-center mb-4'>Keep the name of python model: <b>"MODEL"</b></h4>
                <div className='items-center'>
                <span>
                <label>Select python file: </label>
                <input type="file" onChange={handleModelFileChange} className='mb-2' accept=".py" placeholder="Select Py Files" />
                </span>
                <br/>
                <span>
                <label>Select csv files: </label>
                <input type="file" onChange={handleCsvFilesChange} multiple className='mb-2 pl-[20px]' accept=".csv" placeholder="Select CSV Files" />
                </span>
                <br/>
                <button onClick={submitHandler} className='ml-36 mt-4 border-2 p-1 font-bold bg-white text-black rounded-md'>Click me</button>
                </div>
            </div>
            <div className='w-full md:w-1/2 flex justify-center items-center'>
                <div className='text-center'>
                    <h2 className='text-2xl pb-2'>Sample model for understanding</h2>
                    <img className='rounded-xl mx-auto' src="modelImage.png" alt="model" />
                </div>
            </div>
        </div>
    );
};

export default PyToPkl;
