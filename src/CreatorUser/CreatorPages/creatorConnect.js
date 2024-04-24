import React, { useState, useEffect } from "react";
import {  Box,
    IconButton,
  Container,
  Button,
  TextField,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import { useParams, useLocation,useNavigate } from "react-router-dom"; // Also import useLocation
import blitzLogo from "../../Components/globalAssets/platty.png";
import routes from "../../Config/routes.js";
const CreatorConnect = () => {
    const navigate = useNavigate();
    const { creator } = useParams();
    const location = useLocation();
    const [creatorName, setCreatorName] = useState(creator || "");
    const [paymentMethod, setPaymentMethod] = useState("PayPal");
    const [paymentEmail, setPaymentEmail] = useState("");
    const [stripeUserId, setStripeUserId] = useState("");

    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get('code');
      if (code && !stripeUserId) {
        fetchStripeUserId(code);
      }
    }, [location, stripeUserId]);

    const handlePaymentMethodChange = (event) => {
      setPaymentMethod(event.target.value);
      if (event.target.value === "Stripe") {
        // Store the creator name temporarily and use a fixed redirect URI
        sessionStorage.setItem('creatorName', creatorName);
        const redirectUri = `https://blitzpay.pro/creatorconnect/redirect`;
        window.location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_OhWROUX5WK46p2a7QFs2zNkr3Sxh6r5I&scope=read_write&redirect_uri=${encodeURIComponent(redirectUri)}`;
      }
    };

    const fetchStripeUserId = async (code) => {
      const response = await fetch('/api/stripe/exchange_code', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (data.stripeUserId) {
        setStripeUserId(data.stripeUserId);
        const storedCreator = sessionStorage.getItem('creatorName');
        navigate(`/creatorconnect/${storedCreator}?stripeUserId=${data.stripeUserId}`);
      }
    };

    const handleFormSubmit = async (event) => {
      event.preventDefault();
      const payload = {
        username: creatorName,
        payout_preferred: paymentMethod,
        email: paymentEmail,
        stripe_id: stripeUserId
      };
      const response = await fetch('/creator_users/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Creator user added successfully!');
        navigate(`/success`);
      } else {
        console.error('Failed to add creator user:', data.error);
        alert('Failed to add creator user: ' + data.error);
      }
    };
  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#000" }}>
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="logo"
              onClick={() => navigate(routes.campaigns)}
            >
              <img
                src={blitzLogo}
                alt="logo"
                style={{ width: "120px", height: "50px" }}
              />
            </IconButton>
          </Box>
          <Box
            display="flex"
            flexGrow={1}
            justifyContent="center"
            style={{ flexGrow: 2 }}
          >
            {/* Navigation items here */}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <h1>Creator Connect Form</h1>
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Creator Name"
            fullWidth
            value={creatorName}
          />
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <MenuItem value="PayPal">PayPal, Standard, Fees Apply</MenuItem>
              <MenuItem value="Stripe">BlitzPay, Faster, Less Fees</MenuItem>
            </Select>
          </FormControl>
          {paymentMethod === "PayPal" && (
            <TextField
              label="PayPal Email"
              fullWidth
              value={paymentEmail}
              onChange={(e) => setPaymentEmail(e.target.value)}
            />
          )}
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Container>
    </>
  );
};

export default CreatorConnect;
