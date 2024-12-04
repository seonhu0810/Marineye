import "../css/Mypage.css";
import AuthContext from "../context/AuthProvider";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Mypage = () => {
  const { setAuth } = useContext(AuthContext);

  const nav = useNavigate();

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
      console.err("로그아웃 에러:", error);
      alert("로그아웃 요청 중 에러가 발생하였습니다");
    }
  };

  return (
    <div className="background-wrapper">
      <h1>Mypage</h1>

      <h2>{AuthContext.username}님</h2>
      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
      <h2>과거 객체 인식 이력 조회하기</h2>
    </div>
  );
};

export default Mypage;
