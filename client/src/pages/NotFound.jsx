import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: "bold", color: "primary.main" }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ color: "text.secondary", mb: 2 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        The page you are looking for doesn&apos;t exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{
          px: 4,
          py: 1,
          fontSize: "1rem",
          borderRadius: "8px",
          textTransform: "none",
        }}
      >
        Go to Home
      </Button>
    </Container>
  );
};

export default NotFound;
