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
  Box
} from "@mui/material";
import client from "../../../API"; // Adjust the path to your API client
import { useMutation } from "react-query";

const InvoiceDialog = ({ open, onClose, invoiceInfo = undefined }) => {
  const [poNumber, setPONumber] = useState(invoiceInfo?.po_number ?? "");
  const [amountDue, setAmountDue] = useState(invoiceInfo?.amount_due ?? "");
  const [email, setEmail] = useState(""); // State to hold email input

  useEffect(() => {
    if (invoiceInfo) {
      setPONumber(invoiceInfo.po_number ?? "");
      setAmountDue(invoiceInfo.amount_due ?? "");
    }
  }, [invoiceInfo]);


  const handleSubmit = async () => {
    const submissionData = {
      po_number: poNumber,
      amount_due: amountDue,
      email: email,  // Include the email in the submission data
    };

    try {
      const response = await client.invoices.create(submissionData);
      const data = await response.json();
      if (response.ok) {
        onClose(true);
        alert('Invoice created and shared successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error submitting invoice:', error);
      //alert('Failed to create and share invoice: ' + error.message);
      onClose(true);

    }
  };
  
  const handleGeneratePO = () => {
    setPONumber(`PO-${Math.floor(Math.random() * 1000000)}`);
  };
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="invoice-dialog-title"
    >
<DialogTitle id="invoice-dialog-title">{invoiceInfo ? "Edit Invoice" : "Create Invoice"}</DialogTitle>
      <DialogContent>
      <Box display="flex" flexDirection={"row"} alignItems="center" gap={2}>
          <TextField
            margin="dense"
            label="PO #"
            fullWidth
            value={poNumber}
            onChange={(e) => setPONumber(e.target.value)}
            variant="outlined"
            required
          />
          <Button variant="outlined" onClick={handleGeneratePO}>
            Generate PO
          </Button>
        </Box>
        <TextField
          label="Amount Due"
          type="number"
          fullWidth
          margin="dense"
          value={amountDue}
          onChange={(e) => setAmountDue(e.target.value)}
          required
        />
         <TextField
          label="Share this Invoice (Email)"
          type="email"
          fullWidth
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email to share the invoice"
        />
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
