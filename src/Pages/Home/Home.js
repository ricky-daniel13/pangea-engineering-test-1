import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import blitzLogo from "../../Components/globalAssets/platty.png";
import imageOnRight from "../../Components/globalAssets/blitzBoltBlack.png";
import Divider from "@mui/material/Divider";
import routes from "../../Config/routes";
import {
  BenefitsSection,
  CreatorsSection,
  PricingSection,
  AboutSection,
} from "./homeExtended";

const Home = () => {
  const navigate = useNavigate();
  const handleSignUp = () => navigate(routes.login);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const benefitsRef = React.useRef(null);
  const creatorsRef = React.useRef(null);
  const pricingRef = React.useRef(null);
  const aboutRef = React.useRef(null);

  return (
    <>
      {/* header */}
      <AppBar
        position="static"
        style={{
          backgroundColor: "#000",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="logo"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src={blitzLogo}
                alt="logo"
                style={{ width: "120px", height: "60px" }}
              />
            </IconButton>
          </Box>
          <Box
            display="flex"
            flexGrow={1}
            justifyContent="center"
            style={{ flexGrow: 3 }}
          >
            <Typography
              variant="h6"
              className="menu-item"
              style={{ marginLeft: "2.5%", marginRight: "2.5%" }}
              onClick={() =>
                benefitsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                  inline: "nearest",
                })
              }
            >
              Benefits
            </Typography>

            <Typography
              variant="h6"
              style={{ marginLeft: "2.5%", marginRight: "2.5%" }}
              className="menu-item"
              onClick={() =>
                creatorsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                  inline: "nearest",
                })
              }
            >
              Creators
            </Typography>
            <Typography
              variant="h6"
              className="menu-item"
              style={{ marginLeft: "2.5%", marginRight: "2.5%" }}
              onClick={() =>
                pricingRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                  inline: "nearest",
                })
              }
            >
              Pricing
            </Typography>

            <Typography
              variant="h6"
              style={{ marginLeft: "2.5%", marginRight: "2.5%" }}
              className="menu-item"
              onClick={() =>
                aboutRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                  inline: "nearest",
                })
              }
            >
              About
            </Typography>
          </Box>

          <Box style={{ flexGrow: 1 }}></Box>
          <Button color="inherit" onClick={handleSignUp}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content section */}
      <Box
        className="starry-background"
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          backgroundColor: '#000',
          color: '#fff',
        }}
      >
        <img
          src={blitzLogo}
          alt="Blitz logo"
          style={{ maxWidth: '60%', height: 'auto' }}
          className="animated-fade-in"
        />
        <Typography variant="h4" sx={{ mt: 2 }} className="animated-slide-up">
          Pay - Create - Accelerate
        </Typography>
      </Box>

      {/* Additional sections will be below and can be scrolled to */}
      <Container maxWidth="false" sx={{ backgroundColor: "#f0f0f0", p: 4 }}>
        <Grid container spacing={4}>
          {/* Row for Benefits and Creators */}
          <Grid item xs={12} md={6}>
            <BenefitsSection />
          </Grid>
          <Grid item xs={12} md={6}>
            <CreatorsSection />
          </Grid>

          {/* Row for Pricing and About */}
          <Grid item xs={12} md={6}>
            <PricingSection />
          </Grid>
          <Grid item xs={12} md={6}>
            <AboutSection />
          </Grid>
        </Grid>
        
        <footer sx={{ mt: 4, backgroundColor: "#f5f5f5", p: 2, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            © 2023 Pangea, Inc. All rights reserved.
          </Typography>
        </footer>
      </Container>
    </>
  );
};
export default Home;
