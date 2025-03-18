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
import { Controller, useForm } from "react-hook-form";
import { CreateForm } from "../../../app/models/form";
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
  setIsCreatingForm: (value: boolean) => void; 
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
  const theme = useTheme();

  const status = useAppSelector((state) => state.form.status);

  interface FormData {
    topic: string;
    endDate: string;
    options: { text: string }[];
    multipleAnswer?: boolean; 
  }

  const methods = useForm<FormData>({
    mode: "all",
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
    trigger,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: FormData) => {
    if (messageId != 0) {
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

        await dispatch(createForm(newForm)).unwrap();

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
    setValue("options", newOptions, { shouldValidate: false });
    trigger("options");
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = getValues("options");
    const newOptions = currentOptions.filter((_, i) => i !== index);
    setValue("options", newOptions); 
    trigger("options"); 
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
                  min: new Date().toISOString().split("T")[0], 
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
                    checked={field.value || false} 
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
            key={index} 
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
              color="error"
              sx={{
                borderRadius: "8px", 
                textTransform: "none", 
                height: "10vh",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <CloseIcon
                sx={{
                  "&:hover": {
                    color: "darkred",
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
              borderRadius: "8px", 
              textTransform: "none", 
              "&:hover": {
                backgroundColor: "primary.dark",
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
            type="button" 
            variant="outlined"
            color="secondary"
            onClick={() => {
              reset();
              setIsCreatingForm(false);             
            }}
            sx={{
              borderRadius: "8px", 
              textTransform: "none", 
              borderColor: "text.secondaryChannel",
              color: "text.secondaryChannel",
              "&:hover": {
                backgroundColor: "secondary.light", 
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
              <CircularProgress size={18} sx={{ color: "white" }} /> 
            }
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: "8px", 
              textTransform: "none", 
              "&:hover": {
                backgroundColor: "primary.dark", 
              },
            }}
          >
            {messageId == 0 ? "Sačuvaj" : "Dodaj anketu"}
          </LoadingButton>
        </Box>
      </Box>
    </form>
  );
}
