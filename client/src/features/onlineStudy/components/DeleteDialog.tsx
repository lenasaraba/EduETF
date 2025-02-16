import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAppSelector } from "../../../app/store/configureStore";

interface DeleteDialogProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  handleConfirmDelete: (item: any, itemType: string) => void; // Ovdje proslediš objekat koji brišeš, može biti kurs ili tema
  itemType: "course" | "theme"; // Tip stavke koja se briše
  itemData: any; // Podaci o kursu ili temi koji se brišu
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  openDialog,
  handleCloseDialog,
  handleConfirmDelete,
  itemType,
  itemData,
}) => {
  const isCourse = itemType === "course";
  const title = isCourse ? "Potvrda brisanja kursa" : "Potvrda brisanja teme";
  const message = isCourse
    ? `Da li ste sigurni da želite da obrišete kurs "${itemData?.name}"?`
    : `Da li ste sigurni da želite da obrišete temu "${itemData?.title}"?`;


  const statusProf=useAppSelector((state)=>state.professor.status);
  
  
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12pt",
          padding: 3,
          minWidth: 300,
          textAlign: "center",
        },
      }}
    >
      <DialogTitle
        sx={{ fontFamily: "Raleway, sans-serif", fontSize: "1.2rem" }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography
          sx={{ fontFamily: "Raleway, sans-serif", color: "text.secondary" }}
        >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button onClick={handleCloseDialog} sx={{ color: "text.primary" }}>
          Odustani
        </Button>
        <LoadingButton
        loading={isCourse?statusProf=="pendingDeleteCourse" : statusProf=="pendingDeleteTheme"}
          onClick={() => handleConfirmDelete(itemData, itemType)}
          color="error"
          variant="contained"
          loadingIndicator={
            <CircularProgress size={18} sx={{ color: "white" }} /> // Ovdje mijenjaš boju
          }
        >
          Obriši
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
