import React, { useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar/NavBar";
import { makeStyles } from "@material-ui/core/styles";
import { drawerWidth } from "../../../Utils/constants";
import HeaderView from "./headerview"; // Adjust the path according to your file structure
import CompanyDetailsView from "./sections/companydetailsviews"; // Import the new component
import CampaignDetailsView from "./sections/campaignsdetailsviews"; // Import the new component
import InvoiceDetailsView from "./sections/invoicedetailsviews";
import { Divider, Typography } from "@mui/material";
import PayoutDetailsView from "./sections/payoutdetailsview";
import useAuth from "../../../Hooks/use-auth";
import CreatorDetailsView from "./sections/creatordetailsview";
import UserDetailsView from "./sections/admindetailviews";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  navbar: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 2,
  },
  content: {
    display: "flex",
    flexGrow: 1,
    paddingLeft: theme.spacing(20), // Adjust padding as needed
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(3),
    overflowY: "auto",
    flexDirection: "column", // Changed to column to stack filter and csv sections vertically
    flexGrow: 1,
    paddingLeft: "17rem", // Add padding equal to the navbar width
    overflowY: "auto", // Allow vertical scrolling within the content area if necessary
  },
  button: {
    margin: theme.spacing(2), // Uniform margin for buttons
    padding: theme.spacing(2), // Adjust padding to ensure buttons are not too large or too small
    width: "100%", // Make buttons take full width of their container for consistency
  },
  buttonContainer: {
    padding: theme.spacing(2), // Ensure buttons have their own padding
    display: "flex",
    gap: theme.spacing(2), // Use gap property to space out buttons
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  header: {
    padding: theme.spacing(2),
    fontWeight: "bold",
  },
}));

const CompanyList = () => {
  const classes = useStyles();
  const [currentView, setCurrentView] = useState("companies");
  const { getCurrrentUser } = useAuth();

  const renderView = () => {
    switch (currentView) {
      case "creators":
        return <CreatorDetailsView classes={classes} />;
        case "admin":
        return <UserDetailsView classes={classes} />;
      case "campaigns":
        return <CampaignDetailsView classes={classes} />;
      case "payouts":
        return <PayoutDetailsView classes={classes} />;
      case "invoices":
        return <InvoiceDetailsView classes={classes} />;
      case "companies":
      default:
        return <CompanyDetailsView classes={classes} />;
    }
  };

  return (
    <div className={classes.root}>
      <Navbar className={classes.navbar} />
      {(getCurrrentUser()?.type ?? "none") == "admin" ? (
        <>
          <div className={classes.content}>
            <HeaderView setCurrentView={setCurrentView} />
          </div>
          <Divider></Divider>
          <div className={classes.page}>{renderView()}</div>
        </>
      ) : (
        <Typography
          className={classes.content}
          sx={{
            height: "90vh",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Sorry, You are not allowed to view this page.
        </Typography>
      )}
    </div>
  );
};

export default CompanyList;
