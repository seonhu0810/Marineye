import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Home.css";

import Inputselector from "../components/Inputselector";
import Imageupload from "../pages/Imageupload";
import Mobilecamera from "../pages/Mobilecamera";
import Externalcamera from "../pages/Externalcamera";

const Home = () => {
  const nav = useNavigate();

  const [inputMethod, setInputMethod] = useState("");

  const handleInputChange = (method) => {
    setInputMethod(method);
  };

  const ToggleComponent = () => {
    const [isVisible, setIsVisible] = useState(true); // 컴포넌트의 표시 상태

    const handleButtonClick = () => {
      setIsVisible(false); // 버튼을 클릭하면 상태를 변경하여 숨김
    };
  };

  return (
    <div className="home-container">
      <div className="select-box">
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
