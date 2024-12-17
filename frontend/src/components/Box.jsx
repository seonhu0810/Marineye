// Box.js
const Box = ({ title, children }) => {
  // children 텍스트에서 줄바꿈(\n)을 <br /> 태그로 변환
  const formattedContent = children.split("\n").map((str, index) => (
    <span key={index}>
      {str}
      <br />
    </span>
  ));

  return (
    <div className="box">
      <h2>{title}</h2>
      <div>{formattedContent}</div>
    </div>
  );
};

export default Box;
