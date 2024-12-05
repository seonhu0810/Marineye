import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLogin: false,
    username: "",
  });

  // 컴포넌트 마운트 시 localstorage에서 로그인 상태 불러오기
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAuth({ isLogin: true, username: "" }); //실제로 JWT디코딩해야함
    }
  }, []);

  // auth 상태 변경될 때마다 localStorage 저장
  useEffect(() => {
    if (auth.isLogin) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
