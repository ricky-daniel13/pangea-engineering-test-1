import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import blitzLogo from "../../Components/globalAssets/platty.png";
import { useMutation } from "react-query";
import client from "../../API";
import useAuth from "../../Hooks/use-auth";
import { validateEmail, validatePassword } from "../../Utils";
import routes from "../../Config/routes";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const { authorize, setCurrentUser } = useAuth();

  const { mutate: login, isLoading } = useMutation(client.users.login, {
    onSuccess: (data) => {
      authorize(data.token);
      setCurrentUser(data.user);
      navigate(routes.dashboard);
    },
    onError: (error) => {
      console.error("An error occurred during login: ", error);
      let errorMessage = "An error occurred, please try again.";
      if (error.code == "ERR_NETWORK") {
        errorMessage = "Network is disconnected!";
      } else {
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleLogin = async () => {
    if (email.length === 0) {
      setSnackbarMessage("Email field is required!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);

      return;
    }

    if (!validateEmail(email)) {
      setSnackbarMessage("Invalid email address!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);

      return;
    }

    if (password.length === 0) {
      setSnackbarMessage("Email field is required!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);

      return;
    }

    if (!validatePassword(password)) {
      setSnackbarMessage("Password should have 6 more characters!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);

      return;
    }

    login({
      email,
      password,
    });
  };

  const handleRegister = () => {
    navigate(routes.register);
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={blitzLogo} alt="Blitz Logo" />
      </div>

      <div className="form-container">
        <h2>Welcome back</h2>
        <p>Sign in to continue with Blitz</p>

        <TextField
          disabled={isLoading}
          label="Email"
          variant="outlined"
          fullWidth
          sx={{ marginTop: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          disabled={isLoading}
          label="Password"
          variant="outlined"
          type="password"
          sx={{ marginTop: 2 }}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Box className="remember-me-container" sx={{ marginTop: 2 }}>
          <input type="checkbox" id="remember-me" name="remember-me" />
          <label htmlFor="remember-me">Remember me</label>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ marginTop: 2 }}
          startIcon={
            isLoading && <CircularProgress size={20} color="inherit" />
          }
          onClick={handleLogin}
        >
          Login
        </Button>

        <p>
          Don't have an account?
          <Button color="primary" onClick={handleRegister}>
            Contact Us
          </Button>
        </p>

        <p>
          <Button color="primary" onClick={handleLogin}>
            Forgot Password
          </Button>
        </p>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
