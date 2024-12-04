import React, { useState, useEffect } from "react";
import Objectlist from "../components/Objectlist";

const Externalcamera = () => {
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    // 외부 카메라 연결
    const getExternalCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        setVideoSrc(URL.createObjectURL(stream)); // 카메라 스트림을 URL로 변환하여 상태에 저장
      } catch (err) {
        console.error("Error accessing external camera", err);
      }
    };

    getExternalCamera();

    // 클린업 함수: 컴포넌트가 언마운트될 때 스트림을 종료
    return () => {
      if (videoSrc) {
        const stream = new MediaStream(videoSrc);
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoSrc]);

  return (
    <div>
      <Objectlist />
      <h2>별도 카메라를 연결해주세요</h2>
      {videoSrc ? (
        <video src={videoSrc} autoPlay width="100%" />
      ) : (
        <p>Loading camera...</p>
      )}
    </div>
  );
};

export default Externalcamera;
