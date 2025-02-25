import { CardMedia } from "@mui/material";
import { StudyProgram, Year } from "../../../app/models/course";
import slikaZO1 from "../../../assets/zo1.jpg";
import slikaZO2 from "../../../assets/zo2.jpg";

// import slikaRII1 from "../../../assets/rii1.jpg";
// import slikaRII2 from "../../../assets/rii2.png";
import slikaRII3 from "../../../assets/ri3.jpg";
import slikaRII4 from "../../../assets/ri4.jpg";
// import slikaAIE1 from "../../../assets/electr1.jpg";
// import slikaAIE2 from "../../../assets/electr2.jpg";
import slikaAIE3 from "../../../assets/aie3.jpg";
import slikaAIE4 from "../../../assets/aie4.jpg";
// import slikaEE1 from "../../../assets/ee1.jpg";
// import slikaEE2 from "../../../assets/ee2.jpg";
import slikaEE3 from "../../../assets/ee3.jpg";
import slikaEE4 from "../../../assets/ee4.jpg";
import freeTopic from "../../../assets/FreeTopic.jpg";

interface Props {
  year: Year;
  studyProgram: StudyProgram;
  sx: object;
}
export default function CourseCardMedia({ year, studyProgram, sx }: Props) {
  let slika;
  if (year != undefined && studyProgram != undefined) {
    if (year.id == 1 && studyProgram.id == 4) slika = slikaZO1;
    if (year.id == 2 && studyProgram.id == 4) slika = slikaZO2;

    // if (year.id == 1 && studyProgram.id == 1) slika = slikaRII1;

    // if (year.id == 2 && studyProgram.id == 1) slika = slikaRII2;

    if (year.id == 3 && studyProgram.id == 1) slika = slikaRII3;

    if (year.id == 4 && studyProgram.id == 1) slika = slikaRII4;

    // if (year.id == 1 && studyProgram.id == 2) slika = slikaAIE1;

    // if (year.id == 2 && studyProgram.id == 2) slika = slikaAIE2;

    if (year.id == 3 && studyProgram.id == 2) slika = slikaAIE3;

    if (year.id == 4 && studyProgram.id == 2) slika = slikaAIE4;

    // if (year.id == 1 && studyProgram.id == 3) slika = slikaEE1;

    // if (year.id == 2 && studyProgram.id == 3) slika = slikaEE2;

    if (year.id == 3 && studyProgram.id == 3) slika = slikaEE3;

    if (year.id == 4 && studyProgram.id == 3) slika = slikaEE4;
  } else slika = freeTopic;

  return <CardMedia component="img" sx={sx} image={slika} />;
}
