import React, { useState } from "react";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(null); // 이메일 유효성 결과
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  // 이미 존재하는 이메일 목록 (임시 데이터)
  const existingEmails = ["test@example.com", "user@example.com"];

  // 이메일 중복 검사 (API 없이 로컬 데이터로 처리)
  const checkEmailDuplication = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailValid("올바른 이메일 형식을 입력해주세요.");
    } else if (existingEmails.includes(email)) {
      setEmailValid("이미 사용 중인 이메일입니다.");
    } else {
      setEmailValid("사용 가능한 이메일입니다.");
    }
  };

  // 실시간 유효성 검사
  const validate = () => {
    const newErrors = {};
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }
    if (
      !password.match(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      newErrors.password =
        "비밀번호는 8자 이상, 숫자, 영어, 특수문자를 포함해야 합니다.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 버튼 활성화 조건
  const isFormValid =
    emailValid === "사용 가능한 이메일입니다." &&
    password &&
    confirmPassword &&
    !Object.keys(errors).length;

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("회원가입 성공!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>이름</label>
        <input type="text" placeholder="이름을 입력하세요" />
      </div>

      <div>
        <label>이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailValid(null); // 이메일 입력 시 결과 초기화
          }}
        />
        <button type="button" onClick={checkEmailDuplication}>
          중복검사
        </button>
        {emailValid && <p>{emailValid}</p>}
      </div>

      <div>
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p>{errors.password}</p>}
      </div>

      <div>
        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      </div>

      <button type="submit" disabled={!isFormValid}>
        Join
      </button>
    </form>
  );
}

export default SignupForm;
