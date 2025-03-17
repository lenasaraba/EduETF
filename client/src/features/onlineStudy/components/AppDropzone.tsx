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
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import DuoIcon from "@mui/icons-material/Duo";
import { FieldValues, UseControllerProps } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useAppSelector } from "../../../app/store/configureStore";

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
const status=useAppSelector((state)=>state.course.status)
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setSelectedFiles([...files, ...acceptedFiles]);

      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "image/*": [],
      "video/mp4": [".mp4"],
    },
    multiple: true,
  });

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
      return (
        <DuoIcon sx={{ fontSize: 30, marginRight: 2, color: "primary.main" }} />
      );
    }
    return <DescriptionIcon sx={{ fontSize: 40, marginRight: 2 }} />;
  };

  return (
    <Box
      sx={{
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 2, 
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: "bold", color: "text.secondary" }}
      >
        Sedmica {newWeek}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3, 
          flexDirection: { xs: "column", sm: "row" }, 
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1, 
          }}
        >
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed",
              borderColor: "primary.main",
              borderRadius: 2,
              padding: 3,
              textAlign: "center",
              height: "30vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1,
              backgroundColor: "action.hover",
              "&:hover": {
                cursor: "pointer",
                borderColor: "primary.dark",
                backgroundColor: "action.selected",
              },
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Prevuci i otpusti fajlove ovdje
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              ili klikni za dodavanje
            </Typography>
          </Box>

          {files.length === 0 && (
            <Button
              onClick={handleCloseWeek}
              sx={{
                width: "100%",
                mt: 2,
                backgroundColor: "error.light",
                "&:hover": {
                  backgroundColor: "error.main",
                },
              }}
              variant="contained"
            >
              Otkaži
            </Button>
          )}
        </Box>

        {files.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // flex: 1, // Prilagodljiva širina
              gap: 2,
            }}
          >
            <Paper
              sx={{
                width: "100%",
                height: "30vh",
                overflowY: "auto",
                backgroundColor: "background.paper",
                boxShadow: 1,
                borderRadius: 2,
              }}
            >
              <List>
                {files.map((file, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      padding: 1,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    {getFileIcon(file)}

                    <ListItemText
                      primary={file.name}
                      sx={{ fontSize: "10pt", ml: 1 }}
                      primaryTypographyProps={{ sx: { fontSize: "10pt", wordBreak:"break-word" } }}
                    />

                    <IconButton
                      onClick={() => removeFile(index)}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Dugmad "Otkaži" i "Sačuvaj" */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Button
                onClick={handleCloseWeek}
                sx={{
                  flex: 1,
                  backgroundColor: "error.light",
                  "&:hover": {
                    backgroundColor: "error.main",
                  },
                }}
                variant="contained"
              >
                Otkaži
              </Button>
              <LoadingButton
                loading={status == "pendingUploadMaterial"}
                onClick={handleSaveWeek}
                sx={{
                  flex: 1,
                  backgroundColor: "success.light",
                  "&:hover": {
                    backgroundColor: "success.main",
                  },
                }}
                variant="contained"
                loadingIndicator={
                  <CircularProgress size={18} sx={{ color: "white" }} /> 
                }
              >
                Sačuvaj
              </LoadingButton>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
