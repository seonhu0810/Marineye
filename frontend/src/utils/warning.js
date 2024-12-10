export const showWarning = (detection, threshold, setAlertMessage) => {
  if (detection.distance < threshold) {
    const message = `경고! ${detection.name}가 너무 가까이 있습니다`;
    setAlertMessage(message);
    return message;
  }
  return null;
};
