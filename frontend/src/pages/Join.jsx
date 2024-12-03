import "../css/Join.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const email_regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const pw_regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%])[a-zA-Z\d@#$%]{8,}$/;
const REGISTER_URL = "localhost:5173/join";

const Join = () => {
  const userRef = useRef(); //이메일 입력 자동 포커스
  const errRef = useRef();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  //사이드 이펙트 처리
  // 1. 첫 렌더링 : 이메일 입력칸에 자동 포커스
  // 2. 이메일 입력 받을 시에 setValidEmail 호출하여 유효성 검사 실시
  // 3. 비밀번호와 확인 비밀번호를 입력받을 시에 비밀번호 유효성검사,
  // 비밀번호 형식이 맞고 비밀번호==확인비밀번호 일 때 setValidPassword를 true로 반환
  // 4. 이메일, 비밀번호, 확인비밀번호 입력 시 에러메세지 초기화
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // 이름 유효성
  useEffect(() => {
    setValidName(name.length >= 2);
  }, [name]);

  // 이메일 유효성
  useEffect(() => {
    const result = email_regex.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result);
  }, [email]);

  //비밀번호 유효성 검사
  useEffect(() => {
    const result = pw_regex.test(password);
    console.log(result);
    console.log(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, matchPassword]);

  // 제출 폼 관리
  const handleSubmit = async (e) => {
    e.preventDefault(); //폼 제출 시 페이지 새로고침되는 것을 막음

    const v1 = email_regex.test(email);
    const v2 = pw_regex.test(password);

    if (!v1 || !v2) {
      setErrMsg("적절치 않은 아이디, 비밀번호");
      return;
    }

    // 서버 요청 처리 -> try문
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ email, password }), //데이터를 JSON형태로 변환
        {
          headers: { "Content-Type": "application/json" }, // 헤더에 Content-type 지정하여 서버에 json 데이터를 보낸다고 알림
          withCredentials: true, // 사용자 인증 정보 포함하여 요청 전송
        }
      );

      console.log(response.data); // 서버가 응답한 데이터
      console.log(response.accessToken); //서버가 반환한 인증 토큰
      console.log(JSON.stringify(response));
      setSuccess(true); //success 상태를 true로 설정
    } catch (err) {
      // catch문
      if (!err?.response) {
        setErrMsg("서버의 응답이 없습니다");
      } else if (err.response?.status === 409) {
        setErrMsg("이미 아이디가 존재합니다");
      } else {
        setErrMsg("회원가입 실패, 잠시 후 다시 시도하십시오.");
      }
      errRef.current.focus(); // 에러 메세지에 포커스
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>로그인 되었습니다!</h1>
          <p>
            <a href="#" onClick={() => nav("/login")}>
              로그인하기
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
          <h1>회원가입</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">
              <FaUser />
              <span className={validName ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} color="green" />
              </span>
              <span className={validName || !name ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} color="red" />
              </span>
            </label>

            <input
              type="text"
              id="name"
              autoComplete="off"
              ref={userRef}
              value={name}
              placeholder="이름"
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
              required
            />
            <p
              id="passwordnote"
              className={
                nameFocus && name && !validName ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              2자 이상 입력해주세요.
            </p>
            <label htmlFor="email">
              <MdEmail />
              <span className={validEmail ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} color="green" />
              </span>
              <span className={validEmail || !email ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} color="red" />
              </span>
            </label>
            <input
              type="email"
              id="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="이메일 주소"
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id="uidnote"
              className={
                emailFocus && email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              이메일 형식에 맞게 입력해주세요.
            </p>
            <label htmlFor="password">
              <FaLock />
              <span className={validPassword ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} color="green" />
              </span>
              <span className={validPassword || !password ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} color="red" />
              </span>
              <label htmlFor="confirm_password">
                <span
                  className={validMatch && matchPassword ? "valid" : "hide"}
                >
                  <FontAwesomeIcon icon={faCheck} color="green" />
                </span>
                <span
                  className={validMatch || !matchPassword ? "hide" : "invalid"}
                >
                  <FontAwesomeIcon icon={faTimes} color="Red" />
                </span>
              </label>
            </label>

            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              value={password}
              placeholder="비밀번호"
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="passwordnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />

            <p
              id="passwordnote"
              className={
                passwordFocus && password && !validPassword
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.
              <br />
              가능한 특수문자 :<span aria-label="exclamation mark">!</span>
              <span aria-label="at symbol">@</span>
              <span aria-label="hashtag">#</span>
              <span aria-label="dollor sign">$</span>
              <span aria-label="percent">%</span>
            </p>

            <input
              type="password"
              id="confirm_password"
              onChange={(e) => setMatchPassword(e.target.value)}
              placeholder="비밀번호 확인"
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              입력하신 비밀번호와 일치해야합니다.
            </p>
            <button
              className="submit-button"
              disabled={
                !validEmail || !validPassword || !validMatch ? true : false
              }
            >
              회원가입
            </button>
            <p>
              이미 회원가입 하셨나요?{"  "}
              <span className="line">
                <a href="#" onClick={() => nav("/login")}>
                  {" "}
                  로그인
                </a>
              </span>
            </p>
          </form>
        </section>
      )}
    </>
  );
};
export default Join;
