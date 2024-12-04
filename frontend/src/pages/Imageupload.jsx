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
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h2>이미지를 업로드해주세요</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: "20px" }}
      />
      {outputImage && (
        <div>
          <img
            src={outputImage}
            alt="Processed"
            style={{
              maxWidth: "80%", // 이미지 크기를 화면에 맞게 더 작은 크기로 조정
              height: "auto", // 비율에 맞게 높이 자동 조정
              borderRadius: "8px", // 이미지에 둥근 모서리 추가
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 이미지에 그림자 효과 추가
              marginBottom: "20px", // 이미지와 객체 정보 사이에 간격 추가
            }}
          />
        </div>
      )}
      {detections.length > 0 && (
        <div style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
          <h3>Detection Results:</h3>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            {detections.map((item, index) => (
              <li
                key={index}
                style={{ marginBottom: "10px", fontSize: "16px" }}
              >
                <strong>{item.class}:</strong> {item.confidence.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
