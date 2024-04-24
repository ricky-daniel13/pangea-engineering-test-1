import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../../API";
import { useMutation } from "react-query";
import routes from "../../../Config/routes";
import { drawerWidth } from "../../../Utils/constants";
import SearchFilterSection from "../Search/leftColumnSearch";
import CampaignDetailsUI from "./campaigndetailsUI";
import {
  Container,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Navbar from "../../../Components/Navbar/NavBar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    overflow: "hidden",
    paddingLeft: 240, // Set this to the width of your Navbar
    [theme.breakpoints.up("md")]: {
      paddingLeft: 0,
    },
  },
  navbar: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 2,
  },
  content: {
    display: "flex",
    flexDirection: "row", // Changed to column to stack filter and csv sections vertically
    flexGrow: 1,
    paddingLeft: drawerWidth, // Add padding equal to the navbar width
    width: `calc(80% - ${drawerWidth})`, // Allocate 75% of the width minus the navbar width
    overflowY: "auto", // Allow vertical scrolling within the content area if necessary
    overflowX: "auto", // Allow horizontal scrolling within the csvSection if necessary
    overflow: "auto",
    height: "100%",
  },
  filterSection: {
    backgroundColor: "#f0f0f0",
    padding: theme.spacing(3),
  },
  csvSection: {
    backgroundColor: "#e8e8e8",
    padding: theme.spacing(0.9),
    height: "100%", // Set a fixed height
    overflowY: "auto", // Enable vertical scrolling within the CSV section
    width: "100%", // Ensure the csvSection takes the full width of its parent
    overflowX: "auto", // Allow horizontal scrolling within the csvSection if necessary
  },
  searchSection: {
    padding: theme.spacing(2),
    height: "100%", // Set a fixed height
    overflowY: "auto", // Enable vertical scrolling within the CSV section
    width: "100%", // Ensure the csvSection takes the full width of its parent
    overflowX: "auto", // Allow horizontal scrolling within the csvSection if necessary
  },
  campaignDetails: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    overflowY: "auto", // Enable vertical scrolling within the CSV section
  },
}));

const AddCreators = () => {
  const classes = useStyles();
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [selectedCreatorsData, setSelectedCreatorsData] = useState([]);

  const { mutate: fetchCampaignDetails } = useMutation(client.campaigns.fetch, {
    onSuccess: (data) => {
      data.creators = JSON.parse(data.creators);
      setCampaignDetails(data);
    },
    onError: (error) => {
      console.error("Error fetching campaign details:", error);
    },
  });

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails(campaignId);
    }
  }, [campaignId]);

  const handleCreatorSelect = (creator) => {
    setSelectedCreatorsData((prevCreators) => [...prevCreators, creator]);
  };

  const { mutate: updateCreatorList } = useMutation(
    client.campaigns.updateCreatorList,
    {
      onSuccess: (data) => {
        console.log("Successfully updated campaign creators:", data);

        // Optionally, navigate to another route upon success
        navigate(routes.campaigns);
      },
      onError: (error) => {
        console.error("Error updating campaign creators:", error);
      },
    }
  );

  const handleConfirmCreatorChanges = async () => {
    // Assuming selectedCreatorsData is an array of objects with 'id' and other properties
    // And assuming the backend expects each object in 'newCreators' to at least have an 'id' property

    const newCreators = selectedCreatorsData.map((creator) => {
      // Here, you directly use the properties from each creator object
      // No need to redeclare promotionPlatform or promotionType since they are part of the creator object
      return {
        id: creator.id,
        name: creator.name, // Assuming you meant to use the name from the creator object
        price: creator.price,
        following: creator.following,

        promotionPlatform: creator.promotionPlatform, // Directly use promotionPlatform from creator object
        promotionType: creator.promotionType, // Directly use promotionType from creator object
        platformLink: creator.platformLink, // Directly use platformLink from creator object
      };
    });
    const payload = {
      campaignId: parseInt(campaignId),
      newCreators: newCreators, // This now matches the expected structure
    };

    // Proceed with the API call using this updated payload
    updateCreatorList(payload);
  };

  return (
    <Container maxWidth={false}>
      <Navbar />
      <Grid container spacing={2} className={classes.root}>
        <div className={classes.content}>
          <Grid item xs={12} md={9} className={classes.searchSection}>
            <SearchFilterSection onCreatorSelect={handleCreatorSelect} />
          </Grid>
          <Grid item xs={12} md={3} className={classes.campaignDetails}>
            <CampaignDetailsUI
              campaignDetails={campaignDetails}
              newCreators={selectedCreatorsData}
            />
            <Divider style={{ margin: "20px 0" }} />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleConfirmCreatorChanges}
            >
              Confirm Creator Changes
            </Button>
          </Grid>
        </div>
      </Grid>
    </Container>
  );
};

export default AddCreators;
