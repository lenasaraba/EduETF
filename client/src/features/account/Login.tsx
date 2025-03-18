
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { Grid, useTheme } from "@mui/material"; 
import logo from "../../assets/etf.png";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import Alert from "@mui/material/Alert";
import lightLogo from "../../assets/lightLogo.png";
import darkLogo from "../../assets/darkLogo.png";

const Card = styled(MuiCard)(() => ({
  display: "flex",
  borderRadius: 10,
  flexDirection: "column",
  width: "100%",
  padding: "3rem",
  maxWidth: "550px",
  backgroundColor: "background.paper", 
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", 
  marginLeft: "2rem", 
}));

export default function Login() {
  const theme = useTheme(); 

  return (
    <>
      <CssBaseline />

      <Grid
        container
        sx={{
          flexGrow: 1,
          backgroundImage: `url(${logo})`,
          backgroundSize: "contain",
          backgroundPosition: "right",
          width: "100%",
          filter: "blur(8px)",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: 0,
          bottom: 0,
          zIndex: -1,
        }}
      ></Grid>

      <Grid
        sx={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <Alert
          severity="info"
          variant="filled"
          sx={{
            color: "text.primary",
            backgroundColor: "background.paper",
            opacity: "80%",
            fontFamily: "Raleway, sans-serif",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            width: "100%",
          }}
        >
          Za prijavu koristite Microsoft nalog koji vam je dodijeljen od strane
          fakulteta.
        </Alert>
        <Card
          variant="outlined"
          sx={{
            p: 6,
            borderRadius: "16px", 
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)", 
            border: "1px solid rgba(0, 0, 0, 0.12)",
            ml: 15, 
            width: "40vw", 
            maxWidth: "40vw", 
            backgroundColor: "background.paper", 
            backdropFilter: "blur(8px)", 
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <img
              style={{
                height: "12vh",
                opacity: 0.9,
                filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
              }}
              src={theme.palette.mode === "dark" ? darkLogo : lightLogo}
              alt="Logo"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4, 
            }}
          >
            <Button
              variant="contained"
              onClick={() =>
                (window.location.href =
                  "http://localhost:5000/api/account/login")
              }
              startIcon={<MicrosoftIcon />}
              sx={{
                padding: "12px 28px", 
                fontSize: "1.1rem",
                fontWeight: 600, 
                borderRadius: "12px", 
                textTransform: "none",
                backgroundColor: "primary.main",
                color: "text.primary", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", 
                transition: "all 0.3s ease", 
                "&:hover": {
                  backgroundColor: "primary.dark",
                  transform: "translateY(-2px)", 
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                },
                "&:active": {
                  transform: "translateY(0)", 
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", 
                },
              }}
            >
              Prijavi se putem Microsofta
            </Button>
          </Box>
        </Card>
      </Grid>
    </>
  );
}
