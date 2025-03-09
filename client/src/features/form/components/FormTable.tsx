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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchRoundedIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import { useState } from "react";
import { Form, User, Option, UsersOption } from "../../../app/models/form";

interface Props {
    forms: Form[];
}

const FormTable = ({ forms }: Props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortByDate, setSortByDate] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);
    const [selectedForm, setSelectedForm] = useState<Form | null>(null);
    const rowsPerPage = 5;

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
                return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
            } else {
                return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
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

    const theme=useTheme();
    return (
        <>
            {/* <TextField
                label="Pretraži po temi"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
            /> */}
            <Box
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
                <Table>
                    <TableHead
                        sx={{
                            backgroundColor: "primary.light",
                            boxShadow: theme.shadows[2],
                        }}
                    >
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight="bold" color="primary.dark">
                                    Tema
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight="bold" color="primary.dark">
                                    Autor
                                </Typography>
                            </TableCell>
                            <TableCell>
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
                                        "&:hover": {
                                            backgroundColor: "action.hover",
                                        },
                                    }}
                                >
                                    Datum kreiranja
                                </Button>
                            </TableCell>
                            <TableCell align="center">
                                <Typography fontWeight="bold" color="primary.dark">
                                    Status
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography fontWeight="bold" color="primary.dark">
                                    Pregled
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedForms.map((form, index) => (
                            <TableRow
                                key={form.id}
                                hover
                                sx={{
                                    backgroundColor: index % 2 === 0 ? "background.paper" : "action.hover",
                                    "&:hover": {
                                        backgroundColor: "action.selected",
                                    },
                                }}
                            >
                                <TableCell>{form.topic}</TableCell>
                                <TableCell>
                                    {form.user.firstName} {form.user.lastName}
                                </TableCell>
                                <TableCell>
                                    {new Date(form.creationDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={getFormStatus(form.endDate)}
                                        sx={{
                                            backgroundColor: getFormStatus(form.endDate) === "Otvorena" ? "success.light" : "error.light",
                                            color: "white",
                                            fontWeight: "bold",
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleViewDetails(form)}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "primary.main",
                                                color: "primary.contrastText",
                                            },
                                        }}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {forms.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                        count={Math.ceil(filteredForms.length / rowsPerPage)}
                        page={page}
                        onChange={(_, newPage) => setPage(newPage)}
                        color="primary"
                    />
                </Box>
            )}

            <Dialog
                open={!!selectedForm}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "primary.light",
                        color: "primary.dark",
                        fontWeight: "bold",
                    }}
                >
                    {selectedForm?.topic}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <DialogContentText>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Autor:</strong> {selectedForm?.user.firstName}{" "}
                            {selectedForm?.user.lastName}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Datum kreiranja:</strong>{" "}
                            {new Date(selectedForm?.creationDate || "").toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Datum završetka:</strong>{" "}
                            {new Date(selectedForm?.endDate || "").toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Status:</strong>{" "}
                            <Chip
                                label={getFormStatus(selectedForm?.endDate || "")}
                                sx={{
                                    backgroundColor: getFormStatus(selectedForm?.endDate || "") === "Otvorena" ? "success.light" : "error.light",
                                    color: "white",
                                    fontWeight: "bold",
                                }}
                            />
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Opcije:</strong>
                        </Typography>
                        <ul>
                            {selectedForm?.options.map((option) => (
                                <li key={option.id}>
                                    {option.text} (Odgovori: {option.usersOption.length})
                                </li>
                            ))}
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        color="primary"
                        sx={{
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: "primary.main",
                                color: "primary.contrastText",
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