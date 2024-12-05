import React, { useState } from "react";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [outputImage, setOutputImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // 이미지 미리보기 설정
      handleUpload(file); // 업로드 실행
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/detection/detect/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload image");

      // 이미지와 JSON 데이터를 동시에 처리
      const imageBlob = await response.blob(); // 이미지를 Blob 형태로 받음
      const imageUrl = URL.createObjectURL(imageBlob); // Blob을 URL로 변환

      setOutputImage(imageUrl); // 변환된 이미지를 상태에 저장

      // JSON 응답을 별도로 받아서 객체 감지 정보를 처리
      const jsonResponse = await response.json(); // JSON 데이터 받기
      setDetections(jsonResponse.detections); // 감지된 객체 정보 저장
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>이미지를 업로드해주세요</h1>
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
      {detections.length > 0 && (
        <div style={styles.detectionsContainer}>
          <h3 style={styles.detectionTitle}>Detection Results:</h3>
          <ul style={styles.detectionsList}>
            {detections.map((item, index) => (
              <li key={index} style={styles.detectionItem}>
                <strong>{item.class}:</strong> {item.confidence.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
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
  detectionsContainer: {
    textAlign: "left",
    maxWidth: "600px",
    margin: "0 auto",
  },
  detectionTitle: {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "10px",
  },
  detectionsList: {
    listStyleType: "none",
    padding: "0",
  },
  detectionItem: {
    marginBottom: "10px",
    fontSize: "16px",
    color: "#555",
  },
};

export default ImageUpload;
