import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { Link, useNavigate } from "react-router-dom";
import { Grid } from "@mui/joy";
import { useAppSelector } from "../../../app/store/configureStore";

export default function AppAppBar() {
  const user = useAppSelector((state) => state.account.user);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/onlineStudy", { replace: true });
  };
  return (
    <Box
      sx={{
        boxShadow: 0,
        bgcolor: "background.paper",
        borderRadius: "22px",

        backgroundImage: "none",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          margin: 0,
          width: "100%",
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            padding: 0,
            width: "70%",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,

              display: "flex",
              flexDirection: { xs: "column", sm: "row", md: "row" },
              alignItems: "center",
              px: 0,
              justifyContent: "space-evenly",
              margin: 0,
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                margin: 0,
                padding: 0,
              }}
            >
              <Button
                variant="text"
                size="small"
                sx={{
                  paddingX: 2,
                  borderRadius: "25pt",
                  color: "text.primary",
                  fontWeight: "bold",
                  transition: "all 0.5s ease", 
                  backgroundColor: "transparent",
                  "&:hover": {
                    color: "action.hover", 
                    backgroundColor: "action.active",
                  },
                  fontFamily: "Raleway, sans-serif",
                }}
                component={Link}
                to="/courses?type=all"
              >
                Svi kursevi
              </Button>
            </Box>
            {user && user.role == "Profesor" && (
              <>
                <Box
                  onClick={handleNavigate}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer", 
                    "&:hover": {
                      cursor: "pointer", 
                    },
                  }}
                >
                  <AutoStoriesIcon
                    sx={{
                      color: "text.primary",
                      fontWeight: "bold",
                      margin: 0,
                      padding: 0,
                      transition: "all 0.5s ease", 
                      "&:hover": {
                        color: "primary.main", 
                      },
                      fontFamily: "Raleway, sans-serif",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display:"flex" ,
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <Button
                    variant="text"
                    size="small"
                    sx={{
                      paddingX: 2,
                      borderRadius: "25pt",
                      color: "text.primary",
                      fontWeight: "bold",
                      transition: "all 0.5s ease",
                      backgroundColor: "transparent",
                      "&:hover": {
                        color: "action.hover", 
                        backgroundColor: "action.active",
                      },
                      fontFamily: "Raleway, sans-serif",
                    }}
                    component={Link}
                    to="/courses?type=my"
                  >
                    Moji kursevi
                  </Button>
                </Box>
              </>
            )}
            {user && user.role == "Student" && (
              <>
                <Box
                  onClick={handleNavigate}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer", 
                    "&:hover": {
                      cursor: "pointer", 
                    },
                  }}
                >
                  <AutoStoriesIcon
                    sx={{
                      color: "text.primary",
                      fontWeight: "bold",
                      margin: 0,
                      padding: 0,
                      transition: "all 0.5s ease", 
                      "&:hover": {
                        color: "primary.main", 
                      },
                      fontFamily: "Raleway, sans-serif",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display:"flex" ,
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <Button
                    variant="text"
                    size="small"
                    sx={{
                      paddingX: 2,
                      borderRadius: "25pt",
                      color: "text.primary",
                      fontWeight: "bold",
                      transition: "all 0.5s ease", 
                      backgroundColor: "transparent",
                      "&:hover": {
                        color: "action.hover", 
                        backgroundColor: "action.active",
                      },
                      fontFamily: "Raleway, sans-serif",
                    }}
                    component={Link}
                    to="/courses?type=myLearning"
                  >
                    Moje učenje
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Toolbar>
      </Grid>
    </Box>
  );
}
