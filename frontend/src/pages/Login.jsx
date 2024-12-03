import "../css/Login.css";
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";

const LOGIN_URL = "./auth";
const email_regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const pw_regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%])[a-zA-Z\d@#$%]{8,}$/;

const Login = () => {
  const { setAuth } = useContext(AuthContext);

  const nav = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      console.log(email, password);
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ email, password, roles, accessToken });
      setEmail("");
      setPassword("");
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("서버가 응답하지 않습니다.");
      } else if (err.response?.status === 400) {
        setErrMsg("이메일과 비밀번호를 모두 입력해주세요.");
      } else if (err.response?.status === 401) {
        setErrMsg("인증 실패하였습니다.");
      } else {
        setErrMsg("로그인에 실패하였습니다.");
      }
      errRef.current.focus();
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
              <input type="checkbox" />
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
