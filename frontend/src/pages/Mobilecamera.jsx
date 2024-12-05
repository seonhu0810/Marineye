import React, { useState, useEffect } from "react";
import Objectlist from "../components/Objectlist";

const Mobilecamera = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [showObjectList, setShowObjectList] = useState(false);

  useEffect(() => {
    // 모바일 카메라 연결
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setVideoSrc(URL.createObjectURL(stream)); // 카메라 스트림을 URL로 변환하여 상태에 저장
      } catch (err) {
        console.error("Error accessing mobile camera", err);
      }
    };

    getCamera();

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
      <h2>모바일 카메라를 연결중입니다</h2>
      {videoSrc ? (
        <video src={videoSrc} autoPlay width="100%" />
      ) : (
        <p>Loading camera...</p>
      )}

      {<Objectlist />}
    </div>
  );
};

export default Mobilecamera;
