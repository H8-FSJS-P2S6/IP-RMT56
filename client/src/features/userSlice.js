import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axiosInstance";
import Swal from "sweetalert2";

const initialState = {
  user: null,
  accessToken: localStorage.getItem("access_token") || null,
  userId: localStorage.getItem("userId") || null,
  status: "idle",
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("userId");
      state.user = null;
      state.accessToken = null;
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.userId = action.payload.userId;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.userId = action.payload.userId;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(googleLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.userId = action.payload.userId;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post("/register", userData);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userId", data.userId);

      dispatch(
        setUser({
          user: data,
          accessToken: data.access_token,
          userId: data.userId,
        })
      );

      return {
        user: data,
        access_token: data.access_token,
        userId: data.userId,
      };
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response ? error.response.data.error : error.message,
      });
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (loginData, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post("/login", loginData);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userId", data.userId);

      dispatch(
        setUser({
          user: data,
          accessToken: data.access_token,
          userId: data.userId,
        })
      );

      return {
        user: data,
        access_token: data.access_token,
        userId: data.userId,
      };
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response ? error.response.data.error : error.message,
      });
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (googleData, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post("/google-login", googleData);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userId", data.userId);

      dispatch(
        setUser({
          user: data,
          accessToken: data.access_token,
          userId: data.userId,
        })
      );

      return {
        user: data,
        access_token: data.access_token,
        userId: data.userId,
      };
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response ? error.response.data.error : error.message,
      });
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
