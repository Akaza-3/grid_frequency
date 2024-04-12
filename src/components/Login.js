import React from "react";

const Login = ({ handleLogin }) => {
  return (
    <div style={{ margin: "500px" }}>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
