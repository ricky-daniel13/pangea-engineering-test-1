import React, { useState, useEffect } from "react";
import { Button, Checkbox, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
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
import Paper from "@mui/material/Paper";
import PayoutDialog from "../payoutdialog";
import { drawerWidth } from "../../../../Utils/constants";
import { useIsMounted } from "../../../../Hooks/use-is-mounted";

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
    flexDirection: "column",
    flexGrow: 1,
    paddingLeft: "16rem",
    width: `calc(100% - 16rem)`,
    overflowY: "auto",
  },
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    width: "100%",
  },
  buttonContainer: {
    padding: theme.spacing(2),
    display: "flex",
    gap: theme.spacing(2),
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

const PayoutDetailsView = () => {
  const classes = useStyles();
  const isMounted = useIsMounted();
  const [payouts, setPayouts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isPayoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [editingPayout, setEditingPayout] = useState(null);

  const { mutate: fetchPayouts } = useMutation(client.payouts.listAdmin, {
    onSuccess: (data) => {
      setPayouts(data.payouts);
      setSelectedIds([]);
    },
    onError: (error) => {
      console.error("Error fetching payouts:", error);
    },
  });

  useEffect(() => {
    isMounted && fetchPayouts();
  }, [isMounted]);

  const onDeletePayouts = async () => {
    if (selectedIds.length > 0) {
      try {
        const response = await fetch(`https://blitz-backend-nine.vercel.app/api/payouts/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payoutIds: selectedIds }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Deletion successful", data);
          fetchPayouts();
          setSelectedIds([]);
        } else {
          const errorResponse = await response.text();
          console.error("Deletion failed", errorResponse);
        }
      } catch (error) {
        console.error("Error deleting payouts", error);
      }
    }
  };
  const handleDialogOpen = (payout) => {
    setEditingPayout(payout);
    setPayoutDialogOpen(true);
  };

  const handleDialogClose = () => {
    setPayoutDialogOpen(false);
    setEditingPayout(null);
  };
  const handleSelectPayout = (payoutId) => {
    const newSelectedIds = selectedIds.includes(payoutId)
      ? selectedIds.filter(id => id !== payoutId)
      : [...selectedIds, payoutId];
    setSelectedIds(newSelectedIds);
  };

  return (
    <div className={classes.content}>
      <Button
          variant="contained"
          color="secondary"
          onClick={onDeletePayouts}
          startIcon={<DeleteIcon />}
          disabled={!selectedIds.length}
        >
          Delete Selected
        </Button>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < payouts.length}
                  checked={selectedIds.length === payouts.length && payouts.length > 0}
                  onChange={(event) => setSelectedIds(
                    event.target.checked ? payouts.map((n) => n.id) : []
                  )}
                />
              </TableCell>
              <TableCell>Payout ID</TableCell>
              <TableCell>PO Number</TableCell>
              <TableCell>Creator Name</TableCell>
              <TableCell>Creator Payout Destination</TableCell>
              <TableCell>Payout Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>BlitzPay</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payouts.map((payout) => (
              <StyledTableRow key={payout.id}>
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    onChange={() => handleSelectPayout(payout.id)}
                    checked={selectedIds.includes(payout.id)}
                  />
                </StyledTableCell>
                <StyledTableCell>{payout.id}</StyledTableCell>
                <StyledTableCell>{payout.po_number}</StyledTableCell>
                <StyledTableCell>{payout.creatorName}</StyledTableCell>
                <StyledTableCell>{payout.creatorPayoutEmail}</StyledTableCell>
                <StyledTableCell>{payout.payout_date}</StyledTableCell>
                <StyledTableCell>{payout.status}</StyledTableCell>
                <StyledTableCell>{payout.blitzPay ? "Yes" : "No"}</StyledTableCell>
                <StyledTableCell>${payout.amount}</StyledTableCell>
                <StyledTableCell>
                  <IconButton onClick={() => handleDialogOpen(payout)}>
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isPayoutDialogOpen && (
        <PayoutDialog
          open={isPayoutDialogOpen}
          onClose={handleDialogClose}
          payoutInfo={editingPayout}
        />
      )}
    </div>
  );
};

export default PayoutDetailsView;