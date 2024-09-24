import { Outlet } from "react-router-dom"; 
import { Container, Box } from "@mui/material";

import Navbar from "../components/Navbar";

function AppLayout() {
  return (
    <Box sx={{ height: "100dvh" }}>
      <Navbar />
      <Container maxWidth="xl" component="main">
        <Outlet />
      </Container>
    </Box>
  );
}

export default AppLayout;
