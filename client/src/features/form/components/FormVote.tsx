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

interface FormVoteProps {
  form: Form;
  //   onSubmitVote: (selectedOptions: number[]) => void;
}

export default function FormVote({ form }: FormVoteProps) {
  // State za čuvanje izabranih opcija
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  // Funkcija za ažuriranje izabranih opcija
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

  // Funkcija za predaju glasa
  const handleSubmit = () => {
    // onSubmitVote(selectedOptions);
    setSelectedOptions([]); // Resetuj izabrane opcije nakon glasanja
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: 0,
        margin: 0,
        marginX: 1,
        backgroundColor: "transparent",
      }}
    >
      <Box sx={{ margin: 0, padding: 0, paddingX: 2 }}>
        {/* <Typography variant="h5" component="h2" gutterBottom>
          {form.topic}
        </Typography> */}
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
          {form.options.map((option) => (
            <div key={option.id}>
              {form.multipleAnswer ? (
                // Checkbox za višestruki izbor
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => handleOptionChange(option.id)}
                    />
                  }
                  label={option.text}
                />
              ) : (
                // Radio button za jednostruki izbor
                <FormControlLabel
                  control={
                    <Radio
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => handleOptionChange(option.id)}
                    />
                  }
                  label={option.text}
                />
              )}
            </div>
          ))}
        </FormControl>
        <Box sx={{ margin: 0, padding: 0, display: "flex", width: "100%", justifyContent:"flex-end" }}>
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
