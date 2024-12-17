import React, { useState, useContext } from "react";
import Objectlist from "../components/Objectlist";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

// Imageupload.jsx
const ImageUpload = () => {
  const nav = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [image, setImage] = useState(null); // 원본 이미지 미리보기 상태
  const [detections, setDetections] = useState([]); // 감지된 객체 상태
  const [outputImage, setOutputImage] = useState(null); // 결과 이미지 상태
  const [showObjectList, setShowObjectList] = useState(false); // 객체 목록 표시 여부

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // 이미지 미리보기 설정
      handleUpload(file); // 파일 업로드 후 감지 수행
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    // JWT 토큰을 Authorization 헤더에 포함시킴
    const token = localStorage.getItem("access_token"); // 로컬스토리지에서 토큰 가져오기 (적절히 수정 필요)

    if (!token) {
      console.error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
      return; // 토큰이 없으면 요청을 보내지 않음
    }

    try {
      // 파일 업로드 후 감지 수행
      const uploadResponse = await fetch(
        "http://127.0.0.1:8000/api/detection/detect/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // 인증 헤더 추가
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Object detection failed");
      }

      const uploadData = await uploadResponse.json();
      let imageUrl = uploadData.image_path; // 감지된 이미지 경로
      const detections = uploadData.detections; // 감지된 객체들

      imageUrl = imageUrl.replace(/\\/g, "/"); // 백슬래시를 슬래시로 변경
      console.log("이미지 URL:", imageUrl);

      // 결과 이미지 표시
      setOutputImage(imageUrl); // 감지된 이미지 URL로 결과 이미지 설정

      // 객체 목록 표시
      setDetections(detections); // 감지된 객체 목록 설정
      setShowObjectList(true); // 객체 목록을 화면에 표시
    } catch (error) {
      console.error("파일 업로드 또는 감지 수행에 실패하였습니다:", error);
    }
  };

  // 로그인되지 않은 경우 alert 후 이전 페이지로 이동
  if (!auth.isLogin) {
    alert("로그인 후 이용해주세요.");
    nav("/login"); // 로그인 페이지로 리다이렉트
    return null; // 컴포넌트 렌더링을 중단
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <MdOutlineDriveFolderUpload />
        <br />
        이미지를 업로드해주세요
      </h1>
      <h4 style={styles.subtitle}>이미지는 하나씩 업로드 가능합니다.</h4>
      <label htmlFor="file-upload" style={styles.uploadButton}>
        이미지 업로드
      </label>
      <input
        type="file"
        id="file-upload"
        accept="image/*"
        onChange={handleFileChange}
        style={styles.fileInput}
      />
      {outputImage && (
        <div>
          <img
            src={outputImage}
            alt="Processed"
            style={styles.processedImage}
          />
        </div>
      )}
      {showObjectList && <Objectlist detections={detections} />}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    margin: "20px",
  },
  title: {
    fontSize: "2rem",
    color: "white",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1rem",
    color: "black",
    marginBottom: "20px",
  },
  uploadButton: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "black",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    marginBottom: "20px",
    transition: "background-color 0.3s ease",
  },
  fileInput: {
    display: "none",
  },
  processedImage: {
    maxWidth: "80%",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
};

export default ImageUpload;
