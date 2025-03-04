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
        // overflow: "hidden", // Sprečava prekomerno skrolovanje
        display: "flex",
        flexDirection: "column",
      }}
    >
      {students && students.length > 0 ? (
        <Box
          sx={{
            // overflowY: "auto", // Omogućava vertikalno skrolovanje unutar okvira ako je potrebno
            paddingX: {xs:0, md:2},
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
                flexDirection: { xs: "column", sm: "row" }, // Na malim ekranima kolona, na većim red
                justifyContent: {
                  xs: "center",
                  sm: "space-between",
                },
                height: "auto",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.03)",
                },
                overflow: "hidden", // Sprečava horizontalni skrol
              }}
            >
              {/* Avatar - Dinamički smanjen */}
              <Avatar
                sx={{
                  width: { xs: `calc(30px + 2vw)`, sm: 45 }, // Dinamička širina
                  height: { xs: `calc(30px + 2vw)`, sm: 45 }, // Dinamička visina
                  fontSize: { xs: `calc(0.9rem + 0.5vw)`, sm: "1.2rem" }, // Dinamički font
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  flexShrink: 0, // Sprečava smanjivanje avatara ispod određene veličine
                }}
              >
                {user.firstName.charAt(0).toUpperCase()}
              </Avatar>
            
              {/* Glavni podaci o studentu */}
              <Box
                sx={{
                  flex: 1,
                  textAlign: { xs: "center", sm: "left" },
                  minWidth: 0, // Sprečava prekoračenje teksta
                  overflow: "hidden", // Sprečava horizontalni skrol
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: { xs: `calc(0.8rem + 0.5vw)`, sm: "1rem" }, // Dinamički font
                    whiteSpace: "nowrap", // Sprečava prelazak u novi red
                    overflow: "hidden", // Skriva tekst koji prelazi
                    textOverflow: "ellipsis", // Dodaje "..." ako tekst prelazi
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: `calc(0.7rem + 0.5vw)`, sm: "0.875rem" }, // Dinamički font
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.email}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: `calc(0.6rem + 0.5vw)`, sm: "0.75rem" }, // Dinamički font
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {formattedEnrollDate} - {formattedWithdrawDate}
                </Typography>
              </Box>
            
              {/* Status - Dinamički smanjen i prebačen u novi red na malim ekranima */}
              <Typography
                variant="body2"
                color="primary"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: `calc(0.7rem + 0.5vw)`, sm: "0.875rem" }, // Dinamički font
                  textAlign: "center",
                  mt: { xs: 0.5, sm: 0 }, // Dodat mali razmak na XS ekranu
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flexShrink: 1, // Sprečava smanjivanje ispod određene veličine
                  order: { xs: 1, sm: 0 }, // Na malim ekranima prebacuje status ispod
                }}
              >
                {withdrawDate !== "0001-01-01T00:00:00" && withdrawDate !== null
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
