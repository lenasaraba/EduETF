import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import DuoIcon from "@mui/icons-material/Duo";
import { FieldValues, UseControllerProps } from "react-hook-form";

type Props<T extends FieldValues> = {
  name: keyof T;
  handleCloseWeek: () => void;
  handleSaveWeek: () => void;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  newWeek: number;
} & UseControllerProps<T>;

export default function AppDropzone<T extends FieldValues>({
  handleCloseWeek,
  handleSaveWeek,
  setSelectedFiles,
  newWeek,
}: Props<T>) {
  const [files, setFiles] = useState<File[]>([]);

  // const handleCloseWeek = async () => {
  //  setAddingWeek(false);
  //  console.log(watchFile.path);
  // };

  // const handleSaveWeek = async () => {
  //  if (selectedFiles.length === 0) {
  //    alert("Dodajte bar jedan fajl!");
  //    return;
  //  }
  //  console.log(selectedFiles);
  //  const formData = new FormData();
  //  formData.append("weekNumber", newWeek.toString());
  //  // Dodaj svaki fajl pod istim ključem "files"
  //  selectedFiles.forEach((file, index) => {
  //    formData.append(`files`, file); // Ovo bi backend trebao da podrži
  //  });
  //  // Provera da li su svi fajlovi pravilno dodati
  //  console.log("Sadržaj FormData:");
  //  for (const pair of formData.entries()) {
  //    console.log(pair);
  //  }
  // try {
  //   const response = await fetch("/api/courses/add-material", {
  //     method: "POST",
  //     body: formData,
  //   });
  //   if (response.ok) {
  //  alert("Materijal uspešno sačuvan!");
  //  setAddingWeek(false);
  //  setSelectedFiles([]);
  //  console.log(newWeek);
  //  setNewWeek((prev) => prev + 1);
  //  console.log(newWeek);
  //   } else {
  //     alert("Greška prilikom čuvanja!");
  //   }
  // } catch (error) {
  //   console.error("Greška:", error);
  // }
  // };

  // Funkcija za dodavanje fajlova
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setSelectedFiles([...files, ...acceptedFiles]);

      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  // Funkcija za uklanjanje fajla iz liste
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // accept: "image/*, .pdf, .docx",
  });

  // Funkcija za dobijanje odgovarajuće ikonice
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <Avatar
          src={URL.createObjectURL(file)}
          sx={{ width: 30, height: 30, marginRight: 2 }}
        />
      );
    } else if (file.type === "application/pdf") {
      return (
        <PictureAsPdfIcon color="error" sx={{ fontSize: 30, marginRight: 2 }} />
      );
    } else if (file.name.endsWith(".docx")) {
      return (
        <DescriptionIcon
          color="primary"
          sx={{ fontSize: 30, marginRight: 2 }}
        />
      );
    } else if (file.name.endsWith(".mp4")) {
      console.log(file);
      return (
        <DuoIcon sx={{ fontSize: 30, marginRight: 2, color: "primary.main" }} />
      );
    }
    return <DescriptionIcon sx={{ fontSize: 40, marginRight: 2 }} />;
  };

  // console.log(files.length);

  return (
    <Box
      sx={{ margin: 0, padding: 0, display: "flex", flexDirection: "column" }}
    >
      <Typography variant="body2">Sedmica {newWeek}</Typography>
      <div style={{ display: "flex", gap: 20 }}>
        {/* Dropzone */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            {...getRootProps()}
            sx={{
              margin: 0,
              border: "2px dashed gray",
              padding: 2.5,
              textAlign: "center",
              width: "20vw",
              height: "20vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              "&:hover": {
                cursor: "crosshair",
              },
            }}
          >
            <input {...getInputProps()} />
            <p>Prevuci i otpusti fajlove ovdje ili klikni za dodavanje</p>
          </Box>
          {files.length == 0 && (
            <Button onClick={handleCloseWeek} sx={{ width: "100%" }}>
              Otkaži
            </Button>
          )}
        </Box>
        {/* Kontejner za listu fajlova sa fiksnom visinom i skrolovanjem */}
        <Box
          sx={{
            // display: "grid",
            // gridTemplateColumns:
            //   files.length > 0 ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {files.length > 0 && (
            <>
              <Paper
                // elevation={3}
                sx={{
                  width: "30vw",
                  height: "20vh",
                  overflowY: "auto",
                  // padding: 1,
                  backgroundColor: "transparent",
                }}
              >
                <List>
                  {files.map((file, index) => (
                    <ListItem key={index} sx={{ padding: 0, pl: 1 }}>
                      {getFileIcon(file)}
                      <ListItemText
                        primary={file.name}
                        sx={{ fontSize: "10pt", padding: 0 }}
                        primaryTypographyProps={{ sx: { fontSize: "10pt" } }}
                      />
                      <IconButton onClick={() => removeFile(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Box
                sx={{
                  // display: "grid",
                  // gridTemplateColumns:
                  //   files.length > 0 ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <Button onClick={handleCloseWeek} sx={{ width: "50%" }}>
                  Otkaži
                </Button>

                <Button onClick={handleSaveWeek} sx={{ width: "50%" }}>
                  Sačuvaj
                </Button>
              </Box>
            </>
          )}
        </Box>
      </div>
    </Box>
  );
}
