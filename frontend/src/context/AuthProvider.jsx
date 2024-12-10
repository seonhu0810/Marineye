import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLogin: false,
    token: null, // token 상태를 명확히 정의
    username: "",
  });

  // 컴포넌트 마운트 시 localStorage에서 로그인 상태 불러오기
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setAuth({ isLogin: true, token, username }); // token과 username 모두 상태에 저장
    }
  }, []);

  // auth 상태 변경될 때마다 localStorage 저장
  useEffect(() => {
    if (auth.isLogin) {
      localStorage.setItem("access_token", auth.token); // 실제 JWT 토큰 저장
      localStorage.setItem("username", auth.username);
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
