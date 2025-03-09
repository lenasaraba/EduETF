import * as yup from "yup";

export const formValidation = yup.object().shape({
  topic: yup.string().required("Tema ankete je obavezna."),
  endDate: yup.string().required("Datum kraja ankete je obavezan."),
  options: yup
    .array()
    .of(
      yup.object().shape({
        text: yup.string().required("Tekst opcije je obavezan."),
      })
    )
    .min(1, "Morate dodati barem jednu opciju.")
    .required("Opcije su obavezne."),
    multipleAnswer: yup
    .boolean()
});
