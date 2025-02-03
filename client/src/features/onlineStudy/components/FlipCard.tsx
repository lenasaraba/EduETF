import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Course } from "../../../app/models/course";
import CourseCardMedia from "./CourseCardMedia";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../app/store/configureStore";

const FlipCardContainer = styled("div")({
  perspective: "1000px", // Dodajemo perspektivu za 3D efekat
  width: "100%",
  height: "300px",
  margin: "20px auto",
  position: "relative",
});

const FlipCardInner = styled("div")({
  width: "100%",
  height: "100%",
  position: "relative",
  transformStyle: "preserve-3d",
  transition: "transform 1s", // Animacija tokom okretanja
  "&:hover": {
    transform: "rotateY(180deg)", // Efekat okretanja na hover
  },
});

const FlipCardSide = styled(Box)({
  width: "100%",
  height: "100%",
  position: "absolute",
  backfaceVisibility: "hidden", // Sakrivamo zadnju stranu
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
});

const FlipCardFront = styled(FlipCardSide)({
  //   backgroundImage: "url('https://source.unsplash.com/random/300x400')", // Zameni URL
  // backgroundColor:"green",
  backgroundSize: "cover",
  backgroundPosition: "center",
});

const FlipCardBack = styled(FlipCardSide)({
  backgroundColor: "text.primary", // Plava boja pozadine za zadnju stranu
  transform: "rotateY(180deg)", // Okrećemo zadnju stranu
  padding: "20px",
});

interface Props {
  course: Course;
  handleDeleteClick: ( event: React.MouseEvent<HTMLElement>,
    type: "course" | "theme",
    item: any) => void;

}

export default function FlipCard({ course, handleDeleteClick }: Props) {
  const user = useAppSelector((state) => state.account.user);
  // console.log(course.professorsCourse);
  

  return (
    <FlipCardContainer>
      <FlipCardInner>
        {/* Prednja strana kartice */}
        <FlipCardFront>
          <CourseCardMedia
            year={course.year}
            studyProgram={course.studyProgram}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1, // pozadina
              objectFit: "cover", // slika se prilagođava
              borderRadius: "16px",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              padding: "16px",
              background: "rgba(0, 0, 0, 0.6)", // tamna pozadina
              color: "white",
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px",
            }}
          >
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              {course.name}
            </Typography>
          </Box>
        </FlipCardFront>

        {/* Zadnja strana kartice */}
        <FlipCardBack
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 3,
            backgroundColor: "common.backgroundChannel",
            borderRadius: "16px",
          }}
        >
          <Typography
            sx={{ color: "text.primary" }}
            variant="h6"
            fontWeight="bold"
            gutterBottom
          >
            {course.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Godina:</strong> {course.year.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Smjer:</strong> {course.studyProgram.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{
              marginTop: "8px",
              fontSize: "clamp(12px, 14px, 16px)",
              overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
              display: "-webkit-box", // Neophodno za multi-line truncation
              WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
              WebkitLineClamp: 3, // Maksimalan broj linija (menjajte po potrebi)
              lineHeight: "1.2", // Podešava razmak između linija

              height: "3.6em", // Fiksna visina: broj linija * lineHeight
              textOverflow: "ellipsis",
            }}
          >
            {course.description}
          </Typography>
          <Box
            sx={{
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              mt: 2,
              width:"100%",
            }}
          >
            <Button
            variant="contained"
              color="secondary"

              component={Link}
              to={`/courses/${course.id}`}
              sx={{
                fontSize:"clamp(8pt, 10pt, 12pt)",
                color: "common.onBackground",
                // backgroundColor:"primary.main",
                borderRadius: "15pt",
              }}
            >
              Otvori
            </Button>
            {user &&
            course.professorsCourse.some(
              (pc) => pc.user.username === user.username
            ) ? (
              <Button
                variant="contained"
                color="error"
                sx={{
                  fontSize:"clamp(8pt, 10pt, 12pt)",
                  borderRadius: "15pt",
                }}
                onClick={(event)=>handleDeleteClick(event, "course", course)}
              >
                Obriši kurs
              </Button>
            ) : (
              ""
            )}
          </Box>
        </FlipCardBack>
      </FlipCardInner>
    </FlipCardContainer>
  );
}
