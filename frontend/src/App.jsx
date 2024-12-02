import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Mypage from "./pages/Mypage";
import Notfound from "./pages/Notfound";
import Join from "./pages/Join";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
        </Routes>
      </Router>
    </>
  );
}

export default App;
