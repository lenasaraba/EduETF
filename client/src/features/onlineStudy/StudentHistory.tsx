import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchMyCoursesAsync,
  fetchStudentsAsync,
  resetMyCoursesParams,
  resetStudentsParams,
  setMyCoursesParams,
  setStudentsParams,
} from "./courseSlice";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import {
  Avatar,
  Box,
  Breadcrumbs,
  Chip,
  CircularProgress,
  debounce,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
// import { ColorPaletteProp } from '@mui/joy/styles';

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Link } from "react-router-dom";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SchoolIcon from "@mui/icons-material/School";
import SearchRoundedIcon from "@mui/icons-material/Search";
import CourseCardMedia from "./components/CourseCardMedia";

export default function StudentHistory() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.user);
  const courses = useAppSelector((state) => state.course.myCourses);
  const coursesLoaded = useAppSelector((state) => state.course.myCoursesLoaded);

  //   const students = useAppSelector((state) => state.course.students);
  //   const statusStudents = useAppSelector((state) => state.course.status);
  //   const studentsLoaded = useAppSelector((state) => state.course.studentsLoaded);
  const coursesParams = useAppSelector((state) => state.course.myCoursesParams);

  const [searchTerm, setSearchTerm] = useState(coursesParams.searchTerm);

  const debouncedSearch = useMemo(
    () =>
      debounce((event: any) => {
        setSearchTerm(event.target.value);
        dispatch(setMyCoursesParams({ searchTerm: event.target.value }));
        dispatch(fetchMyCoursesAsync());
      }, 1000),
    [dispatch]
  );

  useEffect(() => {
    dispatch(resetMyCoursesParams());
    dispatch(fetchMyCoursesAsync());
  }, [dispatch]);

  const topOfPageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (topOfPageRef.current) {
      topOfPageRef.current.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
  }, []);

  //   useEffect(() => {
  //     return () => {
  //       debouncedSearch.clear();
  //     };
  //   }, [debouncedSearch]);

  return (
    <>
      <div ref={topOfPageRef}></div>
      <Grid
        container
        sx={{
          display: "block",
          direction: "column",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="small" />}
              sx={{ pl: 0 }}
            >
              <Box
                component={Link}
                to="/profile"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PersonOutlineIcon
                  sx={{
                    color: "text.primary",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2)",
                      color: "primary.dark",
                    },
                  }}
                />
              </Box>

              <Typography
                component={Typography}
                color="neutral"
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  "&:hover": {
                    color: "primary.dark",
                  },
                  fontFamily: "Raleway, sans-serif",
                }}
              >
                Istorija naloga
              </Typography>
            </Breadcrumbs>
          </Box>
          <div
            style={{
              marginTop: "32px",
              marginBottom: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Raleway, sans-serif",
                fontWeight: "bolder",
                color: "primary.main",
                fontSize: "3.75rem",
              }}
            >
              Istorija
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Raleway, sans-serif",
                fontWeight: "bold",
                color: "primary.dark",
                fontSize: "1.75rem",
              }}
            >
              {user?.firstName}&nbsp;{user?.lastName} &bull; {user?.email}
            </Typography>
          </div>
          <Box
            className="SearchAndFilters-tabletUp"
            sx={{
              borderRadius: "sm",
              py: 0,
              display: { xs: "none", sm: "flex" },
              flexWrap: "wrap",
              gap: 1.5,
              marginBottom: 2,
              "& > *": {
                minWidth: { xs: "120px", md: "160px" },
              },
            }}
          >
            <FormControl sx={{ flex: 1 }}>
              <FormLabel
                sx={{
                  color: "primary.main",
                  marginBottom: 1,
                  fontFamily: "Raleway,sans-serif",
                  fontSize: "clamp(12px, 14px, 16px)",
                  overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
                  display: "-webkit-box", // Neophodno za multi-line truncation
                  WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                  WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
                  lineHeight: "1", // Podešava razmak između linija
                  height: "1em", // Fiksna visina: broj linija * lineHeight
                  textOverflow: "ellipsis", // Dodaje tri tačke
                }}
              >
                Pretraži prema nazivu ili opisu
              </FormLabel>
              <TextField
                placeholder="Pretraga.."
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: 0,
                      }}
                    >
                      <SearchRoundedIcon
                        fontSize="small"
                        sx={{ color: "primary.main" }}
                      />
                    </Box>
                  ),
                }}
                sx={{
                  backgroundColor: "background.paper",
                  borderColor: "background.default",
                  color: "red",
                  padding: 0,
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    height: 40,
                    paddingRight: "14px",
                    "& fieldset": {
                      borderColor: "background.default",
                    },
                    "&:hover fieldset": {
                      borderColor: "action.hover", // Promeni samo obrub, ako želiš
                    },
                    "&:hover": {
                      backgroundColor: "action.hover", // Ovdje se menja pozadina celog inputa
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: 0,
                  },
                  "& .MuiInputBase-inputAdornedStart": {
                    paddingLeft: 0,
                  },
                  "& input": {
                    color: "primary.main", // Osnovna boja teksta
                    fontSize: 14,
                  },
                }}
                value={searchTerm || ""}
                onChange={(event: any) => {
                  setSearchTerm(event.target.value);
                  debouncedSearch(event);
                }}
              />
            </FormControl>
          </Box>
          <Divider />
          {!coursesLoaded ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "40vh",
                width: "100%",
                margin: 0,
                padding: 1,
              }}
            >
              <CircularProgress size={60} sx={{ color: "primary.main" }} />
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: {
                    xs: "block",
                    sm: "block",
                    ".MuiList-root": { paddingBottom: "0px !important" },
                  },
                }}
              >
                {courses &&
                  courses.map((course) => (
                    <List
                      key={course.id}
                      sx={{
                        "--ListItem-paddingX": 0,
                        "--ListItem-paddingY": 0,
                      }}
                    >
                      <ListItem
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          height: "20vh",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "start",
                            width: "60%",
                            height: "100%",
                          }}
                        >
                          <Box>
                            <CourseCardMedia
                              year={course.year}
                              studyProgram={course.studyProgram}
                              sx={{
                                objectFit: "cover",
                                borderRadius: "15pt",
                                height: 80,
                                width: 100,
                              }}
                            />
                          </Box>
                          <Box sx={{ padding: 0, margin: 0 }}>
                            <Typography
                              component={Link}
                              to={`/courses/${course.id}`}
                              variant="h6"
                              gutterBottom
                              sx={{
                                fontWeight: 600,
                                lineHeight: 1,
                                textDecoration: "none",
                                color: "text.primary",
                                "&:hover": {
                                  color: "primary.dark",
                                },
                              }}
                            >
                              {course.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              gutterBottom
                              sx={{ fontSize: "9pt" }}
                            >
                              {course.description}
                            </Typography>
                            <Typography variant="caption">
                              {course.year.name} &bull;{" "}
                              {course.studyProgram.name}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            margin: 0,
                            padding: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            overflowY: "auto",
                            maxHeight: "100%",
                            paddingRight: 1,
                          }}
                        >
                          {course.usersCourse
                            .filter((u) => u.user.id === user?.id)
                            .map((u) => {
                              return (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginBottom: 1,
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="caption">
                                    {new Date(u.enrollDate).toLocaleDateString(
                                      "sr-RS"
                                    )}
                                    {" - "}
                                    {u.withdrawDate != null
                                      ? new Date(
                                          u.withdrawDate
                                        ).toLocaleDateString("sr-RS")
                                      : "danas"}
                                  </Typography>
                                  <Chip
                                    label={
                                      u.withdrawDate != null
                                        ? "Ispisan"
                                        : "Aktivan"
                                    }
                                    sx={{
                                      color:
                                        u.withdrawDate != null
                                          ? "text.secondaryChannel"
                                          : "text.primaryChannel",
                                      ".MuiChip-label": {
                                        paddingX: 1,
                                        fontSize: "8pt",
                                      },
                                    }} // Crveno ako je ispisan, zeleno ako nije
                                  />
                                </Box>
                              );
                            })}
                        </Box>
                      </ListItem>
                      <Divider />
                    </List>
                  ))}
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}
