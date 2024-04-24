import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TextField,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  Grid,
  CardContent,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@material-ui/icons/Edit";
import FileCopyIcon from "@material-ui/icons/FileCopy"
import CreatorFeedbackDialog from "./creatorFeedback";
import Navbar from "../../../Components/Navbar/NavBar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from "@mui/material";
import RecentCampaign from "./recentCampaigns";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share"; // Import the Share icon
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useIsMounted } from "../../../Hooks/use-is-mounted";
import { useMutation } from "react-query";
import client from "../../../API";
import { ConfigValue } from "../../../Config";
import EditCreatorDialog from './editcreatordialog';

function formatIdealDueDate(dateString) {
  // Directly use the dateString to create a new Date object
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Or any placeholder you prefer
  } else {
    // Ensure timezone does not affect the output, consider formatting like so:
    // Extract month, day, and year, then format it as MM/DD/YY
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().substr(-2);
    return `${month}/${day}/${year}`; // Returns "MM/DD/YY"
  }
}

const CampaignDetailDialog = ({
  openDialog,
  handleCloseDialog,
  dialogContent,
  setDialogContent,
  handleToggleChange,
  creatorsToRemove,
  setCreatorsToRemove,
  blitzAutoCampaign,
  fetchCampaigns,
}) => {
  const navigate = useNavigate();

  // Calculate total sum and number of creators
  const [newPrices, setNewPrices] = useState({}); // Hold new prices for creators    const [selectedCreatorForAction, setSelectedCreatorForAction] = useState(null);
  const [liveLinks, setLiveLinks] = useState({});
  const [boostCodes, setBoostCodes] = useState({});
  const [poNumber, setPoNumber] = useState("");
  const [selectedAction, setSelectedAction] = useState("Actions");
  const [isChanging, setChanging] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);  // New state for feedback dialog

  const handleEditCreator = (creator) => {
    // If campaign is Launched, prepare and open feedback dialog
    if (dialogContent.campaign_status === 'Launched') {
      setEditingCreator({
        ...creator,
        campaignId: dialogContent.id  // Ensure we pass the campaign ID to the dialog
      });
      setFeedbackDialogOpen(true);
    } else if (dialogContent.campaign_status !== 'Completed') {
      setEditingCreator({
        id: creator.id,
        creatorBrief: creator.creatorBrief,
        postingInstructions: creator.postingInstructions,
        campaignId: dialogContent.id
      });
      setEditDialogOpen(true);
    }
  };
  
  const openFeedbackDialog = () => {
    if (editingCreator) {
      setFeedbackDialogOpen(true);
    } else {
      alert("No creator selected for feedback.");
    }
  };
  
  
  // Render edit button conditionally
  const renderEditButton = (creator) => {
    if (!['Launched', 'Completed'].includes(dialogContent.status)) {
      return (
        <IconButton onClick={() => handleEditCreator(creator)} color="primary">
          <EditIcon />
        </IconButton>
      );
    }
    return null;
  };

  // Check campaign status to conditionally display the "Add Creators" button and feedback section
  const canEditCampaign = !['Launched', 'Completed'].includes(dialogContent.status);
  const canSendFeedback = dialogContent.status === 'Launched';

  const closeEditDialog = () => {
    setEditDialogOpen(false);
  };
  const [postingInstructions, setPostingInstructions] = useState("");
  // Function to handle the selection of a creator for a specific action
  const handleActionSelection = (event) => {
    const action = event.target.value;
    setSelectedAction(action);
    // Additional logic to prepare for the action (e.g., set up for removal or price update)
  };
  // Calculate total sum and number of creatorsr
  const totalCampaignSum = dialogContent.creators
    ? dialogContent.creators.reduce((acc, creator) => {
        // Remove any characters that are not digits or a dot, then parse
        const price = parseFloat(
          (newPrices[creator.id] || creator.price || "0").replace(/[^\d.]/g, "")
        );
        return acc + price;
      }, 0)
    : 0;
  const totalCreators = dialogContent.creators
    ? dialogContent.creators.length
    : 0;

  // Function to stage creator removals without immediate effect
  // Toggle creator removal
  const toggleCreatorRemoval = (creatorId) => {
    setCreatorsToRemove((prevCreators) => {
      if (prevCreators.includes(creatorId)) {
        return prevCreators.filter((id) => id !== creatorId);
      } else {
        return [...prevCreators, creatorId];
      }
    });
  };

  const handleAddCreatorsClick = (campaignId) => {
    navigate(`/add-creators/${campaignId}`);
  };

  const { mutate: launchCampaign, isLoading: isLaunching } = useMutation(
    client.campaigns.launch,
    {
      onSuccess: (data) => {
        console.log(data);
        alert("Campaign launched successfully!");

        // Assuming fetchCampaigns is a function that updates the UI with the latest campaigns list
        fetchCampaigns();
      },
      onError: (error) => {
        console.error("Error launching campaign:", error);
        alert(
          `Error launching campaign: ${
            error.response?.data?.message ?? error.message
          }`
        );
      },
    }
  );

  const handleLaunchCampaign = async () => {
    const creatorNames = dialogContent.creators.map((creator) => creator.name);
    const creatorPrices = dialogContent.creators.reduce((acc, creator) => {
      acc[creator.name] = creator.price; // Map each creator's name to their price
      return acc;
    }, {});

    launchCampaign({
      campaignId: dialogContent.id,
      campaignName: dialogContent?.name,
      campaignBrief: dialogContent.brief, // Ensure this is the key expected by your backend
      creatorNames,
      creatorPrices, // Mapping of creator names to their prices
      blitzautocampaign: blitzAutoCampaign, // Include blitzAutoCampaign in the request body
    });
  };

  const { mutate: completeCampaign, isLoading: isCompleting } = useMutation(
    client.campaigns.complete,
    {
      onSuccess: (data) => {
        console.log(data);
        alert("Campaign completed successfully, PO number updated.");

        // Optionally, refresh your campaigns data or update UI accordingly
        fetchCampaigns();
      },
      onError: (error) => {
        console.error("Error completing campaign:", error);
        alert(`Error: ${error.response?.data?.message ?? error.message}`);
      },
    }
  );

  const handleCompleteCampaign = async () => {
    // Check if campaignId and poNumber are available
    if (!dialogContent.id) {
      alert("Campaign ID is missing");
      return;
    }

    completeCampaign({ index: dialogContent.id, params: { poNumber } });
  };

  const handleCreatorFieldChange = (creatorId, field, value) => {
    // Update the creator's specific field value in the dialogContent state
    const updatedCreators = dialogContent.creators.map((creator) => {
      if (creator.id === creatorId) {
        return { ...creator, [field]: value };
      }
      return creator;
    });

    setDialogContent({ ...dialogContent, creators: updatedCreators });

    // If assets are approved, handle the specific logic for that case
    if (field === "assetsApproved" && value === true) {
      // Call the separate function to handle the logic for when assets are approved
      handleAssetsApproved(creatorId);
    }
  };

  // Revised assets approval logic to call `sendPostingInstructions` with correct parameters
  const handleAssetsApproved = async (creatorId) => {
    // Assuming `postingInstructions` is captured somewhere in your state
    const creator = dialogContent.creators.find(
      (creator) => creator.id === creatorId
    );
    if (!creator || !creator.postingInstructions) {
      alert("No instructions found for creator", creatorId);
      return;
    }

    sendPostingInstructions(creatorId, creator.postingInstructions);
  };

  const handleAddPostingInstructions = async () => {
    // Define the updated creators array, mapping over each creator to add postingInstructions
    const updatedCreators = dialogContent.creators.map((creator) => {
      return { ...creator, postingInstructions: postingInstructions };
    });

    // Prepare the payload with the campaign ID and the updated creators array
    const payload = {
      campaignId: dialogContent.id, // Assuming dialogContent holds the current campaign's ID
      creators: updatedCreators,
    };

    // Log the payload for debugging
    console.log(
      "Updating campaign with new posting instructions: ",
      JSON.stringify(payload, null, 2)
    );

    try {
      // Make the API call to update creator details
      const response = await fetch(
        `${ConfigValue.PUBLIC_REST_API_ENDPOINT}/campaigns/updateCreatorDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        // If the response is not OK, throw an error with the response's error message
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to save posting instructions"
        );
      }

      // On successful update, update the local state to reflect the changes
      setDialogContent({ ...dialogContent, creators: updatedCreators });

      // Show a success message
      alert("Posting instructions updated successfully for all creators.");
    } catch (error) {
      // Log and alert any errors encountered during the update
      console.error("Error updating posting instructions:", error);
      alert(`Error: ${error.message}`);
    } finally {
      // Optionally, reset the postingInstructions state and close any relevant dialogs
      setPostingInstructions("");
      setPostingDialogOpen(false);
    }
  };

  // Update price function
  const updatePrice = (creatorId, event) => {
    const price = event.target.value; // Assuming you want to capture the value directly
    setNewPrices((prevPrices) => ({
      ...prevPrices,
      [creatorId]: price, // Ensure this captures the correct value format
    }));
  };

  const applyChanges = async () => {
    setChanging(true);

    // Early exit if no action is selected or no modifications are specified
    const requestBody = {
      campaignId: dialogContent.id,
      creators: dialogContent.creators,
      blitzAutoCampaign: dialogContent.blitz_autocampaign,
    };
    try {
      const response = await fetch(
        `${ConfigValue.PUBLIC_REST_API_ENDPOINT}/campaigns/updateCreatorDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        setChanging(false);
        throw new Error("Failed to update creator details.");
      }

      alert("Creator details updated successfully.");
      fetchCampaigns(); // Refresh the campaign data
    } catch (error) {
      setChanging(false);
      console.error("Error updating creator details:", error);
      alert("Failed to update creator details.");
      return;
    }

    if (selectedAction === "remove" && creatorsToRemove.length > 0) {
      try {
        const response = await fetch(
          `${ConfigValue.PUBLIC_REST_API_ENDPOINT}/campaigns/removeCreators`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              campaignId: dialogContent.id,
              creatorIds: creatorsToRemove,
            }),
          }
        );
        if (!response.ok) {
          setChanging(false);
          // Handle error response
          const errorData = await response.json();
          console.error(`Failed to remove creators: ${errorData.message}`);
          return; // Exit if there is an error
        }
        // Success - Optionally, you can refresh the campaign data or clear the state
        setCreatorsToRemove([]);
        updateCampaignSum();
        fetchCampaigns(); // Refresh the campaigns to reflect the removal
      } catch (error) {
        console.error("Error removing creators:", error);
      }
    }

    // Inside your applyChanges function for the "counter" action
    if (selectedAction === "counter" && Object.keys(newPrices).length > 0) {
      try {
        const response = await fetch(
          `${ConfigValue.PUBLIC_REST_API_ENDPOINT}/campaigns/updateCreatorPrices`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              campaignId: dialogContent.id, // Ensure this is an integer
              newPrices, // This should be an object mapping creator IDs to their new prices
            }),
          }
        );
        if (response.ok) {
          // After successful removal
          updateCampaignSum();
          fetchCampaigns(); // Refresh the campaign data
        }
        if (!response.ok) {
          setChanging(false);
          const errorData = await response.json();
          throw new Error(
            `Failed to update creator prices: ${errorData.message}`
          );
        }

        // If successful, reset the newPrices
        setNewPrices({});
      } catch (error) {
        console.error("Error updating prices:", error);
        // Handle error (e.g., show a message to the user)
      }
    }

    setChanging(false);

    // Close the dialog regardless of outcome
    updateCampaignSum();
    updateLiveLinksAndBoostCodes();
    handleCloseDialog();
    fetchCampaigns(); // Refresh the campaign data
  };

  const { mutate: doUpdateCampaginSum } = useMutation(
    client.campaigns.updateCampaignSum,
    {
      onSuccess: (data) => {
        console.log(data);
        alert("Campaign sum updated successfully");
        fetchCampaigns(); // Refresh the campaign list to reflect the updated sum
      },
      onError: (error) => {
        console.error("Error updating campaign sum:", error);
      },
    }
  );

  const updateCampaignSum = async () => {
    const campaignSumToUpdate = totalCampaignSum; // Use the calculated totalCampaignSum
    doUpdateCampaginSum({
      campaignId: dialogContent.id,
      campaignSum: campaignSumToUpdate.toString(), // Convert to string if needed
    });
  };

  const { mutate: doUpdateLiveLinksAndBoostCodes } = useMutation(
    client.campaigns.updateLinksCodes,
    {
      onSuccess: (data) => {
        console.log(data);
        // Success handling
        alert("Live links and boost codes updated successfully");
        setLiveLinks({});
        setBoostCodes({});
        // You might want to refresh or update the UI accordingly here
      },
      onError: (error) => {
        console.error("Error updating live links and boost codes:", error);
        alert("Failed to update live links and boost codes");
      },
    }
  );
  const { mutate: sendPosting } = useMutation(
    client.campaigns.sendPostingInstructions,
    {
      onSuccess: (data) => {
        alert("Posting instructions sent successfully.");
      },
      onError: (error) => {
        console.error("Error sending posting instructions:", error);
        alert(`Error sending posting instructions: ${error.message}`);
      },
    }
  );

  const sendPostingInstructions = async (creatorId, instructions) => {
    if (!creatorId || !instructions) {
      alert("Missing creator ID or instructions");
      return;
    }

    sendPosting({
      creatorId: creatorId,
      postingInstructions: instructions,
    });
  };

  const updateLiveLinksAndBoostCodes = async () => {
    // Constructing the updates payload
    const updates = dialogContent.creators
      .map((creator) => ({
        id: creator.id,
        liveLink: liveLinks[creator.id] || "",
        boostCode: boostCodes[creator.id] || "",
      }))
      .filter((update) => update.liveLink || update.boostCode); // Filter out entries without updates

    if (updates.length === 0) {
      return false; // Early exit if no updates
    }

    doUpdateLiveLinksAndBoostCodes({
      campaignId: dialogContent.id, // Assuming `dialogContent` holds the current campaign's data
      updates: updates,
    });
  };
  // Add this function inside CampaignDetailDialog component
const saveCreatorDetails = (creatorId, details) => {
  // Update the creators array with the new details for the specified creator
  const updatedCreators = dialogContent.creators.map((creator) => {
    if (creator.id === creatorId) {
      return { ...creator, ...details };
    }
    return creator;
  });

  // Update dialogContent with the new creators array
  setDialogContent((prev) => ({ ...prev, creators: updatedCreators }));

  // Here, make an API call to update the backend data if necessary
  // Assuming you have a method to call the API
  updateCampaignCreators(dialogContent.id, updatedCreators);
};

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6">
              Campaign Name: {dialogContent?.name}
            </Typography>
            <Typography>
              {dialogContent?.drive_link && (
                <Link
                  href={dialogContent.drive_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Campaign Assets
                </Link>
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6">
              <Typography variant="h6">
                Ideal Due Date:{" "}
                {formatIdealDueDate(dialogContent?.ideal_duedate)}
              </Typography>{" "}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="PO Number"
              required
              fullWidth
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              onClick={() =>
                setPoNumber(`PO-${Math.floor(Math.random() * 100000)}`)
              }
              fullWidth
            >
              Generate New PO
            </Button>
          </Grid>
          <Grid item xs={12} style={{ marginTop: 8 }}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Select
                value={selectedAction} // Tracks the current selected action within the dialog
                displayEmpty
                onChange={handleActionSelection}
                style={{ flexGrow: 1 }}
              >
                <MenuItem value="" disabled>
                  Actions
                </MenuItem>
                <MenuItem value="remove">Remove Creator</MenuItem>
                <MenuItem value="counter">Counter Offer Price</MenuItem>
              </Select>
              <div>
                <Typography>Blitz SMS and Email Automation</Typography>

                <Switch
                  checked={dialogContent?.blitz_autocampaign} // Use dialogContent's blitzAutoCampaign
                  onChange={handleToggleChange}
                  name="blitzautocampaign"
                  inputProps={{
                    "aria-label": "Blitz SMS and Email Automation toggle",
                  }}
                  disabled={dialogContent.blitz_autocampaign} // Disable if already on
                />

                <Tooltip title="This is in alpha mode, so there may be errors if you try to run a campaign this way">
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              </div>

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleLaunchCampaign(dialogContent.id)}
                startIcon={
                  isLaunching && <CircularProgress size={20} color="inherit" />
                }
              >
                Launch Campaign
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={() => handleAddCreatorsClick(dialogContent?.id)} // Pass the current dialog's campaign ID
              >
                Add Creators
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={applyChanges}
                startIcon={
                  isChanging && <CircularProgress size={20} color="inherit" />
                }
              >
                Approve Changes
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={handleCompleteCampaign}
                startIcon={
                  isCompleting && <CircularProgress size={20} color="inherit" />
                }
              >
                Complete Campaign
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent>
        {dialogContent?.creators ? (
          <>
            <TableContainer component={Paper}>
              <Table aria-label="creator details">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: "white" }}>Select</TableCell>
                    <TableCell style={{ color: "white" }}>Name/ID</TableCell>
                    <TableCell style={{ color: "white" }}>Price</TableCell>
                    <TableCell style={{ color: "white" }}>Offer Sent</TableCell>
                    <TableCell style={{ color: "white" }}>
                      Assets Sent
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      Approve Assets
                    </TableCell>
                    <TableCell style={{ color: "white" }}>Live Link</TableCell>
                    <TableCell style={{ color: "white" }}>
                      Usage or Boost Code
                    </TableCell>
                    <TableCell style={{ color: "white" }}>Post Date</TableCell>
                    <TableCell style={{ color: "white" }}>
                      Total Views
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      Total Likes
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      Total Comments
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      Total Engagement
                    </TableCell>
                    <TableCell style={{ color: "white" }}>Report</TableCell>
                    <TableCell style={{ color: "white" }}>Status</TableCell>
                    <TableCell style={{ color: "white" }}>Add Creator Details</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {dialogContent.creators.map((creator, index) => (
                    <TableRow key={index}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={creatorsToRemove.includes(creator.id)}
                          onChange={() => toggleCreatorRemoval(creator.id)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>{creator.name}</TableCell>
                      <TableCell>
                        {/* Render editable price field if counter offer is selected */}
                        {selectedAction === "counter" ? (
                          <TextField
                            type="text"
                            value={
                              newPrices[creator.id] || creator.price.toString()
                            }
                            onChange={(e) => updatePrice(creator.id, e)}
                            fullWidth
                          />
                        ) : (
                          creator.price
                        )}
                      </TableCell>
                      <TableCell>
                        {blitzAutoCampaign ? (
                          creator.offerSent ? (
                            "Yes"
                          ) : (
                            "No"
                          )
                        ) : (
                          <Checkbox
                            checked={creator.offerSent || false}
                            onChange={(e) =>
                              handleCreatorFieldChange(
                                creator.id,
                                "offerSent",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {blitzAutoCampaign ? (
                          creator.assetsSent ? (
                            "Yes"
                          ) : (
                            "No"
                          )
                        ) : (
                          <Checkbox
                            checked={creator.assetsSent || false}
                            onChange={(e) =>
                              handleCreatorFieldChange(
                                creator.id,
                                "assetsSent",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {/* Assets Approved checkbox remains static, reflecting stored value */}
                        <Checkbox
                          checked={creator.assetsApproved || false}
                          onChange={(e) =>
                            handleCreatorFieldChange(
                              creator.id,
                              "assetsApproved",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          variant="outlined"
                          size="small"
                          placeholder="Live Link"
                          value={
                            liveLinks[creator.id] !== undefined
                              ? liveLinks[creator.id]
                              : creator.liveLink || ""
                          }
                          onChange={(e) =>
                            setLiveLinks({
                              ...liveLinks,
                              [creator.id]: e.target.value,
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          variant="outlined"
                          size="small"
                          placeholder="Boost Code"
                          value={
                            boostCodes[creator.id] !== undefined
                              ? boostCodes[creator.id]
                              : creator.boostCode || ""
                          }
                          onChange={(e) =>
                            setBoostCodes({
                              ...boostCodes,
                              [creator.id]: e.target.value,
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {blitzAutoCampaign ? (
                          creator.postDate || "N/A"
                        ) : (
                          <TextField
                            variant="outlined"
                            size="small"
                            placeholder="YYYY-MM-DD"
                            value={creator.postDate || ""}
                            onChange={(e) =>
                              handleCreatorFieldChange(
                                creator.id,
                                "postDate",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {blitzAutoCampaign ? (
                          creator.totalViews || "N/A"
                        ) : (
                          <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Total Views"
                            value={creator.totalViews || ""}
                            onChange={(e) =>
                              handleCreatorFieldChange(
                                creator.id,
                                "totalViews",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {blitzAutoCampaign ? (
                          creator.likes || "N/A"
                        ) : (
                          <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Likes"
                            value={creator.likes || ""}
                            onChange={(e) =>
                              handleCreatorFieldChange(
                                creator.id,
                                "likes",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {blitzAutoCampaign ? (
                          creator.comments || "N/A"
                        ) : (
                          <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Comments"
                            value={creator.comments || ""}
                            onChange={(e) =>
                              handleCreatorFieldChange(
                                creator.id,
                                "comments",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {/* Total Engagement field might be calculated automatically or remain static */}
                        {creator.totalEngagement || "N/A"}
                      </TableCell>
                      <TableCell>
                        {/* Campaign Recap might remain static or link to a detailed view */}
                        {creator.campaignRecap || "N/A"}
                      </TableCell>
                      <TableCell>
                        {blitzAutoCampaign ? (
                          creator.status
                        ) : (
                          <Select
                            value={creator.status}
                            onChange={(e) =>
                              handleCreatorFieldChange(
                                creator.id,
                                "status",
                                e.target.value
                              )
                            }
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            variant="outlined"
                            size="small"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="Accepted">Accepted</MenuItem>
                            <MenuItem value="declined">Declined</MenuItem>
                            <MenuItem value="pitched">Pitched</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="drop">Drop</MenuItem>
          <MenuItem value="counter">Counter</MenuItem>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                      <TableCell>{renderEditButton(creator)}</TableCell>

      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {canSendFeedback && (
              <Button
                variant="contained"
                color="primary"
                onClick={openFeedbackDialog}
              >
                Send Feedback
              </Button>
            )}
            <Grid
              container
              display="flex"
              justifyContent="space-between"
              marginTop={2}
              spacing={2}
            >
<Grid item xs={12} md={6}>
  <Typography>Total Campaign Sum: ${totalCampaignSum.toFixed(2)}</Typography>
  <Typography>Total Creators: {totalCreators}</Typography>
  <Typography variant="h6" style={{ marginTop: 20, marginBottom: 10 }}>Campaign Manager:</Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={4}>
      <Typography variant="body2"><strong>Name:</strong> {dialogContent.campaign_manager?.name}</Typography>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Typography variant="body2"><strong>Email:</strong> {dialogContent.campaign_manager?.email}</Typography>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Typography variant="body2"><strong>Phone:</strong> {dialogContent.campaign_manager?.phone_number}</Typography>
    </Grid>
  </Grid>


              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Posting Instructions"
                  type="text"
                  fullWidth
                  multiline
                  minRows={3}
                  value={postingInstructions}
                  onChange={(e) => setPostingInstructions(e.target.value)}
                />
                <DialogActions>
                  <Button onClick={handleAddPostingInstructions}>
                    Add Posting Instructions
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography>No creator data available.</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
      <EditCreatorDialog
    open={editDialogOpen}
    onClose={closeEditDialog}
    creator={editingCreator}
    onSave={saveCreatorDetails}  // Make sure this prop is passed correctly
   // brief={brief}  // Make sure this prop is passed correctly
/>
<CreatorFeedbackDialog
  open={feedbackDialogOpen}
  onClose={() => setFeedbackDialogOpen(false)}
  creator={editingCreator} // Pass the currently selected creator
  campaignId={editingCreator?.campaignId} // Pass the campaign ID
/>

    </Dialog>
  );
};

const Campaigns = () => {
  const isMounted = useIsMounted();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});
  const [creatorsToRemove, setCreatorsToRemove] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [blitzAutoCampaign, setBlitzAutoCampaign] = useState(false);

  const handleToggleChange = async (event) => {
    const newBlitzAutoCampaignValue = event.target.checked;
    setBlitzAutoCampaign(newBlitzAutoCampaignValue); // Update local state
    setDialogContent((prevState) => ({
      ...prevState,
      blitz_autocampaign: newBlitzAutoCampaignValue,
    }));
    // Optionally, if you want to immediately update the backend about this change (outside the launch campaign process), you can call the API here. This step is optional and depends on your specific requirements.
  };

  const { mutate: fetchCampaigns } = useMutation(client.campaigns.list, {
    onSuccess: (data) => {
      let filteredData =
        statusFilter === "All"
          ? data
          : data.filter((campaign) => campaign.campaignstatus === statusFilter);
      filteredData = filteredData.map((campaign) => ({
        ...campaign,
        creators: JSON.parse(campaign.creators),
      }));

      setCampaigns(filteredData);
    },
    onError: (error) => {
      console.error("Error fetching campaigns:", error);
    },
  });

  const handleOpenDialog = (campaignData) => {
    setDialogContent(campaignData); // Assuming campaignData contains the details about the campaign
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formatCampaignSum = (sum) => {
    const numericSum = parseFloat(sum.replace(/[^\d.]/g, "")); // Remove any non-numeric characters
    return `$${numericSum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`; // Format with commas and prefix with $
  };

  // Utility function to format proposal date
  const formatProposalDate = (dateString) => {
    const date = new Date(dateString);
    // Format the date as mm/dd/yy
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear().toString().substr(-2)}`;
  };

  useEffect(() => {
    if (!isMounted) return;
    // Call the function
    fetchAndInitializeCampaigns();
    fetchCampaigns();
  }, [isMounted, statusFilter]); // Empty dependency array means this effect runs once on mount

  const { mutate: fetchAndInitializeCampaigns, isLoading } = useMutation(
    client.campaigns.list,
    {
      onSuccess: (data) => {
        let initializedCampaigns = data.map((campaign) => ({
          ...campaign,
          status: "Pending", // Assuming you want to set all fetched campaigns to "Pending"
        }));
        initializedCampaigns = initializedCampaigns.map((campaign) => ({
          ...campaign,
          creators: JSON.parse(campaign.creators),
        }));

        setCampaigns(initializedCampaigns);
      },
      onError: (error) => {
        console.error("Error fetching campaigns:", error);
      },
    }
  );

  // This function could be added within your existing React component
  // Adjusted function to explicitly receive `creatorId` and `instructions`
  
  const handleActionChange = (event) => {
    setSelectedAction(event.target.value);
  };

  const handleCheckboxChange = (campaignId) => {
    const selectedIndex = selectedCampaigns.indexOf(campaignId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCampaigns, campaignId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedCampaigns.slice(1));
    } else if (selectedIndex === selectedCampaigns.length - 1) {
      newSelected = newSelected.concat(selectedCampaigns.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedCampaigns.slice(0, selectedIndex),
        selectedCampaigns.slice(selectedIndex + 1)
      );
    }

    setSelectedCampaigns(newSelected);
  };

  const handleRowDoubleClick = (campaign) => {
    setDialogContent(campaign);
    setOpenDialog(true);
  };

  const { mutate: deleteCampaign, isLoading: isDeletingCampaign } = useMutation(
    client.campaigns.delete,
    {
      onSuccess: (data) => {
        console.log(data);
        alert("Campaign deleted successfully!");

        // Assuming fetchCampaigns is a function that updates the UI with the latest campaigns list
        fetchCampaigns();
      },
      onError: (error) => {
        console.error("Error deleting campaign:", error);
        alert("Error deleting campaign: " + error.message);
      },
    }
  );

  const { mutate: updateCampaignStatus, isLoading: isUpdatingCampagingStatus } =
    useMutation(client.campaigns.update, {
      onSuccess: (data) => {
        console.log(data);
        alert("Campaign status updated successfully!");

        // Assuming fetchCampaigns is a function that updates the UI with the latest campaigns list
        fetchCampaigns();
      },
      onError: (error) => {
        console.error("Error updating campaign:", error);
        alert("Error updating campaign: " + error.message);
      },
    });

  const applyAction = async () => {
    if (selectedAction.length == 0) {
      alert("Please choose action!");
      return;
    }
    if (selectedAction === "delete") {
      deleteCampaign({ id: selectedCampaigns });
    } else if (selectedAction === "archive" || selectedAction === "pause") {
      const status = selectedAction === "archive" ? "Archived" : "Paused";
      updateCampaignStatus({ campaignIds: selectedCampaigns, status });
    }
    setSelectedCampaigns([]); // Clear selection after action
  };

  const sortedCampaigns = campaigns.sort(
    (a, b) => new Date(b.proposal_date) - new Date(a.proposal_date)
  );

  const handleSelectCampaign = (campaign) => {
    setDialogContent(campaign); // Set the selected campaign as dialog content
    setOpenDialog(true); // Open the dialog
  };
  const handleShareCampaign = (campaignId) => {
    const url = `${window.location.origin}/campaigns/${campaignId}`;
    navigator.clipboard.writeText(url);
    alert('Share link copied to clipboard!');
  };
  const handleCopyCampaign = async (campaignId) => {
    try {
        const response = await fetch('https://blitz-backend-nine.vercel.app/api/campaigns/copyCampaign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ campaignId: campaignId }), // Passing campaignId correctly
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        alert(data.message);
        fetchCampaigns(); // Refresh the list to show the copied campaign
    } catch (error) {
        console.error('Failed to copy campaign:', error);
        alert('Error copying campaign');
    }
};

  
  return (
    <div>
      <Navbar />
      <Box sx={{ my: 4, paddingLeft: "15.5rem", margin: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          component="div"
          style={{ color: "#1976d2" }}
        >
          Campaigns
        </Typography>
        <Grid container spacing={2}>
          <Grid container spacing={2}>
            {sortedCampaigns.slice(0, 3).map((campaign) => (
              <Grid item xs={12} md={6} key={campaign.id}>
                <RecentCampaign
                  campaign={campaign}
                  onSelectCampaign={handleSelectCampaign}
                />
              </Grid>
            ))}

            {/* Summary block and other content... */}

            {/* Summary Block */}
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ minWidth: 275, margin: 2 }}>
                <CardContent onDoubleClick={() => onSelectCampaign(campaign)}>
                  <Typography variant="h5" component="div" gutterBottom>
                    Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Campaigns: {campaigns.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Campaigns:{" "}
                    {
                      campaigns.filter(
                        (campaign) => campaign.campaign_status === "Launched"
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Budget: $
                    {campaigns
                      .reduce(
                        (sum, campaign) =>
                          sum + Number(campaign.campaign_sum || 0),
                        0
                      )
                      .toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Posts Up:{" "}
                    {campaigns.reduce(
                      (sum, campaign) =>
                        sum +
                        campaign.creators.filter((creator) => creator.liveLink)
                          .length,
                      0
                    )}
                  </Typography>
                  {/* Assuming each campaign should have a fixed number of posts (e.g., 5) */}
                  <Typography variant="body2" color="text.secondary">
                    Total Posts Remaining:{" "}
                    {/* Calculation would depend on your data structure */}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Views:{" "}
                    {campaigns
                      .reduce(
                        (sum, campaign) =>
                          sum +
                          campaign.creators.reduce(
                            (cSum, creator) =>
                              cSum + Number(creator.totalViews || 0),
                            0
                          ),
                        0
                      )
                      .toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Engagement:{" "}
                    {campaigns
                      .reduce(
                        (sum, campaign) =>
                          sum +
                          campaign.creators.reduce(
                            (cSum, creator) =>
                              cSum + Number(creator.totalEngagement || 0),
                            0
                          ),
                        0
                      )
                      .toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} sx={{ paddingRight: "2%" }}>
            {" "}
            {/* Allocate 80% width and add padding */}{" "}
            {/* Adjusted from md={8} to md={9} for the main content */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 2,
                mb: 4,
              }}
            >
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 240, marginLeft: 2 }}
              >
                <InputLabel id="status-filter-label">
                  Filter by Status
                </InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                  }}
                  label="Filter by Status"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Paused">Paused</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Launched">Launched</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 240 }}
              >
                <InputLabel id="action-type-label">Action Type</InputLabel>
                <Select
                  labelId="action-type-label"
                  value={selectedAction}
                  onChange={handleActionChange}
                  label="Action Type"
                >
                  <MenuItem value="edit">Edit</MenuItem>
                  <MenuItem value="delete">Delete</MenuItem>
                  <MenuItem value="archive">Archive</MenuItem>
                  <MenuItem value="pause">Pause</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={applyAction}
                startIcon={
                  (isDeletingCampaign || isUpdatingCampagingStatus) && (
                    <CircularProgress size={20} color="inherit" />
                  )
                }
              >
                Apply
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table aria-label="campaigns table" sx={{ minWidth: 650 }}>
                <TableHead style={{ backgroundColor: "black", color: "white" }}>
                  <TableRow>
                    <TableCell style={{ color: "white" }}>Select</TableCell>
                    <TableCell style={{ color: "white" }}>
                      Campaign Name
                    </TableCell>
                    <TableCell style={{ color: "white" }}>Brief</TableCell>
                    <TableCell style={{ color: "white" }}>
                      Campaign Sum
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      Proposal Date
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      Product Type
                    </TableCell>
                    <TableCell style={{ color: "white" }}>Creators</TableCell>
                    <TableCell style={{ color: "white" }}>
                      Video Amount
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      Ideal Due Date
                    </TableCell>
                    <TableCell style={{ color: "white" }}>Status</TableCell>
                    <TableCell style={{ color: "white" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <TableRow
                        key={campaign.id}
                        onDoubleClick={() => handleRowDoubleClick(campaign)}
                        hover
                      >
                        {" "}
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedCampaigns.indexOf(campaign.id) !== -1
                            }
                            onChange={() => handleCheckboxChange(campaign.id)}
                          />
                        </TableCell>
                        <TableCell
                          onClick={() => handleOpenDialog(campaign)}
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          {campaign.name}
                        </TableCell>
                        <TableCell>{campaign.brief}</TableCell>
                        <TableCell>
                          {formatCampaignSum(campaign.campaign_sum)}
                        </TableCell>
                        <TableCell>
                          {formatProposalDate(campaign.proposal_date)}
                        </TableCell>
                        <TableCell>{campaign.campaign_type}</TableCell>
                        <TableCell>
                          {campaign.creators
                            .map((creator) => creator.name)
                            .join(", ")}
                        </TableCell>
                        <TableCell>{campaign.video_amount}</TableCell>
                        <TableCell>
                          <Typography>
                            {formatIdealDueDate(campaign.ideal_duedate)}
                          </Typography>
                        </TableCell>
                        <TableCell>{campaign.campaign_status}</TableCell>
                        <TableCell>
  <IconButton onClick={() => handleShareCampaign(campaign.id)}>
    <ShareIcon />
  </IconButton>
  <IconButton onClick={() => handleCopyCampaign(campaign.id)}>
    <FileCopyIcon />
  </IconButton>
</TableCell>

                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="8" align="center">
                        No campaigns available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
      <CampaignDetailDialog
        selectedAction={selectedAction}
        dialogContent={dialogContent}
        setDialogContent={setDialogContent}
        openDialog={openDialog}
        fetchCampaigns={fetchCampaigns}
        handleCloseDialog={handleCloseDialog}
        handleToggleChange={handleToggleChange}
        creatorsToRemove={creatorsToRemove}
        setCreatorsToRemove={setCreatorsToRemove}
        blitzAutoCampaign={blitzAutoCampaign}
      />
    </div>
  );
};

export default Campaigns;
