import { Card, CardContent, Typography, Box, styled } from "@mui/material";
import { Theme } from "../../../app/models/theme";
import { Link } from "react-router-dom";
import CourseCardMedia from "../../onlineStudy/components/CourseCardMedia";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { useAppSelector } from "../../../app/store/configureStore";

interface ThemeCardProps {
  theme: Theme;
}

export default function ThemeCard2({ theme }: ThemeCardProps) {
  const user = useAppSelector((state) => state.account.user);

  const StyledCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: 0,
    height: "100%",
    backgroundColor: theme.palette.secondary.main,
    "&:focus-visible": {
      outline: "3px solid",
      outlineColor: "hsla(210, 98%, 48%, 0.5)",
      outlineOffset: "2px",
    },
  }));
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        padding: 0,
        "&:visited": {
          color: "text.primary", 
        },
        "&:hover": {
          color: "primary.main", 
        },
        "&:active": {
          color: "text.primary", 
        },
        backgroundColor: "transparent",
      }}
    >
      <StyledCard
        variant="outlined"
        sx={{
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
            height: "200px", 
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
              filter: "brightness(0.6)", 
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "0",
              color: "white",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              component={Link}
              to={user ? `/forum/${theme.id}` :`/login`}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "clamp(12pt, 16pt, 20pt)",
                fontFamily: "Raleway, sans-serif",
                textDecoration: "none",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden", 
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1, 
                lineHeight: "1.2em", 
                height: "1.2em",
                textOverflow: "ellipsis", 

                width: "100%",

                color: "#c4e1f6", 
                "&:visited": {
                  color: "#c4e1f6", 
                },
                "&:hover": {
                  color: "primary.main",
                  cursor: "pointer",
                },
                "&:active": {
                  color: "#c4e1f6", 
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

        <CardContent sx={{ padding: 2 }}>
          
          <Typography
            sx={{
              color: "text.secondary",
              overflow: "hidden", 
              display: "-webkit-box", 
              WebkitBoxOrient: "vertical", 
              WebkitLineClamp: 3,
              lineHeight: "1",
              height: "3em", 
              textOverflow: "ellipsis", 
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
              }}
            >
              {theme.user ? (
                <>
                  <PersonPinRoundedIcon
                    sx={{
                      fontSize: "1rem",
                      color: "text.secondary",
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
              }}
            >
              <ChatBubbleOutlineIcon
                sx={{
                  fontSize: "1rem",
                  color: "text.secondary",
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
