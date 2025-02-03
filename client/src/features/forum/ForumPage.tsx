import { Box, Button, Divider, Grid, Typography } from "@mui/material";
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
  // const methods = useForm({
  //   mode: "all",
  //   resolver: yupResolver(validationSchema(true)),
  // });
  //OVO TRUE SAM DODALA DA NE CRVENI

    const user = useAppSelector((state) => state.account.user);
  

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(resetThemesParams());
    dispatch(fetchThemesAsync());
  }, [dispatch]);

  const { themes, themesLoaded, status } = useAppSelector(
    (state) => state.theme
  );
  // const [open, setOpen] = useState(false);

  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false); // Zatvori modal

  //POGLEDATI KURS I RADITI SVE STO SE TICE UPLOADA, I NA KURS I NA FORUM

  //DODATI MOZDA UPLOAD FAJLOVA U PORUKU NA FORUMU,
  // KAO AKO IMAJU NEKO PITANJE ZA NEKI FAJL

  // const themeApp = useTheme();
  const newArray = [...(themes || [])];
  const topThemes = newArray
    ?.sort((a, b) => b.messages.length - a.messages.length) // Sortiraj prema broju poruka opadajuće
    .slice(0, 7);
  const firstFourThemes = topThemes.slice(0, 4); // Prvih 4 elementa
  const lastThreeThemes = topThemes.slice(-3);

  if (!themesLoaded || status.includes("pending"))
    return <LoadingComponent message="Učitavanje tema..." />;
  return (
    // <FormProvider {...methods}>
    <>
      <Grid
        container
        sx={{
          display: "flex",
          direction: "column",
          position: "relative",
          alignItems: "center",
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
                // gutterBottom
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
                //onClick={handleOpen}
                sx={{
                  backgroundColor: "primary.dark",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "20px",
                  // fontSize: "30px",
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

            <Box
              component="fieldset"
              sx={{
                border: "1px solid",
                px: 0,
                // margin: 4,
                width: "100%",
                // mb: 4,
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
                  sx={{ display: "block", fontFamily: "Raleway, sans-serif" }}
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

            {/* <Box
              sx={{
                px: 0,
                margin: 0,
                width: "100%",

                padding: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="button" sx={{ mb: 4 }}>
                ILI
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Raleway, sans-serif",
                  color: "text.primary",
                  marginBottom: 4,
                }}
              >
                Želite započeti svoju temu? Kliknite dugme ispod!
              </Typography>
              <Typography
                variant="button"
                component={Link}
                to="/createTheme"
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "20px",
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  textDecoration: "none",
                }}
              >
                Započni svoju temu
              </Typography>
            </Box> */}


          </Box>
        </Grid>
      </Grid>
    </>
    // </FormProvider>
  );
}
