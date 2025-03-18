import {
  Backdrop,
  Box,
  extendTheme,
  keyframes,
} from "@mui/material";

import lightLogo from "../../assets/lightLogo.png";
import darkLogo from "../../assets/darkLogo.png";



export default function LoadingComponent() {
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
            primary: "#DCD7C9", 
            secondary: "#A0B1A8", 
            disabled: "#6c859d",
            primaryChannel: "#3A7D44",
            secondaryChannel: "#D04B47", 
          },

          action: {
            active: "#A2B7B0", 

            hover: "#5A524699", 
            disabled: "#4A525880", 
            disabledBackground: "#2E333666", 
            focus: "#75655499",
          },

          
          background: {
            default: "#0f100f", 
            paper: "#2C3639", 
          },
          divider: "#3D4A4F",
          primary: {
            main: "#A59D84",
          },
          secondary: { main: "#1B242280" }, 
          common: {
            background: "#3D655D", 
            white: "#F1F1F1", 
            black: "#1A2B3C",
            onBackground: "#7E99A3", 
            backgroundChannel: "#5E4B2F", 
          },
          Tooltip: {
            bg: "#8E8C5F", 
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
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        height="100vh"
      >
        <Box
          component="img"
          src={theme.palette.mode == "dark" ? darkLogo : lightLogo} 
          sx={{
            height: "20vh",
            animation: `${pulseAnimation} 1.5s infinite ease-in-out`,
          }}
        />
      </Box>
    </Backdrop>
  );
}
