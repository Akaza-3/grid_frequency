import React from 'react'

const Contact = () => {
  return (
    <div className='bg-[#141514]  min-h-screen pt-24'>
    <h1 className='text-center font-bold text-6xl text-white'>Contact Us</h1>      
    <div className="flex justify-center items-center pt-24 bg-[#141514]">
      <div className="flex flex-col md:flex-row">
          <div className="bg-[#575757] text-white shadow-md rounded-md p-6 max-w-sm mx-2 mb-4 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">Sahil Kothari</h2>
            <div className="mb-4">
              <p className="mb-2">Phone: 1234567890</p>
              <p className="mb-2">Email: 202001112@daiict.ac.in</p>
            </div>
          </div>

          <div className="bg-[#575757] text-white shadow-md rounded-md p-6 max-w-sm mx-2 mb-4 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">Shreyansh Khemesara</h2>
            <div className="mb-4">
              <p className="mb-2">Phone: 0987654321</p>
              <p className="mb-2">Email: 202001121@daiict.ac.in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
