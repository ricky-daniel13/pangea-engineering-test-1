import React, { useState, useEffect } from "react";
import Navbar from "../../../../Components/Navbar/NavBar";
import {
  TextField,
  Button,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "react-query";
import client from "../../../../API";
import { StyledTableRow, StyledTableCell } from "../../../../Utils/styledcell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { drawerWidth } from "../../../../Utils/constants";
import CompanyDialog from "../info";
import HeaderView from "../headerview"; // Adjust the path according to your file structure
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

const CompanyDetailsView = () => {
  const classes = useStyles();
  const isMounted = useIsMounted();
  const [companies, setCompanies] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isPayCreatorDialogOpen, setPayCreatorDialogOpen] = useState(false);

  const { mutate: fetchCompanies } = useMutation(client.companies.list, {
    onSuccess: async (data) => {
      setCompanies(data); // Adjust based on actual API response
      setSelectedIds([]);
    },
    onError: (error) => {
      console.error("Error fetching invoices:", error);
    },
  });

  const { mutate: deleteCompanies } = useMutation(client.companies.delete, {
    onSuccess: async (data) => {
      fetchCompanies();
    },
    onError: (error) => {
      console.error("Error fetching invoices:", error);
    },
  });

  useEffect(() => {
    isMounted && fetchCompanies();
  }, [isMounted]);

  const onDeleteCompanies = () => {
    deleteCompanies({ companyIds: selectedIds });
  };

  const onCompany = () => {
    setPayCreatorDialogOpen(true);
  };

  const formatAmount = (amount) => {
    // Format the number to a currency format
    return `$${parseFloat(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const handleSelectItem = (companyId) => {
    if (selectedIds.includes(companyId)) {
      setSelectedIds(selectedIds.filter((item) => item != companyId));
    } else {
      setSelectedIds([...selectedIds, companyId]);
    }
  };

  const handleDialogClose = (bRefresh) => {
    setPayCreatorDialogOpen(false);
    bRefresh && fetchCompanies();
  };

  return (
    <div className={classes.content}>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onCompany()}
        >
          Add Company
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedIds.length !== 1}
          onClick={() => onCompany()}
        >
          Edit Company
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedIds.length}
          onClick={onDeleteCompanies}
        >
          Delete Company(s)
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center"></StyledTableCell>
              <StyledTableCell align="center">ID</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Balance</StyledTableCell>
              <StyledTableCell align="center">Seats</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Created At</StyledTableCell>
              <StyledTableCell align="center">Updated At</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <StyledTableRow key={company.id}>
                <StyledTableCell align="center" style={{ width: 50 }}>
                  <Checkbox
                    color="primary"
                    checked={selectedIds.includes(company.id)}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent row click event from firing
                      handleSelectItem(company.id);
                    }}
                    inputProps={{
                      "aria-labelledby": `enhanced-table-checkbox_${company.id}`,
                    }}
                  />
                </StyledTableCell>

                <StyledTableCell align="center">{company.id}</StyledTableCell>
                <StyledTableCell align="center">{company.name}</StyledTableCell>
                <StyledTableCell align="center">
                  {formatAmount(company.balance)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {company.seats.join(", ")}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {company.account_status}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(company.account_updated).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(company.account_updated).toLocaleDateString()}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isPayCreatorDialogOpen && (
        <CompanyDialog
          open={isPayCreatorDialogOpen}
          info={
            selectedIds.length > 0
              ? companies.filter((item) => item.id == selectedIds[0])[0]
              : undefined
          }
          onClose={handleDialogClose}
        />
      )}
    </div>
  );
};

export default CompanyDetailsView;
