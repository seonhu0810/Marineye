import React, { useState, useEffect, useContext } from "react";
import Objectlist from "../components/Objectlist";
import AuthContext from "../context/AuthProvider";

const Externalcamera = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [videoSrc, setVideoSrc] = useState(null);
  const [detections, setDetections] = useState([]); // 감지된 객체 정보
  const [showObjectList, setShowObjectList] = useState(false);

  useEffect(() => {
    // 외부 카메라 연결
    const getExternalCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        setVideoSrc(stream); // 카메라 스트림을 URL로 변환하여 상태에 저장
        startDetection(stream); // 탐지 시작
      } catch (err) {
        console.error("Error accessing external camera", err);
      }
    };

    getExternalCamera();

    // 클린업 함수: 컴포넌트가 언마운트될 때 스트림을 종료
    return () => {
      if (videoSrc) {
        videoSrc.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoSrc]);

  const startDetection = async (stream) => {
    const videoElement = document.createElement("video");
    videoElement.srcObject = stream;
    videoElement.play();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // 주기적으로 비디오 프레임 전송
    const detectInterval = setInterval(async () => {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("file", blob);

        try {
          const response = await fetch(
            "http://127.0.0.1:8000/api/detection/detect/", // 서버 API 주소
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) throw new Error("탐지 요청 실패");

          const jsonResponse = await response.json(); // JSON 데이터 받기

          const transformedDetections = jsonResponse.detections.map((item) => ({
            name: item.name, // YOLO에서 반환하는 name
            distance: item.distance, // YOLO에서 반환하는 distance
            bearing: item.bearing, // YOLO에서 반환하는 bearing
          }));

          setDetections(transformedDetections); // 감지된 객체 정보 저장
          setShowObjectList(true); // Objectlist 표시
        } catch (error) {
          console.error("탐지 중 오류 발생:", error);
        }
      });
    }, 1000); // 1초마다 탐지 실행

    // 클린업: 탐지 중단
    return () => clearInterval(detectInterval);
  };

  // 로그인되지 않은 경우 alert 후 이전 페이지로 이동
  if (!auth.isLogin) {
    alert("로그인 후 이용해주세요.");
    window.history.back();
    return null; // 컴포넌트 렌더링을 중단
  }

  return (
    <div>
      <h1>외부 카메라를 연결중입니다</h1>
      {videoSrc ? (
        <video
          autoPlay
          playsInline
          muted
          width="100%"
          ref={(video) => {
            if (video && video.srcObject !== videoSrc) {
              video.srcObject = videoSrc;
            }
          }}
        />
      ) : (
        <p>Loading camera...</p>
      )}

      {/* 감지된 객체가 있을 때 Objectlist 표시 */}
      {showObjectList && <Objectlist detections={detections} />}
    </div>
  );
};

export default Externalcamera;
