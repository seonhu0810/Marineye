import { useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";

import Logo from "/logo.jpg";
import "../css/Navbar.css";

const Navbar = () => {
  return (
    <header className="header">
      <Link to={"/"} className="logo">
        Marineye
      </Link>

      <nav className="navbar">
        <Link to={"/"}>Home</Link>
        <Link to={"/about"}>About</Link>
        <Link to={"/mypage"}>Mypage</Link>
        <Link to={"/login"}>login</Link>
        <Link to={"/join"}>join</Link>
      </nav>
    </header>
  );
};

export default Navbar;
