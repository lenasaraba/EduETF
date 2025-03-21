import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Box, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { Theme } from "../../../app/models/course";

interface SlideCardProps {
  themes: Theme[];
}

export default function SlideCardThemes({ themes }: SlideCardProps) {
  const designTheme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (themes[activeStep] != null)
    return (
      <Box
        sx={{
          margin: 0,
          padding: 1,
          border: "1px solid",
          width: "100%",
          borderRadius: "20pt",
          borderColor: themes[activeStep].active ? "primary.main" : "gray",
          boxShadow: 3,
          backgroundColor: "secondary.main",
        }}
      >
        <Grid
          sx={{
            width: "100%",
            mb: 2,
            mt: 2,
            paddingX: 2,
          }}
        >
          <Grid
            sx={{
              display: "grid",
              gridTemplateRows: "1fr 1fr 1fr",
              padding: 0,
            }}
          >
            <Typography
              component={Link}
              variant="body1"
              to={`/forum/${themes[activeStep].id}`}
              sx={{
                width: "fit-content",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "clamp(11pt, 13pt, 15pt)",
                fontFamily: "Raleway, sans-serif",
                textDecoration: "none",
                color: "primary.light",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                lineHeight: "1",
                height: "1em",
                "&:hover": {
                  color: "primary.main",
                },
                fontWeight: "bolder",
              }}
            >
              {themes[activeStep].title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "clamp(8pt, 10pt, 12pt)",
                fontFamily: "Raleway, sans-serif",
              }}
            >
              {themes[activeStep].description}
            </Typography>

            <Box
              sx={{
                margin: 0,
                padding: 0,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "clamp(8pt, 10pt, 12pt)",
                  fontFamily: "Raleway, sans-serif",
                  color: "primary.main",
                }}
              >
                {new Date(themes[activeStep].date).toLocaleDateString("sr-RS")}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <MobileStepper
          variant="text"
          steps={themes.length}
          position="static"
          activeStep={activeStep}
          sx={{
            flexGrow: 1,
            padding: 0,
            backgroundColor: "transparent",

            "& .MuiMobileStepper-dot": {
              backgroundColor: "background.paper",
            },
            "& .MuiMobileStepper-dotActive": {
              backgroundColor: "common.black",
            },
          }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === themes.length - 1}
              sx={{ color: "primary.dark", fontSize: "clamp(6pt, 8pt, 10pt)" }}
            >
              Sljedeća
              {designTheme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ color: "primary.dark", fontSize: "clamp(6pt, 8pt, 10pt)" }}
            >
              {designTheme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Prethodna
            </Button>
          }
        />
      </Box>
    );
  else
    return (
      <Typography fontFamily="Raleway, sans-serif" textAlign="center">
        Ne postoje teme na forumu za ovaj kurs.
      </Typography>
    );
}
