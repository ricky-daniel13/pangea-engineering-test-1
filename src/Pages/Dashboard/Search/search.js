import React, { useState, useEffect, useRef } from "react";
import "./search.css";
import Navbar from "../../../Components/Navbar/NavBar";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@material-ui/core";
import CreatorDialog from "./creatorintake"; // Adjust the path as necessary
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "react-query";
import client from "../../../API";
import Paper from "@mui/material/Paper";
import SearchFilterSection from "../Search/leftColumnSearch";

import { drawerWidth } from "../../../Utils/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    overflow: "hidden",
  },
  navbar: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 2,
  },
  content: {
    display: "flex",
    flexDirection: "column", // Changed to column to stack filter and csv sections vertically
    flexGrow: 1,
    paddingLeft: "15.5rem", // Add padding equal to the navbar width
    width: "100%", // Allocate 75% of the width minus the navbar width
    overflowY: "auto", // Allow vertical scrolling within the content area if necessary
    backgroundColor: "#e8e8e8",
    padding: theme.spacing(0.9),
    width: `calc(100% - 14.5px)`, // Ensure the csvSection takes the full width of its parent
    overflowX: "auto", // Allow horizontal scrolling within the csvSection if necessary
  },

  filterSection: {
    backgroundColor: "#f0f0f0",
    padding: theme.spacing(3),
  },

  rightColumn: {
    width: "25%", // Set the right column to take 25% of the screen
    overflowY: "auto", // Allow vertical scrolling within the right column if necessary
  },

  formControl: {
    margin: theme.spacing(1.5),
    minWidth: 150,
  },

  searchField: {
    margin: theme.spacing(1.5), // This adds margin all around the TextField
    marginLeft: theme.spacing(6), // This adds additional margin to the left
    minWidth: 150,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1), // Uniform margin for buttons
    padding: theme.spacing(1), // Adjust padding to ensure buttons are not too large or too small
    width: "100%", // Make buttons take full width of their container for consistency
  },
  filterContainer: {
    padding: theme.spacing(2), // Add padding around the filter container for spacing
  },
  buttonContainer: {
    padding: theme.spacing(2), // Ensure buttons have their own padding
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2), // Use gap property to space out buttons
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  header: {
    margin: theme.spacing(1),
    fontWeight: "bold",
  },
}));

const SearchPage = (onCreatorSelect) => {
  const classes = useStyles();
  const [filter, setFilter] = useState("");
  const [region, setRegion] = useState(""); // Default to showing ALL Regions
  const [platform, setPlatform] = useState("TikTok"); // Default to TikTok Brand, and remove the option for None
  const [promotionType, setPromotionType] = useState("Brand"); // Assuming you want to start with TikTok Brand
  const [data, setData] = useState([]);
  const [race, setRace] = useState("");
  const [gender, setGender] = useState("");
  const [furtherLocation, setFurtherLocation] = useState("");
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [avgViews, setAvgViews] = useState("");
  const [selectedCreatorsData, setSelectedCreatorsData] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [campaignBrief, setCampaignBrief] = useState("");
  const [videoAmount, setVideoAmount] = useState("1");
  const [campaignType, setCampaignType] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [campaignSum, setCampaignSum] = useState(0);
  const [idealDueDate, setIdealDueDate] = useState(new Date());
  const [isCreatorDialogOpen, setIsCreatorDialogOpen] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tableHeight, setTableHeight] = useState(0);
  const [emailRecipient, setEmailRecipient] = useState("");

  const filterRef = useRef(null);

  useEffect(() => {
    const sum = calculateTotalCampaignSum();
    setCampaignSum(sum);
  }, [selectedCreatorsData]);

  useEffect(() => {
    filterRef.current &&
      setTableHeight(
        document.documentElement.offsetHeight -
          filterRef.current.clientHeight -
          82
      );
  }, [filterRef, document.documentElement.offsetHeight]);

  const calculateTotalCampaignSum = () => {
    const sum = selectedCreatorsData.reduce((accumulator, creator) => {
      // Ensure price is a string and default to "0" if not
      const priceAsString =
        typeof creator.price === "string" ? creator.price : "0";
      const cleanedPriceString = priceAsString.replace(/[^0-9.-]+/g, "");
      const price = parseFloat(cleanedPriceString);
      if (isFinite(price)) {
        return accumulator + price;
      } else {
        console.error(`Invalid price format detected: ${creator.price}`);
        return accumulator;
      }
    }, 0);
    return sum;
  };

  // Function to generate a unique campaign ID
  const generateCampaignID = () => new Date().getTime().toString();
  // Before creating the campaignData object
  const parsedVideoAmount = parseInt(videoAmount, 10); // Ensure videoAmount is an integer
  const today = new Date().toISOString().slice(0, 10);

  // Function to create campaign data object
  const createCampaignData = () => {
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

    return {
      id: generateCampaignID(),
      name: campaignName,
      brief: campaignBrief,
      videoAmount: parseInt(videoAmount, 10),
      campaignType: campaignType,
      creators: newCreators,
      proposalDate: new Date().toISOString().slice(0, 10),
      campaign_sum: calculateTotalCampaignSum(),
      idealDueDate: idealDueDate,
      emailRecipient: emailRecipient,
      campaign_manager: {  // Default manager as a fallback
        name: "Jeremy Crandall",
        email: "jeremy@thecultureclub.us",
        phone_number: "+1 585-202-7324"
      }
    };
  };

  // Function to handle creating a new campaign
  const { mutate: createCampaigns, isLoading: isCreatingCampaign } =
    useMutation(client.campaigns.create, {
      onSuccess: (data) => {
        console.log("Campaign saved successfully:", data);

        setDialogMessage("Campaign created successfully!");
        setOpenDialog(true);

        setSelectedItems(new Set());
        setCampaignName("");
        setCampaignBrief("");
      },
      onError: (error) => {
        console.error("Error saving campaign:", error);
        setDialogMessage(`Error: ${error.message}`);
        setOpenDialog(true);
      },
    });
  const handleCreatorSelect = (creator) => {
    setSelectedCreatorsData((prevCreators) => [...prevCreators, creator]);
  };
  const handleCreateCampaign = async () => {
    console.log("Creating campaign..."); // Initial log to confirm the function is called
    const campaignData = createCampaignData();
    createCampaigns(campaignData);
  };
  const handleCreatorSubmit = (formData) => {
    console.log(formData); // For now, just log the form data. You can replace this with your actual submission logic.
  };

  <Dialog
    open={openDialog}
    onClose={() => setOpenDialog(false)}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {"Campaign Creation Status"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {dialogMessage}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenDialog(false)} color="primary" autoFocus>
        Close
      </Button>
    </DialogActions>
  </Dialog>;

  return (
    <div className={classes.root}>
      <Navbar className={classes.navbar} />
      <div className={classes.content}>
        <SearchFilterSection onCreatorSelect={handleCreatorSelect} />
      </div>
      <CreatorDialog
        open={isCreatorDialogOpen}
        onClose={() => setIsCreatorDialogOpen(false)}
        onSubmit={handleCreatorSubmit}
      />
      <div className={classes.rightColumn}>
        <Paper className={classes.paper} elevation={3}>
          <Typography
            variant="h4"
            gutterBottom
            className={classes.header}
            align="center"
          >
            Campaign Builder
          </Typography>
          <Divider style={{ margin: "10px 0" }} />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                label="Campaign Name"
                variant="outlined"
                fullWidth
                value={campaignName} // Set value from state
                onChange={(e) => setCampaignName(e.target.value)} // Update state on change
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Campaign Brief"
                variant="outlined"
                fullWidth
                value={campaignBrief} // Set value from state
                onChange={(e) => setCampaignBrief(e.target.value)} // Update state on change
              />
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <TextField
                  id="date-picker"
                  label="Due Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={idealDueDate}
                  onChange={(e) => setIdealDueDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true, // This makes the label visible
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
  <TextField
    label="Email Recipient"
    variant="outlined"
    fullWidth
    value={emailRecipient}
    onChange={(e) => setEmailRecipient(e.target.value)}
  />
</Grid>

            <Grid item xs={12} style={{}}>
              <Typography variant="h6" align="center">
                Creator Details
              </Typography>
            </Grid>
            <Grid item xs={12} style={{}}>
              <List>
                {selectedCreatorsData.map((creator, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${creator.name}`}
                      secondary={`Following: ${creator.following}`}
                    />
                    <ListItemText
                      primary={`Price: ${creator.price}`}
                      secondary={`${creator.promotionPlatform} ${creator.promotionType}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                Campaign Sum: ${campaignSum}
              </Typography>
            </Grid>

            {/* Split "Video Amount" and "Campaign Type" into two columns */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Video Amount</InputLabel>
                <Select
                  value={videoAmount}
                  onChange={(e) => setVideoAmount(e.target.value)}
                  label="Video Amount"
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  {/* Add more options as needed */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Campaign Type</InputLabel>
                <Select
                  value={campaignType} // Set value from state
                  onChange={(e) => setCampaignType(e.target.value)} // Update state on change
                  label="Campaign Type"
                >
                  <MenuItem value="product">Product Promotion</MenuItem>
                  <MenuItem value="app">App Promotion</MenuItem>
                  <MenuItem value="website">Website Promotion</MenuItem>
                  <MenuItem value="song">Song Promotion</MenuItem>
                  <MenuItem value="Consultant">Consultant</MenuItem>

                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => {
                  setSelectedItems(new Set()); // Clears the selection set
                  setSelectedCreatorsData([]); // Clears the selected creators data
                }}
              >
                Remove Creators
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCreateCampaign} // Make sure this directly calls the function
                startIcon={
                  isCreatingCampaign && (
                    <CircularProgress size={20} color="inherit" />
                  )
                }
              >
                Create Campaign!
              </Button>
            </Grid>
            <Dialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Campaign Creation Status"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {dialogMessage}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpenDialog(false)}
                  color="primary"
                  autoFocus
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Paper>
      </div>
    </div>
  );
};

export default SearchPage;
