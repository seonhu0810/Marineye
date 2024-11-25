import "./App.css";
import { useState, useEffect } from "react";

function App() {
  // 상태 변수 message 선언
  const [message, setMessage] = useState("");

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    fetch("http://127.0.0.1:8000/hello")
      .then((response) => response.json()) // JSON으로 응답 받기
      .then((json) => {
        setMessage(json.message); // message 상태 업데이트
      })
      .catch((error) => console.error("Error fetching the message:", error));
  }, []); // 빈 배열을 넣어서 컴포넌트가 처음 마운트될 때만 실행되도록 설정

  return (
    <div>
      <h1>{message}</h1> {/* message 상태를 화면에 출력 */}
    </div>
  );
}

export default App;
