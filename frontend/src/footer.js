import React from "react";
import { Container, Typography, Link, Box, Grid } from "@mui/material";

const Footer = () => {
  return (
    <footer>
    <Box sx={{ backgroundColor: "#282c34", color: "#fff" }}>
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" align="center">
              <strong>Project by:</strong>
              <br />
              Abhinav Singh
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" align="center">
              <strong>Find me on:</strong>
              <br />
              <Link
                href="https://github.com/justAbhinav"
                target="_blank"
                color="inherit"
              >
                GitHub
              </Link>
              <br />
              <Link
                href="https://www.linkedin.com/in/abhinav-singh-1b8384250/"
                target="_blank"
                color="inherit"
              >
                LinkedIn
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" align="center">
              <strong>Contact me at:</strong>
              <br />
              <Typography variant="body2" align="center">
                22UCC004@lnmiit.ac.in
                <br />
                <Link
                  href="mailto:22UCS004@lnmiit.ac.in"
                  target="_blank"
                  color="inherit"
                >
                  (or just click here)
                </Link>
              </Typography>
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" sx={{ marginTop: "20px" }}>
          &copy; {new Date().getFullYear()} Abhinav Singh. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
    </footer>
  );
};

export default Footer;
