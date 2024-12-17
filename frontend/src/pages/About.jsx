import "../css/About.css";
import { IoMdBoat } from "react-icons/io";
import Box from "../components/Box";
import { useState, useEffect } from "react";

const About = () => {
  const [visibleBoxIndex, setVisibleBoxIndex] = useState(0);

  const boxes = [
    {
      title: "서비스 소개",
      content:
        "선박, 부표, 기타 물체를 인식하여 안전한 항해와 효율적인 해상 교통 관리를 지원하기 위해, 실시간으로 객체를 인식하는 서비스입니다.",
    },
    {
      title: "작동 방법",
      content:
        "이 시스템은 최첨단 딥러닝 기술인 YOLO v11(Object Detection)을 기반으로 설계되었습니다.\nYOLO v11은 객체를 빠르고 정확하게 감지할 수 있는 모델로, 이미지와 비디오 처리에 최적화되어 있습니다.\n충돌 방지 알고리즘은 해양 환경에서의 실시간 경고 제공을 목표로 특별히 설계되었습니다.",
    },
    {
      title: "서비스 목표",
      content:
        "해양 사고를 사전에 방지하고, 선박 및 해양 생태계의 안전을 보장하는 것이 저희의 목표입니다. 이를 통해 해양 산업에서의 효율성을 높이고, 환경 보호와 안전한 항해에 기여하고자 합니다.",
    },
    {
      title: "서비스 사용방법",
      content:
        "1. 카메라 연결 또는 이미지 업로드 방식 중에 선택해주세요.\n2. 시스템이 자동으로 객체를 탐지하고 거리, 방위를 나타내며 충돌 위험 여부를 분석합니다.\n3. 결과 페이지에서 탐지된 객체와 경고 메시지를 확인하세요.",
    },
  ];

  useEffect(() => {
    if (visibleBoxIndex < boxes.length - 1) {
      const timer = setTimeout(() => {
        setVisibleBoxIndex(visibleBoxIndex + 1);
      }); // 3초마다 박스를 렌더링

      return () => clearTimeout(timer);
    }
  }, [visibleBoxIndex, boxes.length]);

  return (
    <div className="about-service">
      {boxes.slice(0, visibleBoxIndex + 1).map((box, index) => (
        <Box key={index} title={box.title}>
          {box.content}
        </Box>
      ))}
    </div>
  );
};

export default About;
