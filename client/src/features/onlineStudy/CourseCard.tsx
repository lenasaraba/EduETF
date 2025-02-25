import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Popover,
  TextField,
  FormControl,
  FormHelperText,
  Divider,
  PopperPlacementType,
  Fade,
  Paper,
  Popper,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Course } from "../../app/models/course";
import CourseCardMedia from "./components/CourseCardMedia";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/system";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  deletePaginatedCourseAsync,
  enrollOnCourse,
  fetchCoursesAsync,
  removeProfessorFromCourse,
  removeStudentFromCourse,
} from "./courseSlice";
import { LoadingButton } from "@mui/lab";
import { Author } from "./components/Author";

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.user);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);

  const [anchorElProf, setAnchorElProf] = useState<HTMLButtonElement | null>(
    null
  );
  const [openProf, setOpenProf] = useState(false);
  const [placement, setPlacement] = useState<PopperPlacementType>();
  const handleClickProfessor =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElProf(event.currentTarget);
      setOpenProf((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  const idMenu = open ? "simple-popover" : undefined;

  const status = useAppSelector((state) => state.course.status);

  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);
  const [openDialogRemoveProfessor, setOpenDialogRemoveProfessor] =
    useState(false);
  const [openDialogRemoveStudent, setOpenDialogRemoveStudent] = useState(false);

  const [coursePassword, setCoursePassword] = useState("");
  const [error, setError] = useState(false);

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnchorEl(null);
  };

  const handleConfirmDelete = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      console.log(course);
      await dispatch(deletePaginatedCourseAsync(course!.id));
      await dispatch(fetchCoursesAsync()); //zbog meta data
    } catch (error) {
      console.error("Greška prilikom brisanja kursa:", error);
    } finally {
      setAnchorEl(null);
      setOpenDialog(false);
    }
  };

  const confirmEnroll = async () => {
    try {
      console.log(course);
      if (coursePassword === course.password) {
        setError(false);

        await dispatch(enrollOnCourse(course.id));
        setOpenEnrollDialog(false);
        navigate(`/courses/${course.id}`);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Greška prilikom upisa na kurs:", error);
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    course: Course
  ) => {
    console.log(course);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveProfClick = () => {
    setOpenDialogRemoveProfessor(true);
  };

  const handleCloseDialogRemoveProfessor = () => {
    setOpenDialogRemoveProfessor(false);
  };

  const handleRemoveProfFromCourse: () => Promise<void> = async () => {
    try {
      await dispatch(removeProfessorFromCourse(course!.id));
      // navigate("/courses?type=all");
    } catch (error) {
      console.error("Greška prilikom uklanjanja profesora sa kursa:", error);
    } finally {
      setOpenDialogRemoveProfessor(false);
    }
  };

  const handleRemoveStudentClick = () => {
    setOpenDialogRemoveStudent(true);
  };

  const handleCloseDialogRemoveStudent = () => {
    setOpenDialogRemoveStudent(false);
  };

  const handleRemoveStudentFromCourse: () => Promise<void> = async () => {
    try {
      await dispatch(removeStudentFromCourse(course!.id));
    } catch (error) {
      console.error("Greška prilikom ispisivanja studenta sa kursa:", error);
    } finally {
      setOpenDialogRemoveStudent(false);
    }
  };
  const theme = useTheme();
  return (
    <>
      <Card
        sx={{
          maxHeight: 310,
          paddingBottom: 2,
          boxSizing: "border-box",
          borderRadius: "20pt",
          backgroundColor: "background.default",
          backgroundImage: "none",
          border: "2px solid",
          borderColor: "background.paper",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.03)",
            // boxShadow: (theme) => `0px 4px 10px ${theme.palette.background.paper}`,
            backgroundColor: "action.focus",
            // boxShadow: theme.shadows[12],
          },
        }}
      >
        <Box
          sx={{
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {course.name.charAt(0).toUpperCase()}
              </Avatar>
            }
            title={course.name}
            titleTypographyProps={{
              sx: {
                fontWeight: "bold",
                color: "primary.main",
                fontFamily: "Raleway,sans-serif",
                fontSize: "clamp(12px, 14px, 16px)",
                overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
                display: "-webkit-box", // Neophodno za multi-line truncation
                WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
                lineHeight: "1.2", // Podešava razmak između linija

                height: "1.2em", // Fiksna visina: broj linija * lineHeight
                textOverflow: "ellipsis", // Dodaje tri tačke
                "&:hover": {
                  fontWeight: user ? "bold" : "900",
                  cursor: user ? "normal" : "pointer",
                  color: user ? "primary.main" : "primary.dark",
                },
              },
            }}
            onClick={() => {
              if (!user) {
                // Ako korisnik nije prijavljen, preusmeri ga na stranicu za prijavu
                navigate("/login");
              }
              // } else {
              //   // Ako je korisnik prijavljen, obavi neku drugu akciju
              //   navigate(`/course/${course.id}`);
              // }
            }}
          />
          {user &&
          course.professorsCourse.some(
            (pc) => pc.user.username === user.username && pc.withdrawDate == null
          ) ? (
            <>
              <div>
                <Box
                  aria-describedby={idMenu}
                  // variant="contained"
                  onClick={(event) => handleClick(event, course)}
                  sx={{
                    display: "flex",
                    width: "fit-content",
                    borderRadius: "20pt",
                    padding: 0,
                    marginRight: 2,
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

        <CourseCardMedia
          year={course.year}
          studyProgram={course.studyProgram}
          sx={{
            height: 140,

            backgroundSize: "contain",
            bgcolor: "primary.light",
          }}
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontFamily: "Raleway,sans-serif",
              fontSize: "clamp(12px, 14px, 16px)",
              overflow: "hidden",
              display: "-webkit-box", // Neophodno za multi-line truncation
              WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
              WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
              lineHeight: "1.3", // Podešava razmak između linija
              height: "1.3em", // Fiksna visina: broj linija * lineHeight
              textOverflow: "ellipsis", // Dodaje tri tačke
            }}
          >
            {course.studyProgram.name} - {course.year.name}
          </Typography>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "space-evenly" }}>
          {user &&
            user.role === "Student" &&
            !course.usersCourse.some(
              (uc) => uc.user?.username === user.username && uc.withdrawDate == null
            ) && (
              <Button
                onClick={() => setOpenEnrollDialog(true)}
                sx={{
                  fontFamily: "Raleway, sans-serif",
                  m: 0,
                  ml: 0,
                  p: 0,
                  borderRadius: "20pt",
                  paddingX: 1,
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "background.paper",
                  },
                }}
              >
                Upiši se
              </Button>
            )}
          {user &&
          (course.professorsCourse.some(
            (pc) => pc.user.username === user.username && pc.withdrawDate == null
          ) ||
            course.usersCourse.some(
              (uc) => uc.user?.username === user.username && uc.withdrawDate == null
            )) ? (
            <Button
              component={Link}
              to={`/courses/${course.id}`}
              size="small"
              sx={{
                fontFamily: "Raleway, sans-serif",
                m: 0,
                ml: 0,
                p: 0,
                paddingX: 1,
                borderRadius: "20pt",

                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "background.paper",
                },
              }}
            >
              Otvori
            </Button>
          ) : user?.role == "Profesor" ? (
            <Button
              onClick={handleClickProfessor("right-start")}
              size="small"
              sx={{
                fontFamily: "Raleway, sans-serif",
                m: 0,
                ml: 0,
                p: 0,
                paddingX: 1,
                borderRadius: "20pt",

                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "background.paper",
                },
              }}
            >
              Prikaži profesore
            </Button>
          ) : (
            <></>
          )}
          {user &&
            course.usersCourse.some(
              (uc) =>
                uc.user?.username === user.username && uc.withdrawDate == null
            ) && (
              <>
                <Button
                  onClick={handleRemoveStudentClick}
                  size="small"
                  sx={{
                    fontFamily: "Raleway, sans-serif",
                    m: 0,
                    ml: 0,
                    p: 0,
                    borderRadius: "20pt",
                    paddingX: 1,
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "background.paper",
                    },
                  }}
                >
                  Ispiši se
                </Button>
              </>
            )}
        </CardActions>
      </Card>
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
            {course?.name}
            {"-"}
            {course?.description}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: "text.primary" }}>
            Odustani
          </Button>
          <LoadingButton
            loading={status == "pendingDeletePaginatedCourse"}
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            loadingIndicator={
              <CircularProgress size={18} sx={{ color: "white" }} /> // Ovdje mijenjaš boju
            }
          >
            Obriši
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEnrollDialog}
        onClose={() => setOpenEnrollDialog(false)}
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
          Unesite šifru kursa
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth error={error}>
            <TextField
              label="Šifra"
              type="password"
              fullWidth
              variant="outlined"
              sx={{ mt: 1 }}
              value={coursePassword}
              onChange={(e) => setCoursePassword(e.target.value)}
            />
            {error && (
              <FormHelperText>Pogrešna šifra, pokušajte ponovo.</FormHelperText>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button
            onClick={() => setOpenEnrollDialog(false)}
            sx={{ color: "text.primary" }}
          >
            Odustani
          </Button>
          <LoadingButton
            loading={status == "loadingEnrollOnCourse"}
            onClick={() => confirmEnroll()}
            color="primary"
            variant="contained"
            loadingIndicator={
              <CircularProgress size={18} sx={{ color: "white" }} /> // Ovdje mijenjaš boju
            }
          >
            Potvrdi
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Popper
        sx={{ zIndex: 1200 }}
        open={openProf}
        anchorEl={anchorElProf}
        placement={placement}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              {course.professorsCourse.map((prof, index) => (
                <Typography
                  key={index}
                  sx={{ paddingX: 2, paddingY: 1, fontSize: "11pt" }}
                >
                  {prof.user.firstName} {prof.user.lastName}
                </Typography>
              ))}
            </Paper>
          </Fade>
        )}
      </Popper>

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
            Da li ste sigurni da želite da napustite ovaj kurs? - {course.name}
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

      <Dialog
        open={openDialogRemoveStudent}
        onClose={handleCloseDialogRemoveStudent}
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
            Da li ste sigurni da želite da se ispišete sa kursa - {course.name}{" "}
            ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleCloseDialogRemoveStudent}
            sx={{ color: "text.primary" }}
          >
            Odustani
          </Button>
          <LoadingButton
            loading={status == "loadingRemoveStudentFromCourse"}
            onClick={handleRemoveStudentFromCourse}
            color="error"
            variant="contained"
            loadingIndicator={
              <CircularProgress size={18} sx={{ color: "white" }} />
            }
          >
            Ispiši se
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
    // </Box>
  );
}
