import { removeCookie } from "@/utils/cookies";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  user: {
    userId: string;
    username: string;
    email: string;
    user_type: string;
  } | null;
  token: string | null;
  loading: {
    register: boolean;
    login: boolean;
  };
  error: {
    register: string | null;
    login: string | null;
    refresh: string | null;
  }
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: { register: false, login: false },
  error:  { register: null, login: null , refresh: null },
};
// Thunk to handle the user data when fetched from cookies
export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (
    authData: {
      username: string;
      userId: string;
      token: string;
      email: string;
      user_type: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return authData; // Return the data received from the cookie
    } catch (error) {
      return rejectWithValue("Failed to fetch user data");
    }
  }
);
// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.data || "Registration failed"
      );
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (loginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginCredentials,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.response?.data?.data || "Login failed due to server error");
    }
  }
);

// Refresh Token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/refresh-token", { token });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.data || "Token refresh failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
        removeCookie();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload; // Set user data from the cookie
        state.token = action.payload.token; // Set the token from the cookie
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.user = null;
        state.token = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading.register = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading.register = false;
        state.error.register = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error.register = action.payload as string;
        state.loading.register = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading.login = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token;
        state.loading.login = false;
        state.error.login = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error.login = action.payload as string;
        state.loading.login = false;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading.login = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.error.refresh = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
