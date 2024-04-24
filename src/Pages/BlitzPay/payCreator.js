import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Box,
} from "@mui/material";
import "./blitzpay.css";
import { useMutation } from "react-query";
import client from "../../API";
import { useIsMounted } from "../../Hooks/use-is-mounted";

const PayCreatorDialog = ({ open, onClose, onSubmit }) => {
  const isMounted = useIsMounted();

  const [paymentAmount, setPaymentAmount] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [creators, setCreators] = useState([]);
  const [blitzPay] = useState([]);
  const [bypassSMSVerification, setBypassSMSVerification] = useState(false);

  const { mutate: fetchCreatorsData } = useMutation(client.creators.list, {
    onSuccess: (data) => {
      const formattedData = data.map((creator) => ({
        ...creator,
        label: creator.creator, // Assuming 'creator' field is the name of the creator
      }));
      setCreators(formattedData);
    },
    onError: (error) => {
      console.error("Error fetching creators:", error);
    },
  });

  useEffect(() => {
    if (!isMounted) return;

    fetchCreatorsData();
  }, [isMounted]);

  const handleGeneratePO = () => {
    setPoNumber(`PO-${Math.floor(Math.random() * 1000000)}`);
  };

  const handleSubmit = () => {
    if (!selectedCreator || !paymentAmount || !poNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    // Structure the form data according to backend expectations
    const submissionData = {
      creator_id: selectedCreator.creator, // Assuming id is the correct identifier
      amount: parseFloat(paymentAmount), // Ensure amount is a float
      po_number: poNumber,
      blitzPay: false,
      bypassSMSVerification, // Include bypass flag in submission data
    };

    // onSubmit should be a prop passed from parent component
    onSubmit(submissionData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Pay a Creator</DialogTitle>
      <DialogContent>
        <Autocomplete
          sx={{ marginTop: 2 }}
          options={creators}
          getOptionLabel={(option) => option.label || ""} // Use the label property
          value={selectedCreator}
          onChange={(event, newValue) => {
            setSelectedCreator(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select a Creator"
              variant="outlined"
              required
            />
          )}
        />

        <TextField
          margin="dense"
          label="Payment Amount"
          type="number"
          fullWidth
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          variant="outlined"
          required
        />

        <Box display="flex" flexDirection={"row"} alignItems="center" gap={2}>
          <TextField
            margin="dense"
            label="PO #"
            fullWidth
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
            variant="outlined"
            required
          />
          <Button variant="outlined" onClick={handleGeneratePO}>
            Generate PO
          </Button>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={bypassSMSVerification}
              onChange={(e) => setBypassSMSVerification(e.target.checked)}
              color="primary"
            />
          }
          label="Bypass SMS Verification"
        />
        <TextField
          margin="dense"
          label="Notes"
          fullWidth
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayCreatorDialog;
