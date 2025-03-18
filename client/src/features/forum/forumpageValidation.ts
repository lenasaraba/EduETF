import * as yup from "yup";
export const validationSchema = (isFreeTopic: boolean) =>
  yup.object({
    title: yup
      .string()
      .required("Naslov je obavezan")
      .min(3, "Naslov teme mora imati najmanje 3 karaktera.")
      .max(80, "Naslov teme može imati najviše 80 karaktera."),

    description: yup
      .string()
      .required("Opis je obavezan")
      .min(10, "Opis mora imati najmanje 10 karaktera.")
      .max(180, "Opis može imati najviše 180 karaktera."),
    courseId: isFreeTopic
      ? yup.string()
      : yup
          .string()
          .required("Kurs je obavezan")
          .notOneOf(["0"], "Kurs je obavezan"), 
    freeTopic: yup.boolean(),
  });
