import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  styled,
  Chip,
} from "@mui/material";
import { Theme } from "../../../app/models/theme";
import { Link } from "react-router-dom";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import CourseCardMedia from "../../onlineStudy/components/CourseCardMedia";
import PersonOffIcon from "@mui/icons-material/PersonOff";

interface ThemeCardProps {
  theme: Theme;
}

export default function ThemeCard({ theme }: ThemeCardProps) {
  const StyledCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: 0,
    height: "100%",
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: "transparent",
      // cursor: "pointer",
      border: "1px solid",
      borderColor: theme.palette.background.paper,
    },
    "&:focus-visible": {
      outline: "3px solid",
      outlineColor: "hsla(210, 98%, 48%, 0.5)",
      outlineOffset: "2px",
    },
  }));

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", width: "100%", padding: 0 }}>
      <StyledCard
        variant="outlined"
        // onFocus={() => handleFocus(index)}
        // onBlur={handleBlur}
        // tabIndex={index}
        // className={focusedCardIndex === index ? "Mui-focused" : ""}
        sx={{
          // backgroundColor:"secondary.main",
          justifyContent: "space-evenly",
          height: "100%",
          border: "none",
          borderRadius: "16px",
          boxShadow: (theme) =>
            `0px 4px 12px ${theme.palette.mode === "light" ? "#ddd" : "#333"}`,
          overflow: "hidden",
          position: "relative",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: (theme) =>
              `0px 8px 30px ${theme.palette.mode === "light" ? "#ddd" : "#333"}`,
          },
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
            margin: 0,
          }}
        >
          <CourseCardMedia
            year={theme.course?.year}
            studyProgram={theme.course?.studyProgram}
            sx={{
              height: { sm: "auto", md: "50%" },
              aspectRatio: { sm: "16 / 9", md: "" },
              filter: "brightness(0.6)", // Tamniji filter da bi tekst bio čitljiv
            }}
          />
          {/* <Avatar
            sx={{
              textAlign: "center",
              bgcolor: "primary.main",
              height: 70,
              width: 70,
              margin: 0,
              mb: 2,
            }}
          >
            <Box sx={{ textAlign: "center", fontSize: "25pt", margin: 0 }}>
              {theme.title.charAt(0).toUpperCase()}
            </Box>
          </Avatar> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
              padding: 1,
            }}
          >
            <Typography
              component={Link}
              to={`/forum/${theme.id}`}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "clamp(12pt, 16pt, 18pt)",
                fontFamily: "Raleway, sans-serif",
                textDecoration: "none", // Uklanja podvlačenje linka

                overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
                display: "-webkit-box", // Neophodno za multi-line truncation
                WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
                lineHeight: "1.2", // Podešava razmak između linija
                height: "1.2em", // Fiksna visina: broj linija * lineHeight
                textOverflow: "ellipsis", // Dodaje tri tačke

                color: "text.primary", // Koristi boju teksta iz roditeljskog elementa
                "&:visited": {
                  color: "text.primary", // Zadrži istu boju za visited linkove
                },
                "&:hover": {
                  color: "primary.main", // Zadrži istu boju pri hover-u
                  cursor: "pointer",
                },
                "&:active": {
                  color: "text.primary", // Zadrži istu boju pri aktivnom linku
                },
              }}
            >
              {theme.title}
            </Typography>
            <Chip
              label={theme.course ? theme.course.name : "Slobodna tema"}
              sx={{
                border: "1px solid",
                borderColor: "primary.main",
                fontFamily: "Raleway, sans-serif",
                backgroundColor: "transparent",
                fontSize: "0.7em",
              }}
            />
          </Box>
        </Box>
        <CardContent>
          {/* <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "clamp(9pt, 10pt, 11pt)" }}
          >
            Opis: <br />{" "}
          </Typography> */}
          <Typography
            sx={{
              color: "text.primary",
              overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
              display: "-webkit-box", // Neophodno za multi-line truncation
              WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
              WebkitLineClamp: 3, // Maksimalan broj linija (menjajte po potrebi)
              lineHeight: "1", // Podešava razmak između linija
              height: "3em", // Fiksna visina: broj linija * lineHeight
              textOverflow: "ellipsis", // Dodaje tri tačke
              fontSize: "clamp(10pt, 11pt, 14pt)",
              mb: 2,
            }}
          >
            {theme.description}
          </Typography>
          <Box
            sx={{
              margin: 0,
              padding: 0,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                // mt: 2,
              }}
            >
              {theme.user ? (
                <>
                  <PersonPinRoundedIcon
                    sx={{
                      fontSize: "1rem",
                      color: "text.secondary",
                      // mr: 0.5,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.9rem",
                      color: "text.secondary",
                      fontFamily: "Raleway, sans-serif",
                      paddingLeft: 1,
                    }}
                  >
                    {theme.user?.firstName + " " + theme.user?.lastName}
                  </Typography>
                </>
              ) : (
                <>
                  <PersonOffIcon
                    sx={{
                      fontSize: "1rem",
                      color: "gray",
                      // mr: 0.5,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.9rem",
                      color: "gray",
                      fontFamily: "Raleway, sans-serif",
                      paddingLeft: 1,
                    }}
                  >
                    [Obrisan korisnik]
                  </Typography>
                </>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                // mt: 2,
              }}
            >
              <ChatBubbleOutlineIcon
                sx={{
                  fontSize: "1rem",
                  color: "text.secondary",
                  // mr: 0.5,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.9rem",
                  color: "text.secondary",
                  fontFamily: "Raleway, sans-serif",
                  paddingLeft: 1,
                }}
              >
                {theme.messages.length}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
}
