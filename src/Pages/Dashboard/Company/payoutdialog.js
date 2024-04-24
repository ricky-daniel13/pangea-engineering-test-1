import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
} from "@mui/material";
import client from "../../../API"; // Adjust the path to your API client
import { useMutation } from "react-query";

const PayoutsDialog = ({ open, onClose, payoutInfo = undefined }) => {
  const [poNumber, setPONumber] = useState(payoutInfo?.po_number ?? "");
  const [amount, setAmount] = useState(payoutInfo?.amount ?? ""); // Changed to 'amount' as per backend serialization
  const [status, setStatus] = useState(payoutInfo?.status ?? "");
  const [creatorName, setCreatorName] = useState(payoutInfo?.creatorName ?? "");
  const [payoutDate, setPayoutDate] = useState(payoutInfo?.payout_date ?? "");
  const [creatorPayoutEmail, setCreatorPayoutEmail] = useState(
    payoutInfo?.creatorPayoutEmail ?? "",
  );
  const [blitzPay, setBlitzPay] = useState(payoutInfo?.blitzPay ?? false);

  useEffect(() => {
    if (payoutInfo) {
      setPONumber(payoutInfo.po_number);
      setAmount(payoutInfo.amount);
      setStatus(payoutInfo.status);
      setCreatorName(payoutInfo.creatorName);
      setPayoutDate(payoutInfo.payout_date);
      setCreatorPayoutEmail(payoutInfo.creatorPayoutEmail);
      setBlitzPay(payoutInfo.blitzPay);
    }
  }, [payoutInfo]);
  const handleSubmit = async () => {
    const submissionData = {
      id: payoutInfo?.id,
      po_number: poNumber,
      amount: amount,
      status: status,
      creatorName: creatorName,
      payoutDate: payoutDate, // Verify this is not null
      creatorPayoutEmail: creatorPayoutEmail,
      blitzPay: blitzPay,
    };

    console.log("Submitting data:", submissionData); // Check what's being sent

    try {
      const response = await fetch(
        `https://blitz-backend-nine.vercel.app/api/admin/payouts/edit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Edit successful", data);
        onClose(true);
      } else {
        throw new Error("Failed to edit payout");
      }
    } catch (error) {
      console.error("Error editing payout", error);
    }
  };

  const handleDateChange = (event) => {
    const dateValue = event.target.value
      ? event.target.value
      : new Date().toISOString().split("T")[0]; // Default to today's date if empty
    setPayoutDate(dateValue);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{"Edit Payout"}</DialogTitle>
      <DialogContent>
        {/* Existing fields */}
        <TextField
          label="PO Number"
          fullWidth
          margin="dense"
          value={poNumber}
          onChange={(e) => setPONumber(e.target.value)}
          required
        />
        <TextField
          label="Creator Name"
          fullWidth
          margin="dense"
          value={creatorName}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Amount Due"
          type="number"
          fullWidth
          margin="dense"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <TextField
          label="Payout Date"
          type="date"
          fullWidth
          margin="dense"
          value={payoutDate}
          onChange={(e) => setPayoutDate(e.target.value)}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Creator Payout Email"
          fullWidth
          margin="dense"
          value={creatorPayoutEmail}
          onChange={(e) => setCreatorPayoutEmail(e.target.value)}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="blitzPay-label">BlitzPay</InputLabel>
          <Select
            labelId="blitzPay-label"
            id="blitzPay-select"
            value={blitzPay}
            label="BlitzPay"
            onChange={(e) => setBlitzPay(e.target.value === "true")}
            required
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>{" "}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayoutsDialog;
