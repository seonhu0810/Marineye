import React from "react";
import "../css/Alert.css";

const Alert = ({ message, onClose }) => {
  return (
    <div className="alert">
      <div className="alert-message">
        <strong>경고! </strong>
        {message}
      </div>
      <button className="alert-close" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default Alert;
