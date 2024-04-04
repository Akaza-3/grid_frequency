import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Model from "./pages/models/Model";
import Advertising from "./pages/models/Advertising";
import LinearRegPred from "./pages/models/LinearRegPred";
import PickleUploadForm from "./pages/models/uploadModels";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/models" element={<Model />} />
        <Route path="/models/advertising" element={<Advertising />} />
        <Route path="/models/linearPrediction" element={<LinearRegPred />} />
        <Route path="/models/modelUpload" element={<PickleUploadForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
