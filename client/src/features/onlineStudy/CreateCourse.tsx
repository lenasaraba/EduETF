import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { createCourseAsync, fetchAllYearsPrograms } from "./courseSlice";
import { useNavigate } from "react-router-dom";
import { validationSchema } from "./courseValidation";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function CreateCourse() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { years, currentCourseLoaded, currentCourse } = useAppSelector(
    (state) => state.course
  );
  const studyPrograms = useAppSelector((state) => state.course.programs);
  const filtersLoaded = useAppSelector((state) => state.course.optionsLoaded);

  const statusC = useAppSelector((state) => state.course.status);

  const [showPassword, setShowPassword] = useState(false);
  const [availableYears, setAvailableYears] = useState(years);
  const [availableStudyPrograms, setAvailableStudyPrograms] =
    useState(studyPrograms);
  const [selectedStudyProgram, setSelectedStudyProgram] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  useEffect(() => {
    if (years) setAvailableYears(years);

    if (studyPrograms) setAvailableStudyPrograms(studyPrograms);

    console.log(availableYears);
    console.log(availableStudyPrograms);


  }, [years, studyPrograms]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchAllYearsPrograms());
  }, [dispatch, filtersLoaded]);

  const {
    control,
    setValue,
    setError,
    register,
    formState: { errors },
  } = methods;

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    console.log(data);
    const localDate = new Date();
    const offset = localDate.getTimezoneOffset();

    const adjustedDate = new Date(localDate.getTime() - offset * 60000);
    const newCourse = {
      name: data.name,
      description: data.description,
      yearId: data.yearId,
      studyProgramId: data.studyProgramId,
      courseCreationDate: adjustedDate.toISOString(),
      password: data.password,
    };
    console.log(newCourse);

    const resultAction = await dispatch(createCourseAsync(newCourse));

    if (createCourseAsync.fulfilled.match(resultAction)) {
      navigate(`/courses/${resultAction.payload.id}`);
      console.log(statusC);
    } else {
      console.log("else" + statusC);
      console.error("Failed to create course:", resultAction.payload);
    }
  };

  // const handleStudyProgramChange = (studyProgramId: string) => {
  //   const id = parseInt(studyProgramId);

  //   setSelectedStudyProgram(id);
  //   if (years && studyPrograms) {
  //     if (id == 0) {
  //       setAvailableYears(years);
  //       setAvailableStudyPrograms(studyPrograms);
  //       setSelectedYear(0);

  //       setTimeout(() => {
  //         console.log("selektovano: godina "+selectedYear+" program: "+selectedStudyProgram) // Dijalog se otvara nakon što se tema postavi
  //       }, 0);

  //     } else if (id === 4) {
  //       setAvailableYears(years.filter((year) => year.id <= 2)); // Zajednička osnova - dozvoljene samo prve dve godine
  //       setAvailableStudyPrograms(studyPrograms); // Samo smjer Zajednička osnova

  //       setTimeout(() => {
  //         console.log("selektovano: godina "+selectedYear+" program: "+selectedStudyProgram) // Dijalog se otvara nakon što se tema postavi
  //       }, 0);

  //     } else {
  //       setAvailableYears(years.filter((year) => year.id >= 3)); // Ostali smjerovi - dozvoljene treća i četvrta godina
  //       setAvailableStudyPrograms(studyPrograms); // Svi osim Zajedničke osnove

  //       setTimeout(() => {
  //         console.log("selektovano: godina "+selectedYear+" program: "+selectedStudyProgram) // Dijalog se otvara nakon što se tema postavi
  //       }, 0);
  //     }
  //   }
  // };

  // const handleYearChange = (yearId: string) => {
  //   const id = parseInt(yearId);
  //   // console.log(yearId);
  //   // console.log(id);
  //   // setSelectedYear(id);
  //   console.log(selectedYear);
  //   console.log(selectedStudyProgram);

  //   if (years && studyPrograms) {
  //     if (id == 0) {
  //       setAvailableStudyPrograms(studyPrograms);
  //       setAvailableYears(years);
  //       setSelectedStudyProgram(0);

  //       setTimeout(() => {
  //         console.log("selektovano: godina "+selectedYear+" program: "+selectedStudyProgram) // Dijalog se otvara nakon što se tema postavi
  //       }, 0);
  //     } else if (id > 0 && id <= 2) {
  //       setAvailableStudyPrograms(
  //         studyPrograms.filter((program) => program.id === 4)
  //       ); // Ako je prva ili druga godina, samo smjer Zajednička osnova
  //       setAvailableYears(years);

  //       setTimeout(() => {
  //         console.log("selektovano: godina "+selectedYear+" program: "+selectedStudyProgram) // Dijalog se otvara nakon što se tema postavi
  //       }, 0);

  //     } else {
  //       setAvailableStudyPrograms(
  //         studyPrograms.filter((program) => program.id !== 4)
  //       ); // Ako je treća ili četvrta godina, svi osim Zajedničke osnove
  //       setAvailableYears(years);

  //       setTimeout(() => {
  //         console.log("selektovano: godina "+selectedYear+" program: "+selectedStudyProgram) // Dijalog se otvara nakon što se tema postavi
  //       }, 0);
  //     }
  //   }
  // };

  useEffect(() => {
    if (selectedStudyProgram) {
      // const filteredYears = years?.filter(y => y.studyProgramId === selectedStudyProgram);
      // setAvailableYears(filteredYears);

      // // Ako odabrani smer nema trenutnu godinu, resetuj
      // if (!filteredYears.some(y => y.id === selectedYear)) {
      //   setSelectedYear("");
      // }
      if (selectedStudyProgram == 0) {
        // const filteredPrograms = studyPrograms?.filter(sp => years?.some(y => y.studyProgramId === sp.id && y.id === selectedYear));
        if (selectedStudyProgram == 0 && selectedYear == 0) {
          setAvailableYears(years);
          setAvailableStudyPrograms(studyPrograms);
        } else {
          setAvailableYears(years);
        }
      } else if (selectedStudyProgram > 0 && selectedStudyProgram <= 3) {
        const filteredYears = years!.filter((y) => y.id >= 3);
        setAvailableYears(filteredYears);
      } else {
        const filteredYears = years!.filter((y) => y.id <= 2);
        setAvailableYears(filteredYears);
      }

      console.log(selectedYear);
      console.log(selectedStudyProgram);
    }
  }, [selectedStudyProgram, years, selectedYear]);

  useEffect(() => {
    if (selectedYear) {
      if (selectedYear == 0) {
        // const filteredPrograms = studyPrograms?.filter(sp => years?.some(y => y.studyProgramId === sp.id && y.id === selectedYear));
        setAvailableStudyPrograms(studyPrograms);
        setAvailableYears(years);

        if (selectedStudyProgram == 0 && selectedYear == 0) {
          setAvailableYears(years);
          setAvailableStudyPrograms(studyPrograms);
        } else {
          setAvailableStudyPrograms(studyPrograms);
        }
      } else if (selectedYear > 0 && selectedYear <= 2) {
        const filteredPrograms = studyPrograms!.filter((sp) => sp.id === 4);
        setAvailableStudyPrograms(filteredPrograms);
      } else {
        const filteredPrograms = studyPrograms!.filter((sp) => sp.id !== 4);
        setAvailableStudyPrograms(filteredPrograms);
      }

      console.log(selectedYear);
      console.log(selectedStudyProgram);

      // const filteredPrograms = studyPrograms?.filter(sp => years?.some(y => y.studyProgramId === sp.id && y.id === selectedYear));
      // setAvailableStudyPrograms(filteredPrograms);

      // // Ako odabrana godina više ne pripada trenutnom programu, resetuj program
      // if (!filteredPrograms.some(sp => sp.id === selectedStudyProgram)) {
      //   setSelectedStudyProgram("");
      // }
    }
  }, [selectedYear, studyPrograms, years, selectedStudyProgram]);

  const handleStudyProgramChange = useCallback((event) => {
    const newProgramId = event.target.value;

    setSelectedStudyProgram(newProgramId);

    if (newProgramId === 0) {
      setSelectedYear(0);
      // trigger("yearId");
      validateFieldY("0");  

      setAvailableYears(years);
      setAvailableStudyPrograms(studyPrograms);
    }
  }, [studyPrograms]);

  const handleYearChange = useCallback((event) => {
    const newYearId=event.target.value;
    setSelectedYear(newYearId);
    if(newYearId===0){
      setSelectedStudyProgram(0);
      // trigger("studyProgramId");
      validateFieldP("0");

      console.log(studyPrograms);
      setAvailableStudyPrograms(studyPrograms);
      console.log(years);

      setAvailableYears(years);

    }
  }, [years]);

  const validateFieldY = (fieldValue) => {
    validationSchema
      .validateAt("yearId", { yearId: fieldValue }) // Validacija samo za "yearId"
      .catch((err) => setError("yearId", { type: "manual", message: err.message })  // Postavljanje greške
    ); // Prikazivanje grešaka



  };
  const validateFieldP = (fieldValue) => {
    validationSchema
      .validateAt("studyProgramId", { studyProgramId: fieldValue }) // Validacija samo za "yearId"
      .catch((err) => setError("studyProgramId", { type: "manual", message: err.message })  // Postavljanje greške
    ); // Prikazivanje grešaka



  };

  if (!filtersLoaded) return <LoadingComponent message="Učitavanje..." />;

  return (
    <Grid
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ width: "40%", padding: 8, minWidth: "fit-content" }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            gap: 4,
            direction: "column",
            width: "100%",
            padding: 2,
            paddingX: 4,
            backgroundColor: "background.default",
            borderRadius: "20px",
            border: "2px solid",
            borderColor: "primary.main",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            maxHeight: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontFamily: "Raleway, sans-serif" }}
            mb={1}
          >
            Dodavanje kursa
          </Typography>

          <Grid sx={{ paddingLeft: 0 }}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Naziv"
                  variant="outlined"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ""}
                  {...register("name", {
                    required: "Naziv kursa je obavezan.",
                  })}
                  sx={{ height: "3rem", maxHeight: "3rem" }}
                />
              )}
            />
          </Grid>

          <Grid sx={{ padding: 0 }}>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Opis"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ""}
                  {...register("description", {
                    required: "Opis kursa je obavezan.",
                  })}
                  sx={{ height: "8rem", maxHeight: "8rem" }}
                />
              )}
            />
          </Grid>

          <Grid
            container
            sx={{
              padding: 0,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box component={Grid} sx={{ width: "48%", margin: 0, padding: 0 }}>
              <FormControl
                fullWidth
                error={!!errors.yearId}
                sx={{ height: "3.5rem", maxHeight: "3.5rem" }}
              >
                <InputLabel id="yearId-label">Godina</InputLabel>
                <Controller
                  name="yearId"
                  control={control}
                  rules={{ required: "Izbor godine je obavezan." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        labelId="yearId-label"
                        value={selectedYear}
                        label="Godina"
                        error={!!fieldState.error}
                        onChange={(e) => {
                          // console.log(e.target.value);
                          handleYearChange(e);

                          setValue(
                            "yearId",
                            e.target.value.toString()
                            || selectedYear.toString()
                            ,
                            {
                              shouldValidate: true,
                            }
                          );
                          // console.log(e.target.value);
                          // setSelectedYear(parseInt(e.target.value));
                          // setTimeout(() => {
                          // }, 1000);
                        }}
                      >
                        <MenuItem value={0}>Izaberite godinu</MenuItem>
                        {availableYears?.map((year) => (
                          <MenuItem key={year.id} value={year.id}>
                            {year.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldState.error && (
                        <FormHelperText>
                          {fieldState.error?.message ||
                            "Greška u izboru godine"}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Box>

            <Box component={Grid} sx={{ width: "48%", margin: 0, padding: 0 }}>
              <FormControl
                fullWidth
                error={!!errors.studyProgramId}
                sx={{ height: "3.5rem", maxHeight: "3.5rem" }}
              >
                <InputLabel id="studyProgramId-label">Smjer</InputLabel>
                <Controller
                  name="studyProgramId"
                  control={control}
                  rules={{ required: "Izbor smjera je obavezan." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        labelId="studyProgramId-label"
                        value={selectedStudyProgram}
                        label="Smjer"
                        error={!!fieldState.error}
                        onChange={(e) => {
                          // console.log(e.target.value);
                          handleStudyProgramChange(e);

                          setValue(
                            "studyProgramId",
                            e.target.value.toString()
                            || selectedStudyProgram.toString()
                            ,
                            {
                              shouldValidate: true,
                            }
                          );

                          // console.log(e.target.value);
                          // setSelectedStudyProgram(parseInt(e.target.value));
                          // setTimeout(() => {
                          // }, 1000);
                        }}
                      >
                        <MenuItem value={0}>Izaberite smjer</MenuItem>
                        {availableStudyPrograms?.map((program) => (
                          <MenuItem key={program.id} value={program.id}>
                            {program.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldState.error && (
                        <FormHelperText>
                          {fieldState.error?.message ||
                            "Greška u izboru smjera"}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Box>
          </Grid>

          <Grid sx={{ padding: 0 }}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Lozinka"
                  variant="outlined"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ""}
                  {...register("password", {
                    required: "Lozinka je obavezna.",
                    minLength: {
                      value: 8,
                      message: "Lozinka mora imati najmanje 8 karaktera.",
                    },
                    maxLength: {
                      value: 20,
                      message: "Lozinka može imati najviše 20 karaktera.",
                    },
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ height: "3.5rem", maxHeight: "3.5rem" }}
                />
              )}
            />
          </Grid>

          <Grid
            sx={{ display: "flex", justifyContent: "space-evenly", padding: 0 }}
          >
            <Button onClick={() => navigate(-1)}>Odustani</Button>
            <LoadingButton
              loading={loading}
              disabled={!methods.formState.isValid}
              type="submit"
              variant="contained"
              color="primary"
            >
              Pošalji
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
}
