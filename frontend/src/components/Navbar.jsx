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
    <header className="header">
      <Link to={"/"} className="logo">
        Marineye
      </Link>

      <nav className="navbar">
        <Link to={"/"}>Home</Link>
        <Link to={"/about"}>About</Link>
        {auth.isLogin ? (
          <div
            className="dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="user-info">
              <FaUserCircle />
              <span>{auth.username}님</span>
              <GoTriangleDown />
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <Link to={"/mypage"}>Mypage</Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to={"/join"}>Join</Link>
            <Link to={"/login"}>Login</Link>
            <Link to={"/mypage"}>mypage</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
