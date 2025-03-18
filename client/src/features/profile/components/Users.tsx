import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BadgeTwoToneIcon from "@mui/icons-material/BadgeTwoTone";
import GroupsTwoToneIcon from "@mui/icons-material/GroupsTwoTone";

export default function Users() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        width: "100%",
      }}
    >
      <Box sx={{ width: "50%" }}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
          <Typography
            variant="h5"
            align="center"
            color="primary.main"
            gutterBottom
          >
            Izaberite listu korisnika
          </Typography>

          <Box
            sx={{
              marginTop: 5,
              display: "flex",
              justifyContent: "space-around",
              flexDirection:{xs:"column", sm:"column", md:"row"},
              gap:{xs:2, sm:2, md:3}
            }}
          >
            <Paper
              elevation={2}
              sx={{
                padding: 3,
                textAlign: "center",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                "&:hover": { backgroundColor: "primary.dark" },
                justifyContent:"center"
              }}
              onClick={() => navigate("/users/students")}
            >
              <GroupsTwoToneIcon />
              <Typography variant="h6" sx={{ ml: 1, color: "text.primary" }}>
                Spisak studenata
              </Typography>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                padding: 3,
                textAlign: "center",
                cursor: "pointer",
                alignItems: "center",
                display: "flex",
                "&:hover": { backgroundColor: "primary.dark" },
                justifyContent:"center"

              }}
              onClick={() => navigate("/users/professors")}
            >
              <BadgeTwoToneIcon />
              <Typography variant="h6" sx={{ ml: 1, color: "text.primary" }}>
                Spisak profesora
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
