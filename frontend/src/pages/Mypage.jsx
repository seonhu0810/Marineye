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

  // 로그 조회 함수
  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/detection/logs",
        {
          params: { email: auth.username },
        }
      );
      setLogs(response.data); // 로그 데이터를 상태에 저장
      setError("");
    } catch (err) {
      setError("Error fetching logs");
      console.error(err);
    }
  };

  // 로그아웃 처리
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/users/logout");
      if (response.data.success) {
        setAuth({ isLogin: false, username: "" });
        nav("/");
      } else {
        alert("로그아웃 실패");
      }
    } catch (error) {
      console.error("로그아웃 에러:", error);
      alert("로그아웃 요청 중 에러가 발생했습니다.");
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
      </button>
      {error ? (
        <p className="error-message">{error}</p>
      ) : logs.length > 0 ? (
        <ul className="log-list">
          {logs.map((log, index) => (
            <li key={index} className="log-item">
              <p>
                <strong>객체:</strong> {log.detected_object}
              </p>
              <p>
                <strong>인식 시간:</strong>{" "}
                {new Date(log.timestamp).toLocaleString()}
              </p>
              {log.file_url && (
                <div>
                  {log.file_url.endsWith(".mp4") ? (
                    <video controls src={log.file_url} width="300"></video>
                  ) : (
                    <img src={log.file_url} alt="Detected object" width="300" />
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>로그 데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default Mypage;
