import { CssVarsProvider } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import { Typography, Divider } from "@mui/joy";
import SchoolIcon from "@mui/icons-material/School";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { Link } from "react-router-dom";
import { Breadcrumbs, Grid, useTheme } from "@mui/material";
import ProfessorsTable from "./components/ProfessorsTable";

export default function Professors() {
  const theme = useTheme();
  return (
    <CssVarsProvider disableTransitionOnChange>
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
            paddingX: 10,
            paddingY: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="small" />}
              sx={{ pl: 0 }}
            >
              <Box
                component={Link}
                to="/onlineStudy"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <SchoolIcon
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: "1.5rem",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2)",
                      color: theme.palette.primary.dark, 
                    },
                  }}
                />
              </Box>

              <Typography
                component={Typography}
                color="neutral"
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  "&:hover": {
                    color: theme.palette.primary.dark, 
                  },
                  fontFamily: "Raleway, sans-serif",
                }}
              >
                Svi profesori
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
              sx={{
                fontFamily: "Raleway, sans-serif",
                fontWeight: "bolder",
                color: theme.palette.primary.main,
                fontSize: "3.75rem",
              }}
            >
              Profesori
            </Typography>
          </div>
          <Divider sx={{ marginBottom: 4 }} />

          <ProfessorsTable themeM={theme} />
        </Grid>
      </Grid>
    </CssVarsProvider>
  );
}
