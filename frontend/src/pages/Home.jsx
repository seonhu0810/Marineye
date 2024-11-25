import { useNavigate } from "react-router-dom";
import "../components/Camera";
import "../css/Home.css";
import BasicExample from "../components/BasicExample";
import Navbar from "../components/Navbar";

const Home = () => {
  const nav = useNavigate();

  return (
    <div className="home-container">
      {/* 헤더 */}
      <header className="header">
        <h1 className="title">해양 객체 인식 서비스</h1>
        <div className="auth-buttons">
          <button className="auth-button" onClick={() => nav("/login")}>
            로그인
          </button>
          <button className="auth-button" onClick={() => nav("/join")}>
            회원가입
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="main-content">
        <div className="camera-connection">
          <p>선택하세용</p>
          <button onClick={() => nav("/camera")} className="camera-button">
            카메라 연결
          </button>
          <button className="camera-button">이미지 업로드</button>
        </div>
      </main>
    </div>
  );
};

export default Home;
