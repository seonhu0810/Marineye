import "../css/Join.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const nav = useNavigate();

  return (
    <div className="join-wrapper">
      <div className="form-box register">
        <form action="">
          <h1>Registration</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input type="text" placeholder="Email" required />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Comfirm Password" required />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />I agree to the terms & conditions
            </label>
          </div>

          <button type="submit">Join</button>

          <div className="register-link">
            <p>
              계정이 이미 있으신가요?
              <a
                href="#"
                onClick={() => {
                  nav("/login");
                }}
              >
                로그인
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Join;
