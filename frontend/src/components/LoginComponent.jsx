import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginUser } from "../util/userSlice";

const LoginComponent = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const LOGIN_API_KEY = "https://example.com/api/login"; // API URL

  const loginHandler = (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지
    setMsg("Loading...");
    setLoading(true); // 로딩 상태 활성화

    let body = { email, password };

    axios
      .post(LOGIN_API_KEY, body)
      .then((res) => {
        setLoading(false); // 로딩 상태 비활성화
        setTimeout(() => setMsg(""), 1500); // 메시지 제거

        const code = res.data.code;
        if (code === 400) {
          alert("비어있는 내용입니다.");
        } else if (code === 401) {
          alert("존재하지 않는 id입니다.");
        } else if (code === 402) {
          alert("비밀번호가 일치하지 않습니다.");
        } else {
          dispatch(loginUser(res.data.userInfo));
        }
      })
      .catch((err) => {
        setLoading(false); // 에러 발생 시 로딩 상태 초기화
        alert("로그인 요청 중 문제가 발생했습니다.");
        console.error(err); // 에러 로그 출력
      });
  };

  return (
    <form onSubmit={loginHandler}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </button>
      <p>{msg}</p>
    </form>
  );
};

export default LoginComponent;
