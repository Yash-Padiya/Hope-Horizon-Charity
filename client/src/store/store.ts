import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import feedbackReducer from "./feedbackSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    feedback : feedbackReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
