import { configureStore } from "@reduxjs/toolkit";
import beepReducer from "./beepSlice";

export const store = configureStore({
  reducer: {
    beep: beepReducer,
  },
});
