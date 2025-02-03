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
  fetchProfessorsAsync,
  fetchProfessorThemesAsync,
  fetchProfessorYearsProgramsAsync,
  updateThemeStatus,
} from "./professorSlice";
import CourseCardSkeleton from "./components/CourseCardSkeleton";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Theme } from "../../app/models/theme";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import DeleteDialog from "./components/DeleteDialog";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  border: "2px solid",
  borderColor: theme.palette.background.paper,
}));

export default function ProfessorInfo() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>(); // Osigurava da je `id` uvek string
  const user = useAppSelector((state) => state.account.user);

  useEffect(() => {
    dispatch(fetchProfessorsAsync());
  }, [dispatch]);

  const professor = useAppSelector((state) => {
    if (!id) return undefined; // Ako je `id` undefined, vrati `undefined`
    return state.professor.professors.find((p) => p.id === parseInt(id));
  });

  const [themeSelected, setThemeSelected] = useState<Theme | undefined>(
    undefined
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);

  const idMenu = open ? "simple-popover" : undefined;
  const [loadingStatus, setLoadingStatus] = useState<{
    [key: number]: boolean;
  }>({});

  const coursesLoaded = useAppSelector(
    (state) => state.professor.coursesLoaded
  );
  const allProfessors = useAppSelector((state) => state.professor.professors);

  useEffect(() => {
    allProfessors.forEach((professor) => {
      dispatch(
        fetchProfessorYearsProgramsAsync({
          id: professor.id,
          totalCount: allProfessors.length,
        })
      );
    });
  }, [dispatch, allProfessors]);

  const topOfPageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (topOfPageRef.current) {
      topOfPageRef.current.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
  }, [id]);

  const coursesToDisplay = useAppSelector((state) =>
    state.professor.professorCourses
      ? state.professor.professorCourses[parseInt(id!)]
      : []
  );

  const years = useAppSelector((state) =>
    state.professor.profYears ? state.professor.profYears[parseInt(id!)] : []
  );
  const programs = useAppSelector((state) =>
    state.professor.profPrograms
      ? state.professor.profPrograms[parseInt(id!)]
      : []
  );

  const professorThemes = useAppSelector(
    (state) => state.professor.professorThemes
  );

  useEffect(() => {
    allProfessors.forEach((professor) => {
      dispatch(fetchProfessorThemesAsync(professor.id));
    });
  }, [dispatch, allProfessors]);

  // useEffect(() => {
  //   if (themeSelected) {
  //     setThemeSelected(
  //       professorThemes![professor!.id].find((t) => t.id === themeSelected.id)
  //     );
  //   }
  // }, [professorThemes]);

  // useEffect(() => {
  //   // Ovaj useEffect će se pokrenuti svaki put kada se tema promeni
  //   // console.log('Teme su ažurirane:', professorThemes);
  // }, [professorThemes]);

  const updateStatus = async (event: React.MouseEvent<HTMLElement>, theme: Theme) => {
    event.preventDefault();
  
    // console.log("Pre update:", theme); 
  
    setAnchorEl(null);
    
    setLoadingStatus((prev) => ({ ...prev, [theme.id]: true }));
  
    const updateData = {
      id: theme.id,
      active: !theme.active,
    };
  
    try {
      await dispatch(updateThemeStatus(updateData)).unwrap();
      // console.log("Posle update:", updatedTheme); 
    } catch (error) {
      console.error("Greška prilikom ažuriranja statusa:", error);
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [theme.id]: false }));
    }
  };
  
  

  const handleConfirmDelete = async (item: any, itemType: string) => {
    if (itemType == "course") {
      console.log("Brisanje stavke kurs:", item);
      try {
        await dispatch(deleteProfessorsCourseAsync({id:item!.id, idProfessor: parseInt(id!)}));
      } catch (error) {
        console.error("Greška prilikom brisanja teme:", error);
      } finally {
        setOpenDialog(false);
      }
    } else if (itemType == "theme") {
      console.log("Brisanje stavke tema:", item);
      try {
        await dispatch(deleteProfessorsThemeAsync({id:item!.id, idProfessor: parseInt(id!)}));
      } catch (error) {
        console.error("Greška prilikom brisanja teme:", error);
      } finally {
        setOpenDialog(false);
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>, theme: Theme) => {
    console.log(theme);
    setThemeSelected(theme);
    setAnchorEl(event.currentTarget); // Dijalog se otvara nakon što se tema postavi
  };

  const handleClose = () => {
    setAnchorEl(null);
    setTimeout(() => {
      setThemeSelected(undefined); // Dijalog se otvara nakon što se tema postavi
    }, 0);
  };

  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [itemType, setItemType] = useState<"course" | "theme">("theme");

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLElement>,
    type: "course" | "theme",
    item: any
  ) => {
    setItemType(type);
    setItemToDelete(item);
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnchorEl(null);
  };

  if (!coursesLoaded) return <LoadingComponent message="Učitavanje..." />;

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
                onClick={() => navigate(-1)}
              >
                <SchoolIcon
                  sx={{
                    color: "text.primary",
                    // fontWeight: "bold",
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
                Profil profesora
                {/* {courseType === "my" ? "Moji kursevi" : "Svi kursevi"} */}
              </Typography>
            </Breadcrumbs>
          </Box>
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
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Blaga senka za elegantan izgled
                }}
              >
                {/* Avatar */}
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

                {/* Informacije o profesoru */}
                <Box sx={{ flex: 1 }}>
                  {/* Ime i titula zajedno */}
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
                  {/* Email ispod */}
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
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Blaga senka za elegantan izgled
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
                    {years?.map((year) => year.name).join(", ") || "Nema"}
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
                    {programs?.map((program) => program.name).join(", ") ||
                      "Nema"}
                  </Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="h3">Teme profesora</Typography>

          <Demo sx={{ borderRadius: 2, height: "15rem", marginY: 2 }}>
            <List
              sx={{
                overflowY: "auto",
                height: "15rem",
                backgroundColor: "secondary.main",
              }}
            >
              {professorThemes &&
              professorThemes[professor!.id] &&
              professorThemes[professor!.id].length > 0 ? (
                professorThemes[professor!.id].map((theme, index) => (
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
                        textDecoration: "none", // Uklanja podvlačenje linka
                        color: "text.primary", // Koristi boju teksta iz roditeljskog elementa
                        "&:visited": {
                          color: "text.primary", // Zadrži istu boju za visited linkove
                        },
                        "&:hover": {
                          cursor: "normal",
                          color: "text.primary", // Zadrži istu boju za visited linkove
                        },
                        "&:active": {
                          color: "text.primary", // Zadrži istu boju pri aktivnom linku
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
                        // variant="soft"
                        size="small"
                        icon={
                          // {
                          //   true: <CheckRoundedIcon />,
                          //   false: <BlockIcon />,
                          // }[theme.active]
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
                            ? "grey" // Boja dok traje učitavanje
                            : theme.active
                              ? "text.primaryChannel"
                              : "text.secondaryChannel", // Prilagođene boje
                          color: "#fff", // Tekst u beloj boji
                          borderRadius: "16px", // Primer prilagođenog oblika
                          ".MuiChip-icon": {
                            color: "#fff",
                          },
                        }}
                        // label={theme.active ? "Aktivno" : "Zatvoreno"}
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
                        to={`/forum/${theme.id}`}
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
                              // variant="contained"
                              onClick={(event) => handleClick(event, theme)}
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
                                    onClick={(event) => updateStatus(event, themeSelected!)}
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
                                    {/* {themeSelected.active
                                      ? "Zaključaj"
                                      : "Otključaj"} */}
                                      Ažuriraj aktivnost
                                  </Typography>
                                  <Typography
                                    onClick={(event) =>
                                      handleDeleteClick(
                                        event,
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
          <Divider sx={{ marginY: 2 }} />

          <Typography variant="h3">Kursevi profesora</Typography>
          {coursesToDisplay && coursesToDisplay.length > 0 ? (
            <>
              {!coursesLoaded ? (
                <Grid
                  container
                  spacing={0} // Uklanjamo automatski razmak između elemenata
                  justifyContent="flex-start" // Elementi idu redom, bez centriranja ili raspodele
                  columns={12}
                  sx={{
                    width: "100%",
                    gap: "2.5%",
                    mt: 4,
                    rowGap: 4,
                  }}
                >
                  {coursesToDisplay!.map((course) => (
                    <Grid item xs={12} sm={5.8} md={3.8} key={course.id}>
                      <CourseCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid
                  container
                  spacing={0} // Uklanjamo automatski razmak između elemenata
                  justifyContent="flex-start" // Elementi idu redom, bez centriranja ili raspodele
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
                      xs={12} // Na najmanjim ekranima zauzima celu širinu
                      sm={5.8} // Na manjim ekranima dve kartice u redu
                      md={3.8} // Na srednjim ekranima tri kartice u redu sa prostorom između njih
                      key={course.id}
                    >
                      <FlipCard course={course} handleDeleteClick={handleDeleteClick}/>
                    </Grid>
                  ))}
                </Grid>
              )}
              {/* <Box sx={{ mb: 2, mt: 2 }}>
                {metaData && (
                  <AppPagination
                    metaData={metaData}
                    onPageChange={(page: number) =>
                      dispatch(setPageNumber({ pageNumber: page }))
                    }
                  />
                )}
              </Box> */}
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

          {/* LISTA KURSEVA PROFESORA */}
          {/* <FlipCard  cour/> */}
        </Grid>
      </Grid>

      <DeleteDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleConfirmDelete={handleConfirmDelete}
        itemType={itemType}
        itemData={itemToDelete}
      />

      {/* <Dialog
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
            Da li ste sigurni da želite da obrišete ovu temu?
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
      </Dialog> */}
    </>
  );
}
