import "../css/Login.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);

  useEffect(() => {
    if (emailValid && pwValid) {
      setNotAllow(false);
    } else {
      setNotAllow(true);
    }
  }, [emailValid, pwValid]);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    const regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (regex.test(e.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const handlePw = (e) => {
    setPw(e.target.value);
    const regex = /(?=.*\d)(?=.*[a-z]).{8,}/;
    if (regex.test(e.target.value)) {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  };

  const onClickConfirmButton = async (e) => {
    e.preventDefault(); // form submit 시 새로고침 방지
    try {
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: pw,
        }),
      });

      if (!response.ok) {
        throw new Error("로그인 실패");
      }

      const data = await response.json();

      // JWT 토큰 저장 (localStorage 또는 sessionStorage)
      localStorage.setItem("access_token", data.access_token);

      alert("로그인에 성공했습니다.");
      nav("/"); // 로그인 후 메인 페이지로 이동
    } catch (error) {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="form-box login">
        <form onSubmit={onClickConfirmButton}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={handleEmail}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="errorMessageWrap">
            {!emailValid && email.length > 0 && (
              <div>올바른 이메일을 입력해주세요.</div>
            )}
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={handlePw}
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="errorMessageWrap">
            {!pwValid && pw.length > 0 && (
              <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
            )}
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#">비밀번호를 잊으셨나요?</a>
          </div>

          <button
            type="submit" // 버튼을 submit으로 설정하여 폼 제출을 처리
            disabled={notAllow}
          >
            Login
          </button>

          <div className="register-link">
            <p>
              계정이 없으신가요?{" "}
              <a href="#" onClick={() => nav("/join")}>
                회원가입
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
