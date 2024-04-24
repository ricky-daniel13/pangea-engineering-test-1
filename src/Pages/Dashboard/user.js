import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/NavBar";
import ppfLogo from "../../Components/globalAssets/ppfLogo.png";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useMutation } from "react-query";
import client from "../../API";
import { useIsMounted } from "../../Hooks/use-is-mounted";
import useAuth from "../../Hooks/use-auth";

const User = () => {
  const isMounted = useIsMounted();
  const [open, setOpen] = useState(false);
  const { getCurrrentUser, setCurrentUser } = useAuth();
  const [userInfo, setUserInfo] = useState(getCurrrentUser());

  useEffect(() => {
    isMounted && fetchUserInfo();
  }, [isMounted]);

  const { mutate: fetchUserInfo, isLoading } = useMutation(
    client.users.fetchUser,
    {
      onSuccess: (data) => {
        // Assuming the response structure is directly the data needed
        console.log(data);
        setCurrentUser(data);
        setUserInfo(data);
      },
      onError: (error) => {
        console.error("Error fetching user or company info:", error);
      },
    }
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveChanges = () => {};

  return (
    <div className="dashboard">
      <Navbar />

      <div
        className="content"
        style={{ flexDirection: "row", marginLeft: "15.5rem" }}
      >
        <div
          style={{
            flexDirection: "column",
            width: "60%",
            paddingRight: 20,
            boxShadow: "1rem 0 1rem -1rem rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>Edit your information</h2>
          <div
            style={{
              marginBottom: 20,
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div className="profile-photo">
              <img src={ppfLogo} alt="Profile" />
            </div>
            <p style={{ marginTop: 24 }}>@{userInfo?.username ?? ""}</p>
          </div>
          <div className="field-row">
            <TextField
              className="field"
              label="First Name"
              variant="outlined"
              value={userInfo?.first_name ?? ""}
            />
            <TextField
              className="field"
              label="Last Name"
              variant="outlined"
              value={userInfo?.last_name ?? ""}
            />
          </div>

          <div className="field-row">
            <TextField
              className="field"
              label="Email"
              variant="outlined"
              value={userInfo?.email ?? ""}
            />
            <TextField
              className="field"
              label="Desired Username"
              variant="outlined"
              value={userInfo?.username ?? ""}
            />
          </div>

          <div className="field-row">
            <TextField className="field" label="Password" variant="outlined" />
            <TextField
              className="field"
              label="Re-enter Password"
              variant="outlined"
              type="password"
            />
          </div>

          <div className="field-row">
            <TextField
              className="field"
              label="Street Address"
              variant="outlined"
              value={userInfo?.address ?? ""}
            />
            <TextField
              className="field"
              label="City"
              variant="outlined"
              type="password"
            />
          </div>

          <div className="field-row">
            <TextField className="field" label="State" variant="outlined" />
            <TextField
              className="field"
              label="Country"
              variant="outlined"
              type="password"
            />
          </div>
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            color="primary"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default User;
