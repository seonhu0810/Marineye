<<<<<<< HEAD
// history.js
export const saveHistory = async (detections, imageUrl, username) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/history/save", {
      // 백엔드 API URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        detections,
        imageUrl,
        username,
      }),
    });

    if (!response.ok) {
      throw new Error("History save failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
=======
import axios from "axios";

export const saveHistory = async (logData) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/logs",
      logData
    );
    return response.data;
  } catch (error) {
    console.error("Error saving history:", error);
>>>>>>> dfe73d1ca555ad8080f0a36c4e5969605a69d01a
    throw error;
  }
};
