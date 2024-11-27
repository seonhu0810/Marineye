import "../css/Inputselector.css";

const Inputselector = ({ onSelect }) => {
  return (
    <div className="selectBox">
      <h1>Select Input Method</h1>
      <button onClick={() => onSelect("upload")}>이미지 업로드</button>
      <button onClick={() => onSelect("mobile")}>모바일 카메라 연결</button>
      <button onClick={() => onSelect("external")}>외부 카메라 연결</button>
    </div>
  );
};

export default Inputselector;
