import { useEffect, useState } from "react";
import "../css/Objectlist.css";

const Objectlist = () => {
  const [objects, setObjects] = useState([
    { id: 1, name: "Boat", distance: 300, bearing: 45 },
    { id: 2, name: "Buoy", distance: 150, bearing: 90 },
    { id: 3, name: "Ship", distance: 500, bearing: 180 },
  ]);

  const [sortType, setSortType] = useState("distance");

  const ObjectCount = objects.length;

  useEffect(() => {
    const sorted =
      sortType === "distance"
        ? [...objects].sort((a, b) => a.distance - b.distance)
        : [...objects].sort((a, b) => a.bearing - b.bearing);

    setObjects(sorted);
  }, [sortType]); //sortType 변경시

  const onChangeSortType = (e) => {
    setSortType(e.target.value); //정렬 기준 변경
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
          <option value={"distance"}>거리 순</option>
          <option value={"bearing"}>방위 순</option>
        </select>
      </div>
      <ul>
        {objects.map((obj) => (
          <li key={obj.id}>
            {obj.name} - 거리: {obj.distance}m, 방위: {obj.bearing}°
          </li>
        ))}
        <br></br>
        <p>Total Count : {ObjectCount}</p>
      </ul>
    </div>
  );
};

export default Objectlist;
