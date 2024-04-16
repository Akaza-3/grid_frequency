import React from "react";

const Login = ({ handleLogin }) => {
  return (
    <div className="bg-[#141514] min-h-screen font-bold text-5xl  flex items-center justify-center">
      <button onClick={handleLogin} className="border-4 border-[#575757] bg-[#575757] text-black p-4 rounded-md" >Login with Google</button>
    </div>
  );
};

export default Login;
