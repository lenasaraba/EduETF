import {
  Box,
  Breadcrumbs,
  Button,
  debounce,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
// import Grid from "@mui/material/Grid2";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import CourseCard from "./CourseCard";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  fetchCoursesAsync,
  fetchFilters,
  resetCoursesParams,
  setCoursesParams,
  setPageNumber,
} from "./courseSlice";
import AddIcon from "@mui/icons-material/Add";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LoadingComponent from "../../app/layout/LoadingComponent";
import AppPagination from "../../app/components/AppPagination";
import CourseCardSkeleton from "./components/CourseCardSkeleton";
import FilterSelectChip from "./components/FilterSelectChip";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SchoolIcon from "@mui/icons-material/School";

export default function CourseList() {
  const [searchParams] = useSearchParams();
  const courseType = searchParams.get("type");
  const dispatch = useAppDispatch();

  const {
    coursesLoaded,
    filtersLoaded,
    years,
    programs,
    coursesParams,
    metaData,
  } = useAppSelector((state) => state.course);
  console.log("/////////////////////////////////////// " + metaData);
  const [searchTerm, setSearchTerm] = useState(coursesParams.searchTerm);

  const debouncedSearch = useMemo(
    () =>
      debounce((event: any) => {
        dispatch(setCoursesParams({ searchTerm: event.target.value }));
        dispatch(fetchCoursesAsync());
      }, 1000),
    [dispatch] // Zavisi samo od dispatch-ap
  );

  const allCourses = useAppSelector((state) => state.course.courses);
  // const myCourses = useAppSelector((state) => state.course.courses);
  useEffect(() => {
    if (courseType === "all") {
      dispatch(setCoursesParams({ type: courseType }));
      dispatch(fetchCoursesAsync());
    } else if (courseType === "my") {
      dispatch(setCoursesParams({ type: courseType }));
      dispatch(fetchCoursesAsync());
    }
  }, [courseType, dispatch]);
  const user = useAppSelector((state) => state.account.user);
  const navigate = useNavigate();

  const coursesToDisplay = allCourses;
  useEffect(() => {
    if (courseType === "my" && !user) {
      navigate("/login");
    }
  }, [user, courseType, navigate]);

  useEffect(() => {
    if (!coursesLoaded) dispatch(fetchCoursesAsync());
  }, [coursesLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFilters());
  }, [dispatch, filtersLoaded]);

  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, [debouncedSearch]);

  if (!filtersLoaded)
    return <LoadingComponent message="Učitavanje kurseva..." />;

  return (
    <Grid
      container
      sx={{
        //PROVJERITI SA ŠICOM
        display: "block",
        direction: "column",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: 0,
          // my: 16,
          paddingX: 10,
          paddingY: 3,
          // gap: 4,
        }}
      >
        {/* <Box sx={{ display: "flex", flexDirection: "column", margin: 0 }}> */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Breadcrumbs
            //size="small"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="small" />}
            sx={{ pl: 0 }}
          >
            <Box
              component={Link}
              to="/onlineStudy"
              sx={{ display: "flex", alignItems: "center" }}
              // onClick={() => dispatch(resetCoursesParams())}
            >
              <SchoolIcon
                sx={{
                  color: "text.primary",
                  // fontWeight: "bold",

                  "&:hover": {
                    color: "action.focus", // Promijeni boju na hover
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
                  color: "action.focus", // Promijeni boju na hover
                },
                fontFamily: "Raleway, sans-serif",
              }}
            >
              {courseType === "my" ? "Moji kursevi" : "Svi kursevi"}
            </Typography>
          </Breadcrumbs>
        </Box>
        {/* <Box
          sx={{
            display: "flex",
            mb: 1,
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "start", sm: "center" },
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h2"
            // component="h1"
            sx={{
              fontFamily: "Raleway, sans-serif",
              marginY: 4,
              fontWeight: "bolder",
              color: "primary.main",
            }}
          >
            Kursevi
          </Typography>
          <Button
            component={Link}
            to="/createCourse"
            //onClick={handleOpen}
            sx={{
              backgroundColor: "primary.dark",
              color: "white",
              padding: "10px 20px",
              borderRadius: "20px",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <AddIcon />
          </Button>
        </Box> */}

        <div
          style={{
            marginTop: "32px",
            marginBottom: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h2"
            // gutterBottom
            sx={{
              fontFamily: "Raleway, sans-serif",
              // marginY: 4,
              fontWeight: "bolder",
              color: "primary.main",
            }}
          >
            Kursevi
          </Typography>
          <Button
            component={Link}
            to="/createCourse"
            //onClick={handleOpen}
            sx={{
              backgroundColor: "primary.dark",
              color: "white",
              padding: "10px 20px",
              borderRadius: "20px",
              // fontSize: "16px",
              "&:hover": {
                backgroundColor: "primary.light",
              },
              height: "fit-content",
              minWidth: 0,
              width: "3rem",
              boxSizing: "border-box",
              // height: "auto",
            }}
          >
            <AddIcon sx={{ fontSize: "16pt" }} />
          </Button>
        </div>
        <Divider sx={{ marginBottom: 4 }} />
        <Box
          sx={{
            borderRadius: "sm",
            py: 0,
            display: { xs: "none", sm: "flex" },
            flexWrap: "wrap",
            gap: 1.5,
            flexDirection: "column",
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
              Pretraži prema ključnoj riječi
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

          <FilterSelectChip
            programs={programs!}
            years={years!}
            onChange={(pr: string[], yr: string[]) => {
              dispatch(setCoursesParams({ studyPrograms: pr, years: yr }));
            }}
          />

          {/* VALJA  */}

          {/* ovdje dodati dio koji ide u main content sa grid 86. linija */}
        </Box>
        {(courseType == "my" &&
          coursesToDisplay &&
          coursesToDisplay.length > 0) ||
        (courseType == "all" &&
          coursesToDisplay &&
          coursesToDisplay.length > 0) ? (
          <>
            {!coursesLoaded ? (
              <Grid
                container
                spacing={0} // Dodaje razmak između Grid elemenata
                justifyContent="space-between" // Podešava razmak između elemenata
                columns={12} // Ukupno broj kolona u mreži
                sx={{ width: "100%", rowGap: 4, mt: 4 }}
              >
                {coursesToDisplay!.map((course) => (
                  <Grid item xs={12} md={3.8} key={course.id}>
                    <CourseCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid
                container
                spacing={0} // Dodaje razmak između Grid elemenata
                justifyContent="space-between" // Podešava razmak između elemenata
                columns={12} // Ukupno broj kolona u mreži
                sx={{ width: "100%", rowGap: 4, mt: 4 }}
              >
                {coursesToDisplay!.map((course) => (
                  <Grid item xs={12} md={3.8} key={course.id}>
                    <CourseCard course={course} />
                  </Grid>
                ))}
              </Grid>
            )}
            <Box sx={{ mb: 2, mt: 2 }}>
              {metaData && (
                <AppPagination
                  metaData={metaData}
                  onPageChange={(page: number) =>
                    dispatch(setPageNumber({ pageNumber: page }))
                  }
                />
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", mt: 0 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Raleway, sans-serif",
                paddingTop: 4,
                color: "text.primary",
                ml: 4,
              }}
            >
              Nije pronađen nijedan kurs.
            </Typography>
            {/* <Typography
              variant="body1"
              sx={{
                fontFamily: "Raleway, sans-serif",
                paddingTop: 4,
                color: "text.primary",
                ml: 4,
              }}
            >
              Vrati se na{" "}
              <Box
                component={Link}
                to="/onlineStudy"
                sx={{ margin: 0, padding: 0 }}
              >
                početnu stranicu.
              </Box>
              .
            </Typography> */}
          </Box>
        )}
        {/* </Box> */}
      </Grid>
    </Grid>
  );
}
