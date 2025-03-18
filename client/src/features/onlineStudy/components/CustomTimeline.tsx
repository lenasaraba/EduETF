import Typography from "@mui/material/Typography";
import { Material } from "../../../app/models/course";
import { Box, Divider, IconButton, useTheme } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";

import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline"; 

const MaterialComponent = ({
  material,
  showFile,
  handleDelete,
  isEditing,
}: ComponentProps) => {
  const theme = useTheme();

  const renderContent = () => {
    switch (material.materialType.name) {
      case "Video":
        return (
          <Box
            sx={{
              width: "150px", 
              height: "100%",
              background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.dark} 90%)`,
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PlayCircleOutlineIcon
              sx={{
                fontSize: 64,
                color: "white",
                opacity: 0.8,
                "&:hover": {
                  opacity: 1,
                },
              }}
            />
          </Box>
        );
      case "Slika":
        return (
          <img
            src={`http://localhost:5000/${material.filePath}`}
            alt={material.title}
            style={{
              width: "150px", 
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        );
      case "PDF":
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "150px", 
              height: "100%",
              backgroundColor: theme.palette.primary.dark,
              borderRadius: "8px",
              
            }}
            
          >
            <PictureAsPdfIcon sx={{ fontSize: 48, color: "text.primary" }} />
          </Box>
        );
      case "Dokument":
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "150px",
              height: "100%",
              backgroundColor: theme.palette.primary.dark,
              borderRadius: "8px",
            }}
          >
            <DescriptionIcon sx={{ fontSize: 48, color: "primary.light" }} />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "15vh",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: 2,
        "&:hover": {
          boxShadow: 6,
          cursor: "pointer",
        },
        marginBottom: "16px", 
        margin: 2,
        boxSizing: "border-box",
      }}
      onClick={() => {showFile(material)}}
    >
      {renderContent()}
      <Box
        sx={{
          flex: 1, 
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "8px",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, 
            WebkitBoxOrient: "vertical",
          }}
        >
          {material.title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            whiteSpace: "normal", 
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, 
            WebkitBoxOrient: "vertical",
          }}
        >
          {new Date(material.creationDate).toLocaleDateString("sr-RS", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Typography>
      </Box>
      {isEditing && (
        <IconButton
          sx={{
            alignSelf: "center",
            color: "error.main",
          }}
          onClick={(e) => {
            e.stopPropagation(); 
            handleDelete(material);
          }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

interface ComponentProps {
  material: Material;
  showFile: (material: Material) => void;
  handleDelete: (material: Material) => void;
  isEditing: boolean;
}

interface Props {
  materials: Material[];
  showFile: (material: Material) => void;
  handleDelete: (material: Material) => void;
  isEditing: boolean;
}

export default function CustomTimeline({
  materials,
  showFile,
  handleDelete,
  isEditing,
}: Props) {

  return (
    <Box
      sx={{
        width: "95%",
        overflowX: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {materials &&
        materials.map((material, index) => (
          <Box key={index} sx={{margin:0, padding:0}}>
            <MaterialComponent
              material={material}
              showFile={showFile}
              handleDelete={handleDelete}
              isEditing={isEditing}
            />
            <Divider sx={{ width: "100%", borderWidth:"1px" }} />
          </Box>
        ))}
    </Box>
  );
}
