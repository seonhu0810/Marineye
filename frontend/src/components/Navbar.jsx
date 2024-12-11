import { useNavigate, useSearchParams } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import "../css/Navbar.css";
import { GoTriangleDown } from "react-icons/go";
import { FaUserCircle } from "react-icons/fa";
import AuthContext from "../context/AuthProvider";
import axios from "axios";

const Navbar = () => {
  const nav = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleMouseEnter = () => setDropdownVisible(true);
  const handleMouseLeave = () => setDropdownVisible(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/users/logout");
      if (response.data.success) {
        // 로그아웃 성공 후 상태 초기화
        setAuth({ isLogin: false, username: "" });

        // localStorage에서 로그인 정보 삭제
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");

        // 홈 페이지로 리다이렉트
        nav("/");
      } else {
        alert("로그아웃 실패");
      }
    } catch (error) {
      console.error("로그아웃 에러:", error);
      alert("로그아웃 요청 중 에러가 발생하였습니다");
    }
  };

  return (
    <header className="header">
      <Link to={"/"} className="logo">
        Marineye
      </Link>

      <nav className="navbar">
        <Link to={"/"}>Home</Link>
        <Link to={"/about"}>About</Link>
        <>
          <Link to={"/mypage"}>Mypage</Link>
          <a href="#" onClick={handleLogout}>
            logout{" "}
          </a>
          <FaUserCircle />
          {auth.username}님
          <GoTriangleDown />
        </>
        {auth.isLogin ? (
          <>
            <Link to={"/mypage"}>Mypage</Link>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            <FaUserCircle />
            {auth.username}님
            <GoTriangleDown />
          </>
        ) : (
          <></>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
