import { yupResolver } from "@hookform/resolvers/yup";
import {
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CreateForm, CreateOption } from "../../../app/models/form";
import { Form } from "../../../app/models/theme";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { formValidation } from "../formValidation";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { createForm } from "../formSlice";
import { LoadingButton } from "@mui/lab";

interface Props {
  courseId?: number;
  messageId?: number;
  setIsCreatingForm: (value: boolean) => void; // Funkcija za ažuriranje upita
  setNewForms?: (
    value: CreateForm[] | ((prevForms: CreateForm[]) => CreateForm[])
  ) => void;
}
export default function AddNewForm({
  courseId,
  messageId,
  setIsCreatingForm,
  setNewForms,
}: Props) {
  const dispatch = useAppDispatch();
  //   const user = useAppSelector((state) => state.account.user);
  console.log(messageId);
  const theme = useTheme();

  //   const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  //   const [isCreatingForm, setIsCreatingForm] = useState(false); // Stanje za prikaz forme
  //   const [question, setQuestion] = useState(""); // Stanje za pitanje
  //   const [endDate, setEndDate] = useState<Date | null>(null); // Stanje za datum zatvaranja
  //   const [isMultipleAnswer, setIsMultipleAnswer] = useState(false); // Stanje za tip ankete
  //   const [options, setOptions] = useState<CreateOption[]>([]); // Stanje za opcije
  const [isSubmitted, setIsSubmitted] = useState(false);
  const status = useAppSelector((state) => state.form.status);

  interface FormData {
    topic: string;
    endDate: string;
    options: { text: string }[];
    multipleAnswer?: boolean; // Opciono polje, može biti boolean ili undefined
  }

  const methods = useForm<FormData>({
    mode: "all", // Validacija na svaku promjenu
    resolver: yupResolver(formValidation),
    defaultValues: {
      topic: "",
      endDate: "",
      options: [],
      multipleAnswer: false,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    setError,
    register,
    trigger,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: FormData) => {
    if (messageId != 0) {
      setIsSubmitted(true);
      const isValid = await trigger();
      if (!isValid) return;

      try {
        const newForm = {
          topic: data.topic,
          endDate: data.endDate,
          multipleAnswer: data.multipleAnswer || false,
          options: data.options.map((option) => ({ text: option.text })),
          courseId: courseId ? courseId : null,
        };

        console.log("Nova anketa:", newForm);

        await dispatch(createForm(newForm)).unwrap();

        console.log("Anketa uspješno kreirana");

        setIsCreatingForm(false);

        reset();
      } catch (error) {
        console.error("Greška pri kreiranju ankete:", error);
      }
    } else {
      const isValid = await trigger();
      if (!isValid) return;
      const newForm: CreateForm = {
        topic: data.topic,
        endDate: data.endDate,
        multipleAnswer: data.multipleAnswer || false,
        options: data.options.map((option) => ({ text: option.text })),
        messageId: messageId,
      };
      if (setNewForms) {
        setNewForms((prevForms: CreateForm[]) => [...prevForms, newForm]);
      }
      setIsCreatingForm(false);
    }
  };

  const handleAddOption = () => {
    const currentOptions = getValues("options");
    const newOptions = [...currentOptions, { text: "" }];
    setValue("options", newOptions, { shouldValidate: false }); // Dodaj opciju bez validacije
    trigger("options");
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = getValues("options");
    const newOptions = currentOptions.filter((_, i) => i !== index);
    setValue("options", newOptions); // Ažurirajte stanje forme
    trigger("options"); // Obavijestite react-hook-form da je došlo do promjene
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        id={"createFormElement"}
        sx={{
          mt: 3,
          p: 3,
          backgroundColor: "background.paper",
          borderRadius: "12px",
          boxShadow: theme.shadows[3],
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Kreiraj anketu
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Controller
            name="topic"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Pitanje"
                variant="outlined"
                fullWidth
                error={!!errors.topic}
                helperText={errors.topic?.message}
                // value={question}
                // onChange={(e) => setQuestion(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label="Datum kraja ankete"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
                inputProps={{
                  min: new Date().toISOString().split("T")[0], // Postavi minimalni datum na današnji datum
                }}
              />
            )}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Controller
            name="multipleAnswer"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value || false} // Ako je undefined, koristimo false
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Višestruki odgovori"
              />
            )}
          />
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Opcije:
        </Typography>
        {getValues("options").map((option, index) => (
          <Box
            key={index} // Dodajte key atribut
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <Controller
              name={`options.${index}.text`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={`Opcija ${index + 1}`}
                  fullWidth
                  error={!!errors.options?.[index]?.text}
                  helperText={errors.options?.[index]?.text?.message}
                  sx={{ height: "10vh" }}
                />
              )}
            />
            <Button
              onClick={() => handleRemoveOption(index)}
              // variant="outlined"
              color="error"
              sx={{
                borderRadius: "8px", // Zaobljene ivice
                textTransform: "none", // Bez velikih slova
                height: "10vh",
                "&:hover": {
                  backgroundColor: "transparent",
                  // Hover efekat
                },
              }}
            >
              <CloseIcon
                sx={{
                  "&:hover": {
                    color: "darkred",
                    // Hover efekat
                  },
                  mb: 1,
                }}
              />
            </Button>
          </Box>
        ))}
        <Box sx={{ mb: 2 }}>
          <Button
            onClick={handleAddOption}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: "8px", // Zaobljene ivice
              textTransform: "none", // Bez velikih slova
              "&:hover": {
                backgroundColor: "primary.dark", // Hover efekat
              },
            }}
          >
            Dodaj opciju
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            mt: 3,
            gap: 2,
          }}
        >
          <Button
            type="button" // Ovo je važno da se formular ne pošalje pritiskom na ovo dugme
            variant="outlined"
            color="secondary"
            onClick={() => {
              reset();
              setIsCreatingForm(false); // Zatvori formu
              //VRATITI SE NA OVO
              //   topOfPageRef.current?.scrollIntoView({
              //     behavior: "smooth",
              //     block: "start",
              //   }); // Vrati na vrh
            }}
            sx={{
              borderRadius: "8px", // Zaobljene ivice
              textTransform: "none", // Bez velikih slova
              borderColor: "text.secondaryChannel",
              color: "text.secondaryChannel",
              "&:hover": {
                backgroundColor: "secondary.light", // Hover efekat
              },
            }}
          >
            Poništi
          </Button>
          <LoadingButton
            loading={status == "pendingCreateForm"}
            type="submit"
            variant="contained"
            disabled={!methods.formState.isValid}
            loadingIndicator={
              <CircularProgress size={18} sx={{ color: "white" }} /> // Ovdje mijenjaš boju
            }
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: "8px", // Zaobljene ivice
              textTransform: "none", // Bez velikih slova
              "&:hover": {
                backgroundColor: "primary.dark", // Hover efekat
              },
            }}
          >
            {" "}
            {messageId == 0 ? "Sačuvaj" : "Dodaj anketu"}
          </LoadingButton>
        </Box>
      </Box>
    </form>
  );
}
