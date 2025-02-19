import React from "react";
import {
  Avatar,
  Box,
  Grid,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import { UsersCourse } from "../../../app/models/course";

interface StudentProps {
  students: UsersCourse[] | null;
}

const StudentsOnCourse: React.FC<StudentProps> = ({ students }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        // height: "50vh", // Ograničena visina od 50vh
        width: "100%", // Širina se prilagođava roditeljskoj komponenti (xs={4})
        overflow: "hidden", // Sprečava prekomerno skrolovanje
        display: "flex",
        flexDirection: "column",
      }}
    >
      {students && students.length > 0 ? (
        <Box
          sx={{
            // overflowY: "auto", // Omogućava vertikalno skrolovanje unutar okvira ako je potrebno
            padding: 2,
            paddingY: { xs: 2, md: 0 },
            // paddingRight:0,
            // overflowX:"visible",
            height: "100%", // Koristi celu visinu dostupnu unutar 50vh okvira
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {students.map((student, index) => {
            const { id, enrollDate, withdrawDate, user } = student;
            const formattedEnrollDate = new Date(enrollDate).toLocaleDateString(
              "sr-RS"
            );
            const formattedWithdrawDate =
              withdrawDate !== "0001-01-01T00:00:00" && withdrawDate != null
                ? new Date(withdrawDate).toLocaleDateString("sr-RS")
                : "danas";
            // console.log(withdrawDate);
            return (
              <Box
                key={id}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[6],
                  borderRadius: 3,
                  padding: { xs: 1, sm: 2 },
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 1 },
                  flexDirection: { xs: "column", sm: "column", md: "row" },
                  justifyContent: {
                    xs: "center",
                    sm: "center",
                    md: "space-between",
                  },
                  height: "auto",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
              >
                {/* Avatar - Smanjen na malim ekranima */}
                <Avatar
                  sx={{
                    width: { xs: 30, sm: 45 },
                    height: { xs: 30, sm: 45 },
                    fontSize: { xs: "0.9rem", sm: "1.2rem" },
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.common.white,
                  }}
                >
                  {user.firstName.charAt(0).toUpperCase()}
                </Avatar>

                {/* Glavni podaci o studentu */}
                <Box
                  sx={{
                    flex: 1,
                    textAlign: { xs: "center", sm: "left", md: "left" },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: { xs: "0.8rem", sm: "1rem", md: "1rem" },
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.7rem", sm: "0.875rem", md: "0.95rem" },
                    }}
                  >
                    {user.email}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.8rem" },
                    }}
                  >
                    {formattedEnrollDate} - {formattedWithdrawDate}
                  </Typography>
                </Box>

                {/* Status - Premešten ispod na malim ekranima */}
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.7rem", sm: "0.875rem", md: "0.9rem" },
                    textAlign: "center",
                    mt: { xs: 0.5, sm: 0 }, // Dodat mali razmak na XS ekranu
                  }}
                >
                  {withdrawDate !== "0001-01-01T00:00:00" &&
                  withdrawDate !== null
                    ? "Ispisan"
                    : "Upisan"}
                </Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box sx={{ py: 8, textAlign: "center", width: "100%" }}>
          <Typography variant="h4" sx={{ color: theme.palette.text.secondary }}>
            Nema upisanih studenata
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StudentsOnCourse;
