import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Mypage from "./pages/Mypage";
import Notfound from "./pages/Notfound";
import Join from "./pages/Join";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Mobilecamera from "./pages/Mobilecamera";
import Externalcamera from "./pages/Externalcamera";
import Imageupload from "./pages/Imageupload";
import { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  const isLogin = false;
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/*" element={<Notfound />} />
          <Route path="/join" element={<Join />} />
          <Route path="/about" element={<About />} />
          <Route path="/mobilecamera" element={<Mobilecamera />} />
          <Route path="/externalcamera" element={<Externalcamera />} />
          <Route path="/imageupload" element={<Imageupload />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
