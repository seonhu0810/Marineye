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
    throw error;
  }
};
