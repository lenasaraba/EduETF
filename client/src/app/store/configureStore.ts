import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../features/account/accountSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { courseSlice } from "../../features/onlineStudy/courseSlice";
import { professorSlice } from "../../features/onlineStudy/professorSlice";
import { themeSlice } from "../../features/forum/themeSlice";
import { messageSlice } from "../../features/forum/messageSlice";
import { formSlice } from "../../features/form/formSlice";

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    course: courseSlice.reducer,
    professor: professorSlice.reducer,
    theme: themeSlice.reducer,
    message: messageSlice.reducer,
    form:formSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
