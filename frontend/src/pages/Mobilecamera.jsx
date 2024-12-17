import React, { useState, useEffect, useRef, useContext } from "react";
import Objectlist from "../components/Objectlist";
import AuthContext from "../context/AuthProvider";
import { showWarning } from "../utils/warning";
import Alert from "../components/Alert";

const Mobilecamera = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [detections, setDetections] = useState([]); // 감지된 객체 정보
  const [showObjectList, setShowObjectList] = useState(false);
  const videoRef = useRef(null); // 비디오 엘리먼트를 관리하기 위한 ref
  const streamRef = useRef(null); // MediaStream 관리용 ref
  const detectionInterval = useRef(null); // 탐지 주기 관리
  const warningThreshold = 10;
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    // 모바일 카메라 연결
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream; // 스트림을 ref에 저장
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // 비디오 소스를 스트림으로 설정
        }
        startDetection(); // 탐지 시작
      } catch (err) {
        console.error("Error accessing mobile camera", err);
      }
    };

    getCamera();

    // 클린업 함수: 컴포넌트가 언마운트될 때 스트림과 탐지 중단
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  const startDetection = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    detectionInterval.current = setInterval(async () => {
      // 비디오 프레임 캡처
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // 캡처한 프레임을 Blob으로 변환하여 서버로 전송
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("file", blob);

        try {
          const response = await fetch(
            "http://127.0.0.1:8000/api/detection/detect/",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) throw new Error("탐지 요청 실패");

          const jsonResponse = await response.json();

          const transformedDetections = jsonResponse.detections.map((item) => ({
            name: item.name, // YOLO에서 반환하는 name
            distance: item.distance, // YOLO에서 반환하는 distance
            azimuth: item.azimuth, // YOLO에서 반환하는 bearing
            timestamp: item.timestamp,
          }));

          setDetections(transformedDetections); // 감지된 객체 정보 저장
          setShowObjectList(true); // Objectlist 표시

          transformedDetections.forEach((detection) => {
            showWarning(detection, warningThreshold);
          });
        } catch (error) {
          console.error("탐지 중 오류 발생:", error);
        }
      });
    }, 1000); // 1초마다 탐지 실행
  };

  // 로그인되지 않은 경우 alert 후 이전 페이지로 이동
  if (!auth.isLogin) {
    alert("로그인 후 이용해주세요.");
    window.history.back();
    return null; // 컴포넌트 렌더링을 중단
  }

  return (
    <div>
      <h1>모바일 카메라를 연결중입니다</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="100%"
        style={{
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />
      {/* 감지된 객체가 있을 때 Objectlist 표시 */}
      {showObjectList && <Objectlist detections={detections} />}
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
    </div>
  );
};

export default Mobilecamera;
