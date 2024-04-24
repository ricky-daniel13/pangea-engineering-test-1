// BankInfoForm.js
import React from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const addFinance = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Bank Information</DialogTitle>
      <DialogContent>
        <TextField label="Bank Name" fullWidth />
        <TextField label="Account Number" fullWidth />
        {/* ... other fields as necessary ... */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onClose} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default addFinance;
