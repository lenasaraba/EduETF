import {
  Backdrop,
  Box,
  CircularProgress,
  extendTheme,
  keyframes,
  Typography,
} from "@mui/material";

import lightLogo from "../../assets/lightLogo.png";
import darkLogo from "../../assets/darkLogo.png";

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

            hover: "#5A524699", // 60% providnosti (99 u heksadecimalnom formatu)
            disabled: "#4A525880", // 50% providnosti (80)
            disabledBackground: "#2E333666", // 40% providnosti (66)
            focus: "#75655499",
          },

          // action: {
          //   active: "#A2B7B0", // Neutralnija nijansa za aktivne elemente
          //   hover: "#1B2422", // Duboki kontrast za hover efekat
          //   disabled: "#6c859d", // Osvetljeniji za onemogućene elemente
          //   disabledBackground: "#B5BCC5", // Pozadina za onemogućene
          //   focus: "#5E6E43", // Fokus sa toplijom nijansom
          // },
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
    defaultColorScheme:
      localStorage.getItem("toolpad-mode")?.toString() == "light"
        ? "light"
        : "dark",
  });

  // Definiši keyframes animaciju za pulsiranje
  const pulseAnimation = keyframes`
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(0.8); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  `;

  return (
    <Backdrop
      open={true}
      invisible={true}
      sx={{
        backgroundColor: theme.palette.background.default,
        // color: "#A59D84",
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        height="100vh"
      >
        {/* Animirani logo */}
        <Box
          component="img"
          src={theme.palette.mode == "dark" ? darkLogo : lightLogo} // Možeš dodati uslov za tamni mod ako treba
          sx={{
            height: "20vh",
            animation: `${pulseAnimation} 1.5s infinite ease-in-out`,
          }}
        />
      </Box>
    </Backdrop>
  );
}
