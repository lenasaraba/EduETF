import { Outlet, useNavigate } from "react-router-dom";
import {
  DashboardLayout,
  SidebarFooterProps,
} from "@toolpad/core/DashboardLayout";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useColorScheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { signOut } from "../../features/account/accountSlice";
import React, { useEffect, useMemo, useState } from "react";
import NightsStayTwoToneIcon from "@mui/icons-material/NightsStayTwoTone";
import LightModeTwoToneIcon from "@mui/icons-material/LightModeTwoTone";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";

import { useBranding } from "./BrandingContext";
import lightLogo from "../../assets/lightLogo.png";
import darkLogo from "../../assets/darkLogo.png";
import {
  AccountPreviewProps,
  AccountPreview,
  Account,
  Session,
  AccountPopoverFooter,
  SignOutButton,
} from "@toolpad/core";
import { Login } from "@mui/icons-material";

function CustomThemeToggle(): JSX.Element {
  const { branding, setBranding } = useBranding();

  const { mode, setMode } = useColorScheme();
  const BRANDINGL = {
    title: "",
    logo: <img src={lightLogo} />,
  };

  const BRANDINGD = {
    title: "",
    logo: <img src={darkLogo} />,
  };

  const toggleTheme = React.useCallback(() => {
    if (setMode) {
      setBranding(mode === "light" ? BRANDINGD : BRANDINGL);
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.account);

  // function AccountSidebarPreview(mini: boolean) {
  //   //const { handleClick, open, mini, slotProps } = props;
  //   // const updatedSlotProps = {
  //   //   ...slotProps,
  //   //   moreIconButton: {
  //   //     ...slotProps?.moreIconButton,
  //   //     sx: {
  //   //       ...(slotProps?.moreIconButton?.sx || {}),
  //   //       backgroundColor: "red",
  //   //       padding: "10px",
  //   //       display: "block",
  //   //     },
  //   //     icon: CustomLogOutButton, // Tvoja nova ikonica
  //   //     onClick: () => {
  //   //       console.log("More Icon clicked");
  //   //     },
  //   //   },
  //   //   avatarIconButton: {
  //   //     ...slotProps?.avatarIconButton,
  //   //     sx: {
  //   //       ...(slotProps?.avatarIconButton?.sx || {}),
  //   //       backgroundColor: "yellow", // Na primer, možeš postaviti stil
  //   //       // padding: '10px', // Dodavanje padding-a
  //   //       display: "block",
  //   //     },
  //   //     onClick: () => {
  //   //       console.log("More Icon clicked");
  //   //       // Dodaj željenu funkcionalnost
  //   //     },
  //   //   },
  //   //   avatar: {
  //   //     ...slotProps?.avatar,
  //   //     sx: {
  //   //       ...(slotProps?.avatar?.sx || {}),
  //   //       backgroundColor: "green", // Na primer, možeš postaviti stil
  //   //       // padding: '10px', // Dodavanje padding-a
  //   //       // display:"block",
  //   //     },
  //   //     onClick: () => {
  //   //       console.log("avatar clicked");
  //   //       // Dodaj željenu funkcionalnost
  //   //     },
  //   //   },
  //   // };
  //   return user ? (
  //     <>
  //       <Stack direction="column" p={0}>
  //         <Divider />
  //         <AccountPreview
  //           variant={mini ? "condensed" : "expanded"}
  //           // handleClick={handleClick}
  //           open={open}
  //           // slotProps={updatedSlotProps}
  //         />
  //       </Stack>
  //     </>
  //   ) : (
  //     <></>
  //   );
  // }

  const AccountPreview1: React.FC<AccountPreviewProps> = ({
    slots = {},
    slotProps = {},
    variant = "condensed",
    sx,
  }) => {
    const AvatarComponent = Avatar;
    const initials = user
      ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
      : "";
    const MoreIconButton = slots.moreIconButton || IconButton;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 1,
          padding: 1.5,
          borderRadius: 2,
          ...sx,
          overflow: "hidden",
          transition: "none",
          height: "10vh",
          maxHeight: "10vh",
          minHeight: "10vh",
          // position:"fixed",
          // bottom:0,
          // zIndex:20,
        }}
      >
        <AvatarComponent
          sx={{ color: "text.primary", backgroundColor: "primary.main" }}
        >
          {initials}
        </AvatarComponent>

        {variant === "expanded" && (
          <Box
            sx={{
              margin: 0,
              padding: 0,
              height: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box
              sx={{
                margin: 0,
                padding: 0,
                overflowX: "hidden",
              }}
            >
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                {user?.firstName + " " + user?.lastName}
              </Typography>
              <Typography variant="caption" sx={{ color: "primary.main" }}>
                {user?.email} &bull; {user?.username}
              </Typography>
            </Box>
            <Tooltip title="Odjavi se">
              <MoreIconButton
                {...slotProps.moreIconButton}
                onClick={() => dispatch(signOut())}
              >
                <LogoutIcon sx={{ color: "primary.main" }} />
              </MoreIconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    );
  };

  const createPreviewComponent = (mini: boolean) => {
    function PreviewComponent(props: AccountPreviewProps) {
      // console.log("USAO U CREATE PREVIEW");
      // console.log({ ...props });
      return (
        <AccountPreview1
          variant={mini ? "condensed" : "expanded"}
          handleClick={() => console.log("click")}
        />
      );
    }
    return PreviewComponent;
  };

  function SidebarFooterAccountPopover() {
    return <></>;
  }
  function SidebarFooterAccount({ mini }: SidebarFooterProps) {
    // console.log("Mini state:", mini);

    const PreviewComponent = useMemo(
      () => createPreviewComponent(mini),
      [mini]
    );
    return (
      <Account
        slots={{
          preview: PreviewComponent,
          popover: SidebarFooterAccountPopover,
          popoverContent: SidebarFooterAccountPopover,
        }}
        slotProps={{
          popover: {
            transformOrigin: { horizontal: "left", vertical: "bottom" },
            anchorOrigin: { horizontal: "right", vertical: "top" },
            disableAutoFocus: false,
            onClick: () => {
              // console.log("aaaaaaaaaaaaaaa");
            },
            onClose: () => {
              // console.log("AAAAA");
            },

            slotProps: {
              paper: {
                elevation: 0,
                sx: {
                  overflow: "hidden",
                  mt: 0,
                },
              },
            },
          },
        }}
      />
    );
  }

  function CustomLoginButton({ mini }: SidebarFooterProps) {
    return (
      <Box
        sx={{
          margin: 0,
          padding: 0,
          overflow: "hidden",
          height: "7vh",
          maxHeight: "7vh",
          minHeight: "7vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tooltip title="Prijavi se">
          <Box
            sx={{
              paddingY: 1,
              paddingX: 1.5,
              mb: 0,
              borderRadius: "5pt",
              minWidth: 0,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              "&:hover": {
                backgroundColor: "action.hover",
                cursor: "pointer",
              },
            }}
            onClick={() => navigate("/login")}
          >
            {!mini && (
              <Typography sx={{ paddingRight: 2 }}>Prijavi se</Typography>
            )}
            <Login sx={{ padding: 0, margin: 0, width: "fit-content" }} />
          </Box>
        </Tooltip>
      </Box>
    );
  }

  function sideMenu() {
    return <CustomThemeToggle />;
  }

  return (
    <DashboardLayout
      sx={{
        padding: 0,
      }}
      defaultSidebarCollapsed
      // children={}
      slots={{
        toolbarActions: sideMenu,
        toolbarAccount: () => null,
        sidebarFooter: user ? SidebarFooterAccount : CustomLoginButton,
      }}
    >
      {/* <PageContainer> */}
      <Box
        sx={{
          overflowY: "auto",
          height: "100vh",
          display: "flex",
          minWidth: "500px",
        }}
      >
        <Outlet />
      </Box>

      {/* </PageContainer> */}
    </DashboardLayout>
  );
}
