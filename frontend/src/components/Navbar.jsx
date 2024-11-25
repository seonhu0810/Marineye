import { useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";

import Logo from "/logo.jpg";
import "../css/Navbar.css";

const Navbar = () => {
  return (
    <header className="header">
      <Link to={"/"} className="logo">Logo</Link>
      
      <nav className="narbar">
        <Link to={"/"}>Home</Link>
        <Link to={"/"}>About</Link>
        <Link to={"/"}>Porfolio</Link>
        <Link to={"/"}>Services</Link>
        
      </nav>
    </header>
  );
};

export default Navbar;
