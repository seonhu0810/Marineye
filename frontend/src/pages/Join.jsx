import "../css/Join.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";

const Join = () => {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/register",
        formData
      );
      console.log(response.data);
      alert("User registered successfully!");
    } catch (error) {
      console.error(error.response.data);
      alert("Registration failed: " + error.response.data.detail);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 회원가입 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.name || !formData.email || !formData.password) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 회원가입 성공 로직 (여기서는 예시로 처리)
    console.log("회원가입 정보:", formData);

    // 회원가입 완료 후 로그인 페이지로 이동
    nav("/login");
  };

  return (
    <div className="join-wrapper">
      <div className="form-box register">
        <h1>Registration</h1>
        <form onSubmit={handleSubmit}>
          {/* 사용자 이름 */}
          <div className="input-box">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            <FaUser className="icon" />
          </div>

          {/* 이메일 */}
          <div className="input-box">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <FaEnvelope className="icon" />
          </div>

          {/* 비밀번호 */}
          <div className="input-box">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <FaLock className="icon" />
          </div>

          {/* 비밀번호 확인 */}
          <div className="input-box">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
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
