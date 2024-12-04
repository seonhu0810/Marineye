export const saveHistory = async (objects, imageUrl) => {
  try {
    const response = await fetch("/api/history/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // 인증 토큰
      },
      body: JSON.stringify({
        username: "", // 현재 사용자 ID (변경 필요)
        objects,
        imageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error("이력 저장 실패");
    }
  } catch (error) {
    console.error(error);
  }
};
