import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Grid,
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Button,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { validationSchema } from "./forumpageValidation";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { createThemeAsync } from "./themeSlice";
import { useNavigate } from "react-router-dom";
import { fetchCoursesListAsync } from "../onlineStudy/courseSlice";

export default function CreateTheme() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const enrolledCourses = useAppSelector((state) => state.course.allCourses);
  const user = useAppSelector((state) => state.account.user);
  const status = useAppSelector((state) => state.course.status);

  const [isFreeTopic, setIsFreeTopic] = useState(false);
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema(isFreeTopic)),
  });

  const {
    control,
    setValue,
    trigger,
    clearErrors,
    register,
    formState: { errors },
  } = methods;

  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    const localDate = new Date();
    const offset = localDate.getTimezoneOffset();

    const adjustedDate = new Date(localDate.getTime() - offset * 60000);
    const newTheme = {
      title: data.title,
      description: data.description,
      date: adjustedDate.toISOString(),
      courseId: data.courseId,
    };
    const resultAction = await dispatch(createThemeAsync(newTheme));

    if (createThemeAsync.fulfilled.match(resultAction)) {
      navigate(`/forum/${resultAction.payload.id}`);
    } else {
      console.error("Failed to create theme:", resultAction.payload);
    }
  };
  useEffect(() => {
    if (isInitialized) {
      trigger();
    } else {
      setIsInitialized(true);
    }
  }, [isFreeTopic, trigger]);
  const navigate1 = useNavigate();

  const handleClose = () => {
    navigate1(-1);
  };

  useEffect(() => {
    dispatch(fetchCoursesListAsync());
  }, []);


  let courses: typeof enrolledCourses = [];

  if (user?.role === "Profesor") {
    courses =
      enrolledCourses?.filter((course) =>
        course.professorsCourse?.some(
          (pc) => pc.user.username === user.username && pc.withdrawDate == null
        )
      ) || [];
  } else if (user?.role === "Student") {
    courses =
      enrolledCourses?.filter((course) =>
        course.usersCourse?.some(
          (uc) => uc.user?.username === user.username && uc.withdrawDate == null
        )
      ) || [];
  }
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
            direction: "column",
            gap: 4,
            width: "100%",
            padding: 2,
            paddingX: 4,
            backgroundColor: "background.default",
            borderRadius: "20px",
            border: "2px solid",
            borderColor: "primary.main",
            display: "flex",
            flexDirection: "column",
            height: "75%",
            maxHeight: "75%",
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontFamily: "Raleway, sans-serif" }}
            mb={1}
          >
            Kreiranje teme
          </Typography>

          <Grid sx={{ paddingLeft: 0 }}>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Naslov"
                  variant="outlined"
                  fullWidth
                  {...register("title", {
                    required: "Title is required.",
                  })}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ""}
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
                    required: "Description is required.",
                  })}
                  sx={{ height: "8rem", maxHeight: "8rem" }}
                />
              )}
            />
          </Grid>
          <Grid sx={{ padding: 0 }}>
            <Controller
              name="freeTopic"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ height: "2rem", maxHeight: "2rem" }}
                      {...field}
                      name="freeTopic"
                      checked={isFreeTopic}
                      value={isFreeTopic}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setIsFreeTopic(isChecked);
                        if (isChecked) {
                          setValue("courseId", "0");
                          clearErrors("courseId");
                        } else {
                          setValue("courseId", "0", { shouldValidate: true });
                          trigger();
                        }
                        setValue("freeTopic", isChecked);
                      }}
                      color="primary"
                    />
                  }
                  label="Slobodna tema"
                />
              )}
            />
          </Grid>
          <Grid sx={{ padding: 0 }}>
            <FormControl
              fullWidth
              disabled={isFreeTopic}
              sx={{ height: "3rem", maxHeight: "3rem" }}
              error={!!errors.courseId}
            >
              <InputLabel id="courseId-label">Kurs</InputLabel>
              <Controller
                name="courseId"
                control={control}
                rules={{
                  required: "Izbor kursa je obavezan!", 
                }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      labelId="courseId-label"
                      value={field.value || "0"}
                      label="Kurs"
                      error={!!fieldState.error} 
                      onChange={(e) => {
                        setValue("courseId", e.target.value || "0", {
                          shouldValidate: true,
                        });
                        if (fieldState.error) {
                          clearErrors("courseId");
                        }
                        trigger();
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 120,
                            overflowY: "auto",
                          },
                        },
                      }}
                      sx={{
                        color: fieldState.error ? "error.main" : "inherit", 
                        "& .MuiSelect-icon": {
                          color: fieldState.error ? "error.main" : "inherit", 
                        },
                      }}
                    >
                      <MenuItem value={0}>
                        {status == "pendingFetchCoursesList"
                          ? "Učitavanje..."
                          : "Nema kursa"}
                      </MenuItem>
                      {courses?.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <FormHelperText>
                        {fieldState.error?.message || "Greška u izboru kursa"}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </FormControl>
          </Grid>

          <Grid
            sx={{ display: "flex", justifyContent: "space-evenly", padding: 0 }}
          >
            <Button onClick={handleClose}>Odustani</Button>
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
