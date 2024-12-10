import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLogin: false,
    username: "",
  });

  // 컴포넌트 마운트 시 localStorage에서 로그인 상태 불러오기
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setAuth({ isLogin: true, username: username }); // token이 있으면 로그인 상태로 설정
    }
  }, []);

  // auth 상태 변경될 때마다 localStorage 저장
  useEffect(() => {
    if (auth.isLogin) {
      localStorage.setItem("access_token", "your_token"); // 실제 JWT 토큰을 여기에 저장해야 합니다.
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
