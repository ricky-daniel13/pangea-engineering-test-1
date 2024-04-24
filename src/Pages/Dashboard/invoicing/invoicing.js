import React, { useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar/NavBar";
import "./dedInvoicing.css";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@material-ui/core";
import { StyledTableRow, StyledTableCell } from "../../../Utils/styledcell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import Paper from "@mui/material/Paper";
import { useMutation, useQuery } from "react-query";
import client from "../../../API";
import { useIsMounted } from "../../../Hooks/use-is-mounted";
import InvoiceDialog from "./invoicedialog"; // Adjust path as needed
import EditIcon from "@material-ui/icons/Edit";
import InvoiceEdit from "./editInvoice"; // Assuming the component is named InvoiceEdit inside editInvoice.js
const Invoicing = () => {
  const isMounted = useIsMounted();

  const [statusFilter, setStatusFilter] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [campaignNames, setCampaignNames] = useState({});
  const [accountBalance, setAccountBalance] = useState("Loading...");
  const [creditline, setCreditline] = useState("Loading...");
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchInvoices();
  };
  // Add to the Invoicing component's functional body

  const [editOpen, setEditOpen] = useState(false);  // This will control the visibility of the invoiceEdit dialog
  const [currentInvoice, setCurrentInvoice] = useState(null);  // This will hold the currently selected invoice for editing
  
  const handleEditDialogOpen = (invoice) => {
    setCurrentInvoice(invoice); // Correctly sets the current invoice for editing
    setEditOpen(true); // Opens the dialog
  };
  
  const handleEditDialogClose = (refresh = false) => {
    setEditOpen(false); // Closes the dialog
    setCurrentInvoice(null); // Clears the current editing context
    if (refresh) {
      fetchInvoices(); // Optionally refreshes the invoices if needed
    }
  };
  
  // Fetch company balance and credit line when component mounts
  // Assuming useQuery to fetch current user's company data
  const { mutate: fetchCompanyData } = useMutation(client.companies.listFetch, {
    onSuccess: (data) => {
      // Assuming the response structure is directly the data needed
      if (data && data.balance != undefined && data.credit_line != undefined) {
        setAccountBalance(`$${parseFloat(data.balance).toFixed(2)}`);
        setCreditline(
          data.credit_line
            ? `$${parseFloat(data.credit_line).toFixed(2)}`
            : "No Credit Line Established",
        );
      } else {
        // Handle case where data is undefined or not as expected
        console.error("Received data is not in the expected format:", data);
        setAccountBalance("Data format error");
        setCreditline("Data format error");
      }
    },
    onError: (error) => {
      console.error("Error fetching company data:", error);
      setAccountBalance("Error loading balance");
      setCreditline("Error loading credit line");
    },
  });

  useEffect(() => {
    if (!isMounted) return;

    fetchCompanyData();
    fetchInvoices();
    fetchCampaigns();
  }, [isMounted]);

  const { mutate: fetchInvoices } = useMutation(client.invoices.list, {
    onSuccess: async (data) => {
      setInvoices(data.invoices); // Adjust based on actual API response
    },
    onError: (error) => {
      console.error("Error fetching invoices:", error);
    },
  });

  const { mutate: fetchCampaigns } = useMutation(client.campaigns.list, {
    onSuccess: (data) => {
      const campaignNamesMap = {};
      data.forEach((campaign) => {
        if (campaign) {
          // Ensure the campaign isn't null from a failed fetch
          campaignNamesMap[campaign.id] = campaign.name;
        }
      });
      setCampaignNames(campaignNamesMap);
    },
    onError: (error) => {
      console.error("Error fetching campaigns:", error);
    },
  });

  useEffect(() => {
    // Filter invoices whenever the invoices list or statusFilter changes
    setFilteredInvoices(
      invoices.filter(
        (invoice) => statusFilter === "" || invoice.status === statusFilter,
      ),
    );
  }, [invoices, statusFilter]);

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const formatAmount = (amount) => {
    // First, ensure amount is a number and format it to two decimal places with toFixed
    const formattedAmount = parseFloat(amount).toFixed(2);
    // Then, add commas where appropriate for thousands, millions, etc.
    return `$${formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };
  // Calculations for the summary
  const totalInvoices = invoices.length;
  const totalAmountDue = invoices.reduce(
    (acc, invoice) => acc + parseFloat(invoice.amount_due),
    0,
  );
  const invoicesByStatus = invoices.reduce((acc, invoice) => {
    acc[invoice.status] = (acc[invoice.status] || 0) + 1;
    return acc;
  }, {});

  const getChartData = () => {
    // Assuming invoices have a 'created_at' field and an 'amount_due' field
    const sortedInvoices = [...invoices].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );
    const chartData = sortedInvoices.reduce((acc, invoice) => {
      const date = new Date(invoice.created_at).toLocaleDateString();
      const existing = acc.find((item) => item.date === date);
      if (existing) {
        existing.cost += parseFloat(invoice.amount_due);
      } else {
        acc.push({ date, cost: parseFloat(invoice.amount_due) });
      }
      return acc;
    }, []);
    return chartData;
  };

  const renderCampaignCostsLineChart = () => {
    const chartData = getChartData();

    return (
      <>
        <Typography variant="h6" style={{ margin: "20px 0" }}>
          Invoice Amounts Over Time
        </Typography>
        <LineChart width={500} height={300} data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="cost" stroke="#8884d8" />
        </LineChart>
      </>
    );
  };

  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectInvoice = (event, id) => {
    setSelectedIds((prev) => {
      const selectedIndex = prev.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(prev, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(prev.slice(1));
      } else if (selectedIndex === prev.length - 1) {
        newSelected = newSelected.concat(prev.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          prev.slice(0, selectedIndex),
          prev.slice(selectedIndex + 1),
        );
      }

      return newSelected;
    });
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="invoice-container">
        <div className="left-column">
          <h1 className="header">Invoicing</h1>
          <div className="button-container" style={{ marginBottom: "10px" }}>
            {/* Added "Create Payment" button */}
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Create Invoice
            </Button>
            <InvoiceDialog
              open={open}
              onClose={handleClose}
              invoiceInfo={undefined}
            />

            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Select Filter</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="">All</MenuItem>

                <MenuItem value="Sent">Sent</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
                <MenuItem value="Advance">Advance</MenuItem>
              </Select>
            </FormControl>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">
                    Campaign Name
                  </StyledTableCell>
                  <StyledTableCell align="center">PO Number</StyledTableCell>
                  <StyledTableCell align="center">Amount Due</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Created At</StyledTableCell>
                  <StyledTableCell align="center">Edit</StyledTableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <StyledTableRow key={invoice.id}>
                    <StyledTableCell align="center">
                      {campaignNames[invoice.campaign_id] || "Creator Payout"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {invoice.po_number || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {formatAmount(invoice.amount_due)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {invoice.status}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">
      {invoice.status !== "Paid" && (
        <Button
          onClick={() => handleEditDialogOpen(invoice)}
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
      )}
    </StyledTableCell>
  </StyledTableRow>
))}
              </TableBody>
            </Table>
          </TableContainer>
          {currentInvoice && (
  <InvoiceEdit
    open={editOpen}
    onClose={handleEditDialogClose}
    invoiceInfo={currentInvoice}
  />
)}
        </div>
        <div className="right-column">
          {/* Account Balance section */}
          <h2>Account Balance</h2>
          <p>{accountBalance}</p>
          <h2>Line of Credit</h2>
          <p>{creditline}</p>
          {/* Summary section */}
          <h2>Summary</h2>
          <p>Total Invoices: {totalInvoices}</p>
          {Object.entries(invoicesByStatus).map(([status, count]) => (
            <p key={status}>
              {status}: {count}
            </p>
          ))}

          {/* Payment History placeholder */}
          <h2>Payment History</h2>
          {/* Render the chart in the right column or wherever appropriate */}
          <div className="chart-container">
            {renderCampaignCostsLineChart()}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Invoicing;
