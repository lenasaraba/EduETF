import {
  Card,
  CardContent,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Radio,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { Form } from "../../../app/models/form";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { vote } from "../formSlice";

interface FormVoteProps {
  form: Form;
  IsTheme?: boolean;

  //   onSubmitVote: (selectedOptions: number[]) => void;
}

export default function FormVote({ form, IsTheme }: FormVoteProps) {
  // State za čuvanje izabranih opcija
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const user = useAppSelector((state) => state.account.user);
  // Funkcija za ažuriranje izabranih opcija
  const dispatch = useAppDispatch();
  const handleOptionChange = (optionId: number) => {
    if (form.multipleAnswer) {
      // Ako je višestruki izbor, dodaj ili ukloni opciju
      setSelectedOptions(
        (prev) =>
          prev.includes(optionId)
            ? prev.filter((id) => id !== optionId) // Ukloni opciju
            : [...prev, optionId] // Dodaj opciju
      );
    } else {
      // Ako je jednostruki izbor, postavi samo jednu opciju
      setSelectedOptions([optionId]);
    }
  };

  const disableOption = () => {
    if (user) {
      if (
        user.role == "Profesor" &&
        (form.courseId ||
          form.options.some((option) =>
            option.usersOption.some(
              (userOption) => userOption.user.id === user.id
            )
          ))
      )
        return true;
      if (
        user.role == "Student" &&
        form.options.some((option) =>
          option.usersOption.some(
            (userOption) => userOption.user.id === user.id
          )
        )
      )
        return true;
      const currentDate = new Date();
      const formEndDate = new Date(form.endDate);
      if (currentDate > formEndDate) return true;
      return false;
    }
    return false;
  };

  // Funkcija za predaju glasa
  const handleSubmit = async () => {
    // onSubmitVote(selectedOptions);
    console.log(selectedOptions);
    await dispatch(vote(selectedOptions));

    setSelectedOptions([]); // Resetuj izabrane opcije nakon glasanja
  };

  function getCheckedState(optionId: number): boolean {
    // Pronađi opciju gde je korisnik već glasao
    const userHasVoted = form.options.some((option) =>
      option.usersOption.some(
        (userOption) =>
          userOption.user.id === user!.id && userOption.optionId === optionId
      )
    );

    // Ako je korisnik glasao za ovu opciju, vrati true, inače koristi selectedOptions.includes(optionId)
    return userHasVoted || selectedOptions.includes(optionId);
  }

  return (
    <Box
      sx={{
        width: "100%",
        padding: 0,
        paddingY: IsTheme ? 2 : 0,
        margin: 0,
        marginX: IsTheme ? 0 : 1,
        backgroundColor: IsTheme ? "background.default" : "transparent",
        borderRadius: IsTheme ? "10pt" : 0,
      }}
    >
      <Box sx={{ margin: 0, padding: 0, paddingX: 2 }}>
        {IsTheme && (
          <Typography variant="h5" component="h2" gutterBottom>
            {form.topic}
          </Typography>
        )}
        <Box
          sx={{
            margin: 0,
            padding: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" color="textSecondary" gutterBottom>
            Datum kreiranja:
            {new Date(form.creationDate).toLocaleDateString("sr-RS")}
          </Typography>
          <Typography variant="caption" color="textSecondary" gutterBottom>
            Kraj ankete: {new Date(form.endDate).toLocaleDateString("sr-RS")}
          </Typography>
        </Box>

        <FormControl component="fieldset" fullWidth>
          {[...form.options] // Pravi plitku kopiju niza
            .sort((a, b) => a.id - b.id)
            .map((option) => (
              <div key={option.id}>
                {form.multipleAnswer ? (
                  // Checkbox za višestruki izbor
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={disableOption()}
                        checked={getCheckedState(option.id)}
                        onChange={() => handleOptionChange(option.id)}
                      />
                    }
                    label={
                      option.text +
                      (user &&
                      ((user.role === "Profesor" &&
                        (form.courseId || form.user.id == user.id)) ||
                        (user.role == "Student" && form.user.id == user.id))
                        ? ` (${option.usersOption.length} glasalo)`
                        : "")
                    }
                  />
                ) : (
                  // Radio button za jednostruki izbor
                  <FormControlLabel
                    control={
                      <Radio
                        disabled={disableOption()}
                        checked={getCheckedState(option.id)}
                        onChange={() => handleOptionChange(option.id)}
                      />
                    }
                    label={
                      option.text +
                      (user && user.role === "Profesor"
                        ? ` (${option.usersOption.length} glasalo)`
                        : "")
                    }
                  />
                )}
              </div>
            ))}
        </FormControl>
        <Box
          sx={{
            margin: 0,
            padding: 0,
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
            sx={{ mt: 2 }}
          >
            Glasaj
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
