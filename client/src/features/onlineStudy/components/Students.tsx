import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchStudentsAsync,
  resetStudentsParams,
  setStudentsParams,
} from "../courseSlice";
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

export default function Students() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.user);

  const students = useAppSelector((state) => state.course.students);
  const statusStudents = useAppSelector((state) => state.course.status);
  const studentsLoaded = useAppSelector((state) => state.course.studentsLoaded);
  const studentsParams = useAppSelector((state) => state.course.studentsParams);

  const [searchTerm, setSearchTerm] = useState(studentsParams.searchTerm);

  const debouncedSearch = useMemo(
    () =>
      debounce((event: any) => {
        setSearchTerm(event.target.value);
        dispatch(setStudentsParams({ searchTerm: event.target.value }));
        dispatch(fetchStudentsAsync());
      }, 1000),
    [dispatch]
  );

  useEffect(() => {
    dispatch(resetStudentsParams());
    dispatch(fetchStudentsAsync());
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

  console.log(students);
  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, [debouncedSearch]);

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
                to="/onlineStudy"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <SchoolIcon
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
                Spisak studenata
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
                fontSize: "3.75rem",
              }}
            >
              Studenti
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
              marginBottom:2,
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
          </Box>
          <Divider />
          {!studentsLoaded ? (
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
              <Box sx={{ display: { xs: "block", sm: "block" } }}>
                {students &&
                  students.map((student) => (
                    <List key={student.id} sx={{ "--ListItem-paddingX": 0 }}>
                      <ListItem
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", gap: 2, alignItems: "start" }}
                        >
                          <Box>
                            <Avatar>
                              {student.firstName[0].toUpperCase()}
                            </Avatar>
                          </Box>
                          <div>
                            <Typography gutterBottom sx={{ fontWeight: 600 }}>
                              {student.firstName} {student.lastName}
                            </Typography>
                            {/* <Typography variant="body1" gutterBottom>
                              {student.email}
                            </Typography> */}
                            <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 0.5,
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">{student.username}</Typography>
                  <Typography variant="body1">&bull;</Typography>
                  <Typography variant="body1">{student.email}</Typography>
                </Box>
                            {/* <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Link variant="body1" component="button">
                    Download
                  </Link>
                   <RowMenu /> 
                </Box> */}
                          </div>
                        </Box>
                        {/* <Chip
              icon={
                {
                  Paid: <CheckRoundedIcon />,
                  Refunded: <AutorenewRoundedIcon />,
                  Cancelled: <BlockIcon />,
                }[listItem.status]
              }
              // sx={{color={
              //   {
              //     Paid: 'success',
              //     Refunded: 'neutral',
              //     Cancelled: 'danger',
              //   }[listItem.status] as ColorPaletteProp
              // }}}
              label={listItem.status}
            /> */}
                      </ListItem>
                      <Divider />
                    </List>
                  ))}
                <Box
                  className="Pagination-mobile"
                  sx={{
                    display: { xs: "flex", md: "none" },
                    alignItems: "center",
                    py: 2,
                  }}
                >
                  <IconButton aria-label="previous page">
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                  <Typography variant="body1" sx={{ mx: "auto" }}>
                    Page 1 of 10
                  </Typography>
                  <IconButton
                    aria-label="next page"
                    // variant="outlined"
                    // color="neutral"
                    // size="sm"
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}
