import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import NotFound from "../../app/errors/NotFound";
import { useEffect, useRef, useState } from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import {
  Card,
  CardContent,
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  styled,
  Typography,
  Box,
  Skeleton,
  Grid2,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Popover,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import CourseCardMedia from "./components/CourseCardMedia";
import { Author } from "./components/Author";
import SlideCardThemes from "./components/SlideCardThemes";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import {
  deleteCourseAsync,
  fetchCourseAsync,
  fetchCoursesListAsync,
} from "./courseSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Students from "./components/Students";
import StudentsOnCourse from "./components/StudentsOnCourse";
import SettingsIcon from "@mui/icons-material/Settings";
const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function Course() {
  const [openWeeks, setOpenWeeks] = useState<boolean[]>(Array(10).fill(false));
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const idMenu = open ? "simple-popover" : undefined;
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAppSelector((state) => state.account);

  const toggleWeek = (index: number) => {
    setOpenWeeks((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCourseAsync(parseInt(id!)));
  }, []);

  const course = useAppSelector((state) => state.course.currentCourse);
  const courseStatus = useAppSelector((state) => state.course.status);

  // const coursesLoaded = useAppSelector((state) => state.course.allcoursesLoaded);
  console.log(course);
  const topOfPageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (topOfPageRef.current) {
      topOfPageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [id]);

  if (id === undefined) return <NotFound />;
  if (courseStatus == "pendingFetchCourse")
    return <LoadingComponent message="Učitavanje kursa.." />;

  if (!course) return <NotFound />;

  const activeThemes = course.themes.filter((theme) => theme.active);
  const inactiveThemes = course.themes.filter((theme) => !theme.active);

  const handleDeleteClick = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    //setCourseSelected(undefined);
    setAnchorEl(null);
  };

  const handleConfirmDelete = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      navigate("/courses");
      console.log(course);
      //await dispatch(deleteCourseAsync(course.id));
    } catch (error) {
      console.error("Greška prilikom brisanja kursa:", error);
    } finally {
      setOpenDialog(false);
    }
  };

  return (
    <Grid
      container
      sx={{
        display: "flex",
        direction: "column",
        // alignItems: "center",
        margin: 0,
        paddingX: 10,
        paddingY: 3,
        marginBottom:5,
        height:"fit-content",
      }}
    >
      <Grid
        container
        sx={{
          direction: "row",
          display: "flex",
          margin: 0,
          justifyContent: "space-around",
          boxSizing: "border-box",
        }}
      >
        <div ref={topOfPageRef}></div>
        <Grid item xs={12} sx={{ marginBottom: 2 }}>
          {" "}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              // size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="small" />}
              sx={{ pl: 0 }}
            >
              <Box
                component={Link}
                to="/onlineStudy"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <AutoStoriesIcon
                  sx={{
                    color: "text.primary",
                    fontSize: "1.5rem",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2)",
                      color: "primary.dark", // Promijeni boju na hover
                    },
                  }}
                />
              </Box>

              {/* </Link> */}
              <Typography
                component={Typography}
                color="neutral"
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  "&:hover": {
                    color: "primary.dark", // Promijeni boju na hover
                  },
                  fontFamily: "Raleway, sans-serif",
                }}
              >
                {course.name}
              </Typography>
            </Breadcrumbs>
          </Box>
          {user &&
          course.professorsCourse.some(
            (pc) => pc.user.username === user.username
          ) ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  margin: 0,
                  padding: 0,
                  boxSizing: "border-box",
                  justifyContent: "flex-end",
                }}
              >
                <Box
                  aria-describedby={idMenu}
                  // variant="contained"
                  onClick={handleClick}
                  sx={{
                    display: "flex",
                    width: "fit-content",
                    padding: 0,
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <SettingsIcon
                    sx={{ fontSize: "1.8rem", color: "primary.dark" }}
                  />
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
                    // onClick={updateMaterial}
                    variant="body2"
                    sx={{
                      paddingX: 2,
                      paddingY: 1,
                      "&:hover": {
                        cursor: "pointer",
                        color: "primary.light",
                      },
                      // textTransform: "uppercase",

                      fontFamily: "Raleway, sans-serif",
                      color: "text.primary",
                      backgroundColor: "background.paper",
                    }}
                  >
                    Uredi kurs
                  </Typography>
                  <Divider sx={{ borderColor: "primary.main" }} />
                  <Typography
                    onClick={handleDeleteClick} // Otvara dijalog
                    variant="body2"
                    sx={{
                      paddingX: 2,
                      paddingY: 1,
                      "&:hover": {
                        cursor: "pointer",
                        color: "primary.light",
                      },
                      // textTransform: "uppercase",
                      fontFamily: "Raleway, sans-serif",
                      color: "text.secondaryChannel",
                      backgroundColor: "background.paper",
                    }}
                  >
                    Obriši kurs
                  </Typography>
                </Popover>
              </Box>
            </>
          ) : (
            ""
          )}
        </Grid>

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
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ color: "text.primary" }}>
              Odustani
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Obriši
            </Button>
          </DialogActions>
        </Dialog>

        <Grid
          container
          // spacing={1} // Postavljamo razmak između grid itema unutar ovog kontejnera
          sx={{
            height: "50vh",
            padding: 0,
            justifyContent: "space-between",
            // backgroundColor: "background.paper",
            // backdropFilter: "blur(20px)",
            borderRadius: 3,
          }} // Roditeljski grid bez paddinga
        >
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              height: "100%",
              width: "100%",
              p: 0,
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <Grid
              container
              spacing={1}
              sx={{
                width: "fit-content",
                height: "100%",
                backgroundColor: "background.paper",
                borderRadius: 3,
                overflow: "hidden",
                paddingBottom: 1,
              }}
            >
              {/* 1. Velika slika kursa - puna širina */}
              <Box component={Grid} sx={{ width: "100%", height: "60%" }}>
                <Grid
                  container
                  sx={{ height: "100%", position: "relative", p: 0 }}
                >
                  <CourseCardMedia
                    year={course.year}
                    studyProgram={course.studyProgram}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Grid>
              </Box>

              {/* 2. Naziv kursa - puna širina */}
              <Box
                component={Grid}
                sx={{
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 0,
                  m: 0,
                  pl: 1,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "primary.dark" }}
                >
                  {course.name}
                </Typography>
              </Box>

              {/* 3. Opis i profesori - 60-70%, datum - 30-40% */}
              <Box
                component={Grid}
                sx={{
                  width: "70%",
                  height: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 0,
                  pl: 1,
                  m: 0,
                }}
              >
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  {course.description}
                </Typography>
                {/* <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, fontSize:"clamp(8pt, 10pt, 11pt)" }}
                >
                  Profesori:
                </Typography>
                <Author authors={course.professorsCourse} /> */}
              </Box>

              <Box
                component={Grid}
                sx={{
                  width: "30%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  p: 0,
                }}
              >
                <Box
                  sx={{
                    p: 0,
                    borderRadius: "20pt",
                    // color:"info.light"
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    pr: 1,

                    // backgroundColor: "rgba(12, 16, 23, 0.7)",
                    // backdropFilter: "blur(20px)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "action.active",
                      textAlign: "center",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Kreirano:{" "}
                    {new Date(course.courseCreationDate).toLocaleDateString(
                      "sr-RS"
                    )}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* Desna strana - deo za studente */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              height: "100%",
              width: "100%",

              padding: 0,
              paddingLeft: 0,
              paddingTop: 0,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                // borderRadius: 2,
                backgroundColor: "background.paper",
                // overflow: "hidden",
                padding: 0,
                borderRadius: 3,
              }}
            >
              <StudentsOnCourse students={course.usersCourse} />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ margin: 0, padding: 0, width: "100%", mt: 1 }}>
          <Typography variant="h5">Profesori</Typography>

          <Author authors={course.professorsCourse} />
        </Box>

        {/* RADI GORE */}

        <Divider sx={{ width: "100%", marginY: 2 }} />
        {/* SEDMICE  */}

        <Typography variant="h5" sx={{ mb: 2, width: "100%" }}>
          Sedmice i materijali
        </Typography>
        <List sx={{ width: "100%" }}>
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <ListItem
                component="div"
                onClick={() => toggleWeek(index)}
                sx={{
                  cursor: "pointer",
                  padding: "8px 16px",
                  backgroundColor: openWeeks[index]
                    ? "rgba(0, 0, 0, 0.04)"
                    : "inherit",
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                }}
              >
                <ListItemText primary={`Sedmica ${index + 1}`} />
                <IconButton>
                  {openWeeks[index] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItem>
              <Collapse in={openWeeks[index]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem>
                    <ListItemText
                      primary={`Materijal za sedmicu ${index + 1}`}
                    />
                  </ListItem>
                </List>
              </Collapse>
            </div>
          ))}
        </List>

        <Divider sx={{ marginY: 2 }} />

        <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
          {/* Leva strana - Aktuelne teme */}
          <Box
            component={Grid}
            sx={{ width: "45%", display: "flex", flexDirection: "column", alignItems:"center" }}
          >
            <Typography variant="overline" sx={{ mb: 2 }}>
              Aktuelne teme za ovaj kurs
            </Typography>
            {activeThemes.length > 0 ? (
              <SlideCardThemes course={course} themes={activeThemes} />
            ) : (
              <SpeakerNotesOffIcon sx={{ fontSize: 50, color: "gray" }} />
            )}
          </Box>

          {/* Desna strana - Zatvorene teme */}
          <Box
            component={Grid}
            sx={{ width: "45%", display: "flex", flexDirection: "column",  alignItems:"center"  }}
          >
            <Typography variant="overline" sx={{ mb: 2 }}>
              Zatvorene teme za ovaj kurs
            </Typography>
            {inactiveThemes.length > 0 ? (
              <SlideCardThemes course={course} themes={inactiveThemes} />
            ) : (
              <SpeakerNotesOffIcon sx={{ fontSize: 50, color: "gray" }} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
