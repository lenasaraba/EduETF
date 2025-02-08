import * as yup from "yup";

// Validation schema for course creation
export const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Naziv kursa je obavezan.")
    .min(3, "Naziv kursa mora imati najmanje 3 karaktera.")
    .max(80, "Naziv kursa može imati najviše 80 karaktera."),
  description: yup
    .string()
    .required("Opis kursa je obavezan.")
    .min(10, "Opis kursa mora imati najmanje 10 karaktera.")
    .max(180, "Opis kursa može imati najviše 180 karaktera."),
  yearId: yup
    .string()
    .required("Godina je obavezna.")
    .notOneOf(["0"], "Godina je obavezna."),
  // .positive("ID godine mora biti pozitivan broj.")
  // .integer("ID godine mora biti ceo broj."),
  studyProgramId: yup
    .string()
    .required("Studijski program je obavezan.")
    .notOneOf(["0"], "Studijski program je obavezan."),
  password: yup
    .string()
    .required("Lozinka je obavezna.")
    .min(8, "Lozinka mora imati najmanje 8 karaktera.")
    .max(20, "Lozinka može imati najviše 20 karaktera."),
});
