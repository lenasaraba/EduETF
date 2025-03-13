import { extendTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AppProvider } from "@toolpad/core/react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ForumIcon from "@mui/icons-material/Forum";
import { Router, type Navigation, type Session } from "@toolpad/core";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import LoadingComponent from "./LoadingComponent";
import { fetchCurrentUser, signOut } from "../../features/account/accountSlice";
import lightLogo from "../../assets/lightLogo.png";
import darkLogo from "../../assets/darkLogo.png";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import BadgeTwoToneIcon from "@mui/icons-material/BadgeTwoTone";
import GroupsTwoToneIcon from "@mui/icons-material/GroupsTwoTone";
import SummarizeIcon from "@mui/icons-material/Summarize";

import "./app.css"; //
import { BrandingContext } from "./BrandingContext";
import FormPage from "../../features/form/FormPage";
import { ScheduleRounded, SchoolOutlined } from "@mui/icons-material";
import { router } from "../router/Routes";

// const NAVIGATION: Navigation = [
//   {
//     kind: "header",
//     title: "Meni",
//   },
//   {
//     segment: "",
//     title: "Početna",
//     icon: <HomeIcon />,
//   },

//   {
//     kind: "divider",
//   },
//   {
//     kind: "header",
//     title: "EduETF",
//   },
//   {
//     //provjeriti segment
//     segment: "onlineStudy",
//     title: "Online učenje",
//     icon: <AutoStoriesIcon />,
//   },

//   {
//     segment: "forum",
//     title: "Forum",
//     icon: <ForumIcon />,
//   },
//   {
//     kind: "divider",
//   },
//   {
//     kind: "header",
//     title: "Korisnici",
//   },

//   {
//     //provjera
//     segment: "profile",
//     title: "Moj profil",
//     icon: <PersonOutlineIcon />,
//   },
//   {
//     segment: " ",
//     title: "Korisnici",
//     icon: <PeopleOutlineIcon />,
//     children: [
//       {
//         segment: "../professors", // Dodajemo "/" ispred da se tretira kao apsolutna putanja
//         title: "Profesori",
//         icon: <BadgeTwoToneIcon />,
//       },
//       {
//         segment: "../students", // Isto za studente
//         title: "Studenti",
//         icon: <GroupsTwoToneIcon />,
//       },
//     ],
//   },

//   {
//     kind: "divider",
//   },
//   // {
//   //   kind: 'header',
//   //   title: 'Analytics',
//   // },

//   {
//     segment: "etfis",
//     title: "ETFIS",
//     icon: <LaunchIcon />,
//   },
//   {
//     segment: "about",
//     title: "O nama",
//     icon: <InfoIcon />,
//   },
//   {
//     kind: "divider",
//   },
// ];

const BRANDINGL = {
  title: "",
  logo: <img src={lightLogo} />,
};

const BRANDINGD = {
  title: "",
  logo: <img src={darkLogo} />,
};

const demoTheme = extendTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'Raleway', sans-serif",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          fontSize: "5px !important",

          // padding: "160px", // ili p: 2, ovisno o tvojoj preferenciji
          marginBottom: "0px!important",
        },
        padding: { marginBottom: "0px !important", fontSize: "5px !important" },
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
        divider: "#c5daeb",
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

export default function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.account.user);
  const [pathname, setPathname] = useState("/dashboard");

  console.log(router);
  const NAVIGATION = useMemo(() => {
    const baseNavigation: Navigation = [
      {
        kind: "header",
        title: "Meni",
      },
      {
        segment: "",
        title: "Početna",
        icon: <HomeIcon />,
      },
      {
        kind: "divider",
      },
      {
        kind: "header",
        title: "EduETF",
      },
      {
        segment: "onlineStudy",
        title: "Online učenje",
        icon: <AutoStoriesIcon />,
      },
      {
        segment: "forum",
        title: "Forum",
        icon: <ForumIcon />,
      },
      {
        kind: "divider",
      },
      {
        kind: "header",
        title: "Korisnici",
      },
      {
        segment: "profile",
        title: "Moj profil",
        icon: <PersonOutlineIcon />,
      },
      {
        segment: "users",

        // action: <PeopleOutlineIcon />,
        title: "Korisnici",
        icon: <PeopleOutlineIcon />,
        children: [
          {
            segment: "/professors",
            title: "Profesori",
            icon: <BadgeTwoToneIcon />,
          },
          {
            segment: "/students",
            title: "Studenti",
            icon: <GroupsTwoToneIcon />,
          },
        ],
        // action: () => {},
      },
      {
        kind: "divider",
      },
      {
        segment: "etfis",
        title: "ETFIS",
        icon: <LaunchIcon />,
      },
      {
        segment: "about",
        title: "O nama",
        icon: <InfoIcon />,
      },
      {
        kind: "divider",
      },
    ];

    const eduETFIndex = baseNavigation.findIndex(
      (item) => item.title === "EduETF"
    );

    // Ako je pronađen, umetnite nove stavke ispod njega
    if (eduETFIndex !== -1) {
      if (user) {
        baseNavigation.splice(eduETFIndex + 1, 0, {
          segment: "forms",
          title: "Ankete",
          icon: <SummarizeIcon />, // Dodajte odgovarajuću ikonu
        });
      }
    }

    return baseNavigation;
  }, [user]); // Ovisi o `user` stanju

  const currentSession = {
    user: {
      name: user?.firstName + " " + user?.lastName,
      email: user?.email,
      image: user?.firstName ? user.firstName[0].toUpperCase() : "", // Prvo slovo imena
    },
  };

  const [session, setSession] = useState<Session | null>(
    user ? currentSession : null
  );

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        setSession(currentSession);
      },
      signOut: () => {
        setSession(null);
        dispatch(signOut());
      },
    };
  }, []);

  useEffect(() => {
    if (user) {
      setSession(currentSession);
    }
  }, [user]);

  const [branding, setBranding] = useState(
    localStorage.getItem("toolpad-mode")?.toString() == "light"
      ? BRANDINGL
      : BRANDINGD
  );

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
    } catch (error: unknown) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);

  // useEffect(()=>{
  //   if (user) {
  //     NAVIGATION.push({
  //       segment: "forms",
  //       title: "Ankete",
  //       icon: <SummarizeIcon />, // Dodajte odgovarajuću ikonu
  //     });
  //   }

  // }, [])

  window.scrollTo(0, 0);

  if (loading) return <LoadingComponent message="EduETF"></LoadingComponent>;
  return (
    <>
      {/* <ThemeProvider theme={demoTheme}> */}

      <BrandingContext.Provider value={{ branding, setBranding }}>
        <AppProvider
          theme={demoTheme}
          navigation={NAVIGATION}
          branding={branding}
          authentication={authentication}
          session={session}
          // router={router}
        >
          <Outlet/>
        </AppProvider>
      </BrandingContext.Provider>
    </>
  );
}
