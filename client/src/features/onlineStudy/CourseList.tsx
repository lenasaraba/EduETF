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
import AppPagination from "../../app/components/AppPagination";
import CourseCardSkeleton from "./components/CourseCardSkeleton";
import FilterSelectChip from "./components/FilterSelectChip";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

export default function CourseList() {
  const [searchParams] = useSearchParams();
  const courseType = searchParams.get("type");
  const dispatch = useAppDispatch();

  const {
    pagecoursesLoaded,
    yearsFilter,
    programsFilter,
    coursesParams,
    metaData,
  } = useAppSelector((state) => state.course);
  const [searchTerm, setSearchTerm] = useState(coursesParams.searchTerm);

  const debouncedSearch = useMemo(
    () =>
      debounce((event: any) => {
        dispatch(setCoursesParams({ searchTerm: event.target.value }));
        dispatch(fetchCoursesAsync());
      }, 1000),
    [dispatch] 
  );

  useEffect(() => {
    setSearchTerm("");
  }, [courseType]);

  const allCourses = useAppSelector((state) => state.course.courses);

  let courseTitle = "";
  switch (courseType) {
    case "my":
      courseTitle = "Moji kursevi";
      break;
    case "all":
      courseTitle = "Svi kursevi";
      break;
    case "myLearning":
      courseTitle = "Moje učenje";
      break;
    default:
      courseTitle = "";
      break;
  }

  useEffect(() => {
    dispatch(resetCoursesParams());
    dispatch(setCoursesParams({ type: courseType }));
    dispatch(fetchCoursesAsync());
  }, [courseType, dispatch]);

  const user = useAppSelector((state) => state.account.user);
  const navigate = useNavigate();

  const coursesToDisplay = allCourses;
  useEffect(() => {
    if ((courseType === "my" || courseType === "myLearning") && !user) {
      navigate("/login");
    }
  }, [user, courseType, navigate]);

  useEffect(() => {
    if (!pagecoursesLoaded) {
      dispatch(fetchCoursesAsync());
      dispatch(fetchFilters());
    }
  }, [pagecoursesLoaded, dispatch]);


  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, [debouncedSearch]);

  return (
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
              to="/onlineStudy"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <AutoStoriesIcon
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
              {courseTitle}
            </Typography>
          </Breadcrumbs>
        </Box>
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
            sx={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: "bolder",
              color: "primary.main",
            }}
          >
            Kursevi
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
                minWidth: 0,
                width: "3rem",
                boxSizing: "border-box",
              }}
            >
              <AddIcon sx={{ fontSize: "16pt" }} />
            </Button>
          )}
        </div>
        <Divider sx={{ marginBottom: 4 }} />
        <Box
          sx={{
            borderRadius: "sm",
            py: 0,
            display: {
              xs: "none",
              sm: "flex",
            },
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
                overflow: "hidden", 
                display: "-webkit-box", 
                WebkitBoxOrient: "vertical", 
                WebkitLineClamp: 1, 
                lineHeight: "1",
                height: "1em", 
                textOverflow: "ellipsis", 
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
                    borderColor: "action.hover", 
                  },
                  "&:hover": {
                    backgroundColor: "action.hover", 
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
                  color: "primary.main", 
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
            programs={programsFilter!}
            years={yearsFilter!}
            onChange={(pr: string[], yr: string[]) => {
              dispatch(setCoursesParams({ studyPrograms: pr, years: yr }));
            }}
          />
        </Box>
        {pagecoursesLoaded ? (
          <>
            {coursesToDisplay && coursesToDisplay.length > 0 ? (
              <>
                <Grid
                  container
                  spacing={0}
                  justifyContent="flex-start"
                  columns={12}
                  sx={{
                    width: "100%",
                    gap: "2.5%",
                    mt: 4,
                    rowGap: 4,
                  }}
                >
                  {coursesToDisplay!.map((course) => (
                    <Grid
                      item
                      xs={12} 
                      sm={5.8} 
                      md={3.8} 
                      key={course.id}
                    >
                      <CourseCard course={course} />
                    </Grid>
                  ))}
                </Grid>
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
              </Box>
            )}
          </>
        ) : (
          <Grid
            container
            spacing={0}
            justifyContent="flex-start"
            columns={12}
            sx={{
              width: "100%",
              gap: "2.5%",
              mt: 4,
              rowGap: 4,
            }}
          >
            {[0, 1, 2]!.map((index) => (
              <Grid item xs={12} sm={5.8} md={3.8} key={index}>
                <CourseCardSkeleton />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
