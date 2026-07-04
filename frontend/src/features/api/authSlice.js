import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userInfo: userFromStorage,
  redirectPath: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const expiresIn = 60 * 60 * 1000; 
      const expiryTime = Date.now() + expiresIn; 
      const data = { user: action.payload, expiry: expiryTime, };
      state.userInfo = data;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    setRedirectPath: (state, action) => {
      state.redirectPath = action.payload;
    },
    clearRedirectPath: (state) => {
      state.redirectPath = null;
    },
  },
});

export const { setCredentials, logout, setRedirectPath, clearRedirectPath } = authSlice.actions;
export default authSlice.reducer;