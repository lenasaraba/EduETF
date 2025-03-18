import {
  Box,
  Avatar,
  Divider,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { fetchProfessorCoursesAsync } from "../courseSlice";
import { useEffect } from "react";
import SlideDots from "./SlideDots";
import SlideCard from "./SlideCard";
import { OpenInNewRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function ProfessorList() {
  const dispatch = useAppDispatch();
  const professors = useAppSelector((state) => state.professor.professors);

  useEffect(() => {
    professors!.forEach((professor) => {
      dispatch(fetchProfessorCoursesAsync(professor.id));
    });
  }, [professors]);

  const professorCourses = useAppSelector(
    (state) => state.course.professorCourses
  );

  const statusProf = useAppSelector((state) => state.professor.status);
  const profCoursestatus = useAppSelector((state) => state.course.status);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          mb: 4,
          mt: 4,
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h2"
            gutterBottom
            sx={{ fontFamily: "Raleway, sans-serif", paddingTop: 4 }}
          >
            Profesori
          </Typography>
          <Chip
            size="small"
            icon={<OpenInNewRounded />}
            component={Link}
            to="/users/professors"
            sx={{
              backgroundColor: "primary.dark",
              color: "#fff",
              borderRadius: "16px",
              ".MuiChip-icon": {
                color: "#fff",
              },
              cursor: "pointer",
              marginTop: 4,
              fontFamily: "Raleway, sans-serif",
              marginBottom: 2,
              textDecoration: "none",
              "&:hover": {
                backgroundColor: "primary.main",
              },
              padding: 2,
            }}
            label="Svi profesori"
          />
        </Grid>
        {profCoursestatus == "pendingFetchProfessorCourses" ||
        statusProf == "pendingFetchProfessors" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "20vh",
              width: "100%",
              margin: 0,
              padding: 1,
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              Učitavanje profesora
            </Typography>
            <CircularProgress size={120} sx={{ color: "text.secondary" }} />
          </Box>
        ) : (
          <>
            <Grid container spacing={6} columns={12} sx={{}}>
              {professors!.slice(0, 4).map((teacher, index) => (
                <Grid
                  key={index}
                  size={{ xs: 12, md: 6 }}
                  sx={{
                    border: "1px solid",
                    padding: 2,
                    borderRadius: "20px",
                    borderColor: "text.primary",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: (theme) =>
                        `0px 4px 20px ${theme.palette.text.primary}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      direction: "row",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      key={index}
                      alt={teacher.firstName}
                      sx={{
                        width: 41,
                        height: 41,
                        backgroundColor: "text.primary",
                      }}
                    >
                      {teacher.firstName.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                      <Typography
                        variant="h5"
                        fontFamily="Raleway, sans-serif"
                        component={Link}
                        to={`/professorInfo/${teacher.id}`}
                        sx={{
                          textDecoration: "none",
                          color: "text.primary",
                          "&:visited": {
                            color: "text.primary",
                          },
                          "&:hover": {
                            color: "primary.main",
                          },
                        }}
                      >
                        {teacher.firstName}&nbsp;{teacher.lastName}
                      </Typography>
                    </div>
                  </Box>
                  <Divider component="div" sx={{ my: 2 }} />

                  {professorCourses &&
                  professorCourses[teacher.id] &&
                  professorCourses[teacher.id].filter((course) => {
                    const hasValidProfessor = course.professorsCourse.some(
                      (pc) => {
                        const conditionMet =
                          pc.withdrawDate === null && pc.user.id === teacher.id;
                        return conditionMet;
                      }
                    );
                    return hasValidProfessor;
                  }).length > 0 ? (
                    <SlideCard
                      courses={professorCourses[teacher.id].filter((course) => {
                        const hasValidProfessor = course.professorsCourse.some(
                          (pc) => {
                            const conditionMet =
                              pc.withdrawDate === null &&
                              pc.user.id === teacher.id;
                            return conditionMet;
                          }
                        );

                        return hasValidProfessor;
                      })}
                    />
                  ) : (
                    <Typography>Nema kurseva</Typography>
                  )}

                  <Divider component="div" sx={{ my: 2 }} />

                  {professorCourses &&
                  professorCourses[teacher.id] &&
                  professorCourses[teacher.id].filter((course) =>
                    course.professorsCourse.some(
                      (pc) =>
                        pc.withdrawDate === null && pc.user.id == teacher.id
                    )
                  ).length > 0 ? (
                    <SlideDots
                      programs={[
                        ...new Set(
                          professorCourses[teacher.id]
                            .filter((course) =>
                              course.professorsCourse.some(
                                (pc) =>
                                  pc.withdrawDate === null &&
                                  pc.user.id == teacher.id
                              )
                            )
                            .map((course) => course.studyProgram.name)
                        ),
                      ]}
                    />
                  ) : (
                    <Typography>Nema smjerova</Typography>
                  )}
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </>
  );
}
