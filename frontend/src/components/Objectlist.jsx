import { useEffect, useState } from "react";
import "../css/Objectlist.css";

const Objectlist = ({ detections = [] }) => {
  const [objects, setObjects] = useState([]);
  const [sortType, setSortType] = useState("distance");

  const ObjectCount = objects.length;

  useEffect(() => {
    // detections 정렬
    const sorted =
      sortType === "distance"
        ? [...detections].sort((a, b) => a.distance - b.distance)
        : sortType === "bearing"
        ? [...detections].sort((a, b) => a.bearing - b.bearing)
        : [...detections].sort(
            (a, b) => new Date(a.timestamp - new Date(b.timestamp))
          );
    setObjects(sorted); // 정렬 결과를 상태로 설정
  }, [sortType, detections]); // sortType 또는 detections 변경 시 실행

  const onChangeSortType = (e) => {
    setSortType(e.target.value); // 정렬 기준 변경
  };

  return (
    <div className="Objectlist">
      <h1 style={{ color: "Black" }}>탐지 객체 리스트</h1>
      <div className="menu_bar">
        <select
          className="menu_bar"
          onChange={onChangeSortType}
          value={sortType}
        >
          <option value="distance">거리 순</option>
          <option value="bearing">방위 순</option>
          <option value="timestamp">시간 순</option>
        </select>
      </div>
      <ul>
        {objects && objects.length > 0 ? (
          objects.map((obj, index) => (
            <li key={index}>
              {obj.name} - 거리: {obj.distance}m, 방위: {obj.bearing}°
              <p>
                <strong>탐지 시간:</strong>
                {""}
                {new Date(obj.timestamp).toLocaleString()}
              </p>
            </li>
          ))
        ) : (
          <p>객체가 탐지되지 않았습니다</p>
        )}
      </ul>
      <p>Total Count: {ObjectCount}</p>
    </div>
  );
};

export default Objectlist;
