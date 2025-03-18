import { Button, Container, Divider, Paper, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "transparent",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          maxWidth: 500,
          textAlign: "center",
          borderRadius: 3,
          backgroundColor: "transparent",
          boxShadow: (theme) =>
            `0px 2px 20px 1px ${theme.palette.primary.dark}`,
        }}
      >
        <Typography gutterBottom variant="h4" fontWeight="bold" color="error">
          Resurs nije pronađen
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 2, color: "gray", fontSize: "14pt" }}
        >
          Ne možemo pronaći to što tražiš. 😕
        </Typography>
        <Divider sx={{ width: "100%", my: 2 }} />
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: 2 }}
          onClick={() => window.history.back()}
        >
          Vrati se nazad
        </Button>
      </Paper>
    </Container>
  );
}
