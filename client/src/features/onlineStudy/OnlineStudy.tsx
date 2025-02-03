import AppAppBar from "./components/AppAppBar";
import MainContent from "./components/MainContent";
import { Grid } from "@mui/material";
import ProfessorList from "./components/ProfessorList";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {
  fetchCoursesListAsync,
} from "./courseSlice";
import { useEffect } from "react";
import { fetchProfessorsAsync, resetProfessorsParams } from "./professorSlice";
// import Footer from './components/Footer';

export default function OnlineStudy() {
  // useEffect(() => {
  //   if (location.pathname === "/onlineStudy") {
  //     console.log("Resetujem parametre i pribavljam kurseve za OnlineStudy");
  //     dispatch(resetCoursesParams());
  //     dispatch(fetchCoursesAsync());
  //   }
  // }, [dispatch, location.pathname]);

  //
  const dispatch = useAppDispatch();
  useEffect(() => {
    // dispatch(resetCoursesParams());
    dispatch(fetchCoursesListAsync());
    dispatch(resetProfessorsParams());
    dispatch(fetchProfessorsAsync());
  }, []);
  const { status: courseStatus } = useAppSelector((state) => state.course);
  // console.log(courseStatus);
  if (courseStatus.includes("pending"))
    return <LoadingComponent message="Učitavanje kurseva..." />;

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
