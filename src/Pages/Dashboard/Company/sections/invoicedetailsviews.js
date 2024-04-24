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
import InvoiceDialog from "../invoicedialog";
import { drawerWidth } from "../../../../Utils/constants";
import { useIsMounted } from "../../../../Hooks/use-is-mounted";
import { ConfigValue } from "../../../../Config";

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

const InvoiceDetailsView = () => {
  const classes = useStyles();
  const isMounted = useIsMounted();
  const [invoices, setInvoices] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isInvoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const { mutate: fetchInvoices } = useMutation(client.invoices.listAdmin, {
    onSuccess: (data) => {
      // Assuming data.invoices is the array based on the console.log structure
      setInvoices(data.invoices);
      setSelectedIds([]);
    },
    onError: (error) => {
      console.error("Error fetching invoices:", error);
    },
  });

  useEffect(() => {
    isMounted && fetchInvoices();
  }, [isMounted]);

  const deleteInvoiceMutation = useMutation((invoiceIds) =>
  client.invoices.delete({ invoiceIds })
);


const onDeleteInvoices = async () => {
  if (selectedIds.length > 0) {
    console.log("Full API Endpoint:", `/invoices/delete`); // Verify full endpoint
    try {
      const response = await fetch(`https://blitz-backend-nine.vercel.app/api/invoices/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceIds: selectedIds }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Deletion successful", data);
        fetchInvoices();
        setSelectedIds([]);
      } else {
        const errorResponse = await response.text(); // Get raw response if not JSON
        console.error("Deletion failed", errorResponse);
      }
    } catch (error) {
      console.error("Error deleting invoices", error);
    }
  }
};


  const handleDialogOpen = (invoice = null) => {
    setEditingInvoice(invoice); // If editing an existing invoice, set it as the editingInvoice
    setInvoiceDialogOpen(true);
  };

  const handleDialogClose = (refresh = false) => {
    setInvoiceDialogOpen(false);
    setEditingInvoice(null); // Reset editing invoice
    if (refresh) fetchInvoices();
  };

  const handleSelectInvoice = (event, invoiceId) => {
    const selectedIndex = selectedIds.indexOf(invoiceId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, invoiceId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }
    setSelectedIds(newSelected);
  };

  return (
    <div className={classes.content}>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="secondary"
          onClick={onDeleteInvoices}
          disabled={selectedIds.length === 0}
          startIcon={<DeleteIcon />}
        >
          Delete Selected
        </Button>
      </div>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedIds.length > 0 &&
                    selectedIds.length < invoices.length
                  }
                  checked={
                    invoices.length > 0 &&
                    selectedIds.length === invoices.length
                  }
                  onChange={(event) =>
                    setSelectedIds(
                      event.target.checked ? invoices.map((n) => n.id) : []
                    )
                  }
                />
              </TableCell>
              {/* Assuming these are the fields in your invoice data */}
              <TableCell className={classes.tableHeader}>ID</TableCell>
              <TableCell className={classes.tableHeader}>
                Payment Name
              </TableCell>

              <TableCell className={classes.tableHeader}>PO_Number</TableCell>
              <TableCell className={classes.tableHeader}>Amount</TableCell>
              <TableCell className={classes.tableHeader}>Date Issued</TableCell>
              <TableCell className={classes.tableHeader}>Status</TableCell>
              <TableCell className={classes.tableHeader}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(invoices) ? (
              invoices.map((invoice) => {
                const isItemSelected = selectedIds.indexOf(invoice.id) !== -1;
                return (
                  <StyledTableRow key={invoice.id} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) =>
                          handleSelectInvoice(event, invoice.id)
                        }
                      />
                    </TableCell>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.campaign_name}</TableCell>

                    <TableCell>{invoice.po_number}</TableCell>
                    <TableCell>{invoice.amount_due}</TableCell>
                    <TableCell>{invoice.created_at}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDialogOpen(invoice)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <TableCell colSpan={7} style={{ textAlign: "center" }}>
                  No invoices available
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {isInvoiceDialogOpen && (
        <InvoiceDialog
          open={isInvoiceDialogOpen}
          onClose={handleDialogClose}
          invoiceInfo={editingInvoice} // Change 'invoice' to 'invoiceInfo'
        />
      )}
    </div>
  );
};

export default InvoiceDetailsView;