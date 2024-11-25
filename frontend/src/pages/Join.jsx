// src/pages/Join.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Join.css";

const Join = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // 입력 값 핸들러
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
    navigate("/login");
  };

  return (
    <div className="join-container">
      <h2>회원가입</h2>
      {error && <p className="error">{error}</p>} {/* 에러 메시지 표시 */}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Join;
