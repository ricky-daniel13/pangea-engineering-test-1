import React, { useState, useEffect } from "react";
import { Button, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "react-query";
import client from "../../../../API";
import { StyledTableRow, StyledTableCell } from "../../../../Utils/styledcell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { useIsMounted } from "../../../../Hooks/use-is-mounted";

import Paper from "@mui/material/Paper";
import { drawerWidth } from "../../../../Utils/constants";
import CampaignDialog from "../campaigndialog";

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
    paddingLeft: "16rem", // Add padding equal to the navbar width
    width: `calc(100% - 16rem)`, // Allocate 75% of the width minus the navbar width
    overflowY: "auto", // Allow vertical scrolling within the content area if necessary
  },
  button: {
    margin: theme.spacing(1), // Uniform margin for buttons
    padding: theme.spacing(1), // Adjust padding to ensure buttons are not too large or too small
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

const CampaignDetailsView = () => {
  const classes = useStyles();
  const isMounted = useIsMounted();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCampaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [isPayCreatorDialogOpen, setPayCreatorDialogOpen] = useState(false);
  const [creatorsJson, setCreatorsJson] = useState("");

  const { mutate: fetchCampaigns } = useMutation(client.campaigns.listAdmin, {
    onSuccess: (data) => {
      setCampaigns(data);
      setSelectedIds([]);
    },
    onError: (error) => {
      console.error("Error fetching campaigns:", error);
    },
  });

  useEffect(() => {
    isMounted && fetchCampaigns();
  }, [isMounted]);

  const deleteCampaignMutation = useMutation((campaignIds) =>
    client.campaigns.deleteCampaignAdmin({ campaignIds })
  );

  const onDeleteCampaigns = () => {
    // Call the mutation to delete selected campaigns
    if (selectedIds.length > 0) {
      deleteCampaignMutation.mutate(selectedIds, {
        onSuccess: () => {
          // Optional: Display success message, refresh campaign list, etc.
          fetchCampaigns(); // Assuming fetchCampaigns is a function to refresh the campaigns list
        },
        onError: (error) => {
          console.error("Error deleting campaigns:", error);
          // Optional: Display error message
        },
      });
    }
  };
  const formatAmount = (amount) => {
    // Format the number to a currency format
    return `$${parseFloat(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const onAddOrEditCampaign = () => {
    setPayCreatorDialogOpen(true);
  };

  const handleSelectCampaign = (campaignId) => {
    const newSelectedIds = selectedIds.includes(campaignId)
      ? selectedIds.filter((id) => id !== campaignId)
      : [...selectedIds, campaignId];
    setSelectedIds(newSelectedIds);
  };

  const handleDialogClose = (bRefresh) => {
    setPayCreatorDialogOpen(false);
    bRefresh && fetchCampaigns();
  };

  return (
    <div className={classes.content}>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedIds.length !== 1}
          onClick={onAddOrEditCampaign}
        >
          Edit Campaign
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedIds.length}
          onClick={onDeleteCampaigns}
        >
          Delete Campaign(s)
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }}>Select</TableCell>
              <TableCell style={{ color: "white" }}>Campaign Name</TableCell>
              <TableCell style={{ color: "white" }}>Brief</TableCell>
              <TableCell style={{ color: "white" }}>Campaign Sum</TableCell>
              <TableCell style={{ color: "white" }}>Proposal Date</TableCell>
              <TableCell style={{ color: "white" }}>Product Type</TableCell>
              <TableCell style={{ color: "white" }}>Status</TableCell>
              <TableCell style={{ color: "white" }}>Creators</TableCell>
              <TableCell style={{ color: "white" }}>Video Amount</TableCell>
              <TableCell style={{ color: "white" }}>PO Number</TableCell>

              <TableCell style={{ color: "white" }}>Blitz Auto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((campaign) => (
              <StyledTableRow key={campaign.id}>
                {/* Update to display campaign-specific details */}
                <StyledTableCell align="center">
                  <Checkbox
                    color="primary"
                    checked={selectedIds.includes(campaign.id)}
                    onChange={() => handleSelectCampaign(campaign.id)}
                  />
                </StyledTableCell>

                <StyledTableCell align="center">
                  {campaign.name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {campaign.brief}
                </StyledTableCell>

                <StyledTableCell align="center">
                  {formatAmount(campaign.campaign_sum)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {campaign.proposal_date}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {campaign.campaign_type}
                </StyledTableCell>

                <StyledTableCell align="center">
                  {campaign.campaign_status}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {JSON.parse(campaign.creators)
                    .map((creator) => creator.id)
                    .join(",")}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {campaign.video_amount}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {campaign.po_number}
                </StyledTableCell>

                <StyledTableCell align="center">
                  {campaign.blitz_autocampaign}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isPayCreatorDialogOpen && (
        <CampaignDialog
          open={isPayCreatorDialogOpen}
          info={
            selectedIds.length > 0
              ? campaigns.filter((item) => item.id == selectedIds[0])[0]
              : undefined
          }
          onClose={handleDialogClose}
        />
      )}
    </div>
  );
};

export default CampaignDetailsView;
