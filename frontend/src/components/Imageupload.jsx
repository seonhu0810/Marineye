import React, { useState } from "react";

const Imageupload = () => {
  const [image, setImage] = useState(null);

  // 파일 선택 후 이미지 업로드
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // 파일을 URL로 변환하여 상태에 저장
    }
  };

  return (
    <div>
      <h2>Upload an Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && <img src={image} alt="Uploaded" width="100%" />}
    </div>
  );
};

export default Imageupload;
