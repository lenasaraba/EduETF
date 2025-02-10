import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import NotFound from "../../app/errors/NotFound";
import { useEffect, useRef, useState } from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import {
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  // styled,
  Typography,
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Popover,
  CircularProgress,
} from "@mui/material";
import { EditNote, ExpandLess, ExpandMore } from "@mui/icons-material";
import CourseCardMedia from "./components/CourseCardMedia";
import { Author } from "./components/Author";
import SlideCardThemes from "./components/SlideCardThemes";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import CloseIcon from "@mui/icons-material/Close";
import {
  deleteCourseAsync,
  deleteMaterialAsync,
  fetchCourseAsync,
  fetchCurrentCourseMaterialAsync,
  uploadFile,
  uploadMaterials,
} from "./courseSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import StudentsOnCourse from "./components/StudentsOnCourse";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import AppDropzone from "./components/AppDropzone";
import { useForm } from "react-hook-form";
import { AddMaterial, Material } from "../../app/models/course";
import CustomTimeline from "./components/CustomTimeline";

export default function Course() {
  const [currentMat, setCurrentMat] = useState<Material>();

  const getFilePreview = (filePath: string) => {
    const handleDownload = () => {
      const userConfirmed = window.confirm(
        "Da li želite da preuzmete ovaj fajl?"
      );
      if (userConfirmed) {
        const link = document.createElement("a");
        link.href = `http://localhost:5000//${filePath}`;
        link.download =
          `http://localhost:5000//${filePath}`!.split("/").pop() || ""; // Ime fajla za preuzimanje
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    const fileExtension = filePath.split(".").pop()?.toLowerCase();
    const fileUrl = `http://localhost:5000//${filePath}`;

    if (!fileExtension) return null;

    if (["jpg", "jpeg", "png", "gif", "svg"].includes(fileExtension)) {
      return (
        <img
          src={fileUrl}
          alt="Preview"
          style={{ width: "100%", maxHeight: "100%", objectFit: "cover" }}
        />
      );
    }

    if (["mp4", "webm", "ogg"].includes(fileExtension)) {
      return (
        <video
          src={fileUrl}
          controls
          style={{ width: "100%", maxHeight: "100%" }}
        />
      );
    }

    if (fileExtension === "pdf") {
      return (
        <iframe
          src={fileUrl}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            minHeight: "59vh",
          }}
          title="PDF Preview"
        />
      );
    }

    return (
      <Box
        display="flex"
        alignItems="center"
        onClick={handleDownload}
        sx={{
          width: "fit-content",
          "&:hover": { cursor: "pointer", color: "primary.dark" },
        }}
      >
        {fileExtension === "docx" || fileExtension === "xlsx" ? (
          <InsertDriveFileIcon fontSize="large" />
        ) : (
          <PictureAsPdfIcon fontSize="large" />
        )}
        <Typography sx={{ marginLeft: 1 }}>
          {filePath.split("/").pop()}&nbsp;
        </Typography>
        <Typography
          variant="button"
          sx={{ fontSize: "10pt", color: "primary.light" }}
        >
          {" (Preuzmi dokument)"}
        </Typography>
      </Box>
    );
  };

  const [fileVisible, setFileVisible] = useState(false);

  const methods = useForm({
    mode: "all",
  });

  const { control, watch } = methods;
  const watchFile = watch("file");

  const getMaterialType = (file: File) => {
    if (file.type.startsWith("image/")) {
      return 5;
    } else if (file.type === "application/pdf") {
      return 2;
    } else if (file.name.endsWith(".docx")) {
      return 4;
    } else if (file.type.startsWith("video/")) {
      return 1; // Video
    }
    return 0;
  };

  const navigate = useNavigate();
  const currentCourseLoaded = useAppSelector(
    (state) => state.course.currentCourseLoaded
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const idMenu = open ? "simple-popover" : undefined;
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogMaterial, setOpenDialogMaterial] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<
    Material | undefined
  >(undefined);

  const { user } = useAppSelector((state) => state.account);

  const handleCloseWeek = async () => {
    setOpenWeeks((prev) => prev.map(() => false));

    if (addingWeek) setAddingWeek(false);
    else if (editingWeek) setEditingWeek(false);
  };

  const handleSaveWeek = async () => {
    if (selectedFiles.length === 0) {
      alert("Dodajte bar jedan fajl!");
      return;
    }
    console.log(selectedFiles);

    const materials: AddMaterial[] = [];
    const localDate = new Date();
    const offset = localDate.getTimezoneOffset();

    const adjustedDate = new Date(localDate.getTime() - offset * 60000);
    selectedFiles.forEach((file) => {
      console.log(file);
      const material = {
        courseId: parseInt(id!),
        title: file.name,
        filePath: file.webkitRelativePath,
        url: file.name,
        materialTypeId: getMaterialType(file),
        creationDate: adjustedDate.toISOString(),
        week: newWeek,
      };

      console.log(material);
      //materials.push(material);
      dispatch(
        uploadFile({
          file: file,
          courseId: parseInt(id!),
          weekNumber: newWeek,
          material: material,
        })
      );
    });
    if (addingWeek) setAddingWeek(false);
    else if (editingWeek) setEditingWeek(false);

    // await dispatch(uploadMaterials(materials));
    setSelectedFiles([]);
    // setNewWeek((prev) => prev + 1);
  };

  const [isEditing, setIsEditing] = useState(false);
  // const [isEditingWeek, setIsEditingWeek] = useState(false);

  const toggleEdit = () => {
    setAnchorEl(null); // Dijalog se otvara nakon što se tema postavi

    setTimeout(() => {
      setIsEditing(!isEditing);
    }, 0);
  };

  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCourseAsync(parseInt(id!)));
    dispatch(fetchCurrentCourseMaterialAsync(parseInt(id!)));
  }, []);

  const topOfPageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (topOfPageRef.current) {
      topOfPageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [id]);

  const course = useAppSelector((state) => state.course.currentCourse);
  const courseMaterials = useAppSelector(
    (state) => state.course.currentCourseMaterials
  );

  // useEffect(() => {
  //     dispatch(fetchCurrentCourseMaterialAsync(parseInt(id!)));
  // }, [courseMaterials]);

  const materialsLoaded = useAppSelector(
    (state) => state.course.materialsLoaded
  );
  // const courseStatus = useAppSelector((state) => state.course.status);

  // const coursesLoaded = useAppSelector((state) => state.course.allcoursesLoaded);
  // console.log(course);

  //novo
  const [openWeeks, setOpenWeeks] = useState<boolean[]>([]);
  const [addingWeek, setAddingWeek] = useState(false);
  const [editingWeek, setEditingWeek] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newWeek, setNewWeek] = useState(0);

  // useEffect(() => {
  //   console.log("newWeek ažuriran:", newWeek);
  //   // Ovdje možeš dodati bilo koji kod koji treba da reaguje na promjenu
  // }, [newWeek]);

  // Čekaj da se kurs učita, zatim postavi state
  useEffect(() => {
    if (course) {
      setOpenWeeks(Array(course.weekCount).fill(false));
      setNewWeek(course.weekCount);
      dispatch(fetchCurrentCourseMaterialAsync(course.id));
      // console.log("aaaaaaaaaaaa");
    }
  }, [course]);

  useEffect(() => {
    if (selectedMaterial != undefined) {
      console.log(selectedMaterial);
      setOpenDialogMaterial(true);
    } else {
      console.log("USLA U ODUSTANI");
      console.log(selectedMaterial);
    }
  }, [selectedMaterial]);

  if (!currentCourseLoaded)
    return <LoadingComponent message="Učitavanje kursa.." />;

  const toggleWeek = (index: number) => {
    setOpenWeeks((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  const editWeek = (index: number) => {
    console.log(index);
    setOpenWeeks((prev) =>
      prev.map((isOpen, i) => (i === index - 1 ? true : isOpen))
    );

    setNewWeek(index);

    setTimeout(() => {
      setEditingWeek(true);
    }, 0);
    console.log(newWeek);
  };

  const handleAddWeek = () => {
    setOpenWeeks((prev) => prev.map(() => false));

    setNewWeek(course!.weekCount + 1);
    setAddingWeek(true);
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setSelectedFiles(Array.from(event.target.files));
  //   }
  // };

  if (id === undefined) return <NotFound />;

  if (!course) return <NotFound />;

  const activeThemes = course.themes.filter((theme) => theme.active);
  const inactiveThemes = course.themes.filter((theme) => !theme.active);

  const handleDeleteClick = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };
  const handleDeleteMaterialClick = (material: Material) => {
    setSelectedMaterial(material);
  };

  const handleDeleteMaterial = async () => {
    console.log(selectedMaterial);
    try {
      console.log(selectedMaterial);
      await dispatch(deleteMaterialAsync(selectedMaterial!.id));
      
      setOpenWeeks((prev) =>
        prev.map((isOpen, i) =>
          i === (selectedMaterial?.week ? parseInt(selectedMaterial.week.toString(), 10) - 1 : -1)
            ? true
            : isOpen
        )
      );
      
      setOpenDialogMaterial(false);
    } catch (error) {
      console.error("Greška prilikom brisanja kursa:", error);
    } finally {
      setOpenDialogMaterial(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCloseDialogMaterial = () => {
    setOpenDialogMaterial(false);

    setSelectedMaterial(undefined);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    //setCourseSelected(undefined);
    setAnchorEl(null);
  };

  const handleConfirmDelete = async () => {
    try {
      navigate("/courses?type=all");
      console.log(course);
      await dispatch(deleteCourseAsync(course.id));
    } catch (error) {
      console.error("Greška prilikom brisanja kursa:", error);
    } finally {
      setOpenDialog(false);
    }
  };

  const showFile = (material: Material) => {
    setFileVisible(true);
    console.log(material);
    setCurrentMat(material);
  };
  const hideFile = () => {
    setFileVisible(false);
    setCurrentMat(undefined); // ili undefined, zavisno od tipa
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
        marginBottom: 5,
        height: "fit-content",
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
                    onClick={toggleEdit}
                    variant="body2"
                    sx={{
                      paddingX: 2,
                      paddingY: 1,
                      "&:hover": {
                        cursor: "pointer",
                        color: "primary.light",
                      },
                      // textTransform: "uppercase",
                      width: "max-content",
                      fontFamily: "Raleway, sans-serif",
                      color: "text.primary",
                      backgroundColor: "background.paper",
                    }}
                  >
                    {isEditing ? "Završi uređivanje" : "Uredi kurs"}
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
          open={openDialog || openDialogMaterial}
          onClose={openDialog ? handleCloseDialog : handleCloseDialogMaterial}
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
              {openDialog
                ? "Da li ste sigurni da želite da obrišete ovaj kurs?"
                : "Da li ste sigurni da želite da obrišete ovaj materijal?"}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
            <Button
              onClick={
                openDialog ? handleCloseDialog : handleCloseDialogMaterial
              }
              sx={{ color: "text.primary" }}
            >
              Odustani
            </Button>
            <Button
              onClick={openDialog ? handleConfirmDelete : handleDeleteMaterial}
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

        <Box sx={{ margin: 0, padding: 0, width: "100%", mt: 2 }}>
          <Typography variant="h5">Profesori</Typography>

          <Author authors={course.professorsCourse} />
        </Box>

        {/* RADI GORE */}

        <Divider sx={{ width: "100%", marginY: 2 }} />
        {/* SEDMICE  */}

        <Box
          sx={{
            margin: 0,
            padding: 0,
            mb: 2,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h5"
            // sx={{

            // }}
          >
            Sedmice i materijali{" "}
          </Typography>
          {course.professorsCourse.some(
            (professor) => professor.user.email === user?.email
          ) &&
            isEditing &&
            !addingWeek &&
            !editingWeek && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1" sx={{ color: "primary.dark" }}>
                  Dodaj novu sedmicu&nbsp;
                </Typography>
                <Button
                  onClick={handleAddWeek}
                  title="Dodaj sedmicu"
                  sx={{
                    backgroundColor: "primary.dark",
                    color: "white",
                    padding: 0.8,
                    borderRadius: "20pt",
                    minWidth: "2rem",
                    "&:hover": { backgroundColor: "primary.light" },
                    height: "fit-content",
                    width: "2rem",
                    boxSizing: "border-box",
                  }}
                >
                  <AddIcon sx={{ fontSize: "16pt" }} />
                </Button>
              </Box>
            )}
        </Box>
        {courseMaterials && courseMaterials.length > 0 ? (
          <Box
            sx={{
              margin: 0,
              padding: 0,
              display: "flex",
              width: "100%",
              marginBottom: 5,
              minHeight:
                openWeeks.some((week) => week) || fileVisible ? "40vh" : "auto", // Ako su sve zatvorene, minHeight je auto
              maxHeight: "60vh", // Sprečava preveliko širenje
              transition: "max-height 0.3s ease-in-out", // Glatka animacija
            }}
          >
            {" "}
            <List
              sx={{
                maxWidth: "30vw",
                width: "100%",
                maxHeight: "100%", // Lista prati roditeljsku visinu
                overflowY: "auto", // Skrol samo ovde
                overflowX: "hidden",
                whiteSpace: "nowrap",
                padding: 0,
              }}
            >
              {[...Array(course.weekCount)].map((_, index) => (
                <div key={index}>
                  <ListItem
                    component="div"
                    sx={{
                      // cursor: "pointer",
                      padding: "8px 16px",
                      backgroundColor: openWeeks[index]
                        ? "rgba(0, 0, 0, 0.04)"
                        : "inherit",
                      borderRadius: 2,
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                    }}
                  >
                    <ListItemText primary={`Sedmica ${index + 1}`} />
                    {isEditing && !editingWeek && !addingWeek && (
                      <IconButton>
                        <EditNote onClick={() => editWeek(index + 1)} />
                      </IconButton>
                    )}
                    <IconButton>
                      {openWeeks[index] ? (
                        <ExpandLess onClick={() => toggleWeek(index)} />
                      ) : (
                        <ExpandMore onClick={() => toggleWeek(index)} />
                      )}
                    </IconButton>
                  </ListItem>

                  <Collapse in={openWeeks[index]} timeout="auto" unmountOnExit>
                    <List
                      component="div"
                      disablePadding
                      sx={{ width: "30vw", height: "100%" }}
                    >
                      {courseMaterials.filter(
                        (material) => material.week === index + 1
                      ).length > 0 ? (
                        <CustomTimeline
                          materials={courseMaterials.filter(
                            (material) => material.week === index + 1
                          )}
                          showFile={showFile}
                          handleDelete={handleDeleteMaterialClick}
                        />
                      ) : (
                        <ListItem>
                          <ListItemText primary="Nema materijala za ovu sedmicu." />
                        </ListItem>
                      )}
                    </List>
                  </Collapse>
                </div>
              ))}
            </List>
            {currentMat ? (
              <Box
                sx={{
                  height: "100%",
                  // maxHeight: "60vh",
                  // height:"60vh",
                  backgroundColor: "transparent",
                  width: "100%",
                  paddingX: 1,
                  display: fileVisible ? "block" : "none",
                  // minHeight: fileVisible ? "40vh" : "0", // Ako su sve zatvorene, minHeight je auto
                  // Skrol samo ovde

                  // mb: 2,
                }}
              >
                <Box
                  sx={{
                    margin: 0,
                    padding: 0,
                    maxHeight: "100%", // Sprečava preveliko širenje
                    overflowY: "auto",
                  }}
                >
                  {" "}
                  {getFilePreview(currentMat.filePath)}
                </Box>
                <Button
                  sx={{
                    width: "100%",
                    color: "text.primary",
                    // paddingX: 2,
                    borderRadius: "20pt",

                    // display: "inline-block", // Ovo osigurava da padding i borderRadius funkcionišu ispravno
                    "&:hover": {
                      cursor: "pointer",
                      backgroundColor: "action.acive",
                      color: "primary.light",
                    },
                  }}
                >
                  <CloseIcon
                    color="inherit" // Ovo sprečava preklapanje sa default stilovima
                    onClick={() => hideFile()}
                  />
                </Button>
              </Box>
            ) : (
              ""
            )}
          </Box>
        ) : (
          !isEditing && (
            <Typography
              variant="h6"
              width="100%"
              sx={{ mb: 2, fontWeight: "normal", fontStyle: "italic" }}
            >
              Nema materijala za kurs.
            </Typography>
          )
        )}
        {/* Forma za novu sedmicu */}
        {materialsLoaded ? (
          addingWeek ? (
            <>
              <Box
                sx={{
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box sx={{ margin: 0, padding: 0, display: "flex" }}>
                  <AppDropzone
                    name="file"
                    control={control}
                    handleCloseWeek={handleCloseWeek}
                    handleSaveWeek={handleSaveWeek}
                    setSelectedFiles={setSelectedFiles}
                    newWeek={newWeek}
                  />{" "}
                </Box>{" "}
                {watchFile && (
                  <img
                    src={watchFile.preview}
                    alt="nesh"
                    style={{ maxHeight: "20vh" }}
                  />
                )}
              </Box>
            </>
          ) : editingWeek ? (
            <>
              <Box
                sx={{
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box sx={{ margin: 0, padding: 0, display: "flex" }}>
                  <AppDropzone
                    name="file"
                    control={control}
                    handleCloseWeek={handleCloseWeek}
                    handleSaveWeek={handleSaveWeek}
                    setSelectedFiles={setSelectedFiles}
                    newWeek={newWeek}
                  />{" "}
                </Box>{" "}
                {watchFile && (
                  <img
                    src={watchFile.preview}
                    alt="nesh"
                    style={{ maxHeight: "20vh" }}
                  />
                )}
              </Box>
            </>
          ) : null
        ) : (
          <CircularProgress size={60} sx={{ color: "text.secondary" }} />
        )}

        <Divider sx={{ marginY: 2, width: "100%" }} />

        <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
          {/* Leva strana - Aktuelne teme */}
          <Box
            component={Grid}
            sx={{
              width: "45%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="overline" sx={{ mb: 2 }}>
              Aktuelne teme za ovaj kurs
            </Typography>
            {activeThemes.length > 0 ? (
              <SlideCardThemes course={course} themes={activeThemes} />
            ) : (
              <SpeakerNotesOffIcon
                sx={{ fontSize: 50, color: "gray", mt: 2 }}
              />
            )}
          </Box>

          {/* Desna strana - Zatvorene teme */}
          <Box
            component={Grid}
            sx={{
              width: "45%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="overline" sx={{ mb: 2 }}>
              Zatvorene teme za ovaj kurs
            </Typography>
            {inactiveThemes.length > 0 ? (
              <SlideCardThemes course={course} themes={inactiveThemes} />
            ) : (
              <SpeakerNotesOffIcon
                sx={{ fontSize: 50, color: "gray", mt: 2 }}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
