import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Model from "./pages/models/Model";
import PickleUploadForm from "./pages/models/uploadModels";
import DisplayModels from "./pages/models/DisplayModels";
import UserChart from "./components/chartUser";
import Login from "./components/Login";
import PyToPkl from "./pages/models/PyToPkl";
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAEY1TAQJ9zMwWul1m7eDCWwQPgvPTKFUQ",
  authDomain: "grid-frequency-574eb.firebaseapp.com",
  projectId: "grid-frequency-574eb",
  storageBucket: "grid-frequency-574eb.appspot.com",
  messagingSenderId: "870074634882",
  appId: "1:870074634882:web:a78706cfd38f33b465da9b",
  measurementId: "G-PF1HC2D1RM",
};
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase initialization
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <BrowserRouter>
      <Navbar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {user ? (
          <>
            <Route path="/models" element={<Model />} />
            <Route path="/models/modelUpload" element={<PickleUploadForm />} />
            <Route path="/models/displayModels" element={<DisplayModels />} />
            <Route path="/models/addModels" element={<PickleUploadForm />} />
            <Route path="/models/userChart" element={<UserChart />} />
            <Route path="/pytopickle"  element={<PyToPkl/>}/>
          </>
        ) : (
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
