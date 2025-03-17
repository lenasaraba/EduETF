import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import NotFound from "../../app/errors/NotFound";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { MentionsInput, Mention } from "react-mentions";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DescriptionIcon from "@mui/icons-material/Description";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  CardContent,
  Chip,
  CircularProgress,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Input,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  createMessage,
  deleteMessageAsync,
  fetchMessagesAsync,
  searchMessagesAsync,
  uploadFile,
} from "./messageSlice";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  deleteThemeAsync,
  fetchThemeByIdAsync,
  updateThemeStatus,
} from "./themeSlice";
import { Author } from "../onlineStudy/components/Author";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BlockIcon from "@mui/icons-material/Block";
import React from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChatTwoToneIcon from "@mui/icons-material/ChatTwoTone";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {
  CreateMessage,
  Message,
  MessageMaterial,
} from "../../app/models/theme";
import { Theme as ThemeMod } from "../../app/models/theme";

import "./themeStyle.css";
import Unauthorized from "../../app/errors/Unauthorized";
import { LoadingButton } from "@mui/lab";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SummarizeIcon from "@mui/icons-material/Summarize";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import CustomTimeline from "../onlineStudy/components/CustomTimeline";
import CustomMessageMaterial from "./components/CustomMessageMaterial";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import AddNewForm from "../form/components/AddNewForm";
import FormTable from "../form/components/FormTable";
import {
  assignToMessage,
  createForm,
  fetchAllFormsAsync,
  fetchFormsByMessageIdAsync,
  fetchFormsByThemeIdAsync,
} from "../form/formSlice";
import { CreateForm, Form } from "../../app/models/form";
import FormVote from "../form/components/FormVote";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  const debouncedSearch = useMemo(
    () =>
      debounce((event: any) => {
        console.log(event);
        onSearch(event);
      }, 1000),
    [] // Zavisi samo od dispatch-ap
  );

  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, [debouncedSearch]);

  return (
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
        padding: 0,
        height: 40,
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
          // padding: 0,
          // height: "100%",
        },
        // "& .MuiInputBase-inputAdornedStart": {
        //   paddingLeft: 0,
        // },
        // "& input": {
        //   color: "primary.main", // Osnovna boja teksta
        //   fontSize: 14,
        // },
      }}
      value={query}
      onChange={(e: any) => {
        setQuery(e.target.value);
        console.log(query);
        debouncedSearch(e.target.value);
      }}
    />
    // <button onClick={handleSearch}>Search</button>
  );
};

export default function Theme() {
  const [searchResults, setSearchResults] = useState<Message[] | null>([]);
  const [highlightedMessage, setHighlightedMessage] = useState<number | null>(
    null
  );
  const resultMessages = useAppSelector(
    (state) => state.message.resultMessages
  );
  console.log(resultMessages);
  const [currentResultIndex, setCurrentResultIndex] = useState<number>(0);
  const bottomOfPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(resultMessages);
    if (resultMessages && resultMessages.length > 0) {
      setCurrentResultIndex(0);
      scrollToMessage(resultMessages[0].id!);
    } else {
      setHighlightedMessage(null);
    }
    setSearchResults(resultMessages);
  }, [resultMessages]);

  const handleSearch = async (query: string) => {
    try {
      console.log(query);
      if (theme)
        await dispatch(
          searchMessagesAsync({ themeId: theme.id, query: query })
        );
      // console.log(resultMessages);
      // console.log(messstatus);
      // if (resultMessages) {
      //   setSearchResults(resultMessages);
      //   setCurrentResultIndex(0);
      //   if (resultMessages.length > 0 && resultMessages[0]) {
      //     scrollToMessage(resultMessages[0].id!);
      //   }
      // }
    } catch (error) {
      console.error("Error searching messages:", error);
    }
  };

  const scrollToMessage = (messageId: number) => {
    setHighlightedMessage(messageId);
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleNextResult = () => {
    if (searchResults) {
      console.log(searchResults);
      if (currentResultIndex < searchResults.length - 1) {
        const nextIndex = currentResultIndex + 1;
        setCurrentResultIndex(nextIndex);
        if (searchResults[nextIndex].id)
          scrollToMessage(searchResults[nextIndex].id);
        // console.log("1111")
      }
    }
  };

  const handlePreviousResult = () => {
    if (searchResults) {
      console.log(searchResults);

      if (currentResultIndex > 0) {
        const prevIndex = currentResultIndex - 1;
        setCurrentResultIndex(prevIndex);
        if (searchResults[prevIndex].id)
          scrollToMessage(searchResults[prevIndex].id);
      }
    }
  };

  const navigate = useNavigate();
  const status = useAppSelector((state) => state.theme.status);
  const messstatus = useAppSelector((state) => state.message.status);

  const statusMessage = useAppSelector((state) => state.message.status);

  // const open = Boolean(anchorEl);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [selectedMessage, sestSelectedMessage] = useState<Message>();

  const handleDeleteMessage = (
    // event: React.MouseEvent<HTMLElement>,
    message: Message
  ) => {
    // console.log(courseSelected);
    // setCourseSelected(course);
    sestSelectedMessage(message);
    setOpenMessageDialog(true);
  };
  const handleCloseMessageDialog = () => {
    sestSelectedMessage(undefined);
    setOpenMessageDialog(false);
    // setAnchorEl(null);
  };

  const handleConfirmDeleteMessage = async () => {
    try {
      console.log(selectedMessage);
      if (selectedMessage)
        await dispatch(deleteMessageAsync(selectedMessage.id!));
      setOpenMessageDialog(false);

      // await dispatch(fetchMessagesAsync(parseInt(id!)));
    } catch (error) {
      console.error("Greška prilikom brisanja poruke:", error);
    }
  };

  const { id } = useParams<{ id: string }>(); // Osigurava da je `id` uvek string
  // const themes = useAppSelector((state) => state.theme.themes);
  const { user } = useAppSelector((state) => state.account);
  const messages = useAppSelector(
    // (state) => state.message.messages![parseInt(id!)]
    (state) => state.message.messages
  );

  const messagesLoaded = useAppSelector(
    (state) => state.message.messagesLoaded
  );

  const uniqueUsers = Array.from(
    new Map(
      messages?.map((message) => [message.user?.id, message.user])
    ).values()
  );

  const mentionUsers = uniqueUsers
    ?.filter((u) => u?.username && u?.id !== user?.id) // Filtriramo korisnike koji imaju username i koji nisu prijavljeni korisnik
    .map((u) => ({
      id: String(u?.id), // Pretvaramo ID u string
      display: String(u?.username), // Pretvaramo username u string
    }));

  // mentionUsers.map((m) => console.log({ ...m }));
  // console.log({ ...mentionUsers });

  const [messageContent, setMessageContent] = useState("");
  const dispatch = useAppDispatch();

  // const theme = themes!.find((i) => i.id === parseInt(id!));
  const theme = useAppSelector((state) => state.theme.currentTheme);

  const themeLoaded = useAppSelector((state) => state.theme.currentThemeLoaded);
  useEffect(() => {
    dispatch(fetchThemeByIdAsync(parseInt(id!)));
    dispatch(fetchAllFormsAsync());
  }, [dispatch]);

  const topOfPageRef = useRef<HTMLDivElement>(null);
  // const bottomOfPageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log(theme);
    if (theme != null && themeLoaded) {
      // Fetch podataka
      dispatch(fetchMessagesAsync(parseInt(id!))).then(() => {
        // Skrolovanje stranice na vrh
        if (topOfPageRef.current) {
          window.scrollTo({ top: 0, behavior: "instant" });
          console.log("Stranica skrolovana na vrh");
        }
      });
      dispatch(fetchFormsByThemeIdAsync(theme.id));
    }
  }, [id, theme, dispatch]);

  // useEffect(() => {
  //   if (messages && messages.length > 0) {
  //     messages.forEach((m) => dispatch(fetchFormsByMessageIdAsync(m.id!)));
  //   }
  // }, [messages]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const idMenu = open ? "simple-popover" : undefined;
  const [loadingStatus, setLoadingStatus] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false); // Stanje za prikaz/sakrivanje grida sa studentima
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [isAddingExistingForm, setIsAddingExistingForm] = useState(false);

  const forms = useAppSelector((state) => state.form.forms);
  const formsLoaded = useAppSelector((state) => state.form.formsLoaded);
  const messageForm = useAppSelector((state) => state.form.messageForms);
  const formStatus = useAppSelector((state) => state.form.status);
  console.log(messageForm);

  const toggleMaterials = () => {
    setShowMaterials(!showMaterials); // Promeni stanje prikaza
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Postavlja element na koji je kliknuto
    console.log(anchorEl);
  };

  const updateStatus = async (
    event: React.MouseEvent<HTMLElement>,
    theme: ThemeMod
  ) => {
    event.preventDefault(); // Sprečava osvežavanje stranice

    setLoadingStatus(true); // Postavi loading za određenu temu

    const updateData = {
      id: theme.id,
      active: !theme.active,
    };

    try {
      await dispatch(updateThemeStatus(updateData));
    } catch (error) {
      console.error("Greška prilikom ažuriranja statusa:", error);
    } finally {
      setLoadingStatus(false); // Isključi loading nakon završetka
    }
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteThemeAsync(theme!.id));
      navigate("/themes?type=all");
    } catch (error) {
      console.error("Greška prilikom brisanja teme:", error);
    } finally {
      setAnchorEl(null); // Zatvara meni
      setOpenDialog(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null); // Zatvara Popover
  };
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Prazan niz na početku
  const [selectedForms, setSelectedForms] = useState<Form[]>([]); // Prazan niz na početku
  const [newForms, setNewForms] = useState<CreateForm[]>([]); // Prazan niz na početku

  if (id == undefined) return <NotFound />;

  if (status === "rejectedUnauthorized") {
    return <Unauthorized />;
  }

  // Ako kurs ne postoji, proveravamo status
  if (!theme) {
    if (status === "rejectedNotFound") {
      return <NotFound />;
    }

    // Pazimo da ne prikažemo LoadingComponent ako je status već bio unauthorized
    return <LoadingComponent message="Učitavanje teme..." />;
  }

  const handleFileAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx,image/*,video/*"; // Dozvoljeni tipovi fajlova
    input.multiple = true; // Omogućiti više fajlova
    input.id = "inputEl";

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const filesArray = Array.from(target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
      }
    };
    setTimeout(() => {
      const createFormElement = document.getElementById("inputEl");
      if (createFormElement) {
        createFormElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);

    input.click();
  };

  const handleAddForm = () => {
    setIsAddingExistingForm(false);

    setIsCreatingForm(true);
    setTimeout(() => {
      const createFormElement = document.getElementById("createFormElement");
      if (createFormElement) {
        createFormElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
    // setNewWeek(course!.weekCount + 1);
    // setAddingWeek(true);
  };

  const handleAddExistingForm = () => {
    setIsCreatingForm(false);

    setIsAddingExistingForm(true);
    setTimeout(() => {
      const createFormElement = document.getElementById("createFormElement");
      if (createFormElement) {
        createFormElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const actions = [
    {
      icon: <AttachFileIcon />,
      name: "Dodaj fajl",
      action: handleFileAttach,
    },
    {
      icon: <DashboardCustomizeIcon />,
      name: "Dodaj novu anketu",
      action: handleAddForm,
    },
    {
      icon: <DashboardIcon />,
      name: "Dodaj postojeću anketu",
      action: handleAddExistingForm,
    },
  ];

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
  // console.log("STATUUUS FORMEE " + formStatus);
  return (
    <>
      {id === undefined ? (
        <NotFound />
      ) : status === "rejectedUnauthorized" ? (
        <Unauthorized />
      ) : !theme ? (
        status === "rejectedNotFound" ? (
          <NotFound />
        ) : (
          <LoadingComponent message="Učitavanje teme..." />
        )
      ) : (
        <>
          <div ref={topOfPageRef}></div>

          <Grid
            container
            sx={{
              display: "flex",
              direction: "column",
              margin: 0,
              paddingX: 10,
              paddingY: 3,
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
              <Grid item xs={12} sx={{ marginBottom: 2 }}>
                {" "}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Breadcrumbs
                    //size="small"
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon fontSize="small" />}
                    sx={{ pl: 0 }}
                  >
                    <Box
                      component={Link}
                      to="/forum"
                      sx={{ display: "flex", alignItems: "center" }}
                      // onClick={() => dispatch(resetCoursesParams())}
                      // onClick={() => navigate("../forum")}
                    >
                      <ChatTwoToneIcon
                        sx={{
                          color: "text.secondary",
                          // fontWeight: "bold",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.2)",
                            color: "primary.main", // Promijeni boju na hover
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
                      Tema
                    </Typography>
                  </Breadcrumbs>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sm={12} sx={{ padding: 1 }}>
                <CardContent
                  sx={{
                    border: "1px solid",
                    borderRadius: "20px",
                    borderColor: "primary.main",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    pt: 3,
                    px: 2,
                  }}
                >
                  <Grid container sx={{ padding: 0 }}>
                    <Grid item sx={{ padding: 0 }}>
                      <Avatar
                        alt={theme.title}
                        sx={{
                          width: 56,
                          height: 56,
                          backgroundColor: "text.primary",
                          mr: 2,
                          padding: 0,
                        }}
                      >
                        <Box sx={{ fontSize: "25pt" }}>
                          {theme.title.charAt(0).toUpperCase()}
                        </Box>
                      </Avatar>
                    </Grid>
                    <Grid item xs>
                      <Grid
                        gap={2}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold">
                          {theme.title}
                        </Typography>

                        <Chip
                          // variant="soft"
                          size="small"
                          icon={
                            // {
                            //   true: <CheckRoundedIcon />,
                            //   false: <BlockIcon />,
                            // }[theme.active]
                            loadingStatus ? (
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
                            backgroundColor: loadingStatus
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
                            loadingStatus
                              ? "Ažuriranje..."
                              : theme.active
                                ? "Aktivno"
                                : "Zatvoreno"
                          }
                        />
                        {user && user.username == theme.user?.username ? (
                          <>
                            <div>
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
                                {user.role == "Student" &&
                                  (theme.course == null ||
                                    theme.course?.usersCourse.some(
                                      (uc) =>
                                        uc.user?.username === user.username &&
                                        uc.withdrawDate == null
                                    )) && (
                                    <Typography
                                      onClick={(event) =>
                                        updateStatus(event, theme)
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
                                        color: "text.primary",
                                        backgroundColor: "background.paper",
                                      }}
                                    >
                                      {theme.active ? "Zaključaj" : "Otključaj"}
                                    </Typography>
                                  )}
                                {user.role == "Profesor" &&
                                  (theme.course == null ||
                                    theme.course?.professorsCourse.some(
                                      (pc) =>
                                        pc.user?.username === user.username &&
                                        pc.withdrawDate == null
                                    )) && (
                                    <Typography
                                      onClick={(event) =>
                                        updateStatus(event, theme)
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
                                        color: "text.primary",
                                        backgroundColor: "background.paper",
                                      }}
                                    >
                                      {theme.active ? "Zaključaj" : "Otključaj"}
                                    </Typography>
                                  )}
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
                                    fontFamily: "Raleway, sans-serif",
                                    color: "text.secondaryChannel",
                                    backgroundColor: "background.paper",
                                  }}
                                >
                                  Obriši
                                </Typography>
                              </Popover>
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
                                    Da li ste sigurni da želite da obrišete ovu
                                    temu?
                                  </Typography>
                                </DialogContent>
                                <DialogActions
                                  sx={{ justifyContent: "center", gap: 2 }}
                                >
                                  <Button
                                    onClick={handleCloseDialog}
                                    sx={{ color: "text.primary" }}
                                  >
                                    Odustani
                                  </Button>
                                  <LoadingButton
                                    loading={status == "pendingDeleteTheme"}
                                    onClick={handleConfirmDelete}
                                    color="error"
                                    variant="contained"
                                    loadingIndicator={
                                      <CircularProgress
                                        size={18}
                                        sx={{ color: "white" }}
                                      /> // Ovdje mijenjaš boju
                                    }
                                  >
                                    Obriši
                                  </LoadingButton>
                                </DialogActions>
                              </Dialog>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </Grid>
                      <Typography variant="body2" color="text.secondary">
                        {theme.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {`Objavljeno: ${new Date(theme.date).toLocaleDateString("sr-RS")}`}{" "}
                      </Typography>
                      <br />
                      {theme.user ? (
                        <Typography variant="caption" color="text.secondary">
                          Autor:{" "}
                          <b>
                            {theme.user?.firstName} {theme.user?.lastName}
                          </b>
                        </Typography>
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "gray",
                            textDecoration: "none",
                            fontSize: "10pt",
                            // fontWeight: "normal",
                          }}
                        >
                          Autor: <b>[Obrisan korisnik]</b>
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>

              {theme.course && <Divider sx={{ marginY: 2 }} />}
              <Grid item xs={12} md={6} sm={12} sx={{ padding: 1 }}>
                {theme.course ? (
                  <CardContent
                    sx={{
                      border: "1px solid",
                      borderRadius: "20px",
                      borderColor: "primary.main",
                      height: "100%",
                      padding: 0,
                      pt: 3,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="button"
                      sx={{ fontSize: "8pt", fontWeight: "bold" }}
                    >
                      Kurs
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {theme.course.name}{" "}
                      <Box
                        component="span"
                        sx={{
                          mx: 1,
                          my: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: "18pt",
                          color: "action.disabled",
                        }}
                      >
                        {" "}
                        |{" "}
                      </Box>
                      {theme.course.year.name}{" "}
                      <Box
                        component="span"
                        sx={{
                          mx: 1,
                          my: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: "18pt",
                          color: "action.disabled",
                        }}
                      >
                        |{" "}
                      </Box>{" "}
                      {theme.course.studyProgram.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginBottom: 1 }}
                    >
                      {theme.course.description}
                    </Typography>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Profesori:
                      </Typography>
                      <Box
                        key="index"
                        sx={{ display: "flex", flexDirection: "row" }}
                      >
                        {/* <Avatar
                      key={index}
                      alt={professor.user.firstName}
                      // src={author.avatar}
                      sx={{
                        width: 23,
                        height: 23,
                        backgroundColor: "text.primary",
                        mr: 1,
                      }}
                    >
                      {professor.user.firstName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography>
                      {professor.user.firstName}&nbsp;
                      {professor.user.lastName}
                    </Typography> */}
                        <Author
                          authors={theme.course.professorsCourse.filter(
                            (prof) => prof.withdrawDate == null
                          )}
                        />
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: 2 }}
                      // onClick={() =>
                      //   (window.location.href = `/courses/${theme.course.id}`)
                      // }
                      component={Link}
                      to={`/courses/${theme.course.id}`}
                    >
                      Idi na kurs
                    </Button>
                  </CardContent>
                ) : (
                  <CardContent
                    sx={{
                      border: "1px solid",
                      borderRadius: "20px",
                      borderColor: "primary.main",
                      height: "100%",
                      padding: 0,
                      pt: 3,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="button"
                      sx={{ fontSize: "10pt", fontWeight: "bold" }}
                    >
                      Kategorija
                    </Typography>
                    <Divider />
                    <Typography
                      variant="body1"
                      sx={{ mt: 2, fontSize: "16pt" }}
                    >
                      Slobodna tema
                    </Typography>{" "}
                  </CardContent>
                )}
              </Grid>
            </Grid>
            <Grid
              container
              sx={{
                direction: "column",
                display: "flex",
                margin: 0,
                justifyContent: "space-around",
                boxSizing: "border-box",
                padding: 1,
                mt: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  display: "block",
                  fontFamily: "Raleway, sans-serif",
                  width: "100%",
                }}
              >
                Poruke
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  paddingY: 1,
                  color: "action.disabled",
                  display: "block",
                  fontFamily: "Raleway, sans-serif",
                  width: "100%",
                }}
              >
                {theme.active ? "" : "Zatvorena tema"}
              </Typography>

              <Box
                sx={{
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mb: 1,
                }}
              >
                <SearchBar onSearch={handleSearch} />
                {searchResults && searchResults.length > 0 && (
                  <Box
                    sx={{
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        margin: 0,
                        padding: 0,
                        width: "100%",
                      }}
                    >
                      <Button
                        onClick={handlePreviousResult}
                        disabled={currentResultIndex === 0}
                      >
                        <ArrowBackIosIcon sx={{ fontSize: "10pt" }} />
                      </Button>
                      <Button
                        onClick={handleNextResult}
                        disabled={
                          currentResultIndex === searchResults.length - 1
                        }
                      >
                        <ArrowForwardIosIcon sx={{ fontSize: "10pt" }} />
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        margin: 0,
                        padding: 0,
                        justifyContent: "center",
                        fontSize: "9pt",
                      }}
                    >
                      {currentResultIndex + 1} / {searchResults.length}
                    </Box>
                  </Box>
                )}
                <IconButton
                  title={
                    showMaterials
                      ? "Sakrij sve materijale"
                      : "Prikaži sve materijale"
                  }
                  onClick={toggleMaterials}
                  sx={{
                    backdropFilter: "blur(40px)",
                    color: "primary.dark",
                    // borderRadius:0,
                    // paddingX:2,
                  }}
                  disabled={!messagesLoaded}
                >
                  <PermMediaIcon
                    sx={{ color: "primary.dark" }}
                    fontSize="medium"
                  />
                </IconButton>
              </Box>

              <Grid
                item
                xs={12}
                md={showMaterials ? 8 : 12} // Dinamička širina u zavisnosti od prikaza studenta
                sx={{
                  boxSizing: "border-box",
                  border: "1px solid",
                  borderColor: theme.active
                    ? "primary.main"
                    : "action.disabled",
                  borderRadius: "20px",
                  position: "relative",
                  margin: 0,

                  padding: 0,
                  // minWidth: "700px",

                  mb: 2,
                }}
              >
                {!messagesLoaded ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "70vh",
                      width: "100%",
                      margin: 0,
                      padding: 1,
                    }}
                  >
                    <CircularProgress
                      size={120}
                      sx={{ color: "text.secondary" }}
                    />
                  </Box>
                ) : (
                  <>
                    <Box
                      sx={{
                        // margin: "0 16px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        overflow: "auto",
                        height: "70vh",
                        width: "100%",
                        margin: 0,
                        padding: 1,

                        "&::-webkit-scrollbar": {
                          width: "8px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "primary.main", // Boja skrola
                          borderRadius: "8px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                          backgroundColor: "primary.dark", // Boja hvataljke na hover
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: "transparent", // Prozirna pozadina skrola
                        },
                      }}
                    >
                      <Box
                        sx={{
                          // listStyleType: "none",
                          //padding: 5, // Širi prozor za poruke
                          padding: 0,
                          px: 2,
                          overflow: "auto",
                          "&::-webkit-scrollbar": {
                            width: "8px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "primary.main", // Boja skrola
                            borderRadius: "8px",
                          },
                          "&::-webkit-scrollbar-thumb:hover": {
                            backgroundColor: "primary.light", // Boja hvataljke na hover
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: "transparent", // Prozirna pozadina skrola
                          },
                        }}
                      >
                        {messages && messages.length > 0 ? (
                          messages.map((message, index) => (
                            <Box
                              key={index}
                              id={`message-${message.id}`}
                              sx={{
                                marginTop: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                  message.user?.email === user?.email
                                    ? "flex-end"
                                    : "flex-start",
                                marginBottom: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  backgroundColor:
                                    message.user?.email === user?.email
                                      ? "common.background"
                                      : "common.onBackground",
                                  padding: { xs: 1, sm: 1.5, md: 2 }, 
                                  borderRadius: 2,
                                  maxWidth: {
                                    xs: "90%", 
                                    sm: "80%", 
                                    md: "70%", 
                                  },
                                  width:"100%",
                                  border: "2px solid",
                                  borderColor:
                                    highlightedMessage === message.id
                                      ? "text.primary"
                                      : "transparent",
                                  boxShadow: (theme) =>
                                    highlightedMessage === message.id
                                      ? `0px 0px 15px 2px ${theme.palette.text.primary}`
                                      : "none",
                                  transition: "all 0.2s ease-in-out",
                                }}
                              >
                                <Stack direction="row" alignItems="flex-start">
                                  <Box sx={{ margin: 0, padding: 0 }}>
                                    <Avatar
                                      sx={{
                                        marginRight: { xs: 1, sm: 1.5, md: 2 }, 
                                        width: { xs: 32, sm: 40, md: 48 }, 
                                        height: { xs: 32, sm: 40, md: 48 },
                                        backgroundColor:
                                          "common.backgroundChannel",
                                      }}
                                    />
                                  </Box>
                                  <Box sx={{ width: "100%" }}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight={
                                        message.user?.email === user?.email
                                          ? "bold"
                                          : "normal"
                                      }
                                      sx={{
                                        display: "flex",
                                        flexDirection: {
                                          xs: "column",
                                          sm: "row",
                                        }, // Vertikalni raspored za xs, horizontalni za veće ekrane
                                        justifyContent: "space-between",
                                        alignItems: {
                                          xs: "flex-start",
                                          sm: "center",
                                        },
                                        color: "common.white",
                                        fontSize: {
                                          xs: "0.875rem",
                                          sm: "1rem",
                                        }, // Smanjen font za manje ekrane
                                      }}
                                    >
                                      <span>
                                        {message.user ? (
                                          `${message.user?.firstName} ${message.user?.lastName}`
                                        ) : (
                                          <span style={{ fontStyle: "italic" }}>
                                            [Obrisan korisnik]
                                          </span>
                                        )}
                                        {theme.user?.email ===
                                          message.user?.email && (
                                          <span
                                            style={{
                                              color: "primary.main",
                                              marginLeft: "8px",
                                            }}
                                          >
                                            &#9733;{" "}
                                            <Typography
                                              variant="button"
                                              fontSize={10}
                                              component="span"
                                            >
                                              autor
                                            </Typography>
                                          </span>
                                        )}
                                      </span>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontSize: {
                                            xs: "0.75rem",
                                            sm: "0.875rem",
                                          }, // Smanjen font za manje ekrane
                                          color: "common.black",
                                          mt: { xs: 0.5, sm: 0 }, // Dodatni razmak za xs ekrane
                                        }}
                                      >
                                        {new Date(
                                          message.creationDate
                                        ).toLocaleTimeString("sr-RS", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          second: "2-digit",
                                        })}{" "}
                                        {new Date(
                                          message.creationDate
                                        ).toLocaleDateString("sr-RS", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })}
                                      </Typography>
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      color="text.primary"
                                      sx={{
                                        textAlign: "left",
                                        fontSize: {
                                          xs: "0.875rem",
                                          sm: "1rem",
                                        }, // Smanjen font za manje ekrane
                                        mt: 1,
                                      }}
                                    >
                                      {message.content}
                                    </Typography>

                                    {/* FormVote i materijali */}
                                    {formStatus == message.id?.toString() ? (
                                      <CircularProgress
                                        size={20}
                                        sx={{ color: "#fff" }}
                                      />
                                    ) : (
                                      messageForm &&
                                      messageForm.filter(
                                        (f) => f.messageId == message.id
                                      ) &&
                                      messageForm
                                        .filter(
                                          (f) => f.messageId == message.id
                                        )
                                        .map((form, index) => (
                                          <Box
                                            key={index}
                                            sx={{
                                              margin: 0,
                                              padding: 0,
                                              marginBottom: 2,
                                            }}
                                          >
                                            <FormVote
                                              form={form}
                                              IsTheme={true}
                                            />
                                          </Box>
                                        ))
                                    )}

                                    {/* Materijali */}
                                    {message.materials &&
                                      message.materials.length > 0 && (
                                        <Box sx={{ marginTop: 1 }}>
                                          {message.materials.map(
                                            (material, index) => {
                                              const fileExtension =
                                                material.filePath
                                                  .split(".")
                                                  .pop()
                                                  .toLowerCase();

                                              if (
                                                [
                                                  "jpg",
                                                  "jpeg",
                                                  "png",
                                                  "gif",
                                                ].includes(fileExtension)
                                              ) {
                                                return (
                                                  <Box
                                                    key={index}
                                                    sx={{ marginTop: 1 }}
                                                  >
                                                    <img
                                                      src={`http://localhost:5000//${material.filePath}`}
                                                      alt="Materijal"
                                                      style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "150px", // Smanjena visina slika za manje ekrane
                                                        borderRadius: "8px",
                                                      }}
                                                    />
                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        mt: 0.5,
                                                        wordBreak: "break-word",
                                                      }}
                                                    >
                                                      {material.title}
                                                    </Typography>
                                                  </Box>
                                                );
                                              } else if (
                                                ["mp4", "webm", "ogg"].includes(
                                                  fileExtension
                                                )
                                              ) {
                                                return (
                                                  <Box
                                                    key={index}
                                                    sx={{ marginTop: 1 }}
                                                  >
                                                    <video
                                                      controls
                                                      style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "150px", // Smanjena visina videa za manje ekrane
                                                        borderRadius: "8px",
                                                      }}
                                                      src={`http://localhost:5000//${material.filePath}`}
                                                    />
                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        mt: 0.5,
                                                        wordBreak: "break-word",
                                                      }}
                                                    >
                                                      {material.title}
                                                    </Typography>
                                                  </Box>
                                                );
                                              } else if (
                                                ["pdf", "docx", "doc"].includes(
                                                  fileExtension
                                                )
                                              ) {
                                                return (
                                                  <Box
                                                    key={index}
                                                    sx={{
                                                      marginTop: 1,
                                                      display: "flex",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    <DescriptionIcon fontSize="small" />{" "}
                                                    {/* Smanjena ikonica */}
                                                    <a
                                                      href={`http://localhost:5000//${material.filePath}`}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      style={{
                                                        textDecoration: "none",
                                                        color: "primary.main",
                                                        marginLeft: "8px",
                                                        wordBreak: "break-word",
                                                      }}
                                                    >
                                                      {material.title ||
                                                        "Dokument"}{" "}
                                                      (
                                                      {fileExtension.toUpperCase()}
                                                      )
                                                    </a>
                                                  </Box>
                                                );
                                              }
                                              return null;
                                            }
                                          )}
                                        </Box>
                                      )}

                                    {/* Dugme za brisanje */}
                                    {user &&
                                      user.email === message.user?.email && (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            mt: 1,
                                          }}
                                        >
                                          <DeleteOutlineOutlinedIcon
                                            sx={{
                                              fontSize: {
                                                xs: "14pt",
                                                sm: "16pt",
                                              }, // Smanjena ikonica za manje ekrane
                                              color: "text.disabled",
                                              "&:hover": {
                                                cursor: "pointer",
                                                color: "text.primary",
                                              },
                                            }}
                                            onClick={() =>
                                              handleDeleteMessage(message)
                                            }
                                          />
                                        </Box>
                                      )}
                                  </Box>
                                </Stack>
                              </Box>
                            </Box>
                          ))
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 2,
                              textAlign: "center",
                              fontSize: { xs: "10pt", sm: "12pt" }, // Smanjen font za manje ekrane
                              fontFamily: "Raleway, sans-serif",
                            }}
                          >
                            {theme.active
                              ? user
                                ? "Započnite razgovor."
                                : "Prijavite se da započnete razgovor."
                              : "Zatvorena tema"}
                          </Typography>
                        )}
                        {/* <div ref={bottomOfPageRef}></div> */}
                      </Box>
                    </Box>
                  </>
                )}
                {user && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      padding: 2,
                      width: "100%",
                      backgroundColor: "background.paper",
                      borderRadius: "0 0 20px 20px",
                      height: "8vh ",
                      position: "relative",
                    }}
                  >
                    {/* Input za tekst poruke */}
                    <MentionsInput
                      disabled={!theme.active}
                      className="ssky-mention-input"
                      value={messageContent}
                      onChange={(
                        event: React.ChangeEvent<HTMLTextAreaElement>
                      ) => {
                        let newValue = event.target.value;
                        const regex = /@\[([a-zA-Z0-9_]+)\]\(\d+\)/g;
                        newValue = newValue.replace(regex, "@$1");
                        setMessageContent(newValue);
                      }}
                      style={{
                        flexGrow: 1,
                        minHeight: "40px",
                        padding: "10px",
                        lineHeight: "20px",
                        whiteSpace: "pre-wrap", // Omogućava tekstualni prelaz
                        wordWrap: "break-word", // Omogućava prelaz reči
                        resize: "vertical", // Omogućava korisniku da ručno podešava visinu
                        // Prilagodba za xs i sm ekrane
                        // "@media (max-width: 600px)": {
                        //   minHeight: "60px", // Povećajte visinu za manje ekrane
                        // },
                        // "@media (max-width: 960px)": {
                        //   minHeight: "50px", // Povećajte visinu za srednje ekrane
                        // },
                        fontSize: "clamp(12px, 14px, 16px)",
                        overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
                        display: "-webkit-box", // Neophodno za multi-line truncation
                        WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                        WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
                        // lineHeight: "1", // Podešava razmak između linija
                        height: "1em", // Fiksna visina: broj linija * lineHeight
                        textOverflow: "ellipsis", // Dodaje tri tačke
                      }}
                      placeholder={
                        theme.active
                          ? "Unesite poruku..."
                          : "Nije moguće slati poruke na zatvorenoj temi"
                      }
                    >
                      <Mention
                        trigger="@"
                        data={mentionUsers}
                        displayTransform={(id: string, display: string) =>
                          "@" + display
                        }
                      />
                    </MentionsInput>

                    {/* Dugme + (SpeedDial) */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <div
                        style={{
                          position: "relative",
                          height: "40px",
                          width: "50px",
                        }}
                      >
                        <SpeedDial
                          ariaLabel="Opcije"
                          icon={<SpeedDialIcon />}
                          sx={{
                            position: "absolute", // Sprečava da zauzima previše visine
                            zIndex: 1,
                            bottom: 0,
                            ".MuiSpeedDial-fab": {
                              height: "38px",
                              width: "38px",
                              color: "text.primary",
                            },
                            ".MuiSpeedDial-root": {
                              height: "40px",
                              width: "40px",
                            },
                          }}
                        >
                          {actions.map((action, index) => (
                            <SpeedDialAction
                              key={index}
                              icon={action.icon}
                              tooltipTitle={action.name}
                              onClick={action.action}
                            />
                          ))}
                        </SpeedDial>
                      </div>

                      {/* Dugme za slanje */}
                      <LoadingButton
                        loading={statusMessage == "pendingCreateMessage"}
                        color="primary"
                        variant="contained"
                        disabled={
                          !theme.active ||
                          (messageContent === "" &&
                            selectedFiles.length === 0 &&
                            newForms.length === 0 &&
                            selectedForms.length === 0) ||
                          statusMessage == "pendingCreateMessage"
                        }
                        loadingIndicator={
                          <CircularProgress size={18} sx={{ color: "white" }} /> // Ovdje mijenjaš boju
                        }
                        sx={{
                          textTransform: "none",
                          color: "text.primary",
                          backgroundColor: "primary.main",
                          minWidth: "80px",
                          "&:hover": {
                            color: "primary.dark",
                            backgroundColor: "primary.main",
                          },
                        }}
                        onClick={async () => {
                          try {
                            const localDate = new Date();
                            const offset = localDate.getTimezoneOffset();
                            const adjustedDate = new Date(
                              localDate.getTime() - offset * 60000
                            );

                            const newMessage: CreateMessage = {
                              content: messageContent ? messageContent : "",
                              themeId: theme.id,
                              creationDate: adjustedDate.toISOString(),
                              user: user!,
                              materials: [],
                            };

                            if (selectedFiles && selectedFiles.length > 0) {
                              const uploadPromises = selectedFiles.map(
                                async (file) => {
                                  console.log(file, theme.id);
                                  const response = await dispatch(
                                    uploadFile({ file, themeId: theme.id })
                                  ).unwrap();

                                  return {
                                    title: file.name,
                                    filePath: response.filePath,
                                    url: file.name,
                                    materialTypeId: getMaterialType(file),
                                    creationDate: adjustedDate.toISOString(),
                                  };
                                }
                              );

                              newMessage.materials =
                                await Promise.all(uploadPromises);
                            }

                            const responseMessage = await dispatch(
                              createMessage(newMessage)
                            ).unwrap();

                            if (newForms.length > 0)
                              newForms.map((form) => {
                                form.messageId = responseMessage.id;
                                dispatch(createForm(form));
                              });

                            if (selectedForms.length > 0)
                              selectedForms.map((form) => {
                                dispatch(
                                  assignToMessage({
                                    formId: form.id,
                                    messageId: responseMessage!.id!,
                                  })
                                );
                              });

                            if (bottomOfPageRef.current) {
                              bottomOfPageRef.current.scrollIntoView({
                                behavior: "instant",
                                block: "start",
                              });
                            }

                            setMessageContent("");
                            setSelectedFiles([]);
                            setSelectedForms([]);
                            setNewForms([]);
                          } catch (error) {
                            console.error("Greška pri slanju poruke:", error);
                          }
                        }}
                      >
                        Pošalji
                      </LoadingButton>
                    </Box>
                  </Box>
                )}
              </Grid>

              {/* Prikaz svih odabranih fajlova */}
              {selectedFiles.length > 0 && (
                <Box
                  sx={{
                    width: "100%",
                    padding: 0,
                    marginTop: 1,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "column", md: "row" },
                    alignItems: "center",
                  }}
                >
                  <Typography>
                    <AttachFileIcon sx={{ color: "primary.dark", mr: 3 }} />
                  </Typography>
                  {selectedFiles.map((file, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={3.8}
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        margin: 1,
                        marginTop: 0,
                        padding: "5px 10px",
                        width: "100%",
                        backgroundColor: "background.paper",
                        borderRadius: "8px",
                        // maxWidth: "300px",
                      }}
                    >
                      {/* Ikonica fajla */}
                      <InsertDriveFileIcon sx={{ color: "primary.main" }} />

                      {/* Ime fajla */}
                      <Typography
                        variant="body2"
                        sx={{
                          flexGrow: 1,
                          wordBreak: "break-word",
                          width: "100%",
                        }}
                      >
                        {file.name}
                      </Typography>

                      {/* Dugme za brisanje fajla */}
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedFiles(
                            (prevFiles) =>
                              prevFiles.filter((_, i) => i !== index) // Brišemo fajl sa liste
                          );
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  ))}
                </Box>
              )}

              {(isCreatingForm || newForms.length > 0) && (
                <Box
                  sx={{
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    flexDirection: "column",
                  }}
                >
                  {newForms.length > 0 && (
                    <Box
                      sx={{
                        margin: 0,
                        padding: 0,
                        display: "flex",
                        flexDirection: {
                          xs: "column",
                          sm: "column",
                          md: "row",
                        },
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <DashboardCustomizeIcon
                        sx={{ color: "primary.dark", mr: 3 }}
                      />
                      {newForms.map((form, index) => (
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={3.8}
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            margin: 1,
                            marginTop: 0,
                            padding: "5px 10px",
                            backgroundColor: "background.paper",
                            borderRadius: "8px",
                            maxWidth: "300px",
                          }}
                        >
                          {/* Ime fajla */}
                          <Typography
                            variant="body2"
                            sx={{
                              flexGrow: 1,
                              wordBreak: "break-word",
                              width: "100%",
                            }}
                          >
                            {form.topic}
                          </Typography>

                          {/* Dugme za brisanje fajla */}
                          <IconButton
                            size="small"
                            onClick={() => {
                              setNewForms(
                                (prevForms) =>
                                  prevForms.filter((_, i) => i !== index) // Brišemo fajl sa liste
                              );
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      ))}
                    </Box>
                  )}
                  {isCreatingForm && (
                    <Box sx={{ margin: 0, padding: 0, width: "100%" }}>
                      <AddNewForm
                        // courseId={course.id}
                        setIsCreatingForm={setIsCreatingForm}
                        messageId={0}
                        setNewForms={setNewForms}
                      />
                    </Box>
                  )}
                </Box>
              )}

              {(isAddingExistingForm || selectedForms.length > 0) && (
                <Box
                  sx={{
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    flexDirection: "column",
                  }}
                >
                  {selectedForms.length > 0 && (
                    <Box
                      sx={{
                        margin: 0,
                        padding: 0,
                        display: "flex",
                        flexDirection: {
                          xs: "column",
                          sm: "column",
                          md: "row",
                        },
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <DashboardIcon sx={{ color: "primary.dark", mr: 3 }} />
                      {selectedForms.map((form, index) => (
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={3.8}
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            margin: 1,
                            marginTop: 0,
                            padding: "5px 10px",
                            backgroundColor: "background.paper",
                            borderRadius: "8px",
                            maxWidth: "300px",
                          }}
                        >
                          {/* Ime fajla */}
                          <Typography
                            variant="body2"
                            sx={{ flexGrow: 1, wordBreak: "break-word" }}
                          >
                            {form.topic}
                          </Typography>

                          {/* Dugme za brisanje fajla */}
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedForms(
                                (prevForms) =>
                                  prevForms.filter((_, i) => i !== index) // Brišemo fajl sa liste
                              );
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      ))}
                    </Box>
                  )}
                  {forms && isAddingExistingForm && (
                    <Box sx={{ margin: 0, padding: 0, width: "100%" }}>
                      {forms.filter((form) => !form.courseId && !form.messageId)
                        .length > 0 ? (
                        <FormTable
                          forms={forms.filter(
                            (form) => !form.courseId && !form.messageId
                          )}
                          // courseId={course.id}
                          setIsAddingExistingForm={setIsAddingExistingForm}
                          messageId={0}
                          setSelectedMessageForms={setSelectedForms}
                        />
                      ) : (
                        "Nema formi za prikaz."
                      )}
                    </Box>
                  )}
                </Box>
              )}
              {showMaterials && (
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    // height: { xs: "auto", md: "100%" },
                    width: "100%",
                    padding: 1,
                    borderRadius: 3,
                    marginTop: { xs: 0, md: 0 }, // Uklonili smo marginu na malim ekranima
                    order: 2,
                    height: "78vh",
                    overflow: "auto",
                  }}
                >
                  <Box
                    sx={{
                      // display: "flex",
                      // justifyContent: "center",
                      width: "100%",
                      // height: "100%",
                      padding: 0,
                      borderRadius: 3,
                      overflowY: "auto",
                      textAlign: "center",
                    }}
                  >
                    {messages &&
                    messages.some(
                      (msg) => msg.materials && msg.materials.length > 0
                    ) ? (
                      messages.map((message, messageIndex) =>
                        message.materials && message.materials.length > 0 ? (
                          <Box
                            key={messageIndex}
                            sx={{
                              marginBottom: 3,
                            }}
                          >
                            <CustomMessageMaterial
                              materials={message.materials}
                            />
                          </Box>
                        ) : null
                      )
                    ) : (
                      <Typography
                        variant="caption"
                        // key={messageIndex}
                        sx={{ width: "fit-content" }}
                      >
                        Materijali iz poruka će se prikazati ovdje
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Dialog
            open={openMessageDialog}
            onClose={handleCloseMessageDialog}
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
                Da li ste sigurni da želite da obrišete poruku?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
              <Button
                onClick={handleCloseMessageDialog}
                sx={{ color: "text.primary" }}
              >
                Odustani
              </Button>
              <LoadingButton
                loading={statusMessage == "pendingDeleteMessage"}
                onClick={handleConfirmDeleteMessage}
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
        </>
      )}
      {/* <div id="FormElement"></div> */}
    </>
  );
}
