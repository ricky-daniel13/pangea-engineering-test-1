import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import blitzLogo from "../../Components/globalAssets/platty.png";
import axios from "axios";
import {
  validateEmail,
  validatePassword,
  capitalizeFirstLetter,
} from "../../Utils";
import { useMutation } from "react-query";
import client from "../../API";
import routes from "../../Config/routes";
import { useIsMounted } from "../../Hooks/use-is-mounted";

const Register = () => {
  const navigate = useNavigate();
  const isMounted = useIsMounted();

  // State for company names
  const [companies, setCompanies] = useState([]);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    companyName: "", // Removed companyID as it's no longer needed
    streetAddress: "",
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    isMounted && fetchCompanies();
  }, [isMounted]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const { mutate: register, isLoading } = useMutation(client.users.register, {
    onSuccess: (data) => {
      navigate(routes.login);
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

  const { mutate: fetchCompanies } = useMutation(client.companies.list, {
    onSuccess: (data) => {
      setCompanies(data);
    },
    onError: (error) => {
      console.log("Error fetching companies - ", error);
      setCompanies([]);
    },
  });

  const handleRegister = async () => {
    let bValidation = true;

    Object.keys(userInfo).forEach((item) => {
      if (bValidation && userInfo[item].length === 0) {
        setSnackbarMessage(`${capitalizeFirstLetter(item)} field is required!`);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);

        bValidation = false;
      }
    });

    if (bValidation) {
      if (!validateEmail(userInfo.email)) {
        setSnackbarMessage("Invalid email address!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);

        return;
      }

      if (!validatePassword(userInfo.password)) {
        setSnackbarMessage("Password should have 6 more characters!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);

        return;
      }

      if (userInfo.password != userInfo.confirmPassword) {
        setSnackbarMessage("Password should be confirmed correctly");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);

        return;
      }
    }

    if (!bValidation) return;

    const params = {
      username: userInfo.userName,
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      email: userInfo.email,
      password: userInfo.password,
      company_id: companies.filter(
        (item) => item.name == userInfo.companyName
      )[0].id,
      company_name: userInfo.companyName, // Ensure this matches the expected backend field
      address: `${userInfo.streetAddress}, ${userInfo.city}, ${userInfo.state}, ${userInfo.country}`,
    };

    register(params);
  };

  return (
    <div className="login-container">
      {/* Left column */}
      <div className="logo-container">
        <img src={blitzLogo} alt="blitzLogo" />
      </div>

      {/* Right column */}
      <div className="form-container">
        <h2>Welcome to Blitz!</h2>
        <p>Enter your information to continue with Blitz</p>

        <div className="field-row">
          <TextField
            disabled={isLoading}
            className="field"
            label="First Name"
            variant="outlined"
            value={userInfo.firstName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, firstName: e.target.value })
            }
          />
          <TextField
            disabled={isLoading}
            className="field"
            label="Last Name"
            variant="outlined"
            value={userInfo.lastName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, lastName: e.target.value })
            }
          />
        </div>

        <div className="field-row">
          <TextField
            disabled={isLoading}
            className="field"
            label="Email"
            variant="outlined"
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
          />
          <TextField
            disabled={isLoading}
            className="field"
            label="Desired Username"
            variant="outlined"
            value={userInfo.userName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, userName: e.target.value })
            }
          />
        </div>

        <div className="field-row">
          <TextField
            disabled={isLoading}
            className="field"
            label="Password"
            variant="outlined"
            type="password"
            value={userInfo.password}
            onChange={(e) =>
              setUserInfo({ ...userInfo, password: e.target.value })
            }
          />
          <TextField
            disabled={isLoading}
            className="field"
            label="Re-enter Password"
            variant="outlined"
            type="password"
            value={userInfo.confirmPassword}
            onChange={(e) =>
              setUserInfo({ ...userInfo, confirmPassword: e.target.value })
            }
          />
        </div>

        <div className="field-row">
          <TextField
            disabled={isLoading}
            className="field"
            label="Company Code"
            variant="outlined"
            value={userInfo.companyName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, companyName: e.target.value })
            }
          />
        </div>

        <div className="field-row">
          <TextField
            disabled={isLoading}
            className="field"
            label="Street Address"
            variant="outlined"
            value={userInfo.streetAddress}
            onChange={(e) =>
              setUserInfo({ ...userInfo, streetAddress: e.target.value })
            }
          />
          <TextField
            disabled={isLoading}
            className="field"
            label="City"
            variant="outlined"
            value={userInfo.city}
            onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
          />
        </div>

        <div className="field-row">
          <TextField
            disabled={isLoading}
            className="field"
            label="State"
            variant="outlined"
            value={userInfo.state}
            onChange={(e) =>
              setUserInfo({ ...userInfo, state: e.target.value })
            }
          />
          <TextField
            disabled={isLoading}
            className="field"
            label="Country"
            variant="outlined"
            value={userInfo.country}
            onChange={(e) =>
              setUserInfo({ ...userInfo, country: e.target.value })
            }
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={
            isLoading && <CircularProgress size={20} color="inherit" />
          }
          onClick={handleRegister}
        >
          Create Account
        </Button>
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

export default Register;
