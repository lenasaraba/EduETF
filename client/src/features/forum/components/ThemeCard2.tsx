import { Card, CardContent, Typography, Box, styled } from "@mui/material";
import { Theme } from "../../../app/models/theme";
import { Link } from "react-router-dom";
import CourseCardMedia from "../../onlineStudy/components/CourseCardMedia";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";

interface ThemeCardProps {
  theme: Theme;
}

export default function ThemeCard2({ theme }: ThemeCardProps) {
  const StyledCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: 0,
    height: "100%",
    backgroundColor: theme.palette.secondary.main,
    // "&:hover": {
    //   backgroundColor: "transparent",
    //   // cursor: "pointer",
    //   border: "1px solid",
    //   borderColor: theme.palette.background.paper,
    // },
    "&:focus-visible": {
      outline: "3px solid",
      outlineColor: "hsla(210, 98%, 48%, 0.5)",
      outlineOffset: "2px",
    },
  }));
  console.log({ ...theme });
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        padding: 0,
        "&:visited": {
          color: "text.primary", // Zadrži istu boju za visited linkove
        },
        "&:hover": {
          color: "primary.main", // Zadrži istu boju pri hover-u
        },
        "&:active": {
          color: "text.primary", // Zadrži istu boju pri aktivnom linku
        },
        backgroundColor: "transparent",
      }}
    >
      <StyledCard
        // component={Link}
        // to={`/forum/${theme.id}`}
        variant="outlined"
        // onFocus={() => handleFocus(index)}
        // onBlur={handleBlur}
        // tabIndex={index}
        // className={focusedCardIndex === index ? "Mui-focused" : ""}
        sx={{
          // backgroundColor:"secondary.main",

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
            position: "relative",
            height: "200px", // Fiksna visina slike
            overflow: "hidden",
          }}
        >
          <CourseCardMedia
            year={theme.course?.year}
            studyProgram={theme.course?.studyProgram}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.6)", // Tamniji filter da bi tekst bio čitljiv
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "0",
              // left: "16px",
              color: "white",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              // padding: 2,
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "red",
            }}
          >
            <Typography
              component={Link}
              to={`/forum/${theme.id}`}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "clamp(12pt, 16pt, 20pt)",
                fontFamily: "Raleway, sans-serif",
                textDecoration: "none", // Uklanja podvlačenje linka
                // mt: 2,
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
                display: "-webkit-box", // Neophodno za multi-line truncation
                WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
                lineHeight: "1.2em", // Podešava razmak između linija
                height: "1.2em", // Fiksna visina: broj linija * lineHeight
                textOverflow: "ellipsis", // Dodaje tri tačke

                width: "100%",

                color: "#c4e1f6", // Koristi boju teksta iz roditeljskog elementa
                "&:visited": {
                  color: "#c4e1f6", // Zadrži istu boju za visited linkove
                },
                "&:hover": {
                  color: "primary.main", // Zadrži istu boju pri hover-u
                  cursor: "pointer",
                },
                "&:active": {
                  color: "#c4e1f6", // Zadrži istu boju pri aktivnom linku
                },
              }}
            >
              {theme.title}
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "12pt",
                color: "text.secondary",
                fontFamily: "Raleway, sans-serif",
                mb: 1,
              }}
            >
              {theme.course ? theme.course.name : "Slobodna tema"}
            </Typography>
          </Box>
        </Box>
        {/* <Typography
          sx={{
            textAlign: "center",
            fontSize: "12pt",
            color: "text.secondary",
            fontFamily: "Raleway, sans-serif",
          }}
        >
          {theme.course ? theme.course.name : "Slobodna tema"}
        </Typography> */}

        <CardContent sx={{ padding: 2 }}>
          {/* <Typography
            sx={{
              textAlign: "center",
              fontSize: "12pt",
              color: "text.secondary",
              fontFamily: "Raleway, sans-serif",
            }}
          >
            Autor: {theme.user.firstName + " " + theme.user.lastName}
          </Typography> */}
          {/* <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "clamp(9pt, 10pt, 11pt)" }}
          >
            Opis: <br />{" "}
          </Typography> */}
          <Typography
            sx={{
              color: "text.secondary",
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
              <PersonPinRoundedIcon
                sx={{
                  fontSize: "1rem",
                  color: "text.secondary",
                  // mr: 0.5,
                }}
              />{" "}
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.9rem",
                  color: "text.secondary",
                  fontFamily: "Raleway, sans-serif",
                  paddingLeft: 1,
                }}
              >
                {theme.user.firstName + " " + theme.user.lastName}
              </Typography>
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
