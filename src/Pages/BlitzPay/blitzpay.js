import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/NavBar";
import "./blitzpay.css";
import PayCreatorDialog from "./payCreator"; // Assuming PayCreatorDialog is in the same directory
import {
  Snackbar,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useMutation } from "react-query";
import client from "../../API";
import CreatorDialog from "../Dashboard/Search/creatorintake";
const BlitzPay = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [filterStatus, setFilterStatus] = useState(""); // Added for filtering
  const [isPayCreatorDialogOpen, setIsPayCreatorDialogOpen] = useState(false);
  const [payouts, setPayouts] = useState([]);
  const [filteredPayouts, setFilteredPayouts] = useState([]); // Added to store filtered payouts
  const [selectedPayouts, setSelectedPayouts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isCreatorDialogOpen, setIsCreatorDialogOpen] = useState(false);

  const { mutate: fetchPayouts } = useMutation(client.payouts.list, {
    onSuccess: (data) => {
      // Ensure that data is an array before setting the state
      if (Array.isArray(data.payouts)) {
        setPayouts(data.payouts);
      } else {
        console.error("Expected an array for payouts, received:", data);
        setPayouts([]); // Default to an empty array if the received data is not an array
      }
      console.log(data);
    },
    onError: (error) => {
      console.error("Error fetching payouts:", error);
      let errorMessage = "An error occurred, please try again.";
      if (error.code === "ERR_NETWORK") {
        errorMessage = "Network is disconnected!";
      } else if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    },
  });
  
  useEffect(() => {
    fetchPayouts();
  }, []);
  
  useEffect(() => {
    // Use Array.isArray to ensure payouts is an array before filtering
    if (Array.isArray(payouts)) {
      setFilteredPayouts(
        payouts.filter(
          (payout) => filterStatus === "" || payout.status === filterStatus
        )
      );
    }
  }, [payouts, filterStatus]);
  

  useEffect(() => {
    // Filter payouts whenever the payouts list or filterStatus changes
    setFilteredPayouts(
      payouts.filter(
        (payout) => filterStatus === "" || payout.status === filterStatus
      )
    );
  }, [payouts, filterStatus]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "pay") setIsPayCreatorDialogOpen(true);
  };

  const handleDialogClose = () => setIsPayCreatorDialogOpen(false);

  const { mutate: createPayout } = useMutation(client.payouts.create, {
    onSuccess: (data) => {
      console.log("creating payout - ", data);
      handleDialogClose();
      fetchPayouts(); // Refresh data after creating a payout
    },
    onError: (error) => {
      console.error("Error creating payout:", error);
      let errorMessage = "An error occurred, please try again.";
      if (error.code == "ERR_NETWORK") {
        errorMessage = "Network is disconnected!";
      } else {
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
        }
        alert(errorMessage);
      }
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    },
  });
  const handleCreatorSubmit = (formData) => {
    console.log(formData); // For now, just log the form data. You can replace this with your actual submission logic.
    setIsCreatorDialogOpen(false);
  };
  const handleDialogSubmit = (submissionData) => {
    console.log("SDSd - ", submissionData);
    createPayout(submissionData);
  };

  const handleCheckboxChange = (event, payoutId) => {
    const isSelected = event.target.checked;
    // Directly set the selectedPayouts to the current payoutId if it is selected
    // Or reset to an empty array if it is deselected
    setSelectedPayouts(isSelected ? [payoutId] : []);
  };
  

  const { mutate: deletePayout } = useMutation(data => client.payouts.delete(data), {
    onSuccess: (data) => {
      console.log("deleting payout - ", data);
      setSnackbarMessage("Selected payouts have been successfully deleted.");
      setSnackbarOpen(true);
      fetchPayouts(); // Refresh data after deleting payouts
    },
    onError: (error) => {
      console.error("Error deleting payout:", error);
      let errorMessage = "An error occurred, please try again.";
      if (error.code == "ERR_NETWORK") {
        errorMessage = "Network is disconnected!";
      } else {
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    },
  });

  const handleDeleteSelected = () => {
    deletePayout({
      payoutIds: selectedPayouts
    });
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Calculators
 // Calculators
const creatorsPaid = payouts.length;
const amountInEscrow = Array.isArray(payouts) ? payouts.reduce((acc, curr) => {
  if (["Pending", "queued"].includes(curr.status)) {
    // Assuming curr.amount is a string that might include commas,
    // convert it to a number for calculation.
    const sanitizedAmount = Number(curr.amount.toString().replace(/[$,]/g, ""));
    return acc + sanitizedAmount;
  } else {
    return acc;
  }
}, 0) : 0;  // If payouts is not an array, default to 0

const blitzPaysUsed = Array.isArray(payouts) ? payouts.filter(payout => payout.blitzpay).length : 0;

  return (
    <div className="dashboard">
      <Navbar />
      <div className="content-flex-row">
        <div className="left-column">
          <h1 className="header">Blitz Pay</h1>
          <div className="button-container" style={{ marginBottom: "10px" }}>
            <FormControl style={{ minWidth: 240 }}>
              <InputLabel id="status-filter-label">Status Filter</InputLabel>
              <Select
                labelId="status-filter-label"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Sent">Sent</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
              </Select>
            </FormControl>
            <button className="btn" onClick={() => handleTabClick("pay")}>
              Pay a Creator
            </button>
            <button className="btn" onClick={handleDeleteSelected}>
              Delete Selected
            </button>{" "}
            <button
              className="btn" onClick={() => setIsCreatorDialogOpen(true)}
            >
              Add Creators
            </button>         
             </div>
             <CreatorDialog
            open={isCreatorDialogOpen}
            onClose={() => setIsCreatorDialogOpen(false)}
            onSubmit={handleCreatorSubmit}
          />
          <div className="table-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Check</th>{" "}
                  {/* Updated to have a checkbox column header */}
                  <th>Creator Name</th>
                  <th>Campaign Name</th>
                  <th>Payout Date</th>
                  <th>Payment Status</th>
                  <th>BlitzPay</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
  {filteredPayouts.map((payout) => (
    <tr key={payout.payout_id || 'N/A'}>
      <td>
        <Checkbox
          checked={selectedPayouts.includes(payout.payout_id)}
          onChange={(event) => handleCheckboxChange(event, payout.payout_id)}
          color="primary"
        />
      </td>
                    <td>{payout.creator_id}</td>
                    <td>{payout.campaignname || "Creator Payout"}</td>
                    <td>{payout.payout_date}</td>
                    <td>{payout.status}</td>
                    <td>{payout.blitzpay ? "true" : "false"}</td>
                    <td>${payout.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="right-column">
          <h2>Summary</h2>
          <p>Creators Paid: {creatorsPaid}</p>
          <p>Amount in Escrow: ${amountInEscrow}</p>
          <p>BlitzPays Used: {blitzPaysUsed}</p>
        </div>
      </div>
      {isPayCreatorDialogOpen && (
        <PayCreatorDialog
          open={isPayCreatorDialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
        />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      />
    </div>
  );
};

export default BlitzPay;
