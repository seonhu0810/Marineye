import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Home.css";
import Imageupload from "../pages/Imageupload";
import Mobilecamera from "../pages/Mobilecamera";
import Externalcamera from "../pages/Externalcamera";
import { TiAnchor } from "react-icons/ti";
import AuthContext from "../context/AuthProvider";
import Objectlist from "../components/Objectlist";

const Home = () => {
  const nav = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [inputMethod, setInputMethod] = useState("");

  useEffect(() => {
    setAnimate(true); // 컴포넌트 마운트 시 애니메이션 활성화
  }, []);

  return (
    <div className="home-container">
      <div className="select-box">
        <TiAnchor size={50} />
        <h1>서비스 방식을 선택하세요</h1>
        <button className="select-button" onClick={() => nav("/imageupload")}>
          Image Upload
        </button>
        <button className="select-button" onClick={() => nav("/mobilecamera")}>
          Mobile Camera
        </button>
        <button
          className="select-button"
          onClick={() => nav("/externalcamera")}
        >
          External Camera
        </button>
      </div>
      {inputMethod === "upload" && <Imageupload />}
      {inputMethod === "mobile" && <Mobilecamera />}
      {inputMethod === "external" && <Externalcamera />}
    </div>
  );
};

export default Home;
