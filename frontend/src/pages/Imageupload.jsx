import React, { useState, useContext } from "react";
import Objectlist from "../components/Objectlist";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { saveHistory } from "../api/history";
import { showWarning } from "../utils/warning";

const ImageUpload = () => {
  const nav = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [outputImage, setOutputImage] = useState(null);
  const [showObjectList, setShowObjectList] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // 이미지 미리보기 설정
      handleUpload(file); // 업로드 실행
    }
  };
  const handleUpload = async (file) => {
    const token = auth?.token;

    if (!token) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      nav("/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/detection/detect/",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("서버 오류:", errorText);
        throw new Error("이미지 업로드에 실패하였습니다.");
      }

      const jsonResponse = await response.json(); // JSON 데이터 받기
      const imageUrl = jsonResponse.image_url; // 서버에서 처리된 이미지 URL을 반환한다고 가정

      setOutputImage(imageUrl); // 변환된 이미지를 상태에 저장

      // API에서 반환된 detections를 바로 사용
      const transformedDetections = jsonResponse.detections.map((item) => ({
        name: item.name, // API에서 name 필드 제공 - 객체 이름
        distance: item.distance, // API에서 distance 필드 제공 - 거리
        azimuth: item.azimuth, // API에서 bearing 필드 제공 - 방향
        timestamp: item.timestamp, //인식 시간
      }));

      setOutputImage(imageUrl);
      setShowObjectList(true);

      if (auth.isLogin) {
        // 로그 저장 API 호출
        await saveHistory({
          username: auth.username,
          image_url: imageUrl,
          detections: transformedDetections,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("파일 업로드에 실패하였습니다:", error);
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
