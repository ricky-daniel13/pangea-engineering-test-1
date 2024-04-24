import React from "react";
import {
  Typography,
  Container,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Grid,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; // Example icon, replace with your choice
import SecurityIcon from "@mui/icons-material/Security"; // Example icon, replace with your choice
import StarBorderIcon from "@mui/icons-material/StarBorder"; // Example icon, replace with your choice

export const BenefitsSection = React.forwardRef((props, ref) => (
  <Container ref={ref} id="benefits" component="section" sx={{ my: 4 }}>
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Empowering Global Culture at The Culture Club
      </Typography>
      <Typography paragraph>
        Over the past three years, The Culture Club has processed over $5M in payouts, directly impacting creators across 20+ countries. Our platform, Blitz, is instrumental in democratizing access to the creator economy, offering rapid payouts and scaling from local to global. Benefits include:
      </Typography>
      <Box>
        <List>
          <ListItem>
            <ListItemText primary="Seamless integration of global creators with local and international brands." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Automated deal flows and real-time transaction reporting." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Expansion into athlete and celebrity markets through innovative AI solutions." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Direct engagement with creators via new digital platforms, enhancing communication and efficiency." />
          </ListItem>
        </List>
      </Box>
    </Paper>
  </Container>
));

export const CreatorsSection = React.forwardRef((props, ref) => (
  <Container ref={ref} id="creators" component="section" sx={{ my: 4 }}>
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Creators: The Heart of Innovation
      </Typography>
      <Typography paragraph>
        Our creators are at the forefront of the digital age, driving forward with innovative campaigns managed by MYAH, our conversational AI. MYAH enables creators to automate interactions, ensuring swift and personalized responses to opportunities. Key benefits for creators include:
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Automated, personalized management of brand deals via MYAH." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Direct access to diverse campaigns, including sports and entertainment." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Rapid payment processing and advanced scheduling features." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Integration into our secure, scalable platform designed for creators worldwide." />
        </ListItem>
      </List>
    </Paper>
  </Container>
));

export const PricingSection = React.forwardRef((props, ref) => {
  const theme = useTheme();

  return (
    <Container ref={ref} id="pricing" component="section" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Pricing and Subscriptions
        </Typography>
        <Typography paragraph>
          Blitz offers flexible pricing and subscriptions to fit every client's
          needs. From our Alpha Free tier to Platinum, each subscription is
          designed with your campaign success in mind:
        </Typography>
        <Grid container spacing={2}>
          {/* Silver Tier */}
          <Grid item xs={12} sm={4}>
            <Box
              textAlign="center"
              p={2}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
              }}
            >
              <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom>
                Silver
              </Typography>
              <Typography>$500/month</Typography>
              <Typography variant="body2">
                Get access to enhanced API credentials and a 5% transaction
                volume fee.
              </Typography>
            </Box>
          </Grid>

          {/* Gold Tier */}
          <Grid item xs={12} sm={4}>
            <Box
              textAlign="center"
              p={2}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
              }}
            >
              <SecurityIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom>
                Gold
              </Typography>
              <Typography>$1k/month</Typography>
              <Typography variant="body2">
                Reduce your transaction volume fee and enjoy a $10k credit
                limit.
              </Typography>
            </Box>
          </Grid>

          {/* Platinum Tier */}
          <Grid item xs={12} sm={4}>
            <Box
              textAlign="center"
              p={2}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
              }}
            >
              <StarBorderIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom>
                Platinum
              </Typography>
              <Typography>Custom terms</Typography>
              <Typography variant="body2">
                For qualifying clients, including no platform fee and custom
                feature support.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
});
export const AboutSection = React.forwardRef((props, ref) => (
  <Container ref={ref} id="about" component="section" sx={{ my: 4 }}>
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        About Blitz
      </Typography>
      <Typography paragraph>
        Blitz is more than a software tool; it's a bridge between creativity and
        commerce within the global culture. Engineered to support The Culture
        Club's innovative campaigns, Blitz combines a powerful React.js frontend
        with a Python backend and a PostgreSQL database for unmatched
        reliability and performance. Hosting solutions on AWS or Azure ensure
        Blitz is always available for your next campaign.
      </Typography>
      <Typography paragraph>
        For a closer look at our most current developments, explore the Nexus3
        branch on our GitHub. Join us in redefining campaign management and
        creator engagement with Blitz.
      </Typography>
    </Paper>
  </Container>
));
