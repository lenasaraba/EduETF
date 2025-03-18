import { Button, Container, Divider, Paper, Typography } from "@mui/material";

export default function Unauthorized() {
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
          Pristup odbijen
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, color: "gray" }}>
          Nemate dozvolu za pregled ove stranice.
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
