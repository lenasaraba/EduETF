// /* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useMemo, useRef, useState } from "react";
// import { ColorPaletteProp } from "@mui/joy/styles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { debounce, TableBody, Theme } from "@mui/material";

import { Typography as MuiTypo } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { Link as JoyLink } from "@mui/joy";
import { Typography } from "@mui/joy";
import { Link } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  deleteThemeAsync,
  fetchFilters,
  fetchThemesAsync,
  resetThemesParams,
  setThemesParams,
  updateThemeStatus,
} from "../themeSlice";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy";

import TableRowSkeleton from "./TableRowSkeleton";
import LoadingComponentJoy from "../../../app/layout/LoadingComponentJoy";
import { extendTheme } from "@mui/joy/styles";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import React from "react";
import { Theme as ThemeModel } from "../../../app/models/theme";

import { Modal, Button as ButtonJ } from "@mui/joy";
import { User } from "../../../app/models/user";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { LoadingButton } from "@mui/lab";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof never>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface ThemeTableProps {
  themeM: Theme; // Define the 'theme' prop type
}

export default function ThemeTable({ themeM }: ThemeTableProps) {
  const [currentColor, setCurrentColor] = useState<string>("");
  const [statusValue, setStatusValue] = useState<string>("");
  const [catValue, setCatValue] = useState<string>("");
  const [themeSelected, setThemeSelected] = useState<ThemeModel | undefined>(
    undefined
  );
  const [userSelected, setUserSelected] = useState<User | undefined>(undefined);
  // Ref za pristup svim Option elementima
  const optionRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const prevStatusValue = useRef(statusValue);
  const prevCatValue = useRef(catValue);

  const handleHover = (index: number) => {
    if (optionRefs.current[index]) {
      // Čitanje primenjene boje pozadine
      const backgroundColor = window.getComputedStyle(
        optionRefs.current[index]!
      ).backgroundColor;
      setCurrentColor(backgroundColor); // Postavljamo boju u stanje
    }
  };

  useEffect(() => {
    if (prevStatusValue.current !== statusValue) {
      prevStatusValue.current = statusValue;
    }
  }, [statusValue]);

  useEffect(() => {
    if (prevCatValue.current !== catValue) {
      prevCatValue.current = catValue;
    }
  }, [catValue]);

  const handleMouseLeave = (index: number) => {
    setCurrentColor("");
  };

  const [order, setOrder] = useState<Order>("desc");

  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const themesType = searchParams.get("type");
  const {
    themeStatus,
    category,
    filtersLoaded,
    themesParams,
    themesLoaded,
    status,
  } = useAppSelector((state) => state.theme);

  const [searchTerm, setSearchTerm] = useState(themesParams.searchTerm);

  const debouncedSearch = useMemo(
    () =>
      debounce((event: any) => {
        setSearchTerm(event.target.value);
        dispatch(setThemesParams({ searchTerm: event.target.value }));
        dispatch(fetchThemesAsync());
        console.log("debounced");
      }, 1000),
    [dispatch] // Zavisi samo od dispatch-ap
  );

  const allThemes = useAppSelector((state) => state.theme.themes);

  //themestype: my ili all
  useEffect(() => {
    dispatch(resetThemesParams());
    dispatch(setThemesParams({ type: themesType }));
    dispatch(fetchThemesAsync());
    console.log("themestype");
  }, [themesType, dispatch]);

  const user = useAppSelector((state) => state.account.user);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogInfo, setOpenDialogInfo] = useState(false);

  const [loadingStatus, setLoadingStatus] = useState<{
    [key: number]: boolean;
  }>({});

  const updateStatus = async (
    event: React.MouseEvent<HTMLElement>,
    theme: ThemeModel
  ) => {
    event.preventDefault(); // Sprečava osvežavanje stranice

    setLoadingStatus((prev) => ({ ...prev, [theme.id]: true })); // Postavi loading za određenu temu

    const updateData = {
      id: theme.id,
      active: !theme.active,
    };

    try {
      await dispatch(updateThemeStatus(updateData));
      console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
    } catch (error) {
      console.error("Greška prilikom ažuriranja statusa:", error);
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [theme.id]: false })); // Isključi loading nakon završetka
    }
    console.log("prije");

    dispatch(fetchFilters());
    console.log("poslije");
  };

  useEffect(() => {
    if (themesType === "my" && !user) {
      navigate("/login");
    }
  }, [user, themesType, navigate]);

  // useEffect(() => {
  //   if (!themesLoaded) dispatch(fetchThemesAsync());
  // }, [themesLoaded, dispatch]);

  useEffect(() => {
    // if (!filtersLoaded)
    dispatch(fetchFilters());
  }, [
    dispatch,
    // , filtersLoaded
  ]);

  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, [debouncedSearch]);

  // if (!filtersLoaded)
  //   return <LoadingComponentJoy message="Učitavanje tema..." />;

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLElement>,
    theme: ThemeModel
  ) => {
    setThemeSelected(theme);
    setTimeout(() => {
      setOpenDialog(true); // Dijalog se otvara nakon što se tema postavi
    }, 0);
  };

  const handleCloseDialog = () => {
    setThemeSelected(undefined);

    setOpenDialog(false);
  };

  const handleConfirmDelete = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      await dispatch(deleteThemeAsync(themeSelected!.id));
      // navigate(");
    } catch (error) {
      console.error("Greška prilikom brisanja teme:", error);
    } finally {
      setOpenDialog(false);
    }
    dispatch(fetchFilters());
  };

  const handleCloseDialogInfo = () => {
    setUserSelected(undefined);

    setOpenDialogInfo(false);
  };

  const pageTheme = extendTheme({
    colorSchemes: {
      light: {
        palette: {
          background: {
            popup: "#e3edf5",
          },
          common: {
            white: "#e3edf5",
          },
          neutral: {
            plainColor: `var(--joy-palette-neutral-800)`,
            plainHoverColor: `var(--joy-palette-neutral-900)`,
            plainDisabledColor: `var(--joy-palette-neutral-300)`,

            outlinedColor: `var(--joy-palette-neutral-800)`,
            outlinedBorder: `var(--joy-palette-neutral-200)`,
            outlinedHoverColor: `var(--joy-palette-neutral-900)`,
            outlinedHoverBg: `var(--joy-palette-neutral-100)`,
            outlinedHoverBorder: `var(--joy-palette-neutral-300)`,
            outlinedActiveBg: `var(--joy-palette-neutral-200)`,
            outlinedDisabledColor: `var(--joy-palette-neutral-300)`,
            outlinedDisabledBorder: `var(--joy-palette-neutral-100)`,

            softColor: `var(--joy-palette-neutral-800)`,
            softBg: "#e3edf5",
            softHoverColor: `var(--joy-palette-neutral-900)`,
            softHoverBg: `var(--joy-palette-neutral-200)`,
            softActiveBg: `var(--joy-palette-neutral-300)`,
            softDisabledColor: `var(--joy-palette-neutral-300)`,
            softDisabledBg: `var(--joy-palette-neutral-50)`,
            solidColor: "#e3edf5",
            solidBg: "#e3edf5",
            solidHoverBg: `var(--joy-palette-neutral-700)`,
            solidActiveBg: `var(--joy-palette-neutral-800)`,
            solidDisabledColor: `var(--joy-palette-neutral-300)`,
            solidDisabledBg: `var(--joy-palette-neutral-50)`,
          },
        },
      },
      dark: {
        palette: {
          background: {
            popup: "#212a3e",
          },
          common: {
            white: "#212a3e",
          },
          neutral: {
            plainColor: `var(--joy-palette-neutral-200)`,
            plainHoverColor: `var(--joy-palette-neutral-50)`,
            plainHoverBg: `var(--joy-palette-neutral-800)`,
            plainActiveBg: "#000000",
            plainDisabledColor: `var(--joy-palette-neutral-700)`,

            outlinedColor: `var(--joy-palette-neutral-200)`,
            outlinedBorder: `var(--joy-palette-neutral-800)`,
            outlinedHoverColor: `var(--joy-palette-neutral-50)`,
            outlinedHoverBg: `var(--joy-palette-neutral-800)`,
            outlinedHoverBorder: `var(--joy-palette-neutral-700)`,
            outlinedActiveBg: `var(--joy-palette-neutral-800)`,
            outlinedDisabledColor: `var(--joy-palette-neutral-800)`,
            outlinedDisabledBorder: `var(--joy-palette-neutral-800)`,

            softColor: `var(--joy-palette-neutral-200)`,
            softBg: `var(--joy-palette-neutral-800)`,
            softHoverColor: `var(--joy-palette-neutral-50)`,
            softHoverBg: `var(--joy-palette-neutral-700)`,
            softActiveBg: `var(--joy-palette-neutral-600)`,
            softDisabledColor: `var(--joy-palette-neutral-700)`,
            softDisabledBg: `var(--joy-palette-neutral-900)`,

            solidColor: "#212a3e",
            solidBg: `var(--joy-palette-neutral-600)`,
            solidHoverBg: `var(--joy-palette-neutral-700)`,
            solidActiveBg: `var(--joy-palette-neutral-800)`,
            solidDisabledColor: `var(--joy-palette-neutral-700)`,
            solidDisabledBg: `var(--joy-palette-neutral-900)`,
          },
        },
      },
    },

    variants: {
      plainHover: {
        neutral: {
          color: "#CBDCEB",
          backgroundColor: "#526D82",
        },
      },
      plainActive: {
        neutral: {
          color: "#ffffff",
          backgroundColor: "#526d82",
        },
      },
    },
  });

  const RowMenu = (themeF: ThemeModel) => (
    <>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{
            root: { variant: "plain", color: "neutral", size: "sm" },
          }}
        >
          <MoreHorizRoundedIcon />
        </MenuButton>
        <Menu
          size="sm"
          sx={{
            minWidth: 140,
            backgroundColor: themeM.palette.background.paper,
            borderColor: themeM.palette.background.default,
            color: themeM.palette.primary.main,
          }}
        >
          <MenuItem
            sx={{
              backgroundColor: themeM.palette.background.paper,
              color: themeM.palette.primary.main,
              "&:hover": {
                backgroundColor: themeM.palette.text.primary,
                color: themeM.palette.background.paper,
              },
              "&.Mui-selected, &[aria-selected='true']": {
                backgroundColor: themeM.palette.primary.main,
                color: "white",
                fontWeight: "bolder",
              },
            }}
            onClick={(event) => updateStatus(event, themeF)}
          >
            Ažuriraj aktivnost
          </MenuItem>
          <Divider />
          <MenuItem
            // color="danger"
            sx={{
              backgroundColor: themeM.palette.background.paper,
              color: themeM.palette.text.secondaryChannel,
              "&:hover": {
                backgroundColor: themeM.palette.text.primary,
                color: themeM.palette.background.paper,
              },
              "&.Mui-selected, &[aria-selected='true']": {
                backgroundColor: themeM.palette.primary.main,
                color: "white",
                fontWeight: "bolder",
              },
            }}
            onClick={(event) => handleDeleteClick(event, themeF)}
          >
            Obriši temu
          </MenuItem>
        </Menu>
      </Dropdown>
    </>
  );

  const renderFilters = () => (
    <>
      <FormControl size="sm">
        <FormLabel sx={{ color: themeM.palette.primary.main }}>
          Status
        </FormLabel>
        <Select
          size="sm"
          placeholder="Status"
          slotProps={{
            button: { sx: { whiteSpace: "nowrap" } },
            listbox: {
              sx: {
                // maxHeight: 200, // Postavljanje maksimalne visine menija
                // overflowY: "auto", // Omogućava skrolovanje
                backgroundColor: themeM.palette.background.paper, // Promeni pozadinu menija
              },
            },
          }}
          value={statusValue}
          // onChange={(event, value) => {
          //   console.log("OVJDEEEEE");
          //   setStatusValue(value || "");
          //   dispatch(setThemesParams({ themeStatus: value }));

          //   dispatch(fetchThemesAsync());
          // }}

          onChange={(event, value) => {
            if (value !== prevStatusValue.current) {
              console.log("Promenjena selektovana vrednost!");
              setStatusValue(value || "");
              dispatch(setThemesParams({ themeStatus: value }));
              dispatch(fetchThemesAsync());
            }
            prevStatusValue.current = value!;
          }}
          // MenuProps={{
          //   PaperProps: {
          //     sx: {
          //       maxHeight: 200,  // Postavljanje maksimalne visine menija
          //       overflowY: 'auto',  // Omogućava skrolovanje
          //       backgroundColor: 'gray',  // Promeni pozadinu menija
          //     },
          //   },
          // }}
          sx={{
            // "--ListDivider-gap": 0,
            backgroundColor: themeM.palette.background.paper,
            borderColor: themeM.palette.background.default,
            color: themeM.palette.primary.main,

            "&:hover": {
              backgroundColor: themeM.palette.action.hover, // Hover effect on the select button
              color: themeM.palette.primary.main,
            },
            "&.Mui-focused": {
              borderColor: themeM.palette.primary.main, // Focus state for the select component
            },
          }}
        >
          {themeStatus &&
            themeStatus.length > 0 &&
            themeStatus.map((status, index) => (
              <Option
                key={index}
                value={status}
                ref={(el) => (optionRefs.current[index] = el)} // Čuvanje reference na Option
                onMouseEnter={() => handleHover(index)} // Čitanje boje pri hover-u
                onMouseLeave={() => handleMouseLeave(index)} // Resetovanje boje
                sx={{
                  backgroundColor: themeM.palette.background.paper,
                  color: themeM.palette.primary.main,
                  "&:hover": {
                    //hover na selektovanom
                    backgroundColor: themeM.palette.text.primary,
                    color: themeM.palette.background.paper,
                  },
                  "&.Mui-selected, &[aria-selected='true']": {
                    //SELEKTOVANA
                    backgroundColor: themeM.palette.primary.main, // Stil za odabrano stanje
                    color: "white",
                    fontWeight: "bolder",
                  },
                }}
              >
                {status}
              </Option>
            ))}
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel sx={{ color: themeM.palette.primary.main }}>
          Kategorija
        </FormLabel>
        <Select
          size="sm"
          placeholder="Kategorija"
          onChange={(event, value) => {
            if (value !== prevCatValue.current) {
              console.log("Promenjena selektovana kategorija!");
              setCatValue(value || "");
              dispatch(setThemesParams({ category: value }));
              dispatch(fetchThemesAsync());
            }
            prevCatValue.current = value!;
          }}
          value={catValue}
          sx={{
            backgroundColor: themeM.palette.background.paper,
            borderColor: themeM.palette.background.default,
            color: themeM.palette.primary.main,

            "&:hover": {
              backgroundColor: themeM.palette.action.hover, // Hover effect on the select button
              color: themeM.palette.primary.main,
            },
            "&.Mui-focused": {
              borderColor: themeM.palette.primary.main, // Focus state for the select component
            },
          }}
          slotProps={{
            listbox: {
              sx: {
                maxHeight: "300px",
                backgroundColor: themeM.palette.background.paper, // Promeni pozadinu menija
              },
            },
          }}
        >
          {category &&
            category.length > 0 &&
            category.map((cat, index) => (
              <Option
                key={index}
                value={cat}
                sx={{
                  backgroundColor: themeM.palette.background.paper,
                  color: themeM.palette.primary.main,

                  "&:hover": {
                    //hover na selektovanom
                    backgroundColor: themeM.palette.text.primary,
                    color: themeM.palette.background.paper,
                  },
                  "&.Mui-selected, &[aria-selected='true']": {
                    //SELEKTOVANA
                    backgroundColor: themeM.palette.primary.main, // Stil za odabrano stanje
                    color: "white",
                    fontWeight: "bolder",
                  },
                }}
              >
                {cat}
              </Option>
            ))}
        </Select>
      </FormControl>
    </>
  );

  return (
    <>
      <MuiThemeProvider theme={themeM}>
        <JoyCssVarsProvider theme={pageTheme}>
          {!filtersLoaded ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "10vh",
                width: "100%",
                margin: 0,
                padding: 1,
              }}
            >
              <MuiTypo
                variant="body1"
                sx={{ mb: 2, color: themeM.palette.primary.main }}
              >
                Učitavanje filtera
              </MuiTypo>
              <CircularProgress
                size={40}
                sx={{ color: themeM.palette.primary.main }}
              />
            </Box>
          ) : (
            <>
              <Box
                className="SearchAndFilters-tabletUp"
                sx={{
                  borderRadius: "sm",
                  py: 0,
                  display: { xs: "none", sm: "flex" },
                  flexWrap: "wrap",
                  gap: 1.5,
                  "& > *": {
                    minWidth: { xs: "120px", md: "160px" },
                  },
                }}
              >
                <FormControl sx={{ flex: 1 }} size="sm">
                  <FormLabel sx={{ color: themeM.palette.primary.main }}>
                    Pretraži prema ključnoj riječi
                  </FormLabel>
                  <Input
                    size="sm"
                    placeholder="Pretraga.."
                    startDecorator={<SearchIcon />}
                    onChange={(event: any) => {
                      setSearchTerm(event.target.value);
                      debouncedSearch(event);
                    }}
                    sx={{
                      backgroundColor: themeM.palette.background.paper,
                      borderColor: themeM.palette.background.default,
                      color: themeM.palette.primary.main,
                      "&:hover": {
                        backgroundColor: themeM.palette.action.hover, // Hover effect on the select button
                        color: themeM.palette.primary.main,
                      },
                    }}
                  />
                </FormControl>
                {renderFilters()}
              </Box>
            </>
          )}
          <Sheet
            className="ThemesContainer"
            variant="outlined"
            sx={{
              display: { xs: "none", sm: "initial" },
              width: "100%",
              borderRadius: "sm",
              flexShrink: 1,
              // overflow: "auto",
              minHeight: 0,
              mt: 2,
              borderColor: themeM.palette.background.paper,
              backgroundColor: "transparent",
            }}
          >
            <Table
              aria-labelledby="tableTitle"
              stickyHeader
              hoverRow
              sx={{
                "--TableCell-headBackground": themeM.palette.background.paper,
                "--Table-headerUnderlineThickness": "1px",
                "--TableRow-hoverBackground": themeM.palette.background.paper,
                "--TableCell-paddingY": "8px",
                "--TableCell-paddingX": "12px",
                backgroundColor: themeM.palette.background.paper,
                display: "block",
                tableLayout: "auto", // Dodajemo fixed layout za preciznije pozicioniranje
                width: "100%",
              }}
            >
              <thead style={{ width: "100%", display: "flex" }}>
                <tr
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between", // Koristimo space-between da rasporedimo sadržaj
                    alignItems: "center", // Osiguravamo da su stavke poravnate
                  }}
                >
                  <th
                    style={{
                      width: "25%",
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <JoyLink
                      underline="none"
                      color="primary"
                      component="button"
                      onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                      endDecorator={<ArrowDropDownIcon />}
                      sx={{
                        fontWeight: "lg",
                        "& svg": {
                          transition: "0.2s",
                          transform:
                            order === "desc"
                              ? "rotate(0deg)"
                              : "rotate(180deg)",
                        },
                        color: themeM.palette.primary.main,
                      }}
                    >
                      {order === "asc" ? "Najstarije" : "Najnovije"}
                    </JoyLink>
                  </th>
                  <th
                    style={{
                      // padding: "12px 12px",
                      color: themeM.palette.primary.main,
                      // width: "25%",
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    Datum
                  </th>
                  <th
                    style={{
                      color: themeM.palette.primary.main,
                      //  width: "25%",
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    Kategorija
                  </th>
                  <th
                    style={{
                      color: themeM.palette.primary.main,
                      // width: "25%",
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    Kreator
                  </th>
                  <th
                    style={{
                      // padding: "12px 12px",
                      color: themeM.palette.primary.main,
                      width: "10%",
                      // flex: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      // padding: "12px 12px",
                      color: themeM.palette.primary.main,
                      width: "10%",
                      // flex: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Broj poruka
                  </th>

                  <th
                    style={{
                      color: themeM.palette.primary.main,
                      width: "10%",
                      // flex: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  ></th>
                </tr>
              </thead>
              <TableBody
                sx={{
                  maxHeight: "50vh",
                  overflowY: "auto",
                  backgroundColor: themeM.palette.background.default,
                  display: "block",
                  width: "100%",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: themeM.palette.background.paper, // Boja skrola
                    borderRadius: "8px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: themeM.palette.primary.dark, // Boja hvataljke na hover
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent", // Prozirna pozadina skrola
                  },
                }}
              >
                {!themesLoaded ? (
                  <TableRowSkeleton themeM={themeM} />
                ) : (
                  allThemes &&
                  [...allThemes]
                    .sort(getComparator(order, "id"))
                    .map((theme1) => (
                      <tr
                        key={theme1.id}
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between", // Koristimo space-between da rasporedimo sadržaj
                          alignItems: "center", // Osiguravamo da su stavke poravnate
                          padding: "8px 0", // Povećavamo visinu redova za bolju vidljivost
                          transition: "background-color 0.3s ease", // Efekat prelaza boje
                          // "&:hover": {
                          //   backgroundColor: "#f0f0f0", // Pozadina na hover (možeš promeniti boju)
                          // },
                        }}
                      >
                        <td
                          style={{
                            padding: "0 12px",
                            flex: 1,
                            height: "fit-content",
                            border: 0,
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <div>
                            <MuiTypo
                              component={Link}
                              to={user ? `../forum/${theme1.id}` : `/login`}
                              sx={{
                                textDecoration: "none",
                                color: themeM.palette.action.active,
                                cursor: "pointer",
                                fontSize: "12pt",
                                overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
                                display: "-webkit-box", // Neophodno za multi-line truncation
                                WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                                WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
                                lineHeight: "1.3em", // Podešava razmak između linija
                                height: "1.3em", // Fiksna visina: broj linija * lineHeight
                                textOverflow: "ellipsis", // Dodaje tri tačke
                                fontWeight: "normal", // Normalna težina teksta inicijalno
                                "&:hover": {
                                  color: themeM.palette.primary.main, // Boja za hover stanje
                                  fontWeight: "bold", // Boldovanje na hover
                                },
                              }}
                            >
                              {theme1.title}
                            </MuiTypo>
                            <MuiTypo
                              sx={{
                                fontSize: "11pt",
                                color: themeM.palette.action.active,
                                overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
                                display: "-webkit-box", // Neophodno za multi-line truncation
                                WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                                WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
                                lineHeight: "1.3em", // Podešava razmak između linija
                                height: "1.3em", // Fiksna visina: broj linija * lineHeight
                                textOverflow: "ellipsis", // Dodaje tri tačke
                              }}
                            >
                              {theme1.description}
                            </MuiTypo>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "0 12px",
                            flex: 1,
                            height: "fit-content",
                            border: 0,
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Typography
                            level="body-xs"
                            sx={{
                              color: themeM.palette.action.active,
                            }}
                          >
                            {new Date(theme1.date).toLocaleTimeString("sr-RS", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                            <span style={{ color: "light" }}>{"  |  "}</span>
                            {new Date(theme1.date).toLocaleDateString("sr-RS", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </Typography>
                        </td>
                        <td
                          style={{
                            padding: "0 12px",
                            flex: 1,
                            height: "fit-content",
                            border: 0,
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Typography
                            component={
                              theme1.course != null ? Link : Typography
                            }
                            to={`/courses/${theme1.course?.id}`}
                            sx={{
                              textDecoration: "none",
                              color: themeM.palette.action.active,
                              "&:hover": {
                                color:
                                  theme1.course != null
                                    ? themeM.palette.primary.main
                                    : themeM.palette.action.active,
                                fontWeight:
                                  theme1.course != null ? "bold" : "normal",
                              },
                            }}
                          >
                            {" "}
                            {theme1.course != null
                              ? theme1.course.name
                              : "Slobodna tema"}
                          </Typography>
                        </td>

                        <td
                          style={{
                            padding: "0 12px",
                            flex: 1,
                            height: "fit-content",
                            border: 0,
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                            }}
                          >
                            <Avatar
                              size="sm"
                              sx={{ bgcolor: themeM.palette.primary.main }}
                            >
                              {theme1.user ? (
                                theme1.user.firstName.charAt(0).toUpperCase()
                              ) : (
                                <PersonOffIcon />
                              )}
                            </Avatar>
                            <div>
                              {theme1.user ? (
                                <Typography
                                  level="body-xs"
                                  sx={{
                                    color: themeM.palette.action.active,
                                    textDecoration: "none",
                                    fontSize: "10pt",
                                    fontWeight: "normal",
                                    "&:hover": {
                                      cursor: "pointer",
                                      color: themeM.palette.primary.main, // Boja za hover stanje
                                      fontWeight: "bold", // Boldovanje na hover
                                    },
                                  }}
                                  //ovo raditi samo kad je profesor? i dodati da pise rola pored
                                  // component={Link}
                                  // to={
                                  //   theme1.user.role == "Profesor"
                                  //     ? `/professorInfo/${theme1.user.id}`
                                  //     : `/profile/${theme1.user.id}`
                                  // }
                                  onClick={() => {
                                    if (theme1.user.role === "Profesor") {
                                      navigate(
                                        `/professorInfo/${theme1.user.id}`
                                      );
                                    } else {
                                      setUserSelected(theme1.user);
                                      setOpenDialogInfo(true);
                                    }
                                  }}
                                >
                                  {" "}
                                  {theme1.user.firstName} {theme1.user.lastName}
                                </Typography>
                              ) : (
                                <Typography
                                  level="body-xs"
                                  sx={{
                                    color: "gray",
                                    textDecoration: "none",
                                    fontSize: "10pt",
                                    fontWeight: "normal",
                                  }}
                                >
                                  [Obrisan korisnik]
                                </Typography>
                              )}
                              <Typography
                                level="body-xs"
                                sx={{
                                  color: themeM.palette.action.active,
                                }}
                              >
                                {theme1.user ? theme1.user.email : ""}
                              </Typography>
                            </div>
                          </Box>
                        </td>

                        <td
                          style={{
                            padding: "0 12px",
                            // flex: 1,
                            width: "10%",
                            height: "fit-content",
                            border: 0,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Chip
                            variant="soft"
                            size="sm"
                            startDecorator={
                              loadingStatus[theme1.id] ? (
                                <CircularProgress
                                  size={16}
                                  sx={{ color: "#fff" }}
                                />
                              ) : theme1.active ? (
                                <CheckRoundedIcon />
                              ) : (
                                <BlockIcon />
                              )
                            }
                            sx={{
                              backgroundColor: loadingStatus[theme1.id]
                                ? "grey"
                                : theme1.active
                                  ? themeM.palette.text.primaryChannel
                                  : themeM.palette.text.secondaryChannel, // Prilagođene boje
                              color: "#fff", // Tekst u beloj boji
                              borderRadius: "16px", // Primer prilagođenog oblika
                              ".MuiChip-icon": {
                                color: "#fff",
                              },
                            }}
                          >
                            {loadingStatus[theme1.id]
                              ? "Ažuriranje"
                              : theme1.active
                                ? "Aktivno"
                                : "Zatvoreno"}
                          </Chip>
                        </td>
                        <td
                          style={{
                            padding: "0 12px",
                            // flex: 1,
                            width: "10%",
                            height: "fit-content",
                            border: 0,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <MuiTypo
                            sx={{
                              color: themeM.palette.action.active,
                            }}
                          >
                            {theme1.messages.length.toString()}
                          </MuiTypo>
                        </td>

                        <td
                          style={{
                            padding: "0 12px",
                            // flex: 1,
                            width: "10%",
                            height: "fit-content",
                            border: 0,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {user ? (
                            user.username == theme1.user?.username ? (
                              RowMenu(theme1)
                            ) : user && theme1.course ? (
                              theme1.course.usersCourse.some(
                                (uc) => uc.user.username === user.username
                              ) ||
                              theme1.course.professorsCourse.some(
                                (pc) => pc.user.username === user.username
                              ) ? (
                                <LockOpenIcon sx={{ fontSize: "13pt" }} />
                              ) : (
                                <LockIcon sx={{ fontSize: "13pt" }} />
                              )
                            ) : (
                              <LockOpenIcon sx={{ fontSize: "13pt" }} />
                            )
                          ) : (
                            <LockIcon sx={{ fontSize: "13pt" }} />
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </TableBody>
            </Table>
          </Sheet>
          <Modal
            open={openDialog}
            onClose={handleCloseDialog}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "none", // Uklanjamo zamagljenje pozadine
              backgroundColor: "transparent", // Uklanjamo pozadinsku boju iza modala
              zIndex: 1300, // Postavljamo z-index da bude iznad drugih elemenata
            }}
            slotProps={{
              backdrop: {
                sx: {
                  backgroundColor: "rgba(0,0,0,0.5)", // Uklanjamo pozadinsku boju backdopa
                  backdropFilter: "none !important", // Uklanjamo filter na pozadini
                },
              },
            }}
          >
            <Box
              sx={{
                borderRadius: "12pt",
                padding: 4,
                minWidth: 320,
                maxWidth: 600,
                backgroundColor: themeM.palette.background.paper, // Zadržavamo pozadinsku boju za modal sadržaj
                boxShadow: 24, // Senka iza modala
              }}
            >
              <MuiTypo
                variant="h2"
                sx={{
                  fontFamily: "Raleway, sans-serif",
                  marginBottom: 0,
                  textAlign: "center",
                  paddingY: 2,
                  paddingX: 3,
                  fontSize: "1.2rem",
                  color: themeM.palette.text.primary,
                }}
              >
                Potvrda brisanja
              </MuiTypo>
              <MuiTypo
                sx={{
                  fontFamily: "Raleway, sans-serif",
                  color: themeM.palette.primary.light, // Koristi sekundarni tekst za opis
                  textAlign: "center",
                  marginBottom: 3,
                  fontSize: "clamp(9pt, 11pt, 13pt)",
                }}
              >
                Da li ste sigurni da želite da obrišete ovu temu?
              </MuiTypo>
              <MuiTypo
                sx={{
                  color: themeM.palette.info.light,
                  fontSize: "clamp(8pt, 9pt, 10pt)",
                  textAlign: "center",
                }}
              >
                {themeSelected?.title}
                {"-"}
                {themeSelected?.description}
              </MuiTypo>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  padding: 1,
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <ButtonJ
                  onClick={handleCloseDialog}
                  variant="plain"
                  sx={{
                    color: themeM.palette.text.primary,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    boxShadow: "var(--mui-shadows-2)",
                    "&:hover": {
                      backgroundColor: themeM.palette.primary.dark,
                    },
                  }}
                >
                  Odustani
                </ButtonJ>

                <ButtonJ
                  loading={status == "pendingDeleteTheme"}
                  onClick={handleConfirmDelete}
                  color="danger"
                  variant="solid"
                  loadingIndicator={
                    <CircularProgress size={18} sx={{ color: "red" }} /> // Ovdje mijenjaš boju
                  }
                  sx={{
                    boxShadow: "var(--mui-shadows-2)",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    backgroundColor: themeM.palette.error.main,
                    "&:hover": {
                      backgroundColor: themeM.palette.error.dark,
                    },
                  }}
                >
                  Obriši
                </ButtonJ>
              </Box>
            </Box>
          </Modal>

          <Modal
            open={openDialogInfo}
            onClose={handleCloseDialogInfo}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(6px)", // Blago zamagljenje pozadine
              backgroundColor: "rgba(0, 0, 0, 0.3)", // Taman overlay efekat
              zIndex: 1300,
            }}
          >
            <Box
              sx={{
                borderRadius: "20pt",
                padding: 3,
                minWidth: 350,
                maxWidth: 550,
                backgroundColor: themeM.palette.background.paper,
                boxShadow: 8,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                position: "relative",
                paddingX: 5,
                animation: "fadeIn 0.3s ease-in-out",
                width: 550,
              }}
            >
              {/* Naslov */}
              <MuiTypo
                variant="h5"
                sx={{
                  fontFamily: "Raleway, sans-serif",
                  textAlign: "center",
                  fontWeight: "bold",
                  color: themeM.palette.primary.light,
                }}
              >
                Podaci o studentu
              </MuiTypo>

              {/* Kartica sa podacima */}
              {userSelected && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    padding: 2,
                    borderRadius: "20pt",

                    backgroundColor: themeM.palette.secondary.main,
                    boxShadow: 2,
                  }}
                >
                  {/* Ikona ili avatar */}
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      backgroundColor: themeM.palette.primary.light,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      mr: 1,
                    }}
                  >
                    {userSelected.firstName[0]}
                  </Box>

                  {/* Podaci */}
                  <Box>
                    <MuiTypo
                      sx={{
                        fontFamily: "Raleway, sans-serif",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        color: themeM.palette.text.primary,
                      }}
                    >
                      {userSelected.firstName} {userSelected.lastName}
                    </MuiTypo>
                    <MuiTypo
                      variant="body2"
                      sx={{ color: themeM.palette.text.secondary }}
                    >
                      @{userSelected.username}
                    </MuiTypo>
                    <MuiTypo
                      variant="body2"
                      sx={{
                        color: themeM.palette.primary.dark,
                        fontSize: "0.9rem",
                      }}
                    >
                      {userSelected.email}
                    </MuiTypo>
                  </Box>
                </Box>
              )}

              {/* Dodatne informacije */}
              <MuiTypo
                sx={{
                  color: themeM.palette.info.light,
                  fontSize: "0.8rem",
                  textAlign: "center",
                }}
              >
                {themeSelected?.user.firstName} {themeSelected?.description}
              </MuiTypo>

              {/* Dugme za zatvaranje */}
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <ButtonJ
                  onClick={handleCloseDialogInfo}
                  variant="soft"
                  sx={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    paddingX: 3,
                    borderRadius: "15pt",
                    backgroundColor: themeM.palette.primary.main,
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: themeM.palette.primary.dark,
                    },
                  }}
                >
                  Zatvori
                </ButtonJ>
              </Box>
            </Box>
          </Modal>
        </JoyCssVarsProvider>
      </MuiThemeProvider>
    </>
  );
}
