import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  FormHelperText,
  Paper,
  Popper,
  PopperPlacementType,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { Course } from "../../../app/models/course";
import CourseCardMedia from "./CourseCardMedia";
import { Link, useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { enrollOnCourse } from "../courseSlice";
import { LoadingButton } from "@mui/lab";

const FlipCardContainer = styled("div")({
  perspective: "1000px", // Dodajemo perspektivu za 3D efekat
  width: "100%",
  height: "300px",
  margin: "20px auto",
  position: "relative",
});

const FlipCardInner = styled("div")({
  width: "100%",
  height: "100%",
  position: "relative",
  transformStyle: "preserve-3d",
  transition: "transform 1s", // Animacija tokom okretanja
  "&:hover": {
    transform: "rotateY(180deg)", // Efekat okretanja na hover
  },
});

const FlipCardSide = styled(Box)({
  width: "100%",
  height: "100%",
  position: "absolute",
  backfaceVisibility: "hidden", // Sakrivamo zadnju stranu
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
});

const FlipCardFront = styled(FlipCardSide)({
  //   backgroundImage: "url('https://source.unsplash.com/random/300x400')", // Zameni URL
  // backgroundColor:"green",
  backgroundSize: "cover",
  backgroundPosition: "center",
});

const FlipCardBack = styled(FlipCardSide)({
  backgroundColor: "text.primary", // Plava boja pozadine za zadnju stranu
  transform: "rotateY(180deg)", // Okrećemo zadnju stranu
  padding: "20px",
});

interface Props {
  course: Course;
  handleDeleteClick: (
    event: React.MouseEvent<HTMLElement>,
    type: "course" | "theme",
    item: any
  ) => void;
}

export default function FlipCard({ course, handleDeleteClick }: Props) {
  const user = useAppSelector((state) => state.account.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const status = useAppSelector((state) => state.course.status);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (anchorElProf && !anchorElProf.contains(event.target as Node)) {
        setOpenProf(false);
      }
    };

    if (openProf) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProf, anchorElProf]);

  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);
  const [coursePassword, setCoursePassword] = useState("");
  const [error, setError] = useState(false);

  const statusProf = useAppSelector((state) => state.professor.status);

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

  console.log(statusProf);
  return (

    <>
      <FlipCardContainer>
        <FlipCardInner>
          {/* Prednja strana kartice */}
          <FlipCardFront>
            <CourseCardMedia
              year={course.year}
              studyProgram={course.studyProgram}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
                objectFit: "cover",
                borderRadius: "16px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                padding: "16px",
                background: "rgba(0, 0, 0, 0.6)",
                color: "white",
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
              }}
            >
              <Typography variant="h5" fontWeight="bold" textAlign="center">
                {course.name}
              </Typography>
            </Box>
          </FlipCardFront>

          {/* Zadnja strana kartice */}
          <FlipCardBack
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 3,
              backgroundColor: "common.backgroundChannel",
              borderRadius: "16px",
            }}
          >
            <Typography
              sx={{ color: "text.primary" }}
              variant="h6"
              fontWeight="bold"
              gutterBottom
            >
              {course.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Godina:</strong> {course.year.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Smjer:</strong> {course.studyProgram.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{
                marginTop: "8px",
                fontSize: "clamp(12px, 14px, 16px)",
                overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
                display: "-webkit-box", // Neophodno za multi-line truncation
                WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                WebkitLineClamp: 3, // Maksimalan broj linija (menjajte po potrebi)
                lineHeight: "1.2", // Podešava razmak između linija

                height: "3.6em", // Fiksna visina: broj linija * lineHeight
                textOverflow: "ellipsis",
              }}
            >
              {course.description}
            </Typography>
            <Box
              sx={{
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                mt: 2,
                width: "100%",
              }}
            >
              {user &&
                user.role == "Student" &&
                !course.usersCourse.some(
                  (uc) => uc.user?.username === user.username
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
                (pc) => pc.user.username === user.username
              ) ||
                course.usersCourse.some(
                  (uc) => uc.user?.username === user.username
                )) ? (
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to={user ? `/courses/${course.id}` : `/login`}
                  sx={{
                    fontSize: "clamp(8pt, 10pt, 12pt)",
                    color: "common.onBackground",
                    borderRadius: "15pt",
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
              course.professorsCourse.some(
                (pc) => pc.user.username === user.username
              ) ? (
                <LoadingButton
                  variant="contained"
                  color="error"
                  sx={{
                    fontSize: "clamp(8pt, 10pt, 12pt)",
                    borderRadius: "15pt",
                  }}
                  onClick={(event) =>{
                    console.log(statusProf)
                    handleDeleteClick(event, "course", course)
                  }}
                >
                  Obriši kurs
                </LoadingButton>
              ) : (
                ""
              )}
            </Box>
          </FlipCardBack>
        </FlipCardInner>
      </FlipCardContainer>

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
    </>
  );
}
