import {
  Backdrop,
  Box,
  CircularProgress,
  extendTheme,
  Typography,
} from "@mui/material";

interface Props {
  message?: string;
}

export default function LoadingComponent({ message = "Loading..." }: Props) {
  const theme = extendTheme({
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: "'Raleway', sans-serif",
          },
        },
      },
    },
    colorSchemes: {
      light: {
        palette: {
          text: {
            primary: "#2e3b4e",
            secondary: "#556070",
            disabled: "#a0aab4",
            primaryChannel: "#9EDF9C",
            secondaryChannel: "#D84040",
          },
          action: {
            active: "#5a7d9a",
            hover: "#f0f4f8",
            disabled: "#c7d0d9",
            disabledBackground: "#e9eef2",
            focus: "#D0E8F2",
          },
          background: {
            default: "#f7f9fc",
            paper: "#e3edf5",
          },
          divider: "#e3edf5",
          primary: { main: "#89a8b2" },
          secondary: { main: "#c4d4e180" },
          common: {
            background: "#d9ebf4",
            white: "#334b5e",
            black: "#1a2b3c",
            onBackground: "#6b8ca1",
            backgroundChannel: "#c4dae6",
          },
          Tooltip: {
            bg: "#89a8b2",
          },
        },
      },

      dark: {
        palette: {
          text: {
            primary: "#DCD7C9", // Osvetljeniji tekst na tamnoj pozadini
            secondary: "#A0B1A8", // Neutralniji sekundarni tekst
            disabled: "#6c859d", // Osvetljeni onemogućeni tekst
            primaryChannel: "#3A7D44", // Smanjena zelena za kanale
            secondaryChannel: "#D04B47", // Crvena, zadržana
          },
          action: {
            active: "#A2B7B0", // Neutralnija nijansa za aktivne elemente
            hover: "#1B2422", // Duboki kontrast za hover efekat
            disabled: "#6c859d", // Osvetljeniji za onemogućene elemente
            disabledBackground: "#B5BCC5", // Pozadina za onemogućene
            focus: "#5E6E43", // Fokus sa toplijom nijansom
          },
          background: {
            default: "#0f100f", // Zadržana tvoja tamna pozadina
            paper: "#2C3639", // Zadržana tvoja boja za `paper`
          },
          divider: "#3D4A4F", // Tamna linija razdvajanja sa kontrastom
          primary: {
            main: "#A59D84", // Topla, neutralna primarna boja
          },
          secondary: { main: "#1B242280" }, // Tamna, poluprovidna sekundarna boja
          common: {
            background: "#3D655D", // Pozadina poruka, sa toplinom
            white: "#F1F1F1", // Svetli tekst na tamnim pozadinama
            black: "#1A2B3C", // Suptilni crni za istaknute elemente
            onBackground: "#7E99A3", // Osvetljeni tekst na pozadini
            backgroundChannel: "#5E4B2F", // Topla pozadina za kanale
          },
          Tooltip: {
            bg: "#8E8C5F", // Osvetljeni, zlatni Tooltip
          },
        },
      },
    },
    colorSchemeSelector: "class",
    defaultColorScheme: localStorage.getItem("toolpad-mode")
      ? localStorage.getItem("toolpad-mode")?.toString() == "light"
        ? "light"
        : "dark"
      : "dark",
  });
  return (
    <Backdrop
      open={true}
      invisible={true}
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress
          size={100}
          sx={{ color: theme.palette.text.secondary }}
        ></CircularProgress>
        <Typography
          variant="h4"
          sx={{
            justifyContent: "center",
            position: "fixed",
            top: "60%",
            fontFamily: "Raleway, sans-serif",
          }}
        >
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
}
