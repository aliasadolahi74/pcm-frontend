import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  silenceItems: [],
};

export const beepSlice = createSlice({
  name: "beep",
  initialState,
  reducers: {
    toggle: (state, action) => {
      const index = _.findIndex(
        state.silenceItems,
        (i) => i.deviceID === action.payload.deviceID
      );
      const newSilenceItems = [...state.silenceItems];
      if (index > -1) {
        const newItems = _.filter(newSilenceItems, (i) => {
          return i.deviceID !== action.payload.deviceID;
        });
        state.silenceItems = newItems;
      } else {
        newSilenceItems.push(action.payload);
        state.silenceItems = newSilenceItems;
      }
    },
  },
});

export const { toggle } = beepSlice.actions;

export default beepSlice.reducer;
