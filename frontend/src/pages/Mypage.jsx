import "../css/Mypage.css";
import AuthContext from "../context/AuthProvider";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Mypage = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const nav = useNavigate();

  // 로그를 조회하는 함수
  const fetchLogs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/logs", {
        params: { email: auth.username }, // auth.username은 로그인된 사용자의 email
      });
      setLogs(response.data);
    } catch (err) {
      setError("Error fetching logs");
      console.error(err);
    }
  };

  // 로그아웃 버튼
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/user/logout");
      if (response.data.success) {
        setAuth({ isLogin: false, username: "" });
        nav("/");
      } else {
        alert("로그아웃 실패");
      }
    } catch (error) {
      console.err("로그아웃 에러:", error);
      alert("로그아웃 요청 중 에러가 발생하였습니다");
    }
  };

  return (
    <div className="background-wrapper">
      <h1>Mypage</h1>
      <h2>{auth.username}님</h2>
      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
      <h2>과거 객체 인식 이력</h2>
      <button className="lookup-button" onClick={fetchLogs}>
        조회하기
      </button>{" "}
      {/* 조회하기 버튼 추가 */}
      {/* 로그 목록 출력 */}
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Mypage;
