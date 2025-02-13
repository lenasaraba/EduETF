import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Box, Button, IconButton, useColorScheme } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { signOut } from "../../features/account/accountSlice";
import React, { useEffect } from "react";
import NightsStayTwoToneIcon from "@mui/icons-material/NightsStayTwoTone";
import LightModeTwoToneIcon from "@mui/icons-material/LightModeTwoTone";
import MenuIcon from "@mui/icons-material/Menu";
function CustomThemeToggle(): JSX.Element {
  const { mode, setMode } = useColorScheme();

  const toggleTheme = React.useCallback(() => {
    if (setMode) {
      setMode(mode === "light" ? "dark" : "light");
    }
  }, [mode, setMode]);

  return (
    <IconButton
      type="button"
      aria-label="toggle theme"
      onClick={toggleTheme}
      color="inherit"
    >
      {mode !== "light" ? (
        <LightModeTwoToneIcon sx={{ color: "#A59D84" }} />
      ) : (
        <NightsStayTwoToneIcon sx={{ color: "#89a8b2" }} />
      )}
    </IconButton>
  );
}
export default function Layout() {
  // useEffect(() => {
  //   const element = document.querySelector('[aria-label="Expand menu"]');
  //   const currentLabel = element?.getAttribute("aria-label");
  //   console.log(currentLabel);
  //   if (element) {
  //     // element.addEventListener("click", () => {
  //     // currentLabel = element.getAttribute("aria-label");
  //     console.log(currentLabel);
  //     if (currentLabel?.toString() === "Expand menu") {
  //       element.setAttribute("aria-label", "Otvori meni");
  //       console.log(element.ariaLabel?.toString());
  //     }
  //     // });
  //   }
  // }, []);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);
  function sideMenu() {
    return (
      <>
        {user && (
          <Button
            onClick={() => {
              dispatch(signOut());
            }}
          >
            <LogoutIcon />
          </Button>
        )}
        <CustomThemeToggle />
      </>
    );
  }
  return (
    <DashboardLayout
      components={{
        menuButton: (
          <IconButton
            aria-label="Custom label"
            onClick={() => {
              console.log("Menu button clicked!");
              // Dodaj dodatnu logiku ovde, npr. otvaranje menija
            }}
            sx={{
              height: "50px",
              color: "red", // Prilagođavanje boje
              ":hover": { backgroundColor: "secondary.light" }, // Hover efekat
            }}
          >
            {/* Možeš dodati svoju ikonu */}
            <MenuIcon />
          </IconButton>
        ),
      }}
      sx={{
        padding: 0,
      }}
      defaultSidebarCollapsed
      slots={{
        toolbarActions: sideMenu, // Ako ima dodatne akcije u toolbaru
      }}
    >
      {/* <PageContainer> */}
      <Box
        sx={{
          overflowY: "auto",
          height: "100vh",
          display: "flex",
        }}
      >
        <Outlet />
      </Box>

      {/* </PageContainer> */}
    </DashboardLayout>
  );
}
