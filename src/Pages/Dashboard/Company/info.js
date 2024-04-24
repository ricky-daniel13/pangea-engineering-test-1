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
import { useMutation } from "react-query";
import client from "../../../API"; // Adjust the path to your API client
import { isCompanyBalanceValid, isValidCompanySeats } from "../../../Utils";

const CompanyDialog = ({ open, onClose, info = undefined }) => {
  const [balance, setBalance] = useState(info?.balance ?? "");
  const [accountStatus, setAccountStatus] = useState(
    info?.account_status ?? "Free"
  );
  const [companyName, setCompanyName] = useState(info?.name ?? "");
  const [creditLine, setCreditLine] = useState(info?.credit_line ?? "");
  const [seats, setSeats] = useState(info?.seats?.join(",") ?? "");

  // Define the options for account status
  const accountStatusOptions = [
    "AlphaFree",
    "Free",
    "Silver",
    "Gold",
    "Platinum",
  ];

  const { mutate: editCompany } = useMutation(client.companies.edit, {
    onSuccess: async (data) => {
      onClose(true);
    },
    onError: (error) => {
      console.error("Error fetching invoices:", error);
    },
  });
  const { mutate: createCompany } = useMutation(client.companies.create, {
    onSuccess: async (data) => {
      onClose(true);
    },
    onError: (error) => {
      console.error("Error fetching invoices:", error);
    },
  });

  const handleSubmit = () => {
    if (!balance || !accountStatus || !seats) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!isCompanyBalanceValid(balance)) {
      alert("Please input valid balance! (Max Length is 8 digits)");
      return;
    }

    if (!isValidCompanySeats(seats)) {
      alert("Please input valid seats! (Format: 1,2,3)");
      return;
    }

    if (accountStatus.length == 0) {
      alert("Please input valid account status!");
      return;
    }

    // Structure the form data according to backend expectations
    const submissionData = {
      balance: parseFloat(balance),
      seats: seats.split(","),
      account_status: accountStatus,
      company_name: companyName,
      credit_line: accountStatus !== "Free" ? parseFloat(creditLine) : null,
    };

    if (info) {
      editCompany({ companyId: info.id, params: submissionData });
    } else {
      createCompany(submissionData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {info ? "Edit Company" : "Create Company"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Company Name"
          fullWidth
          margin="dense"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <TextField
          label="Balance"
          type="number"
          fullWidth
          placeholder="12345678.12"
          sx={{ marginTop: "12px" }}
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          variant="outlined"
          required
        />
        <TextField
          label="Seats"
          sx={{ marginTop: "12px" }}
          fullWidth
          placeholder="1,2,3,4"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          variant="outlined"
          required
        />
        <TextField
          select
          label="Account Status"
          fullWidth
          margin="dense"
          value={accountStatus}
          onChange={(e) => setAccountStatus(e.target.value)}
          required
        >
          {accountStatusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        {accountStatus !== "Free" && (
          <TextField
            label="Credit Line"
            type="number"
            fullWidth
            margin="dense"
            value={creditLine}
            onChange={(e) => setCreditLine(e.target.value)}
            required
          />
        )}
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

export default CompanyDialog;
