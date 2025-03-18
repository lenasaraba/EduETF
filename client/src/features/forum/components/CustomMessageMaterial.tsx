import Typography from "@mui/material/Typography";
import { Box, Divider, useTheme } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline"; 
import { MessageMaterial } from "../../../app/models/theme";

const MaterialComponent = ({
  material,

}: ComponentProps) => {
  const theme = useTheme();

  const renderContent = () => {
    switch (material.materialType.id) {
      case 1:
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
      case 5:
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
      case 2:
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
      case 4:
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
        },
        marginBottom: "16px",
        margin: 2,
        boxSizing: "border-box",
      }}
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
       <a
  href={`http://localhost:5000//${material.filePath}`}
  target="_blank"
  rel="noopener noreferrer"
  style={{
    textDecoration: "none",
    color: "inherit",
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
      color: "primary.main",
      "&:hover": {
        cursor: "pointer",
        color: "primary.dark", 
      },
    }}
  >
    {material.title}
  </Typography>
</a>
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
      
    </Box>
  );
};

interface ComponentProps {
  material: MessageMaterial;
 
}

interface Props {
  materials: MessageMaterial[];
 
}

export default function CustomMessageMaterial({
  materials,
 
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
          <Box key={index} sx={{ margin: 0, padding: 0 }}>
            <MaterialComponent
              key={index}
              material={material}
             
            />
            <Divider sx={{ width: "100%", borderWidth: "1px" }} />
          </Box>
        ))}
    </Box>
  );
}
