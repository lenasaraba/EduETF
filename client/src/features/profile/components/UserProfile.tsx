import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Grid,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import LaunchIcon from "@mui/icons-material/Launch";
import { updateUser } from "../../account/accountSlice";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const user = useAppSelector((state) => state.account.user);

  // State za mod uređivanja i korisničke podatke
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
  // Handler za promene u input poljima
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Updated data:", formData);

    // Ažuriraj početne podatke sa novim podacima
    setInitialData(formData);
    setIsEditing(false); // Isključi mod uređivanja nakon submita

    // Sprečavamo podrazumevano ponašanje forme
    e.preventDefault();

    // Koristimo formData za slanje ažuriranih podataka
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
        display: "block",
        margin: "auto",
      }}
    >
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2, width: "40vw" }}>
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
              {/* <Typography variant="body2" sx={{ color: "primary.dark" }}>
                Dodatne informacije o profilu
              </Typography> */}
              <Box
                component={Link}
                to={user?.role=="Student"? "/studentHistory":`/professorInfo/${user?.id}`}
                title="Dodatne informacije o profilu"
                sx={{
                  // backgroundColor: "primary.dark",
                  color: "primary.dark",
                  // padding: 0.8,
                  borderRadius: "20pt",
                  minWidth: "2rem",
                  "&:hover": { color: "primary.light" },
                  height: "fit-content",
                  width: "2rem",
                  boxSizing: "border-box",
                  display:"flex", justifyContent:"center",
                }}
              >
                <LaunchIcon sx={{ fontSize: "16pt" }} />
              </Box>
            </Box>
          </div>
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
                  required // Dodajemo da polje bude obavezno
                  error={!formData.firstName} // Obeležava grešku ako polje nije popunjeno
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
                  required // Dodajemo da polje bude obavezno
                  error={!formData.lastName} // Obeležava grešku ako polje nije popunjeno
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
              {/* <Grid item xs={12}>
                <TextField
                  label="Role"
                  name="role"
                  fullWidth
                  value={user!.role}
                  disabled
                />
              </Grid> */}
              <Box sx={{ textAlign: "center", margin: 2, width: "100%" }}>
                <Button
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
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: "text.primary" }}
                  onClick={() => {
                    setFormData(initialData); // Vraćanje na početne podatke
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
                <Typography variant="body1">{formData.firstName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Prezime:
                </Typography>
                <Typography variant="body1">{user!.lastName}</Typography>
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
              {/* <Grid item xs={12}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Rola:
                </Typography>
                <Typography variant="body1">{user!.role}</Typography>
              </Grid> */}
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
