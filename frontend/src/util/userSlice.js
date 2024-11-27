import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initalState: {
    email: "",
    isLoading: false,
    isLogin: null,
  },
  reducers: {
    //login 성공 시
    loginUser: (state, action) => {
      //name, email 에 api 값 받앙기
      state.name = action.payload.name;
      state.email = action.payload.email;
      // state 변화를 알림
      return state;
    },
    //login 실패 시
    clearUser: (state) => {
      //name,id값을 비워줌
      state.name = "";
      state.email = "";
      return state;
    },
  },
});

export const { loginUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
