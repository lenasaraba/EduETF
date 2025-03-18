import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Grid, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { StudyProgram, Year } from "../../../app/models/course";

interface Props {
  programs: StudyProgram[];
  years: Year[];
  onChange: (pr: string[], yr: string[]) => void;
}

export default function FilterSelectChip({ programs, years, onChange }: Props) {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [isOpenP, setIsOpenP] = useState(false); 

  const [isOpenY, setIsOpenY] = useState(false); 

  const [alignLeft, setAlignLeft] = useState(false); 
  const [alignRight, setAlignRight] = useState(false); 

  const typographyRef = useRef<HTMLDivElement | HTMLSpanElement>(null); 
  const [typographyWidth, setTypographyWidth] = useState(0); 

  const boxRef = useRef<HTMLDivElement | HTMLSpanElement>(null);
  const [boxWidth, setBoxWidth] = useState(0); 

  const typographyRef2 = useRef<HTMLDivElement | HTMLSpanElement>(null); 
  const [typographyWidth2, setTypographyWidth2] = useState(0); 

  const boxRef2 = useRef<HTMLDivElement | HTMLSpanElement>(null);
  const [boxWidth2, setBoxWidth2] = useState(0); 
  useEffect(() => {
    if (typographyRef.current) {
      setTypographyWidth(typographyRef.current.offsetWidth); 
    }
  }, [alignLeft]); 

  useEffect(() => {
    const updateWidths = () => {
      if (boxRef.current) setBoxWidth(boxRef.current.offsetWidth);
      if (boxRef2.current) setBoxWidth2(boxRef2.current.offsetWidth);
    };
    updateWidths();
    window.addEventListener("resize", updateWidths);
    return () => {
      window.removeEventListener("resize", updateWidths);
    };
  }, []);
  useEffect(() => {
    if (typographyRef2.current) {
      setTypographyWidth2(typographyRef2.current.offsetWidth); 
    }
  }, [alignRight]);
  const toggleYears = () => {
    setIsOpenY((prev) => !prev); 
    setAlignLeft((prev) => !prev); 
  };

  const togglePrograms = () => {
    setIsOpenP((prev) => !prev); 
    setAlignRight((prev) => !prev);
  };

  const handleProgramChange = (
    event: ChangeEvent<HTMLInputElement>,
    program: string
  ) => {
    const updatedPrograms = event.target.checked
      ? [...selectedPrograms, program]
      : selectedPrograms.filter((p) => p !== program);

    setSelectedPrograms(updatedPrograms);
    onChange(updatedPrograms, selectedYears);
  };

  const handleYearChange = (
    event: ChangeEvent<HTMLInputElement>,
    year: string
  ) => {
    const updatedYears = event.target.checked
      ? [...selectedYears, year]
      : selectedYears.filter((y) => y !== year);

    setSelectedYears(updatedYears);
    onChange(selectedPrograms, updatedYears);
  };

  return (
    <Box
      sx={{
        display: "flex",
        m: 0,
        padding: 0,
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: "45%" } }}>
        <Box
          ref={boxRef2}
          sx={{
            mb: 1,
            width: "100%",
            color: "primary.main",
            position: "relative", 
            "&:hover": {
              cursor: "pointer",
              color: "text.primary",
            },
          }}
          onClick={togglePrograms}
        >
          <Typography
            ref={typographyRef2}
            sx={{
              width: "fit-content",
              fontSize: "clamp(12px, 14px, 16px)",
              fontFamily: "Raleway, sans-serif",
              display: "flex",
              alignItems: "center",
              position: "relative",
              left:
                typographyWidth2 > 0 && boxWidth2 > 0
                  ? alignRight
                    ? `${boxWidth2 - typographyWidth2}px`
                    : "0" 
                  : "auto",
              textAlign: alignRight ? "right" : "left",
              transition: "left 0.8s ease-in-out", 
            }}
          >
            <FilterAltIcon />
            Smjerovi
          </Typography>
        </Box>

        <Grid
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: 0.5, 
          }}
        >
          {isOpenP &&
            programs.map((program, index) => (
              <Grid
                item
                key={program.id}
                sx={{
                  overflow: "hidden", 
                  width: "100%", 
                  paddingLeft:
                    index % 2 !== 0
                      ? `${boxWidth2 / 6.1}px`
                      : `${boxWidth2 / 11}px`,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedPrograms.includes(program.name)}
                      onChange={(e) => handleProgramChange(e, program.name)}
                    />
                  }
                  label={program.name}
                  sx={{
                    margin: 0, 
                    display: "flex", 
                    alignItems: "center", 
                    width: "100%", 
                    "& .MuiCheckbox-root": {
                      marginRight: 2, 
                    },
                  }}
                  slotProps={{
                    typography: {
                      fontFamily: "Raleway, sans-serif",
                      fontSize: "clamp(12px, 14px, 16px)", 
                      display: "inline", 
                      alignItems: "center",
                      textAlign: "left", 
                      whiteSpace: "nowrap", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis", 
                      width: "100%", 
                    },
                  }}
                />
              </Grid>
            ))}
        </Grid>
      </Box>
      <Box
        sx={{
          width: "45%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Box
          ref={boxRef}
          sx={{
            mb: 1,
            width: "100%",
            color: "primary.main",
            position: "relative",
            "&:hover": {
              cursor: "pointer",
              color: "text.primary",
            },
          }}
          onClick={toggleYears}
        >
          <Typography
            ref={typographyRef}
            sx={{
              width: "fit-content",
              fontSize: "clamp(12px, 14px, 16px)",
              fontFamily: "Raleway, sans-serif",
              display: "flex",
              alignItems: "center",
              position: "relative",
              textAlign:
                typographyWidth > 0 && boxWidth > 0
                  ? alignLeft
                    ? "left"
                    : "right"
                  : "auto", 
              left:
                typographyWidth > 0 && boxWidth > 0
                  ? alignLeft
                    ? "0" 
                    : `${boxWidth - typographyWidth}px` 
                  : "auto", 
              visibility:
                typographyWidth > 0 && boxWidth > 0 ? "visible" : "hidden", 
              transition:
                typographyWidth > 0 && boxWidth > 0
                  ? "left 0.8s ease-in-out"
                  : "none",
            }}
          >
            <FilterAltIcon />
            Godine
          </Typography>
        </Box>

        <Grid
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: 0.5, 
          }}
        >
          {isOpenY &&
            years.map((year) => (
              <Grid
                key={year.id} 
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "fit-content",
                }} 
              >
                <FormControlLabel
                  key={year.id}
                  control={
                    <Checkbox
                      checked={selectedYears.includes(year.name)}
                      onChange={(e) => handleYearChange(e, year.name)}
                    />
                  }
                  label={year.name}
                  sx={{ margin: 0 }}
                  slotProps={{
                    typography: {
                      fontFamily: "Raleway,sans-serif",
                      fontSize: "clamp(12px, 14px, 16px)",
                      display: "flex",
                      alignItems: "center",
                    },
                  }}
                />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
}
