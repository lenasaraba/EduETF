import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchThemesAsync, resetThemesParams } from "./themeSlice";
import { Fragment, useEffect } from "react";
import ThemeCard from "./components/ThemeCard";
import ThemeCard2 from "./components/ThemeCard2";
import forum from "../../assets/forum.png";
import ForumAppBar from "./components/ForumAppBar";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

export default function ForumPage() {
  const user = useAppSelector((state) => state.account.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(resetThemesParams());
    dispatch(fetchThemesAsync());
  }, [dispatch]);

  const { themes, themesLoaded, status } = useAppSelector(
    (state) => state.theme
  );
  //POGLEDATI KURS I RADITI SVE STO SE TICE UPLOADA, I NA KURS I NA FORUM

  //DODATI MOZDA UPLOAD FAJLOVA U PORUKU NA FORUMU,
  // KAO AKO IMAJU NEKO PITANJE ZA NEKI FAJL

  const newArray = [...(themes || [])];
  const topThemes = newArray
    ?.sort((a, b) => b.messages.length - a.messages.length)
    .slice(0, 7);
  const firstFourThemes = topThemes.slice(0, 4);
  const lastThreeThemes = topThemes.slice(-3);

  // if (!themesLoaded || status.includes("pending"))
  //   return <LoadingComponent message="Učitavanje tema..." />;
  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          direction: "column",
          position: "relative",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: 0,
            paddingX: 10,
            paddingY: 3,
          }}
        >
          <ForumAppBar />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              margin: 0,
              padding: 0,
            }}
          >
            <div>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "Raleway, sans-serif",
                  marginY: 4,
                  fontWeight: "bolder",
                  color: "primary.main",
                }}
              >
                Studentski forum
              </Typography>
              <Box
                sx={{
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontFamily: "Raleway, sans-serif" }}>
                  Postavljajte pitanja ili potražite temu koja vam je potrebna.
                </Typography>
                {user && (
                  <Button
                    component={Link}
                    to="/createTheme"
                    sx={{
                      backgroundColor: "primary.dark",
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "20px",
                      "&:hover": {
                        backgroundColor: "primary.light",
                      },
                      height: "fit-content",
                      width: "3rem",
                      boxSizing: "border-box",
                    }}
                  >
                    <AddIcon sx={{ fontSize: "16pt" }} />
                  </Button>
                )}
              </Box>
            </div>

            {status == "pendingFetchThemes" ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "20vh",
                  width: "100%",
                  margin: 0,
                  padding: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: "primary.main" }}
                >
                  Učitavanje tema
                </Typography>
                <CircularProgress size={120} sx={{ color: "primary.main" }} />
              </Box>
            ) : (
              <>
                <Box
                  component="fieldset"
                  sx={{
                    border: "1px solid",
                    px: 0,
                    width: "100%",
                    padding: 0,
                    py: 4,
                    borderRadius: "20px",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    component="legend"
                    sx={{ textAlign: "center", color: "text.primary" }}
                  >
                    NAJPOPULARNIJE
                  </Box>
                  <Grid container columns={12} sx={{ mb: 4, px: 4 }}>
                    {firstFourThemes.map((theme, index) =>
                      index < 2 ? (
                        <Fragment key={index}>
                          <Grid item xs={6} md={3}>
                            <ThemeCard2 theme={theme} key={index} />
                          </Grid>

                          <Grid
                            item
                            xs={6}
                            md={3}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={forum}
                              style={{ width: "70px", height: "auto" }}
                            />
                          </Grid>
                        </Fragment>
                      ) : (
                        <Fragment key={index}>
                          <Grid
                            item
                            xs={6}
                            md={3}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={forum}
                              style={{ width: "70px", height: "auto" }}
                            />
                          </Grid>

                          <Grid item xs={6} md={3} sx={{}}>
                            <ThemeCard2 theme={theme} key={index} />
                          </Grid>
                        </Fragment>
                      )
                    )}
                  </Grid>
                  <Divider sx={{ color: "text.primary", width: "100%", px: 8 }}>
                    <Typography
                      variant="overline"
                      gutterBottom
                      sx={{
                        display: "block",
                        fontFamily: "Raleway, sans-serif",
                      }}
                    >
                      Najnovije
                    </Typography>
                  </Divider>

                  <Grid container columns={12} sx={{ mt: 0, px: 2 }}>
                    {lastThreeThemes?.map((theme, index) => (
                      <Grid item xs={12} md={4} key={theme.id} sx={{ px: 2 }}>
                        <ThemeCard theme={theme} key={index} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
