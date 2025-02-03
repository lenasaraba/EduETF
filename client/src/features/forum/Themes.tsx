import { CssVarsProvider } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
// import Breadcrumbs from "@mui/joy/Breadcrumbs";
import { Typography, Divider, Button } from "@mui/joy";
import ForumIcon from "@mui/icons-material/Forum";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { Link, useSearchParams } from "react-router-dom";
import ThemeTable from "./components/ThemeTable";
import { Breadcrumbs, Grid, useTheme } from "@mui/material";
import { useAppSelector } from "../../app/store/configureStore";
import ThemeList from "./components/ThemeList";
import WaveAnimation from "./components/WaveAnimation";

// import ThemeList from "./components/ThemeList";

export default function Themes() {
  // const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const themesType = searchParams.get("type");
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.account);

  return (
    <CssVarsProvider disableTransitionOnChange>
      {/* <CssBaseline /> */}
      <Grid
        container
        sx={{
          display: "block",
          direction: "column",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: 0,
            // my: 16,
            paddingX: 10,
            paddingY: 3,
            // gap: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              // size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="small" />}
              sx={{ pl: 0 }}
            >
              <Box
                component={Link}
                to="/forum"
                sx={{ display: "flex", alignItems: "center" }}
                // onClick={() => dispatch(resetThemesParams())}
              >
                <ForumIcon
                  sx={{
                    color: theme.palette.text.primary,
                    // fontWeight: "bold",
                    fontSize: "1.5rem",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2)",
                      color: theme.palette.primary.dark, // Promijeni boju na hover
                    },
                  }}
                />
              </Box>

              {/* </Link> */}
              <Typography
                component={Typography}
                color="neutral"
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  "&:hover": {
                    color: theme.palette.primary.dark, // Promijeni boju na hover
                  },
                  fontFamily: "Raleway, sans-serif",
                }}
              >
                {themesType === "my" ? "Moje teme" : "Sve teme"}
              </Typography>
            </Breadcrumbs>
          </Box>
          <div
            style={{
              marginTop: "32px",
              marginBottom: "32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              level="h2"
              // gutterBottom
              sx={{
                fontFamily: "Raleway, sans-serif",
                // marginY: 4,
                fontWeight: "bolder",
                color: theme.palette.primary.main,
                fontSize: "3.75rem",
              }}
            >
              Teme
            </Typography>
            {user && (
              <Button
                component={Link}
                to="/createTheme"
                //onClick={handleOpen}
                sx={{
                  backgroundColor: theme.palette.primary.dark,
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "20px",
                  // fontSize: "30px",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                  },
                  height: "fit-content",
                  width: "3rem",
                  boxSizing: "border-box",
                }}
              >
                <AddIcon sx={{ fontSize: "16pt" }} />
              </Button>
            )}
          </div>
          <Divider sx={{ marginBottom: 4 }} />

          <ThemeTable themeM={theme} />
          {/* <ThemeList /> */}
          {/* OVO SE NE PRIKAZUJE NA LAPTOPU, ALI FINO IZGLEDA, POGLEDATI */}
          {/* <WaveAnimation /> */}
        </Grid>
      </Grid>
    </CssVarsProvider>
  );
}
