import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import logo from "../../assets/etf.png";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import ForumTwoToneIcon from "@mui/icons-material/ForumTwoTone";
import LoginIcon from "@mui/icons-material/Login";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import lightLogo from "../../assets/lightLogo.png";
import darkLogo from "../../assets/darkLogo.png";

export default function HomePage() {
  const { user } = useAppSelector((state) => state.account);
  const theme = useTheme();
  return (
    <>
      <Grid
        container
        sx={{
          flexGrow: 1,
          padding: 2,
          backgroundImage: `url(${logo})`,
          backgroundSize: "contain",
          backgroundPosition: "right",
          height: "100vh",
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
        container
        sx={{
          flexGrow: 1,
          padding: 2,
        }}
      >
        <Grid
          item
          xs={8}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={24}
            sx={{
              borderRadius: "8px",
              backgroundColor: "secondary.main",
              transition: "none",
              boxShadow: (theme) =>
                `0px 0px 20px 14px ${theme.palette.background.paper}`,
            }}
          >
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
                height: "100%",
                padding: 4,
              }}
            >
              <Typography
                variant="caption"
                gutterBottom
                sx={{
                  display: "block",
                  width: "100%",
                  fontFamily: "Raleway, sans-serif",
                  fontSize: 18,
                  lineHeight: "18px",
                  textAlign: "left",
                }}
              >
                Elektrotehnički fakultet
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Raleway, sans-serif",
                  fontSize: 18,
                  textAlign: "left",
                  width: "100%",
                }}
              >
                Istočno Sarajevo
              </Typography>
              <br />
              <Box
                // variant="h1"
                sx={{
                  fontFamily: "Raleway, sans-serif",
                  textAlign: "center",
                  margin: 0,
                  // width: "100%",
                  // fontWeight: 700,
                  // textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                }}
              >
                <img
                  style={{ height: "20vh" }}
                  src={theme.palette.mode == "dark" ? darkLogo : lightLogo}
                />
              </Box>
              <br />
              <Box sx={{ width: "100%", maxWidth: 700 }}>
                <Typography
                  gutterBottom
                  sx={{ fontFamily: "Raleway, sans-serif" }}
                >
                  <SchoolIcon
                    sx={{
                      verticalAlign: "middle",
                      marginRight: 1,
                      marginBottom: 0.5,
                    }}
                  />
                  Dobrodošli u digitalni prostor kreiran za vas, gdje učenje i
                  razmjena ideja postaju jednostavniji i dostupniji nego ikada!
                </Typography>

                <Divider sx={{ color: "text.primary" }}>
                  <Typography
                    variant="overline"
                    gutterBottom
                    sx={{ display: "block", fontFamily: "Raleway, sans-serif" }}
                  >
                    Šta vam nudimo?
                  </Typography>
                </Divider>
                <Typography sx={{ fontFamily: "Raleway, sans-serif" }}>
                  <MenuBookRoundedIcon
                    sx={{
                      verticalAlign: "middle",
                      marginRight: 1,
                      marginBottom: 0.5,
                    }}
                  />
                  Online učenje – Pristupite predavanjima, materijalima i
                  zadacima bilo kada i bilo gdje.
                  <br />
                  <ForumTwoToneIcon
                    sx={{
                      verticalAlign: "middle",
                      marginRight: 1,
                      marginBottom: 0.5,
                    }}
                  />
                  Studentski forum – Povežite se sa kolegama, razmjenjujte
                  ideje, postavljajte pitanja i učite zajedno.
                </Typography>
              </Box>
              <Box>
                {!user && (
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      marginTop:1,
                      padding: 1.5,
                      paddingLeft: 3,
                      paddingRight: 3,
                      borderRadius: 4,
                      color: "background.default",
                      bgcolor: "text.primary",
                      "&:hover": {
                        bgcolor: "primary.main",
                      },
                    }}
                  >
                    Prijavi se &nbsp;
                    <LoginIcon
                      sx={{
                        verticalAlign: "middle",
                        marginRight: 1,
                        marginBottom: 0.5,
                      }}
                    />
                  </Button>
                )}
              </Box>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
