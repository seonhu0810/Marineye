import "../css/About.css";
import { IoMdBoat } from "react-icons/io";

const About = () => {
  return (
    <div className="about-service">
      <h1>
        <IoMdBoat /> About Marineye (Marine Object Detection System)
      </h1>
      <br></br>
      <h4>&quot;What We Do&quot;</h4>
      <div>
        선박, 부표, 기타 물체를 인식하여 안전한 항해와 효율적인 해상 교통 관리를
        지원하기 위해, 실시간으로 객체를 인식하는 서비스입니다
      </div>
      <br></br>
      <h4>&quot;How it Works&quot;</h4>
      <div>
        이 시스템은 최첨단 딥러닝 기술인 YOLO v11(Object Detection)을 기반으로
        설계되었습니다.<br></br> YOLO v11은 객체를 빠르고 정확하게 감지할 수
        있는 모델로, 이미지와 비디오 처리에 최적화되어 있습니다.<br></br>
        충돌 방지 알고리즘은 해양 환경에서의 실시간 경고 제공을 목표로 특별히
        설계되었습니다.
        <br></br>
      </div>
      <br></br>
      <h4>&quot;Our vision&quot;</h4>
      <div>
        해양 사고를 사전에 방지하고, 선박 및 해양 생태계의 안전을 보장하는 것이
        저희의 목표입니다. 이를 통해 해양 산업에서의 효율성을 높이고, 환경
        보호와 안전한 항해에 기여하고자 합니다.
      </div>
      <br></br>
      <h4>&quot;User Guide&quot;</h4>
      <div>
        1. 카메라 연결 또는 이미지 업로드 방식 중에 선택해주세요 <br></br>2.
        시스템이 자동으로 객체를 탐지하고 거리, 방위를 나타내며 충돌 위험 여부를
        분석합니다.
        <br></br>3. 결과 페이지에서 탐지된 객체와 경고 메세지를 확인하세요.
      </div>
      <br></br>
      <h4>&quot;Mypage&quot;</h4>
      <div>해당 페이지를 통해 과거 객체 인식 결과를 조회할 수 있습니다. </div>
    </div>
  );
};

export default About;
