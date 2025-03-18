import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Avatar,
  Grid,
  Paper,
  Button,
  TextField,
  CircularProgress,
  LinearProgress,
  Box,
} from "@mui/material";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import LaunchIcon from "@mui/icons-material/Launch";
import { updateUser } from "../../account/accountSlice";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

const UserProfile = () => {
  const user = useAppSelector((state) => state.account.user);
  const status = useAppSelector((state) => state.account.status);

  const [isEditing, setIsEditing] = useState(false);

  const [initialData, setInitialData] = useState({
    firstName: user!.firstName,
    lastName: user!.lastName,
  });
  const [formData, setFormData] = useState({
    firstName: user!.firstName,
    lastName: user!.lastName,
  });
  const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const LinearBuffer = () => {
    const [progress, setProgress] = useState(0);
    const [buffer, setBuffer] = useState(10);

    const progressRef = useRef(() => {});

    useEffect(() => {
      progressRef.current = () => {
        if (progress >= 100) {
          setProgress(0);
          setBuffer(10);
        } else {
          setProgress((prev) => prev + 5);
          setBuffer((prev) => Math.min(100, prev + Math.random() * 15));
        }
      };
    }, [progress]);

    useEffect(() => {
      const timer = setInterval(() => {
        progressRef.current();
      }, 150);

      return () => clearInterval(timer);
    }, []);

    return (
      <Box sx={{ width: "30%", height: "2vh", mt: 1 }}>
        <LinearProgress
          variant="buffer"
          value={progress}
          valueBuffer={buffer}
        />
      </Box>
    );
  };

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    setInitialData(formData);
    setIsEditing(false); 
    e.preventDefault();
    await dispatch(updateUser(formData));
  };
  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    isChanged;
  return (
    <Box
      sx={{
        m: 0,
        padding: 0,
        paddingLeft: 0,
        paddingRight: 0,
        height: "fit-content",
        display: {xs:"flex", sm:"flex", md:"block"},
        justifyContent:{xs:"center", sm:"center"},
        margin: "auto",

      }}
    >
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2, width: {xs:"80%", sm:"80%", md:"40vw"} }}>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          mb={2}
          sx={{ position: "relative" }}
        >
          <div>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "absolute",
                top: 4,
                right: 1,
              }}
            >
              <Box
                component={Link}
                to={
                  user?.role == "Student"
                    ? "/studentHistory"
                    : `/professorInfo/${user?.id}`
                }
                title="Dodatne informacije o profilu"
                sx={{
                  color: "primary.dark",
                  borderRadius: "20pt",
                  minWidth: "2rem",
                  "&:hover": { color: "primary.light" },
                  height: "fit-content",
                  width: "2rem",
                  boxSizing: "border-box",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <LaunchIcon sx={{ fontSize: "16pt" }} />
              </Box>
            </Box>
          </div>
          {status == "pendingUpdateUser" ? (
            <CircularProgress size={30} />
          ) : (
            <>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: "text.primary",
                  mb: 2,
                }}
              >
                {initialData.firstName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                {initialData.firstName} {initialData.lastName}
              </Typography>
            </>
          )}
          <Typography variant="subtitle1" color="text.secondary">
            @{user!.username} &bull; {user!.role}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {isEditing ? (
            <>
              <Grid item xs={12}>
                <TextField
                  label="Ime"
                  name="firstName"
                  fullWidth
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                  error={!formData.firstName} 
                  helperText={!formData.firstName ? "Ime je obavezno" : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Prezime"
                  name="lastName"
                  fullWidth
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  error={!formData.lastName} 
                  helperText={!formData.lastName ? "Prezime je obavezno" : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Korisničko ime"
                  name="username"
                  fullWidth
                  value={user!.username}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  value={user!.email}
                  disabled
                />
              </Grid>
              <Box sx={{ textAlign: "center", margin: 2, width: "100%" }}>
                <LoadingButton
                  loading={status == "pendingUpdateUser"}
                  loadingIndicator={
                    <CircularProgress size={18} sx={{ color: "white" }} /> 
                  }
                  variant="contained"
                  sx={{
                    backgroundColor: "text.primary",
                    color: "background.default",
                    mr: 1,
                  }}
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                >
                  Sačuvaj izmjene
                </LoadingButton>
                <Button
                  variant="outlined"
                  sx={{ color: "text.primary" }}
                  onClick={() => {
                    setFormData(initialData); 
                    setIsEditing(false);
                  }}
                >
                  Odustani
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Ime:
                </Typography>
                {status == "pendingUpdateUser" ? (
                  <LinearBuffer />
                ) : (
                  <Typography variant="body1">{formData.firstName}</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Prezime:
                </Typography>
                {status == "pendingUpdateUser" ? (
                  <LinearBuffer />
                ) : (
                  <Typography variant="body1">{formData!.lastName}</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Korisničko ime:
                </Typography>
                <Typography variant="body1">{user!.username}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Email:
                </Typography>
                <Typography variant="body1">{user!.email}</Typography>
              </Grid>
              <Box sx={{ textAlign: "center", margin: 2, width: "100%" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "text.primary",
                    color: "background.default",
                  }}
                  onClick={() => setIsEditing(true)}
                >
                  Uredi profil
                </Button>
              </Box>
            </>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserProfile;
