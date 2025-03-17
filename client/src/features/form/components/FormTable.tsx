import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TextField,
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  useTheme,
  Chip,
  Checkbox,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchRoundedIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CloseIcon from "@mui/icons-material/Close";

import { useEffect, useState } from "react";
import { Form, User, Option, UsersOption } from "../../../app/models/form";
import { LoadingButton } from "@mui/lab";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { assignToCourse } from "../formSlice";
import { fetchCourseAsync } from "../../onlineStudy/courseSlice";

interface Props {
  forms: Form[];
  courseId?: number;
  messageId?: number;
  setIsAddingExistingForm?: (value: boolean) => void; // Funkcija za ažuriranje upita
  setSelectedMessageForms?: (
    value: Form[] | ((prevForms: Form[]) => Form[])
  ) => void;
}

const FormTable = ({
  forms,
  courseId,
  messageId,
  setIsAddingExistingForm,
  setSelectedMessageForms,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByDate, setSortByDate] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const rowsPerPage = 5;
  const status = useAppSelector((state) => state.form.status);
  const dispatch = useAppDispatch();
  //   console.log(courseId, messageId);

  // useEffect(()=>{
  //   if(selectedForm?.courseId)
  //     dispatch(fetchCourseAsync(selectedForm?.courseId))
  //   else
  //     dispatch(fetchMess)
  // }, [selectedForm])

  const getFormStatus = (endDate: string) => {
    const currentDate = new Date();
    const formEndDate = new Date(endDate);
    return currentDate > formEndDate ? "Zatvorena" : "Otvorena";
  };

  const filteredForms = forms
    .filter((form) =>
      form.topic.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortByDate === "asc") {
        return (
          new Date(a.creationDate).getTime() -
          new Date(b.creationDate).getTime()
        );
      } else {
        return (
          new Date(b.creationDate).getTime() -
          new Date(a.creationDate).getTime()
        );
      }
    });

  const paginatedForms = filteredForms.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleViewDetails = (form: Form) => {
    setSelectedForm(form);
  };

  const handleCloseDialog = () => {
    setSelectedForm(null);
  };

  const theme = useTheme();
  const [selectedForms, setSelectedForms] = useState<number[]>([]);

  const handleCheckboxChange = (formId: number) => {
    setSelectedForms((prev) =>
      prev.includes(formId)
        ? prev.filter((id) => id !== formId)
        : [...prev, formId]
    );
  };
  const handleAddSurvey = () => {
    console.log(selectedForms);
    if (messageId != 0) {
      selectedForms.forEach((formId) => {
        console.log("Čekirana anketa ID:", formId);
        if (courseId)
          dispatch(assignToCourse({ formId: formId, courseId: courseId }));
      });
      if (setIsAddingExistingForm) setIsAddingExistingForm(false);
    } else {
      console.log("Poruka");
      // if (setSelectedMessageForms) {
      //   setSelectedMessageForms((prevForms: Form[]) => [
      //     ...prevForms,
      //     selectedForms,
      //   ]);
      // }
      selectedForms.forEach((formId) => {
        if (setSelectedMessageForms) {
          setSelectedMessageForms((prevForms: Form[]) => [
            ...prevForms,
            forms.find((f) => f.id == formId)!,
          ]);
        }
      });
      if (setIsAddingExistingForm) setIsAddingExistingForm(false);
    }
  };

  return (
    <>
      <Box
        id={"createFormElement"}
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 0,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          marginBottom: 2,
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
            value={searchTerm}
            onChange={(event: any) => {
              setSearchTerm(event.target.value);
            }}
          />
        </FormControl>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: theme.shadows[3],
        }}
      >
        <Table
          sx={{
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: 3,
            tableLayout: "fixed", // Fiksna širina stupaca
          }}
        >
          <TableHead
            sx={{
              backgroundColor: "primary.light",
              boxShadow: 2,
            }}
          >
            <TableRow sx={{ height: "42px" }}>
              {/* Kolona "Pitanje" */}
              <TableCell
                sx={{
                  padding: "12px",
                  width: { xs: "50%", sm: "50%", md: "20%" }, // Širina za različite ekrane
                }}
              >
                <Typography
                  fontWeight="bold"
                  color="primary.dark"
                  variant="subtitle1"
                  sx={{ fontSize: "12pt" }}
                >
                  Pitanje
                </Typography>
              </TableCell>

              {/* Kolona "Autor" (sakrivena za xs i sm) */}
              <TableCell
                sx={{
                  padding: "12px",
                  width: { md: "20%" }, // Širina samo za md
                  display: { xs: "none", sm: "none", md: "table-cell" }, // Sakriveno za xs i sm
                }}
              >
                <Typography
                  fontWeight="bold"
                  color="primary.dark"
                  sx={{ fontSize: "12pt" }}
                  variant="subtitle1"
                >
                  Autor
                </Typography>
              </TableCell>

              {/* Kolona "Datum kreiranja" (sakrivena za xs i sm) */}
              <TableCell
                sx={{
                  padding: "12px",
                  width: { md: "20%" }, // Širina samo za md
                  display: { xs: "none", sm: "none", md: "table-cell" }, // Sakriveno za xs i sm
                }}
              >
                <Button
                  onClick={() =>
                    setSortByDate(sortByDate === "asc" ? "desc" : "asc")
                  }
                  endIcon={
                    sortByDate === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )
                  }
                  sx={{
                    textTransform: "none",
                    color: "primary.dark",
                    fontWeight: "bold",
                    borderRadius: "20px",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                    fontSize: "12pt",
                    padding: 0,
                  }}
                >
                  Datum kreiranja
                </Button>
              </TableCell>

              {/* Kolona "Status" (sakrivena za xs i sm) */}
              <TableCell
                align="center"
                sx={{
                  padding: "12px",
                  width: { md: "20%" }, // Širina samo za md
                  display: { xs: "none", sm: "none", md: "table-cell" }, // Sakriveno za xs i sm
                }}
              >
                <Typography
                  fontWeight="bold"
                  color="primary.dark"
                  sx={{ fontSize: "12pt" }}
                  variant="subtitle1"
                >
                  Status
                </Typography>
              </TableCell>

              {/* Kolona "Pregled" (uvijek vidljiva) */}
              <TableCell
                align="center"
                sx={{
                  padding: "12px",
                  width: { xs: "50%", sm: "50%", md: "20%" }, // Širina za različite ekrane
                }}
              >
                <Typography
                  fontWeight="bold"
                  color="primary.dark"
                  sx={{ fontSize: "12pt" }}
                  variant="subtitle1"
                >
                  Pregled
                </Typography>
              </TableCell>

              {/* Kolona "Označi" (samo ako je ispunjen uslov) */}
              {(courseId || messageId == 0) && (
                <TableCell
                  align="center"
                  sx={{
                    padding: "12px",
                    width: { md: "20%" }, // Širina samo za md
                    display: { xs: "none", sm: "none", md: "table-cell" }, // Sakriveno za xs i sm
                  }}
                >
                  <Typography
                    fontWeight="bold"
                    color="primary.dark"
                    sx={{ fontSize: "12pt" }}
                    variant="subtitle1"
                  >
                    Označi
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedForms.map((form, index) => (
              <TableRow
                key={form.id}
                hover
                sx={{
                  height: "48px",
                  backgroundColor:
                    index % 2 === 0 ? "background.paper" : "action.hover",
                  "&:hover": {
                    backgroundColor: "action.selected",
                    transform: "scale(1.02)",
                    transition: "transform 0.2s ease-in-out",
                  },
                }}
              >
                {/* Kolona "Pitanje" */}
                <TableCell
                  sx={{
                    padding: "12px",
                    width: { xs: "50%", sm: "50%", md: "20%" },
                  }}
                >
                  <Typography variant="body1" noWrap sx={{ fontSize: "11pt" }}>
                    {form.topic}
                  </Typography>
                </TableCell>

                {/* Kolona "Autor" (sakrivena za xs i sm) */}
                <TableCell
                  sx={{
                    padding: "12px",
                    width: { md: "20%" },
                    display: { xs: "none", sm: "none", md: "table-cell" },
                  }}
                >
                  <Typography variant="body1" noWrap sx={{ fontSize: "11pt" }}>
                    {form.user.firstName} {form.user.lastName}
                  </Typography>
                </TableCell>

                {/* Kolona "Datum kreiranja" (sakrivena za xs i sm) */}
                <TableCell
                  sx={{
                    padding: "12px",
                    width: { md: "20%" },
                    display: { xs: "none", sm: "none", md: "table-cell" },
                  }}
                >
                  <Typography variant="body1" noWrap sx={{ fontSize: "11pt" }}>
                    {new Date(form.creationDate).toLocaleDateString("sr-RS")}
                  </Typography>
                </TableCell>

                {/* Kolona "Status" (sakrivena za xs i sm) */}
                <TableCell
                  align="center"
                  sx={{
                    padding: "12px",
                    width: { md: "20%" },
                    display: { xs: "none", sm: "none", md: "table-cell" },
                  }}
                >
                  <Chip
                    label={getFormStatus(form.endDate)}
                    sx={{
                      backgroundColor:
                        getFormStatus(form.endDate) === "Otvorena"
                          ? "success.light"
                          : "error.light",
                      color: "white",
                      fontWeight: "bold",
                      height: "24px",
                      fontSize: "11pt",
                      borderRadius: "12px",
                    }}
                  />
                </TableCell>

                {/* Kolona "Pregled" (uvijek vidljiva) */}
                <TableCell
                  align="center"
                  sx={{
                    padding: "12px",
                    width: { xs: "50%", sm: "50%", md: "20%" },
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleViewDetails(form)}
                    sx={{
                      padding: "6px",
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                        transform: "scale(1.1)",
                        transition: "transform 0.2s ease-in-out",
                      },
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </TableCell>

                {/* Kolona "Označi" (samo ako je ispunjen uslov) */}
                {(courseId || messageId == 0) && (
                  <TableCell
                    align="center"
                    sx={{
                      padding: "12px",
                      width: { md: "20%" },
                      display: { xs: "none", sm: "none", md: "table-cell" },
                    }}
                  >
                    <Checkbox
                      checked={selectedForms.includes(form.id)}
                      onChange={() => handleCheckboxChange(form.id)}
                      size="small"
                      sx={{
                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                      }}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {forms.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            position: "relative",
          }}
        >
          <Pagination
            count={Math.ceil(filteredForms.length / rowsPerPage)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
          {(courseId || messageId == 0) && setIsAddingExistingForm && (
            <Box
              sx={{
                position: "absolute",
                right: 1,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                type="button" // Ovo je važno da se formular ne pošalje pritiskom na ovo dugme
                variant="outlined"
                color="secondary"
                onClick={() => {
                  //   reset();
                  setIsAddingExistingForm(false);
                }}
                sx={{
                  borderRadius: "8px", // Zaobljene ivice
                  textTransform: "none", // Bez velikih slova
                  borderColor: "text.secondaryChannel",
                  color: "text.secondaryChannel",
                  "&:hover": {
                    backgroundColor: "secondary.light", // Hover efekat
                  },
                  fontSize: "10pt",
                  height: "fit-content",
                  mr: 1,
                }}
              >
                Poništi
              </Button>
              <LoadingButton
                loading={status == "pendingAssignToCourse"}
                type="submit"
                variant="contained"
                disabled={selectedForms.length == 0}
                loadingIndicator={
                  <CircularProgress size={18} sx={{ color: "white" }} /> // Ovdje mijenjaš boju
                }
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  borderRadius: "8px", // Zaobljene ivice
                  textTransform: "none", // Bez velikih slova
                  fontSize: "10pt",
                  height: "fit-content",
                  "&:hover": {
                    backgroundColor: "primary.dark", // Hover efekat
                  },
                }}
                onClick={handleAddSurvey}
              >
                {messageId == 0 ? "Sačuvaj" : "Dodaj anketu"}
              </LoadingButton>
            </Box>
          )}
        </Box>
      )}

      <Dialog
        open={!!selectedForm}
        onClose={handleCloseDialog}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.light",
            color: "primary.dark",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
          }}
        >
          <Box sx={{margin:0, padding:0, width:"100%"}}>
          {selectedForm?.topic}
          {selectedForm && selectedForm.courseId > 0 && (
            <Chip
              label="Kurs"
              sx={{
                backgroundColor: "primary.dark",
                color: "white",
                fontWeight: "bold",
                ml:2,
              }}
            />
          )}
          {selectedForm && selectedForm.messageId > 0 && (
            <Chip
              label="Tema"
              sx={{
                backgroundColor: "primary.dark",
                color: "white",
                fontWeight: "bold",
                ml:2,

              }}
            />
          )}
          </Box>
          <IconButton
            onClick={handleCloseDialog}
            sx={{ color: "primary.dark" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Grid container sx={{ padding: 2 }}>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Autor:</strong> {selectedForm?.user.firstName}{" "}
                {selectedForm?.user.lastName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Datum kreiranja:</strong>{" "}
                {new Date(selectedForm?.creationDate || "").toLocaleDateString(
                  "sr-RS"
                )}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Datum završetka:</strong>{" "}
                {new Date(selectedForm?.endDate || "").toLocaleDateString(
                  "sr-RS"
                )}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Status:</strong>{" "}
                <Chip
                  label={getFormStatus(selectedForm?.endDate || "")}
                  sx={{
                    backgroundColor:
                      getFormStatus(selectedForm?.endDate || "") === "Otvorena"
                        ? "success.light"
                        : "error.light",
                    color: "white",
                    fontWeight: "bold",
                    ml: 1, // Margin lijevo
                  }}
                />
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                Opcije:
              </Typography>
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  boxShadow: 1,
                  p: 0, // Bez paddinga
                }}
              >
                {selectedForm?.options.map((option) => (
                  <ListItem
                    key={option.id}
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      "&:last-child": {
                        borderBottom: "none", // Ukloni border za zadnji element
                      },
                    }}
                  >
                    <ListItemText
                      primary={option.text}
                      secondary={`Odgovori: ${option.usersOption.length}`}
                      sx={{ color: "text.primary" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              fontWeight: "bold",
              textTransform: "none", // Bez velikih slova
              borderRadius: 1, // Zaobljeni rubovi dugmeta
              backgroundColor: "primary.main",
              color: "text.primary",
              "&:hover": {
                backgroundColor: "primary.dark", // Promeni samo obrub, ako želiš
              },
            }}
          >
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FormTable;
