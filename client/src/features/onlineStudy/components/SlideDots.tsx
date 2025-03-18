import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

interface SlideDotsProps {
  programs: string[]; 
}

export default function SlideDots({ programs }: SlideDotsProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (programs.length > 0)
    return (
      <>
        <Typography
          variant="caption"
          fontFamily="Raleway, sans-serif"
          sx={{ display: "block", textAlign: "center" }}
        >
          Aktivni smjerovi profesora
        </Typography>
        <div style={{ margin: "0", padding: 0 }}>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            color="primary.main"
            fontFamily="Raleway, sans-serif"
          >
            {programs[activeStep]}
          </Typography>

          <MobileStepper
            variant="dots"
            steps={programs.length}
            position="static"
            activeStep={activeStep}
            sx={{ flexGrow: 1, padding: 0, color: "common.onBackground" }}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === programs.length - 1}
                sx={{ color: "common.onBackground" }}
              >
                Sljedeća
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
                sx={{ color: "common.onBackground" }}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Prethodna
              </Button>
            }
          />
        </div>
      </>
    );
  else return <></>;
}
