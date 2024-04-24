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
} from "@mui/material";
import client from "../../../API"; // Adjust the path to your API client
import { useMutation } from "react-query";

const InvoiceDialog = ({ open, onClose, invoiceInfo = undefined }) => {
  const [poNumber, setPONumber] = useState(invoiceInfo?.po_number ?? "");
  const [amountDue, setAmountDue] = useState(invoiceInfo?.amount_due ?? "");
  const [status, setStatus] = useState(invoiceInfo?.status ?? "");
  const [campaignName, setCampaignName] = useState(
    invoiceInfo?.campaign_name ?? ""
  );
  const [createdAt, setCreatedAt] = useState(invoiceInfo?.created_at ?? "");

  useEffect(() => {
    if (invoiceInfo) {
      setPONumber(invoiceInfo.po_number ?? "");
      setAmountDue(invoiceInfo.amount_due ?? "");
      setStatus(invoiceInfo.status ?? "");
      setCampaignName(invoiceInfo.campaign_name ?? "");
      setCreatedAt(invoiceInfo.created_at ?? "");
    }
  }, [invoiceInfo]);

  const { mutate: editInvoice } = useMutation(client.invoices.editAdmin, {
    onSuccess: (data) => {
      onClose(true);
    },
    onError: (error) => {
      console.error("Error submitting invoice:", error);
    },
  });

  const handleSubmit = async () => {
    const submissionData = {
      id: invoiceInfo?.id,
      po_number: poNumber,
      amount_due: amountDue,
      status: status,
    };

    editInvoice(submissionData);
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="invoice-dialog-title"
    >
      <DialogTitle id="invoice-dialog-title">{"Edit Invoice"}</DialogTitle>
      <DialogContent>
        <TextField
          label="PO Number"
          fullWidth
          margin="dense"
          value={poNumber}
          onChange={(e) => setPONumber(e.target.value)}
          required
        />
        <TextField
          label="Amount Due"
          type="number"
          fullWidth
          margin="dense"
          value={amountDue}
          onChange={(e) => setAmountDue(e.target.value)}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <MenuItem value={"Paid"}>Paid</MenuItem>
            <MenuItem value={"Pending"}>Pending</MenuItem>
            <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
          </Select>
        </FormControl>
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

export default InvoiceDialog;
