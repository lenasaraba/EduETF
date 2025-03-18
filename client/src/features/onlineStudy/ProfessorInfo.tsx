import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  styled,
  Typography,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { useRef, useEffect, useState } from "react";
import FlipCard from "./components/FlipCard";
import SchoolIcon from "@mui/icons-material/School";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ForumIcon from "@mui/icons-material/Forum";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import {
  deleteProfessorsCourseAsync,
  deleteProfessorsThemeAsync,
  fetchProfessorByIdAsync,
  fetchProfessorByIdCoursesAsync,
  fetchProfessorByIdThemesAsync,
  removeProfessorFromCourse,
  updateThemeStatus,
} from "./professorSlice";
import { Theme } from "../../app/models/theme";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import DeleteDialog from "./components/DeleteDialog";
import NotFound from "../../app/errors/NotFound";
import { LoadingButton } from "@mui/lab";
import { Course } from "../../app/models/course";
import CourseCardMedia from "./components/CourseCardMedia";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  border: "2px solid",
  borderColor: theme.palette.background.paper,
}));

export default function ProfessorInfo() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((state) => state.account.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchProfessorByIdAsync(parseInt(id)));
      dispatch(fetchProfessorByIdThemesAsync(parseInt(id)));
      dispatch(fetchProfessorByIdCoursesAsync(parseInt(id)));
    }
  }, []);

  const professor = useAppSelector((state) => state.professor.currentProfessor);

  const [themeSelected, setThemeSelected] = useState<Theme | undefined>(
    undefined
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogRemoveProfessor, setOpenDialogRemoveProfessor] =
    useState(false);

  const idMenu = open ? "simple-popover" : undefined;
  const [loadingStatus, setLoadingStatus] = useState<{
    [key: number]: boolean;
  }>({});

  const statusProf = useAppSelector((state) => state.professor.status);

  const topOfPageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (topOfPageRef.current) {
      topOfPageRef.current.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
  }, [id]);

  const coursesToDisplay = useAppSelector(
    (state) => state.professor.currentProfessorCourses
  );
  const coursesLoaded = useAppSelector(
    (state) => state.professor.currentProfCoursesLoaded
  );

  const themesToDisplay = useAppSelector(
    (state) => state.professor.currentProfessorThemes
  );

  const themesLoaded = useAppSelector(
    (state) => state.professor.currentProfThemesLoaded
  );

  const years = useAppSelector(
    (state) => state.professor.currentProfessorYears
  );
  const programs = useAppSelector(
    (state) => state.professor.currentProfessorPrograms
  );

  const updateStatus = async (
    event: React.MouseEvent<HTMLElement>,
    theme: Theme
  ) => {
    event.preventDefault();
    setAnchorEl(null);
    setLoadingStatus((prev) => ({ ...prev, [theme.id]: true }));

    const updateData = {
      id: theme.id,
      active: !theme.active,
    };

    try {
      await dispatch(updateThemeStatus(updateData));
    } catch (error) {
      console.error(
        "Greška prilikom ažuriranja statusa u professor slice:",
        error
      );
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [theme.id]: false }));
    }
  };

  const handleConfirmDelete = async (item: any, itemType: string) => {
    if (itemType == "course") {
      try {
        await dispatch(
          deleteProfessorsCourseAsync({
            id: item!.id,
            idProfessor: parseInt(id!),
          })
        );
      } catch (error) {
        console.error("Greška prilikom brisanja teme:", error);
      } finally {
        setOpenDialog(false);
      }
    } else if (itemType == "theme") {
      try {
        await dispatch(
          deleteProfessorsThemeAsync({
            id: item!.id,
            idProfessor: parseInt(id!),
          })
        );
      } catch (error) {
        console.error("Greška prilikom brisanja teme:", error);
      } finally {
        setOpenDialog(false);
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>, theme: Theme) => {
    setThemeSelected(theme);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setTimeout(() => {
      setThemeSelected(undefined);
    }, 0);
  };

  const handleRemoveProfClick = (
    event: React.MouseEvent<HTMLElement>,
    course: Course
  ) => {
    setCourseToRemoveProfFrom(course);
    setOpenDialogRemoveProfessor(true);
  };
  const [isLastProf, setIsLastProf] = useState(false);

  const handleRemoveProfFromCourse: () => Promise<void> = async () => {
    if (
      courseToRemoveProfFrom?.professorsCourse.filter(
        (p) => p.withdrawDate == null
      ).length == 1
    ) {
      setIsLastProf(true);
      setOpenDialogRemoveProfessor(false);
      handleDeleteClick("course", courseToRemoveProfFrom);
    } else removeProfFromCourse();
  };

  const removeProfFromCourse: () => Promise<void> = async () => {
    try {
      await dispatch(removeProfessorFromCourse(courseToRemoveProfFrom!.id));
    } catch (error) {
      console.error("Greška prilikom uklanjanja profesora sa kursa:", error);
    } finally {
      setOpenDialogRemoveProfessor(false);
    }
  };

  const handleCloseDialogRemoveProfessor = () => {
    setOpenDialogRemoveProfessor(false);
    setCourseToRemoveProfFrom(null);
  };

  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const [itemType, setItemType] = useState<"course" | "theme">("theme");
  const [courseToRemoveProfFrom, setCourseToRemoveProfFrom] =
    useState<Course | null>(null);

  const handleDeleteClick = (type: "course" | "theme", item: any) => {
    setItemType(type);
    setItemToDelete(item);
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnchorEl(null);
  };
  if (id == undefined) return <NotFound />;

  return (
    <>
      {id === undefined ? (
        <NotFound />
      ) : (
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
                    to="/users/professors"
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
                    Profil profesora
                  </Typography>
                </Breadcrumbs>
              </Box>
              {statusProf == "pendingFetchProfessorById" ? (
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
                  <CircularProgress
                    size={20}
                    sx={{ color: "text.secondary" }}
                  />
                </Box>
              ) : (
                <>
                  <Grid container sx={{ padding: 0 }}>
                    <Grid item xs={6} sx={{ padding: 1, paddingY: 2 }}>
                      <CardContent
                        sx={{
                          border: "1px solid",
                          borderRadius: "16px",
                          borderColor: "divider",
                          display: "flex",
                          height: "100%",
                          alignItems: "center",
                          padding: 3,
                          backgroundColor: "background.paper",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Avatar
                          alt={`${professor?.firstName} ${professor?.lastName}`}
                          sx={{
                            width: 64,
                            height: 64,
                            backgroundColor: "primary.main",
                            color: "white",
                            fontSize: "24pt",
                            marginRight: 3,
                          }}
                        >
                          {professor?.firstName.charAt(0).toUpperCase()}
                          {professor?.lastName.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                              color: "text.primary",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {professor?.firstName} {professor?.lastName}
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontStyle: "italic",
                                fontWeight: "normal",
                                marginLeft: 1,
                              }}
                            >
                              Profesor
                            </Typography>
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ marginTop: 0.5 }}
                          >
                            {professor?.email}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Grid>
                    <Grid item xs={6} sx={{ padding: 1, paddingY: 2 }}>
                      <CardContent
                        sx={{
                          border: "1px solid",
                          borderRadius: "16px",
                          borderColor: "divider",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          padding: 3,
                          backgroundColor: "background.paper",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: "clamp(10pt, 12pt, 13pt)" }}
                          >
                            Godine
                          </Typography>
                          <Typography
                            sx={{
                              fontStyle: "italic",
                              fontSize: "clamp(8pt, 10pt, 11pt)",
                            }}
                          >
                            {years?.map((year) => year.name).join(", ") ||
                              "Nema"}
                          </Typography>
                        </Box>
                        <Divider
                          sx={{
                            marginY: 1,
                            width: "100%",
                            borderColor: "primary.main",
                            border: "1px solid",
                            color: "primary.main",
                          }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: "clamp(10pt, 12pt, 13pt)" }}
                          >
                            Smjerovi
                          </Typography>
                          <Typography
                            sx={{
                              fontStyle: "italic",
                              fontSize: "clamp(8pt, 10pt, 11pt)",
                            }}
                          >
                            {programs
                              ?.map((program) => program.name)
                              .join(", ") || "Nema"}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Grid>
                  </Grid>
                </>
              )}
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="h3">Teme profesora</Typography>
              {!themesLoaded ? (
                <>
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
                    {" "}
                    <Typography
                      sx={{ marginBottom: 2, color: "text.secondary" }}
                    >
                      Učitavanje tema
                    </Typography>
                    <CircularProgress
                      size={20}
                      sx={{ color: "text.secondary" }}
                    />
                  </Box>
                </>
              ) : (
                <Demo sx={{ borderRadius: 2, height: "15rem", marginY: 2 }}>
                  <List
                    sx={{
                      overflowY: "auto",
                      height: "15rem",
                      backgroundColor: "secondary.main",
                    }}
                  >
                    {themesToDisplay && themesToDisplay.length > 0 ? (
                      themesToDisplay.map((theme, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            "&:hover": {
                              backgroundColor: "background.paper",
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: "primary.main" }}>
                              <ForumIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={theme.title}
                            sx={{
                              width: "50%",
                              textDecoration: "none", 
                              color: "text.primary", 
                              "&:visited": {
                                color: "text.primary", 
                              },
                              "&:hover": {
                                cursor: "normal",
                                color: "text.primary", 
                              },
                              "&:active": {
                                color: "text.primary", 
                              },
                            }}
                          />
                          <Box
                            sx={{
                              margin: 0,
                              padding: 0,
                              display: "flex",

                              alignItems: "center",
                              flexDirection: "row",
                            }}
                          >
                            <Chip
                              size="small"
                              icon={
                                loadingStatus[theme.id] ? (
                                  <CircularProgress
                                    size={16}
                                    sx={{ color: "#fff" }}
                                  />
                                ) : theme.active ? (
                                  <CheckRoundedIcon />
                                ) : (
                                  <BlockIcon />
                                )
                              }
                              sx={{
                                marginX: 1,
                                backgroundColor: loadingStatus[theme.id]
                                  ? "grey"
                                  : theme.active
                                    ? "text.primaryChannel"
                                    : "text.secondaryChannel",
                                color: "#fff",
                                borderRadius: "16px",
                                ".MuiChip-icon": {
                                  color: "#fff",
                                },
                              }}
                              label={
                                loadingStatus[theme!.id]
                                  ? "Ažuriranje..."
                                  : theme!.active
                                    ? "Aktivno"
                                    : "Zatvoreno"
                              }
                            />
                            <IconButton
                              edge="end"
                              aria-label="open"
                              component={Link}
                              to={user ? `/forum/${theme.id}` : `/login`}
                              sx={{
                                marginX: 2,

                                color: "text.primary",
                                "&:hover": {
                                  color: "primary.main",
                                },
                              }}
                            >
                              <OpenInNewIcon />
                            </IconButton>
                            {user && user.username == theme.user.username ? (
                              <>
                                <div>
                                  <Box
                                    aria-describedby={idMenu}
                                    onClick={(event) =>
                                      handleClick(event, theme)
                                    }
                                    sx={{
                                      display: "flex",
                                      width: "fit-content",
                                      padding: 0,
                                      marginX: 1,

                                      "&:hover": {
                                        cursor: "pointer",
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
                                    <>
                                      <Typography
                                        onClick={(event) => {
                                          updateStatus(event, themeSelected!);
                                        }}
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
                                        Ažuriraj aktivnost
                                      </Typography>
                                      <Typography
                                        onClick={(event) =>
                                          handleDeleteClick(
                                            "theme",
                                            themeSelected
                                          )
                                        }
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
                                        Obriši
                                      </Typography>
                                    </>
                                  </Popover>
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                          </Box>
                        </ListItem>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "1rem", paddingX: 2, paddingY: 1 }}
                      >
                        Nema tema ovog profesora.
                      </Typography>
                    )}
                  </List>
                </Demo>
              )}
              <Divider sx={{ marginY: 2 }} />

              <Typography variant="h3">Kursevi profesora</Typography>
              {!coursesLoaded ? (
                <>
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
                    {" "}
                    <Typography
                      sx={{ marginBottom: 2, color: "text.secondary" }}
                    >
                      Učitavanje kurseva
                    </Typography>
                    <CircularProgress
                      size={20}
                      sx={{ color: "text.secondary" }}
                    />
                  </Box>
                </>
              ) : coursesToDisplay && coursesToDisplay.length > 0 ? (
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
                      overflowY: "auto",
                      overflowX: "hidden",
                      maxHeight: "90vh",
                    }}
                  >
                    {coursesToDisplay!
                      .filter((course) =>
                        course.professorsCourse.some(
                          (pc) =>
                            pc.user.id === professor?.id &&
                            pc.withdrawDate === null
                        )
                      )
                      .map((course) => (
                        <Grid item xs={12} sm={5.8} md={3.8} key={course.id}>
                          <FlipCard
                            course={course}
                            handleDeleteClick={handleDeleteClick}
                            handleRemoveProfClick={handleRemoveProfClick}
                          />
                        </Grid>
                      ))}
                  </Grid>
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

              {user?.id == professor?.id && (
                <>
                  <Divider sx={{ marginY: 2 }} />
                  <Typography variant="h3">Istorija kurseva</Typography>
                  {!coursesLoaded ? (
                    <>
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
                        <Typography
                          sx={{ marginBottom: 2, color: "text.secondary" }}
                        >
                          Učitavanje kurseva
                        </Typography>
                        <CircularProgress
                          size={20}
                          sx={{ color: "text.secondary" }}
                        />
                      </Box>
                    </>
                  ) : coursesToDisplay && coursesToDisplay.length > 0 ? (
                    <>
                      <Box
                        sx={{
                          margin: 0,
                          padding: 0,
                          mt: 4,

                          display: {
                            xs: "block",
                            sm: "block",
                            ".MuiList-root": {
                              paddingBottom: "0px !important",
                            },
                          },
                        }}
                      >
                        {coursesToDisplay!
                          .filter((course) =>
                            course.professorsCourse.some(
                              (pc) =>
                                pc.user.id === professor?.id &&
                                pc.withdrawDate !== null
                            )
                          )
                          .map((course) => (
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
                                  {course.professorsCourse
                                    .filter(
                                      (u) =>
                                        u.user.id === user?.id &&
                                        u.withdrawDate != null
                                    )
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
                                            {new Date(
                                              u.enrollDate
                                            ).toLocaleDateString("sr-RS")}
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
                                                ? "Neaktivan"
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
                                            }} 
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
                  ) : (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", mt: 0 }}
                    >
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
              )}
            </Grid>
          </Grid>

          <DeleteDialog
            openDialog={openDialog}
            handleCloseDialog={handleCloseDialog}
            handleConfirmDelete={handleConfirmDelete}
            itemType={itemType}
            itemData={itemToDelete}
            isLastProf={isLastProf}
          />

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
                Da li ste sigurni da želite da napustite ovaj kurs?
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
                loading={statusProf == "pendingRemoveProfessorFromCourse"}
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
      )}
    </>
  );
}
