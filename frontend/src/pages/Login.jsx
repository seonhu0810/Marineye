import "../css/Login.css";
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import { useCookies } from "react-cookie";

const email_regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const pw_regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%])[a-zA-Z\d@#$%]{8,}$/;

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext);
  console.log(auth.username);

  const nav = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [isRemember, setIsRemember] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId"]);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  useEffect(() => {
    const result = email_regex.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = pw_regex.test(password);
    console.log(password);
    console.log(validPassword);
    setValidPassword(result);
  }, [password]);

  useEffect(() => {
    if (cookies.rememberUserId) {
      setEmail(cookies.rememberUserId);
      setIsRemember(true);
      console.log(setIsRemember);
    }
  }, [cookies]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      setSuccess(true);

      if (!response.ok) {
        throw new Error("로그인 실패");
      }

      const data = await response.json();
      console.log(data); // 서버 응답 확인
      setAuth({
        isLogin: true,
        username: data.username,
        token: data.access_token,
      });

      // JWT 토큰 저장 (localStorage 또는 sessionStorage)
      localStorage.setItem("access_token", data.access_token);

      if (isRemember) {
        setCookie("rememberUserId", email, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        }); // 7일 동안 유지
      } else {
        removeCookie("rememberUserId");
      }

      alert("로그인되었습니다.");
      nav("/"); // 로그인 후 메인 페이지로 이동
    } catch (error) {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>로그인하였습니다.</h1>
          <br />
          <p>
            <a href="#" onClick={() => nav("/")}>
              홈으로 가기
            </a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>로그인</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">
              <FaUser />
            </label>
            <input
              type="email"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="이메일 주소"
              required
            />
            <label htmlFor="password">
              <FaLock />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="비밀번호 영문,특수문자,숫자혼합 8~12자"
              required
            />
            <label className="checkbox-container">
              <input
                type="checkbox"
                id="rememberMe"
                checked={isRemember}
                onChange={(e) => setIsRemember(e.target.checked)}
              />
              아이디 저장
            </label>
            <button
              className="submit-button"
              disabled={validEmail && validPassword ? false : true}
            >
              로그인
            </button>
          </form>
          <p>
            계정이 없으신가요?
            <br />
            <span className="line">
              <a href="#" onClick={() => nav("/join")}>
                회원가입
              </a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
