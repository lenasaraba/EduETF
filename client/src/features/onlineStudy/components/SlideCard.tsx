import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Course } from "../../../app/models/course";
import { Grid } from "@mui/material";
import CourseCardMedia from "./CourseCardMedia";
import { Link } from "react-router-dom";

interface SlideCardProps {
  courses: Course[]; // Lista studijskih programa
}

export default function SlideCard({ courses }: SlideCardProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (courses[activeStep] != null)
    return (
      <div style={{ margin: "0", padding: 0 }}>
        <Grid
          sx={{
            gridTemplateColumns: "1fr 2fr", // Leva kolona (slika) će zauzeti 1fr, a desna (tekst) 2fr
            display: "grid",
            gap: 2, // Razmak između kolona
            width: "100%", // Osigurava da grid zauzima celu širinu roditeljskog kontejnera
            mb: 3,
          }}
        >
          <CourseCardMedia
            year={courses[activeStep].year}
            studyProgram={courses[activeStep].studyProgram}
            sx={{
              height: "100px", // Visina slike
              borderRadius: "25pt",
              objectFit: "cover", // Održava proporcije slike
            }}
          />
          <Grid
            sx={{
              display: "grid",
              gridTemplateRows: "1fr 1fr 1fr", // Svaka linija unutar grida zauzima 1fr
              gap: 0.5, // Razmak između redova
            }}
          >
            <Typography
              component={Link}
              to={`/courses/${courses[activeStep].id}`}
              sx={{
                width: "fit-content",
                // whiteSpace: "nowrap", // Sprečava prelamanje linije
                overflow: "hidden", // Sakriva tekst koji ne stane
                textOverflow: "ellipsis", // Dodaje "..." kada tekst ne stane
                fontSize: "clamp(0.8rem, 1.8vw, 1.2rem)", // Dinamički menja veličinu fonta u zavisnosti od širine ekrana
                fontFamily: "Raleway, sans-serif",
                textDecoration: "none",
                color: "text.primary",
                fontWeight:"normal",


                // backgroundColor: "red",
                display: "-webkit-box", // Neophodno za multi-line truncation
                WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
                lineHeight: "1", // Podešava razmak između linija
                height: "1em", // Fiksna visina: broj linija * lineHeight
                "&:hover":{
                  color:"primary.main", 
                  fontWeight:"bolder",
                }
              }}
            >
              {courses[activeStep].name}
            </Typography>

            <Typography
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "clamp(0.6rem,1.5vw, 1rem)",
                fontFamily: "Raleway, sans-serif",
              }}
            >
              {courses[activeStep].description}
            </Typography>

            <Typography
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "clamp(0.5rem, 1vw, 1rem)",
                fontFamily: "Raleway, sans-serif",
                color: "primary.main",
              }}
            >
              {courses[activeStep].studyProgram.name} &nbsp; | &nbsp;{" "}
              {courses[activeStep].year.name}
            </Typography>
          </Grid>
        </Grid>

        {/* <Typography 
        variant="h6" 
        align="center" 
        gutterBottom
      >
        {courses[activeStep].name}
      </Typography> */}

        <MobileStepper
          variant="text"
          steps={courses.length}
          position="static"
          activeStep={activeStep}
          sx={{
            flexGrow: 1,
            padding: 0,
            "& .MuiMobileStepper-dot": {
              backgroundColor: "background.paper", // Neaktivne tačkice
            },
            "& .MuiMobileStepper-dotActive": {
              backgroundColor: "common.black", // Aktivna tačkica
            },
          }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === courses.length - 1}
              sx={{ color: "common.black" }}
            >
              Sljedeći
              {theme.direction === "rtl" ? (
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
              sx={{ color: "common.black" }}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Prethodni
            </Button>
          }
        />
      </div>
    );
  else
    return (
      <Typography fontFamily="Raleway, sans-serif" textAlign="center">
        Nema kurseva za ovog profesora
      </Typography>
    );
}
