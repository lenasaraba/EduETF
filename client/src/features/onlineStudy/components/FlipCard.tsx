import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  FormHelperText,
  Paper,
  Popover,
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
import MoreVertIcon from "@mui/icons-material/MoreVert";

const FlipCardContainer = styled("div")({
  perspective: "1000px",
  width: "100%",
  height: "300px",
  margin: "20px auto",
  position: "relative",
});

const FlipCardInner = styled("div")<{ isFlipped: boolean }>(
  ({ isFlipped }) => ({
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 1s",
    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
    "&:hover": {
      transform: isFlipped ? "rotateY(180deg)" : "rotateY(180deg)", 
    },
  })
);

const FlipCardSide = styled(Box)({
  width: "100%",
  height: "100%",
  position: "absolute",
  backfaceVisibility: "hidden",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
});

const FlipCardFront = styled(FlipCardSide)({
  backgroundSize: "cover",
  backgroundPosition: "center",
});

const FlipCardBack = styled(FlipCardSide)({
  backgroundColor: "text.primary",
  transform: "rotateY(180deg)",
  padding: "20px",
});

interface Props {
  course: Course;

  handleDeleteClick: (type: "course" | "theme", item: any) => void;

  handleRemoveProfClick: (
    event: React.MouseEvent<HTMLElement>,
    item: Course
  ) => void;
}

export default function FlipCard({
  course,
  handleDeleteClick,
  handleRemoveProfClick,
}: Props) {
  const user = useAppSelector((state) => state.account.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const status = useAppSelector((state) => state.course.status);

  const [isFlipped, setIsFlipped] = useState(false); 

  const [anchorElProf, setAnchorElProf] = useState<HTMLButtonElement | null>(
    null
  );

  const [openProf, setOpenProf] = useState(false);
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
  const [placement, setPlacement] = useState<PopperPlacementType>();

  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);

  const [coursePassword, setCoursePassword] = useState("");

  const [error, setError] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const idMenu = open ? "simple-popover" : undefined;

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    course: Course
  ) => {
    event.stopPropagation(); 

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsFlipped(false);
  };

  const confirmEnroll = async () => {
    try {
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
  const handleClickProfessor =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElProf(event.currentTarget);
      setOpenProf((prev) => placement !== newPlacement || !prev);

      setPlacement(newPlacement);
    };

  return (
    <>
      <FlipCardContainer
      >
        <FlipCardInner isFlipped={isFlipped}>
          <FlipCardFront>
            <CourseCardMedia
              year={course.year}
              studyProgram={course.studyProgram}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: " 100%",
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
          <FlipCardBack
            sx={{
              display: "flex",

              flexDirection: "column",

              justifyContent: "center",

              alignItems: "center",

              padding: 3,

              backgroundColor: "common.backgroundChannel",

              borderRadius: "16px",

              position: "relative",
            }}
          >
            {user &&
              course.professorsCourse.some(
                (pc) =>
                  pc.user.username === user.username && pc.withdrawDate == null
              ) && (
                <div style={{ position: "absolute", top: 4, right: 1 }}>
                  <Box
                    aria-describedby={idMenu}
                    onClick={(event) => {
                      event.stopPropagation(); 
                      setIsFlipped(true);
                      handleClick(event, course);
                    }}
                    sx={{
                      display: "flex",
                      width: "fit-content",
                      borderRadius: "20pt",
                      padding: 0,
                      marginTop: 2,
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
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    slotProps={{
                      paper: {
                        sx: {
                          backgroundColor: "red",
                          borderRadius: "10pt",
                          maxWidth: "200px",
                          maxHeight: "150px",
                          overflow: "auto",
                          "&:hover": {
                            cursor: "pointer",
                          },
                        },
                      },
                    }}
                  >
                    <Typography
                      onClick={(event) => {
                        handleDeleteClick("course", course);
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
                        color: "text.secondaryChannel",
                        backgroundColor: "background.paper",
                      }}
                    >
                      Obriši kurs
                    </Typography>

                    <Typography
                      onClick={(event) => {
                        handleRemoveProfClick(event, course);
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
                      Napusti kurs
                    </Typography>
                  </Popover>
                </div>
              )}

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
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                lineHeight: "1.2",
                height: "3.6em",
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
                user.role === "Student" &&
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
                      paddingX: 1,
                      borderRadius: "20pt",
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
                  (pc) =>
                    pc.user.username === user.username &&
                    pc.withdrawDate == null
                ) ||
                  course.usersCourse.some(
                    (uc) =>
                      uc.user?.username === user.username &&
                      uc.withdrawDate == null
                  )) && (
                  <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to={`/courses/${course.id}`}
                    sx={{
                      fontSize: "clamp(8pt, 10pt, 12pt)",
                      color: "common.onBackground",
                      borderRadius: "15pt",
                    }}
                  >
                    Otvori
                  </Button>
                )}             
              {user?.role === "Profesor" &&
                !course.professorsCourse.some(
                  (pc) =>
                    pc.user.username === user.username &&
                    pc.withdrawDate == null
                ) && (
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
              <CircularProgress size={18} sx={{ color: "white" }} />
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
          <Fade {...TransitionProps} timeout={150}>
            <Paper>
              {course.professorsCourse
                .filter((p) => p.withdrawDate == null)
                .map((prof, index) => (
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
