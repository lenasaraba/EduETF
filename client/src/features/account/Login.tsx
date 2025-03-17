import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";
import logo from "../../assets/etf.png";
import { useAppDispatch } from "../../app/store/configureStore";
import { FieldValues, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { signInUser } from "./accountSlice";
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import Alert from "@mui/material/Alert";

import { LoadingButton } from "@mui/lab";
import { LoginButton } from "./components/LoginButton";

const Card = styled(MuiCard)(() => ({
  display: "flex",
  borderRadius: 10,
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: "3rem",
  maxWidth: "550px",
  backgroundColor: "secondary.main",
  margin: "auto",
}));

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  async function submitForm(data: FieldValues) {
    try {
      await dispatch(signInUser(data));

      navigate(location.state?.from || "/");
    } catch (error: any) {
      console.log(error.data);
    }
  }


  return (
    <>
      <CssBaseline />

      <Grid
        container
        sx={{
          flexGrow: 1,
          backgroundImage: `url(${logo})`,
          backgroundSize: "contain",
          backgroundPosition: "right",
          width: "100%",
          filter: "blur(8px)",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: 0,
          bottom: 0,
          zIndex: -1,
        }}
      ></Grid>

      <Grid sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
        <Alert
          severity="info"
          variant="filled"
          sx={{
            color: "text.primary",
            backgroundColor: "background.paper",
            opacity: "80%",
            fontFamily: "Raleway, sans-serif",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          Za prijavu koristite Microsoft nalog koji vam je dodijeljen od strane
          fakulteta.
        </Alert>
        <Card variant="outlined" sx={{ backgroundColor: "secondary.main" }}>
          {/* <SitemarkIcon /> */}
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              mb: 2,
              fontFamily: "Raleway, sans-serif",
            }}
          >
            Prijava
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(submitForm)}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl sx={{ height: "5.5rem", maxHeight: "5.5rem" }}>
              <FormLabel
                htmlFor="email"
                sx={{ fontFamily: "Raleway, sans-serif" }}
              >
                Email
              </FormLabel>
              <TextField
                id="email"
                type="email"
                placeholder="your@email.com"
                autoFocus
                fullWidth
                variant="outlined"
                {...register("email", { required: "Email je obavezan." })}
                error={!!errors.email}
                helperText={errors?.email?.message as string}
              />
            </FormControl>
            <FormControl sx={{ height: "5.5rem", maxHeight: "5.5rem" }}>
              <FormLabel
                htmlFor="password"
                sx={{ fontFamily: "Raleway, sans-serif" }}
              >
                Lozinka
              </FormLabel>
              <TextField
                placeholder="••••••"
                type="password"
                id="password"
                variant="outlined"
                {...register("password", { required: "Lozinka je obavezna." })}
                fullWidth
                error={!!errors.password}
                helperText={errors?.password?.message as string}
              />
            </FormControl>
            <br />
            <LoadingButton
              loading={isSubmitting}
              disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                fontFamily: "Raleway, sans-serif",
                backgroundColor: "common.background",
                color: "common.onBackground",
                border: "1px solid",
                borderColor: "transparent",
                "&:hover": {
                  backgroundColor: "secondary.main",
                  border: "1px solid",
                  borderColor: "common.onBackground",
                },
                "&.MuiLoadingButton-loading": {
                  backgroundColor: "background.paper", // Boja tokom učitavanja
                  border: "2px solid",
                  borderColor: "background.default",
                },
              }}
            >
              Prijavi se
            </LoadingButton>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", mt:2}}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Registruj se koristeći Microsoft nalog")}
              startIcon={<MicrosoftIcon />}
            >
              Registruj se 
            </Button>
            
          </Box>

          {/* -----------------OPEN ID---------------- */}

          {/* <LoginButton/> */}
        </Card>
      </Grid>
    </>
  );
}
