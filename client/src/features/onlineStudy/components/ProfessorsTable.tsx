// /* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useMemo, useRef, useState } from "react";
// import { ColorPaletteProp } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { CircularProgress, debounce, TableBody, Theme } from "@mui/material";
import { Typography as MuiTypo } from "@mui/material";

import { Avatar } from "@mui/joy";
import { Typography } from "@mui/joy";

import SearchIcon from "@mui/icons-material/Search";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";

import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy";

import RowSkeleton from "./RowSkeleton";
import LoadingComponentJoy from "../../../app/layout/LoadingComponentJoy";
import { extendTheme } from "@mui/joy/styles";
import {
  fetchFilters,
  fetchProfessorYearsProgramsAsync,
  fetchProfessorsAsync,
  setProfessorsParams,
} from "../professorSlice";
import { Link } from "react-router-dom";

interface ProfessorsTableProps {
  themeM: Theme; // Define the 'theme' prop type (tema izgled)
}
export default function ProfessorsTable({ themeM }: ProfessorsTableProps) {

  const [currentColor, setCurrentColor] = useState<string>("");
  const [yearValue, setYearValue] = useState<string>("");
  const [programValue, setProgramValue] = useState<string>("");

  // Ref za pristup svim Option elementima
  const optionRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleHover = (index: number) => {
    if (optionRefs.current[index]) {
      // Čitanje primenjene boje pozadine
      const backgroundColor = window.getComputedStyle(
        optionRefs.current[index]!
      ).backgroundColor;
      setCurrentColor(backgroundColor); // Postavljamo boju u stanje
    }
  };

  const handleMouseLeave = (index: number) => {
    setCurrentColor("");
  };

  const dispatch = useAppDispatch();

  const {
    years,
    programs,
    filtersLoaded,
    professorsParams,
    professorsLoaded,

    status,
    profYears,
    profPrograms,
  } = useAppSelector((state) => state.professor);

  const [searchTerm, setSearchTerm] = useState(professorsParams.searchTerm);

  const debouncedSearch = useMemo(
    () =>
      debounce((event: any) => {
        setSearchTerm(event.target.value);
        dispatch(setProfessorsParams({ searchTerm: event.target.value }));
        dispatch(fetchProfessorsAsync());
      }, 1000),
    [dispatch]
  );

  const allProfessors = useAppSelector((state) => state.professor.professors);

  const sortedProfessors = [...allProfessors].sort((a, b) =>
    a.lastName.localeCompare(b.lastName)
  );

  const coursesLoaded = useAppSelector(
    (state) => state.professor.coursesLoaded
  );

  useEffect(() => {
    sortedProfessors.forEach((professor) => {
      dispatch(
        fetchProfessorYearsProgramsAsync({
          id: professor.id,
          totalCount: allProfessors.length,
        })
      );
    });
  }, [dispatch, allProfessors]);

  useEffect(() => {
    if (!professorsLoaded) dispatch(fetchProfessorsAsync());
  }, [professorsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) {
      dispatch(fetchFilters());
    }
  }, [dispatch, filtersLoaded]);

  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, [debouncedSearch]);

  // if (!filtersLoaded)
  //   return <LoadingComponentJoy message="Učitavanje profesora..." />;

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
            // ...neutralD,
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

  const renderFilters = () => (
    <>
      <FormControl size="sm">
        <FormLabel sx={{ color: themeM.palette.primary.main }}>
          Godina
        </FormLabel>
        <Select
          size="sm"
          placeholder="Godina"
          slotProps={{
            button: { sx: { whiteSpace: "nowrap" } },
            listbox: {
              sx: {
                backgroundColor: themeM.palette.background.paper,
              },
            },
          }}
          value={yearValue}
          onChange={(event, value) => {
            setYearValue(value || "");
            dispatch(setProfessorsParams({ year: value }));
            dispatch(fetchProfessorsAsync());
          }}
          sx={{
            backgroundColor: themeM.palette.background.paper,
            borderColor: themeM.palette.background.default,
            color: themeM.palette.primary.main,

            "&:hover": {
              backgroundColor: themeM.palette.action.hover,
              color: themeM.palette.primary.main,
            },
            "&.Mui-focused": {
              borderColor: themeM.palette.primary.main,
            },
          }}
        >
          {years &&
            years.length > 0 &&
            years.map((year, index) => (
              <Option
                key={index}
                value={year}
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
                {year}
              </Option>
            ))}
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel sx={{ color: themeM.palette.primary.main }}>Smjer</FormLabel>
        <Select
          size="sm"
          placeholder="Smjer"
          onChange={(event, value) => {
            setProgramValue(value || "");
            dispatch(setProfessorsParams({ program: value }));
            dispatch(fetchProfessorsAsync());
          }}
          value={programValue}
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
          {programs &&
            programs.length > 0 &&
            programs.map((program, index) => (
              <Option
                key={index}
                value={program}
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
                {program}
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
          {filtersLoaded ? (
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
                  Pretraži prema imenu i/ili prezimenu:
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
          ) : (
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
                tableLayout: "fixed", // Dodajemo fixed layout za preciznije pozicioniranje
                width: "100%",
              }}
            >
              <thead
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
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
                      // width: "25%",
                      flex: 1,
                      color: themeM.palette.primary.main,
                    }}
                  >
                    Ime i prezime
                  </th>

                  <th
                    style={{
                      color: themeM.palette.primary.main,
                      flex: 1,
                    }}
                  >
                    Godine
                  </th>
                  <th
                    style={{
                      color: themeM.palette.primary.main,
                      flex: 1,
                    }}
                  >
                    Smjerovi
                  </th>
                  <th
                    style={{
                      color: themeM.palette.primary.main,
                      flex: 1,
                    }}
                  >
                    Email
                  </th>
                </tr>
              </thead>
              <TableBody
                sx={{
                  maxHeight: "50vh",
                  overflowY: "auto",
                  backgroundColor: themeM.palette.background.default,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
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
                {!coursesLoaded ? (
                  <RowSkeleton themeM={themeM} />
                ) : (
                  sortedProfessors &&
                  [...sortedProfessors]
                    // .sort(getComparator(order, "id"))
                    .map((prof) => (
                      <tr
                        key={prof.id}
                        style={{
                          borderBottom: "1px solid",
                          borderColor: themeM.palette.background.paper,
                          // borderWidth: "500px",
                          // borderCollapse: "collapse",
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between", // Koristimo space-between da rasporedimo sadržaj
                          alignItems: "center", // Osiguravamo da su stavke poravnate
                          padding: "16px 0", // Povećavamo visinu redova za bolju vidljivost
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
                              {prof.lastName.charAt(0).toUpperCase()}
                            </Avatar>
                            <MuiTypo
                              component={Link}
                              to={`/professorInfo/${prof.id}`}
                              sx={{
                                textDecoration: "none",
                                color: themeM.palette.action.active,
                                overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
                                display: "-webkit-box", // Neophodno za multi-line truncation
                                WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                                WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
                                lineHeight: "1", // Podešava razmak između linija
                                height: "1.2em", // Fiksna visina: broj linija * lineHeight
                                textOverflow: "ellipsis", // Dodaje tri tačke
                                fontWeight: "normal", // Normalna težina teksta inicijalno
                                "&:hover": {
                                  cursor: "pointer",
                                  color: themeM.palette.text.primary,
                                },
                              }}
                            >
                              {prof.lastName} {prof.firstName}
                            </MuiTypo>
                          </Box>
                        </td>
                        {/* <td
                          style={{
                            padding: "0 12px",
                            flex: 1,
                            height: "fit-content",
                            border: 0,
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
                        </td> */}
                        <td
                          style={{
                            padding: "0 12px",
                            flex: 1,
                            height: "fit-content",
                            border: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              color: themeM.palette.action.active,
                            }}
                          >
                            {/* {" "}
                            {theme1.course != null
                              ? theme1.course.name
                              : "Slobodna tema"} */}
                            {profYears?.[prof.id]
                              ?.map((year) => year.name)
                              .join(", ") || "Nema"}
                          </Typography>
                        </td>
                        <td
                          style={{
                            padding: "0 12px",
                            flex: 1,
                            height: "fit-content",
                            border: 0,
                          }}
                        >
                          {/* <Chip
                            variant="soft"
                            size="sm"
                            startDecorator={
                              {
                                true: <CheckRoundedIcon />,
                                false: <BlockIcon />,
                              }[theme1.active]
                            }
                            sx={{
                              backgroundColor: theme1.active
                                ? themeM.palette.text.primaryChannel
                                : themeM.palette.text.secondaryChannel, // Prilagođene boje
                              color: "#fff", // Tekst u beloj boji
                              borderRadius: "16px", // Primer prilagođenog oblika
                            }}
                          >
                            {theme1.active ? "Aktivno" : "Zatvoreno"}
                          </Chip> */}
                          <Typography
                            sx={{
                              color: themeM.palette.action.active,
                            }}
                          >
                            {profPrograms?.[prof.id]
                              ?.map((program) => program.name)
                              .join(", ") || "Nema"}
                          </Typography>
                        </td>
                        <td
                          style={{
                            padding: "0 12px",
                            flex: 1,
                            height: "fit-content",
                            border: 0,
                          }}
                        >
                          {/* <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                            }}
                          > */}
                          {/* <Avatar
                              size="sm"
                              sx={{ bgcolor: themeM.palette.primary.main }}
                            >
                              {theme1.user.firstName.charAt(0).toUpperCase()}
                            </Avatar> */}
                          {/* <Typography
                                level="body-xs"
                                sx={{
                                  color: themeM.palette.action.active,
                                }}
                              >
                                {theme1.user.firstName} {theme1.user.lastName}
                              </Typography> */}
                          <MuiTypo
                            sx={{
                              color: themeM.palette.action.active,
                              display: "-webkit-box", // Neophodno za multi-line truncation
                              WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                              WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
                              lineHeight: "1", // Podešava razmak između linija
                              height: "1.2em", // Fiksna visina: broj linija * lineHeight
                              textOverflow: "ellipsis", // Dodaje tri tačke
                              fontWeight: "normal",
                            }}
                          >
                            {prof.email}
                          </MuiTypo>
                          {/* </Box> */}
                        </td>
                      </tr>
                    ))
                )}
              </TableBody>
            </Table>
          </Sheet>
        </JoyCssVarsProvider>
      </MuiThemeProvider>
    </>
  );
}
