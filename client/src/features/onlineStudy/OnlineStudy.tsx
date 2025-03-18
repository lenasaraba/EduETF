import AppAppBar from "./components/AppAppBar";
import MainContent from "./components/MainContent";
import { Grid } from "@mui/material";
import ProfessorList from "./components/ProfessorList";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  fetchCoursesListAsync,
  fetchProfessorCoursesAsync,
} from "./courseSlice";
import { useEffect } from "react";
import { fetchProfessorsAsync, resetProfessorsParams } from "./professorSlice";

export default function OnlineStudy() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCoursesListAsync());
    dispatch(resetProfessorsParams());
    dispatch(fetchProfessorsAsync());
  }, []);
  const professors = useAppSelector((state) => state.professor.professors);
  useEffect(() => {
    professors!.forEach((professor) => {
      dispatch(fetchProfessorCoursesAsync(professor.id));
    });
  }, [dispatch]);
  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          direction: "column",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: 0,
            paddingX: 10,
            paddingY: 3,
          }}
        >
          <AppAppBar />
          <MainContent />
          <ProfessorList />
        </Grid>
      </Grid>
    </>
  );
}
