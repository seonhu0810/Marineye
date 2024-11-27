import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Home.css";
import Navbar from "../components/Navbar";
import Objectlist from "../components/Objectlist";
import Inputselector from "../components/Inputselector";
import Imageupload from "../components/Imageupload";
import Mobilecamera from "../components/Mobilecamera";
import Externalcamera from "../components/Externalcamera";

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
      <Navbar />
      <Objectlist />
      <div className="select-box">
        <h3>서비스 방식을 선택하세요</h3>
        <button
          className="select-button"
          onClick={() => handleInputChange("upload")}
        >
          Image Upload
        </button>
        <button
          className="select-button"
          onClick={() => handleInputChange("mobile")}
        >
          Mobile Camera
        </button>
        <button
          className="select-button"
          onClick={() => handleInputChange("external")}
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
