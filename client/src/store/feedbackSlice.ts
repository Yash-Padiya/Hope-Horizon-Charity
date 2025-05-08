import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    feedbackDrawer : false,
};

const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {
        openFeedbackDrawer: (state) => {
            state.feedbackDrawer = true;
        },
        closeFeedbackDrawer: (state) => {
            state.feedbackDrawer = false;
        },
    }
})

export const { openFeedbackDrawer,closeFeedbackDrawer } = feedbackSlice.actions

export default feedbackSlice.reducer