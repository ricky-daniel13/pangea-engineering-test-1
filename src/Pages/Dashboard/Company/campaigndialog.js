import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import client from "../../../API"; // Adjust the path to your API client
import { useMutation } from "react-query";
import { isJSONObject, isJSONString } from "../../../Utils";

const CampaignDialog = ({ open, onClose, info = undefined }) => {
  const [name, setName] = useState(info?.name ?? "");
  const [brief, setBrief] = useState(info?.brief ?? "");
  const [campaignSum, setCampaignSum] = useState(info?.campaign_sum ?? "");
  const [proposalDate, setProposalDate] = useState(info?.proposal_date ?? "");
  const [productType, setProductType] = useState(info?.campaign_type ?? "");
  const [status, setStatus] = useState(info?.campaign_status ?? "");
  const [videoAmount, setVideoAmount] = useState(info?.video_amount ?? "");
  const [poNumber, setPONumber] = useState(info?.po_number ?? "");
  const [blitzAuto, setBlitzAuto] = useState(info?.blitz_autocampaign ?? false);
  const [creatorsJson, setCreatorsJson] = useState("");

  useEffect(() => {
    if (info && info.creators) {
      // Assuming info.creators is an array of objects, convert it to a string for editing
      setCreatorsJson(
        isJSONObject(info.creators)
          ? JSON.stringify(info.creators, null, 2)
          : info.creators
      ); // Pretty print JSON
    }
  }, [info]);

  const { mutate: editCampaign } = useMutation(client.campaigns.editAdmin, {
    onSuccess: (data) => {
      onClose(true);
    },
    onError: (error) => {
      console.error("Error updating campaign:", error);
    },
  });

  const handleSubmit = () => {
    if (!isJSONString(creatorsJson)) {
      alert("Invalid creators string! It should be valid JSON string.");

      return;
    }

    const submissionData = {
      id: info.id, // Ensure you're passing the campaign ID to know which campaign to update
      name,
      brief,
      campaign_sum: campaignSum,
      proposal_date: proposalDate,
      product_type: productType,
      status,
      creators: creatorsJson, // Assuming creatorsJson contains a JSON string of creators data
      video_amount: videoAmount,
      po_number: poNumber,
      blitz_auto: blitzAuto,
    };

    if (info) {
      editCampaign(submissionData);
    } else {
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="campaign-dialog-title"
    >
      <DialogTitle id="campaign-dialog-title">
        {info ? "Edit Campaign" : "Create Campaign"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Campaign Name"
          fullWidth
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Brief"
          fullWidth
          margin="dense"
          multiline
          rows={4}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          required
        />
        <TextField
          label="Campaign Sum"
          type="number"
          fullWidth
          margin="dense"
          value={campaignSum}
          onChange={(e) => setCampaignSum(e.target.value)}
          required
        />
        <TextField
          label="Proposal Date"
          type="date"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={proposalDate}
          onChange={(e) => setProposalDate(e.target.value)}
          required
        />
        <TextField
          label="Product Type"
          fullWidth
          margin="dense"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          required
        />
        <TextField
          label="Status"
          fullWidth
          margin="dense"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
        {/* If creators is expected to be an array or list, ensure you have logic to handle its display and modification */}
        <TextField
          label="Creators (JSON)"
          fullWidth
          margin="dense"
          multiline
          rows={4}
          value={creatorsJson}
          onChange={(e) => setCreatorsJson(e.target.value)}
          helperText="Edit the creators JSON directly"
        />
        <TextField
          label="Video Amount"
          type="number"
          fullWidth
          margin="dense"
          value={videoAmount}
          onChange={(e) => setVideoAmount(e.target.value)}
          required
        />
        <TextField
          label="PO Number"
          fullWidth
          margin="dense"
          value={poNumber}
          onChange={(e) => setPONumber(e.target.value)}
        />
        <TextField
          label="Blitz Auto Campaign"
          fullWidth
          margin="dense"
          select
          value={blitzAuto}
          onChange={(e) => setBlitzAuto(e.target.value === "true")}
          required
        >
          <MenuItem value="true">Yes</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CampaignDialog;
