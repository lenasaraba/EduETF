import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import { Material } from "../../../app/models/course";
import { Avatar } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import DuoIcon from "@mui/icons-material/Duo";

interface Props {
  materials: Material[];
  showFile: (material: Material) => void;
}

export default function CustomTimeline({ materials, showFile }: Props) {
  const getFileIcon = (material: Material) => {
    if (material.materialType.name == "Slika") {
      return <Avatar src={`http://localhost:5000//${material.filePath}`} />;
    } else if (material.materialType.name == "PDF") {
      return <PictureAsPdfIcon color="error" />;
    } else if (material.materialType.name == "Dokument") {
      return <DescriptionIcon color="primary" />;
    } else if (material.materialType.name == "Video") {
      // console.log(file);
      return <DuoIcon sx={{ color: "primary.main" }} />;
    }
    return <DescriptionIcon />;
  };

  return (
    <Timeline position="alternate" sx={{ width: "inherit" }}>
      {materials &&
        materials.map((material, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent
              sx={{
                flex: 1, // Omogućava da zauzima istu širinu kao TimelineContent
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
                flex: 1, // Ista širina kao TimelineOppositeContent
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
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
                onClick={() =>
                  // setFileVisible((prev) => !prev)
                  showFile(material)
                }
              >
                {material.title}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
    </Timeline>
  );
}
