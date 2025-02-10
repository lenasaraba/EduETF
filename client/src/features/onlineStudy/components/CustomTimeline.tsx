import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import { Material } from "../../../app/models/course";
import { Avatar, Box, IconButton } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import DuoIcon from "@mui/icons-material/Duo";
import DeleteIcon from "@mui/icons-material/Delete";


interface Props {
  materials: Material[];
  showFile: (material: Material) => void;
  handleDelete: (material: Material) => void;
}

export default function CustomTimeline({ materials, showFile, handleDelete }: Props) {
  const getFileIcon = (material: Material) => {
    if (material.materialType.name == "Slika") {
      return (
        <Avatar
          sx={{ width: 20, height: 20 }}
          src={`http://localhost:5000//${material.filePath}`}
        />
      );
    } else if (material.materialType.name == "PDF") {
      return <PictureAsPdfIcon color="error" />;
    } else if (material.materialType.name == "Dokument") {
      return <DescriptionIcon color="primary" />;
    } else if (material.materialType.name == "Video") {
      return <DuoIcon sx={{ color: "primary.main" }} />;
    }
    return <DescriptionIcon />;
  };

  return (
    <Box
      sx={{
        width: "95%",
        maxHeight: "25vh",
        overflowY: "auto",
        overflowX: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <Timeline position="alternate">
        {materials &&
          materials.map((material, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent
                sx={{
                  flex: 1,
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: 1.5,
                }}
                variant="body2"
                color="text.secondary"
              >
                {new Date(material.creationDate).toLocaleDateString("sr-RS", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </TimelineOppositeContent>

              <TimelineSeparator
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <TimelineConnector />
                <TimelineDot
                  sx={{
                    backgroundColor: "transparent",
                    boxShadow: (theme) =>
                      `0px 2px 10px -2px ${theme.palette.text.primary}`,
                  }}
                >
                  {getFileIcon(material)}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>

              <TimelineContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  overflow: "hidden",
                  padding: 1.5,
                }}
              >
                <Typography
                  variant="body1"
                  component="span"
                  sx={{
                    fontSize: "clamp(12px, 2vw, 16px)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    "&:hover": {
                      color: "primary.main",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => showFile(material)}
                >
                  {material.title}
                </Typography>
                <IconButton
                  onClick={() => handleDelete(material)}
                  sx={{ color: "error.main" }}
                >
                  <DeleteIcon />
                </IconButton>
              </TimelineContent>
            </TimelineItem>
          ))}
      </Timeline>
    </Box>
  );
}