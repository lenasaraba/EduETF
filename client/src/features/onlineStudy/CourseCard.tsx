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
} from "@mui/material";
import { Course } from "../../app/models/course";
import CourseCardMedia from "./components/CourseCardMedia";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/system";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deletePaginatedCourseAsync, enrollOnCourse } from "./courseSlice";
import { LoadingButton } from "@mui/lab";

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

  const idMenu = open ? "simple-popover" : undefined;

  const status = useAppSelector((state) => state.course.status);

  // const [courseSelected, setCourseSelected] = useState<Course | undefined>(
  //   undefined
  // );

  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);
  const [coursePassword, setCoursePassword] = useState("");
  const [error, setError] = useState(false);

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    // console.log(courseSelected);
    // setCourseSelected(course);
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
    } catch (error) {
      console.error("Greška prilikom brisanja kursa:", error);
    } finally {
      setAnchorEl(null); // Zatvara meni
      setOpenDialog(false);
      //setCourseSelected(undefined);
    }
  };

  const confirmEnroll = async () => {
    try {
      console.log(course);
      if (coursePassword === course.password) {
        setError(false);

        await dispatch(enrollOnCourse(course.id));
        // console.log(coursePassword);
        setOpenEnrollDialog(false); // Zatvori dijalog ako je tačna šifra
        navigate(`/courses/${course.id}`);

      } else {
        setError(true); // Prikazati grešku ako je netačna
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
    setAnchorEl(event.currentTarget); // Postavlja element na koji je kliknuto
    //setCourseSelected(course);
  };

  const handleClose = () => {
    //setCourseSelected(undefined);
    setAnchorEl(null);
  };

  // console.log("Course card:" + course.name);
  return (
    <>
      <Card
        sx={{
          // width: "100%" /* Postavlja karticu da zauzme 100% širine roditelja */,
          boxSizing: "border-box",
          borderRadius: "20pt",
          backgroundColor: "background.default",

          border: "2px solid",
          borderColor: "background.paper",
          // backdropFilter:"blur(36px)",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: (theme) => `0px 8px 24px ${theme.palette.primary.dark}`,
          },
          // "&:hover":{
          //   borderColor: "primary.dark",

          // }
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
              },
            }}
          />
          {user &&
          course.professorsCourse.some(
            (pc) => pc.user.username === user.username
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
          //  image={course.pictureURL}
          //title={course.name}
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontFamily: "Raleway,sans-serif",
              fontSize: "clamp(12px, 14px, 16px)",
              overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
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
          {/* <LoadingButton
            loading={status == "pendingAddItem" + product.id}
            onClick={() =>
              dispatch(addBasketItemAsync({ productId: product.id }))
            }
            size="small"
          >
            Add to cart
          </LoadingButton> */}
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
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Obriši
          </Button>
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
          >
            Potvrdi
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
    // </Box>
  );
}
