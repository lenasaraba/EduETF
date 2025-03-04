import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { format } from "date-fns";
import CourseCardMedia from "./CourseCardMedia";
import { Author } from "./Author";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Popover,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { deleteCourseAsync, removeProfessorFromCourse } from "../courseSlice";
import { Course } from "../../../app/models/course";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";

const DateCard = ({ date }: { date: string }) => {
  const dateFormatted = new Date(date); // Pretvori string u Date objekat
  const formattedDate = format(dateFormatted, "dd.MM.yyyy"); // Formatiraj datum

  return <div>{formattedDate}</div>;
};

const SyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  backgroundColor: theme.palette.secondary.main,
  "&:hover": {
    backgroundColor: "transparent",
    // cursor: "pointer",
    border: "1px solid",
    borderColor: theme.palette.background.paper,
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "2px",
  },
}));

const SyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  // gap: 4,
  padding: 16,
  // flexGrow: 1,
  "&:last-child": {
    // paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export default function MainContent() {
  const user = useAppSelector((state) => state.account.user);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const idMenu = open ? "simple-popover" : undefined;

  const [courseSelected, setCourseSelected] = useState<Course | undefined>(
    undefined
  );
  const status = useAppSelector((state) => state.course.status);
  const [openDialogRemoveProfessor, setOpenDialogRemoveProfessor] =
    useState(false);

  const handleRemoveProfClick = () => {
    console.log(courseSelected);
    setOpenDialogRemoveProfessor(true);
    setAnchorEl(null);
  };

  const handleCloseDialogRemoveProfessor = () => {
    setOpenDialogRemoveProfessor(false);
    setAnchorEl(null);
  };
  const [isLastProf, setIsLastProf] = useState(false);

  const handleRemoveProfFromCourse: () => Promise<void> = async () => {
    console.log(courseSelected);
    console.log(courseSelected?.professorsCourse);
    if (courseSelected?.professorsCourse.filter((p)=>p.withdrawDate==null).length == 1) {
      setIsLastProf(true);
      handleDeleteClick();
      setOpenDialogRemoveProfessor(false);

      // navigate("/courses?type=all");
    } else removeProfFromCourse();
  };

  const removeProfFromCourse: () => Promise<void> = async () => {
    try {
      await dispatch(removeProfessorFromCourse(courseSelected!.id));
    } catch (error) {
      console.error("Greška prilikom uklanjanja profesora sa kursa:", error);
    } finally {
      setOpenDialogRemoveProfessor(false);
      setAnchorEl(null);
    }
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    try {
      setCourseSelected(undefined);
    } catch (error) {
      console.error("Greška:", error);
    } finally {
      setOpenDialog(false);
      setAnchorEl(null);
    }
  };

  const handleConfirmDelete = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      console.log(courseSelected);
      await dispatch(deleteCourseAsync(courseSelected!.id));
    } catch (error) {
      console.error("Greška prilikom brisanja kursa:", error);
    } finally {
      setAnchorEl(null);
      setOpenDialog(false);
      setCourseSelected(undefined);
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    course: Course
  ) => {
    setAnchorEl(event.currentTarget);
    setCourseSelected(course);
  };

  const handleClose = () => {
    setCourseSelected(undefined);
    setAnchorEl(null);
  };
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null
  );

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const courses = useAppSelector((state) => state.course.allCourses);
  const allcoursesloaded = useAppSelector(
    (state) => state.course.allcoursesLoaded
  );
  const statusCourse = useAppSelector((state) => state.course.status);

  const newArray = [...(courses || [])];
  const topCourses = newArray
    ?.sort((a, b) => b.usersCourse.length - a.usersCourse.length)
    .slice(0, 5);
  const firstTwoCourses = topCourses.slice(0, 2);
  const lastThreeCourses = topCourses.slice(-3);

  // if(!allcoursesloaded) return (<LoadingComponent message="Učitavanje kurseva.."/>)

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          margin: 0,
          padding: 0,
        }}
      >
        <div>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "Raleway, sans-serif",
              marginY: 4,
              fontWeight: "bolder",
              color: "primary.main",
            }}
          >
            Online učenje
          </Typography>
          <Box
            sx={{
              margin: 0,
              padding: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontFamily: "Raleway, sans-serif" }}>
              Pronađite kurs koji vam odgovara.
            </Typography>
            {user && user.role == "Profesor" && (
              <Button
                component={Link}
                to="/createCourse"
                sx={{
                  backgroundColor: "primary.dark",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "20px",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                  height: "fit-content",
                  width: "3rem",
                  boxSizing: "border-box",
                }}
              >
                <AddIcon sx={{ fontSize: "16pt" }} />
              </Button>
            )}
          </Box>
        </div>
        <Divider />

        {!allcoursesloaded ? (
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
            <Typography variant="body1">Učitavanje kurseva</Typography>
            <CircularProgress size={120} sx={{ color: "text.secondary" }} />
          </Box>
        ) : (
          <>
            <Grid container spacing={2} columns={12}>
              {firstTwoCourses.map((course, index) => (
                <Grid key={index} size={{ xs: 12, md: 6 }}>
                  <SyledCard
                    variant="outlined"
                    onFocus={() => handleFocus(index)}
                    onBlur={handleBlur}
                    tabIndex={index}
                    className={focusedCardIndex === index ? "Mui-focused" : ""}
                    sx={{
                      border: "none",
                      borderRadius: "16px",
                      boxShadow: (theme) =>
                        `0px 4px 12px ${theme.palette.mode === "light" ? "#ddd" : "#333"}`,
                      overflow: "hidden",
                      position: "relative",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: (theme) =>
                          `0px 8px 24px ${theme.palette.mode === "light" ? "#bbb" : "#111"}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        overflow: "hidden",
                      }}
                    >
                      <CourseCardMedia
                        year={course.year}
                        studyProgram={course.studyProgram}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "brightness(0.75)", // Tamniji filter da bi tekst bio čitljiv
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: "16px",
                          left: "16px",
                          color: "white",
                          zIndex: 2,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontFamily="Raleway, sans-serif"
                          sx={{ opacity: 0.8, paddingX: 1.5 }}
                        >
                          {course.studyProgram.name}
                        </Typography>
                        <Typography
                          variant="h5"
                          fontFamily="Raleway, sans-serif"
                          sx={{
                            fontWeight: 700,
                            textDecoration: "none", // Uklanja podrazumevanu dekoraciju za Link
                            color: "#c4e1f6", // Podešava boju na primarnu boju teksta
                            "&:hover": {
                              color: "primary.main", // Opcionalno, boja pri hoveru
                            },
                            backdropFilter: "blur(30px)",
                            borderRadius: "20pt",
                            paddingX: 1.5,
                            backgroundColor: "#0c101780",
                          }}
                          component={Link}
                          to={user ? `/courses/${course.id}` : `/login`}
                        >
                          {course.name}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        padding: "16px",
                        backgroundColor: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          margin: 0,
                          padding: 0,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <StyledTypography
                          variant="body2"
                          color="text.secondary"
                          fontFamily="Raleway, sans-serif"
                        >
                          {course.description}
                        </StyledTypography>
                        {user &&
                        course.professorsCourse.some(
                          (pc) =>
                            pc.user.username === user.username &&
                            pc.withdrawDate == null
                        ) ? (
                          <>
                            <div>
                              <Box
                                aria-describedby={idMenu}
                                onClick={(event) => handleClick(event, course)}
                                sx={{
                                  display: "flex",
                                  width: "fit-content",
                                  borderRadius: "20pt",
                                  padding: 0,
                                  "&:hover": {
                                    cursor: "pointer",
                                    color: "text.primary",
                                    backgroundColor: "primary.main",
                                  },
                                }}
                              >
                                <MoreVertIcon />
                              </Box>
                              <Popover
                                id={idMenu}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "center",
                                }}
                                slotProps={{
                                  paper: {
                                    sx: {
                                      borderRadius: "10pt",
                                      "&:hover": {
                                        cursor: "pointer",
                                      },
                                    },
                                  },
                                }}
                              >
                                <Typography
                                  onClick={handleDeleteClick}
                                  variant="body2"
                                  sx={{
                                    paddingX: 2,
                                    paddingY: 1,
                                    "&:hover": {
                                      cursor: "pointer",
                                      color: "primary.light",
                                    },
                                    fontFamily: "Raleway, sans-serif",
                                    color: "text.secondaryChannel",
                                    backgroundColor: "background.paper",
                                  }}
                                >
                                  Obriši kurs
                                </Typography>
                                <Typography
                                  onClick={handleRemoveProfClick}
                                  variant="body2"
                                  sx={{
                                    paddingX: 2,
                                    paddingY: 1,
                                    "&:hover": {
                                      cursor: "pointer",
                                      color: "primary.light",
                                    },
                                    fontFamily: "Raleway, sans-serif",
                                    color: "text.primary",
                                    backgroundColor: "background.paper",
                                  }}
                                >
                                  Napusti kurs
                                </Typography>
                              </Popover>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </Box>
                      <Divider sx={{ my: 1 }} />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Author
                          authors={course.professorsCourse.filter(
                            (pc) => pc.withdrawDate == null
                          )}
                        />

                        <Typography
                          variant="caption"
                          fontFamily="Raleway, sans-serif"
                          color="text.secondary"
                        >
                          <DateCard
                            date={course.courseCreationDate.split("T")[0]}
                          />
                        </Typography>
                      </Box>
                    </Box>
                  </SyledCard>
                </Grid>
              ))}
            </Grid>
            <Grid container spacing={2} columns={12}>
              {lastThreeCourses.map((course, index) => (
                <Grid key={index} size={{ xs: 12, md: 4 }}>
                  <SyledCard
                    variant="outlined"
                    onFocus={() => handleFocus(index)}
                    onBlur={handleBlur}
                    tabIndex={index}
                    className={focusedCardIndex === index ? "Mui-focused" : ""}
                    sx={{
                      justifyContent: "space-evenly",
                      height: "100%",
                      border: "none",
                      borderRadius: "16px",
                      boxShadow: (theme) =>
                        `0px 4px 12px ${theme.palette.mode === "light" ? "#ddd" : "#333"}`,
                      overflow: "hidden",
                      position: "relative",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: (theme) =>
                          `0px 8px 24px ${theme.palette.mode === "light" ? "#bbb" : "#111"}`,
                      },
                    }}
                  >
                    <CourseCardMedia
                      year={course.year}
                      studyProgram={course.studyProgram}
                      sx={{
                        height: { sm: "auto", md: "50%" },
                        aspectRatio: { sm: "16 / 9", md: "" },
                        filter: "brightness(0.75)", // Tamniji filter da bi tekst bio čitljiv
                      }}
                    />
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <SyledCardContent sx={{ pb: 0, gap: 0.5 }}>
                        <Typography
                          variant="caption"
                          component="div"
                          fontFamily="Raleway, sans-serif"
                          fontSize="clamp(10px, 12px, 14px)"
                        >
                          {course.studyProgram.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontFamily="Raleway, sans-serif"
                            fontSize="clamp(12px, 14px, 16px)"
                            fontWeight="bolder"
                            component={Link}
                            to={user ? `/courses/${course.id}` : `/login`}
                            sx={{
                              textDecoration: "none",
                              color: "text.primary",
                              overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
                              display: "-webkit-box", // Neophodno za multi-line truncation
                              WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                              WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
                              lineHeight: "1.2", // Podešava razmak između linija
                              height: "1.2em", // Fiksna visina: broj linija * lineHeight
                              textOverflow: "ellipsis", // Dodaje tri tačke
                              "&:hover": {
                                color: "primary.main", // Opcionalno, boja pri hoveru
                              },
                            }}
                          >
                            {course.name}
                          </Typography>
                          {user &&
                          course.professorsCourse.some(
                            (pc) =>
                              pc.user.username === user.username &&
                              pc.withdrawDate == null
                          ) ? (
                            <>
                              <div>
                                <Box
                                  aria-describedby={idMenu}
                                  onClick={(event) =>
                                    handleClick(event, course)
                                  }
                                  sx={{
                                    display: "flex",
                                    width: "fit-content",
                                    borderRadius: "20pt",
                                    padding: 0,
                                    "&:hover": {
                                      cursor: "pointer",
                                      color: "text.primary",
                                      backgroundColor: "primary.main",
                                    },
                                  }}
                                >
                                  <MoreVertIcon />
                                </Box>
                                <Popover
                                  id={idMenu}
                                  open={open}
                                  anchorEl={anchorEl}
                                  onClose={handleClose}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                  }}
                                  slotProps={{
                                    paper: {
                                      sx: {
                                        borderRadius: "10pt",
                                        "&:hover": {
                                          cursor: "pointer",
                                        },
                                      },
                                    },
                                  }}
                                >
                                  <Typography
                                    onClick={handleDeleteClick}
                                    variant="body2"
                                    sx={{
                                      paddingX: 2,
                                      paddingY: 1,
                                      "&:hover": {
                                        cursor: "pointer",
                                        color: "primary.light",
                                      },
                                      fontFamily: "Raleway, sans-serif",
                                      color: "text.secondaryChannel",
                                      backgroundColor: "background.paper",
                                    }}
                                  >
                                    Obriši kurs
                                  </Typography>
                                  <Typography
                                    onClick={handleRemoveProfClick}
                                    variant="body2"
                                    sx={{
                                      paddingX: 2,
                                      paddingY: 1,
                                      "&:hover": {
                                        cursor: "pointer",
                                        color: "primary.light",
                                      },
                                      fontFamily: "Raleway, sans-serif",
                                      color: "text.primary",
                                      backgroundColor: "background.paper",
                                    }}
                                  >
                                    Napusti kurs
                                  </Typography>
                                </Popover>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </Box>
                        <StyledTypography
                          variant="body2"
                          color="text.secondary"
                          // gutterBottom
                          fontFamily="Raleway, sans-serif"
                          fontSize="clamp(10px, 12px, 14px)"
                        >
                          {course.description}
                        </StyledTypography>
                      </SyledCardContent>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: 2,
                        }}
                      >
                        <Author
                          authors={course.professorsCourse.filter(
                            (pc) => pc.withdrawDate == null
                          )}
                        />
                        <Typography variant="caption">
                          <DateCard
                            date={course.courseCreationDate.split("T")[0]}
                          />
                        </Typography>
                      </Box>
                    </Box>
                  </SyledCard>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12pt",
            padding: 3,
            minWidth: 300,
            textAlign: "center",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Raleway, sans-serif",
            fontSize: "1.2rem",
          }}
        >
          Potvrda brisanja
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "Raleway, sans-serif",
              color: "text.secondary",
            }}
          >
            Da li ste sigurni da želite da obrišete ovaj kurs?
          </Typography>
          <Typography
            color="info.light"
            sx={{ fontSize: "clamp(9pt, 10pt, 11pt)" }}
          >
            {courseSelected?.name}
            {"-"}
            {courseSelected?.description}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: "text.primary" }}>
            Odustani
          </Button>
          <LoadingButton
            loading={statusCourse == "pendingDeleteCourse"}
            loadingIndicator={
              <CircularProgress size={18} sx={{ color: "white" }} /> // Ovdje mijenjaš boju
            }
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Obriši
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogRemoveProfessor}
        onClose={handleCloseDialogRemoveProfessor}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12pt",
            padding: 3,
            minWidth: 300,
            textAlign: "center",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Raleway, sans-serif",
            fontSize: "1.2rem",
          }}
        >
          Napuštate kurs?
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "Raleway, sans-serif",
              color: "text.secondary",
            }}
          >
            Da li ste sigurni da želite da napustite ovaj kurs? -{" "}
            {courseSelected?.name}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleCloseDialogRemoveProfessor}
            sx={{ color: "text.primary" }}
          >
            Odustani
          </Button>
          <LoadingButton
            loading={status == "loadingRemoveProfessorFromCourse"}
            onClick={handleRemoveProfFromCourse}
            color="error"
            variant="contained"
            loadingIndicator={
              <CircularProgress size={18} sx={{ color: "white" }} />
            }
          >
            Napusti kurs
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
