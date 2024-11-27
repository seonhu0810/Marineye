// src/pages/Login.jsx
import "../css/Login.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const User = {
  email: "test@gmail.com",
  pw: "test1234@@@",
};

const Login = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const [emailVaild, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);

  useEffect(() => {
    if (emailVaild && pwValid) {
      setNotAllow(false);
    } else {
      setNotAllow(true);
    }
  }, [emailVaild, pwValid]);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    const regex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (regex.test(e.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const handlePw = (e) => {
    setPw(e.target.value);
    const regex =
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    if (regex.test(e.target.value)) {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  };

  const onClickConfirmButton = () => {
    if (email === User.email && pw === User.pw) {
      alert("로그인에 성공했습니다.");
      nav("/");
    } else {
      alert("등록되지 않은 회원입니다.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="form-box login">
        <form action="">
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
            {!emailVaild && email.length > 0 && (
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
            onClick={onClickConfirmButton}
            disabled={notAllow}
            type="submit"
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
