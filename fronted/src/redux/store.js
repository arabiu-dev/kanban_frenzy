import { configureStore } from "@reduxjs/toolkit";
import boardsSlice from "./boardsSlice";
import themeSlice from "./themeSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    boards: boardsSlice.reducer,
    theme: themeSlice.reducer,
    user: userSlice.reducer
  }
})

export default store
