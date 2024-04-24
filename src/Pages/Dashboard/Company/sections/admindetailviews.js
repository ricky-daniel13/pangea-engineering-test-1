import React, { useState, useEffect } from "react";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { drawerWidth } from "../../../../Utils/constants";
import UserDialog from "../info";
import { StyledTableRow, StyledTableCell } from "../../../../Utils/styledcell";
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
    width: `calc(100% - ${drawerWidth}px)`,
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

const UserDetailsView = () => {
  const classes = useStyles();
  const isMounted = useIsMounted();
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isUserDialogOpen, setUserDialogOpen] = useState(false);

  const { mutate: fetchUsers } = useMutation(client.users.fetchUser, {
    onSuccess: async (data) => {
      setUsers(data);
      setSelectedIds([]);
    },
    onError: (error) => {
      console.error("Error fetching users:", error);
    },
  });

  const { mutate: deleteUser } = useMutation(client.users.delete, {
    onSuccess: async (data) => {
      fetchUsers();
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  useEffect(() => {
    if (isMounted) {
      fetchUsers();
    }
  }, [isMounted]);

  const onDeleteUsers = () => {
    deleteUser({ userIds: selectedIds });
  };

  const onManageUser = () => {
    setUserDialogOpen(true);
  };

  const handleSelectItem = (userId) => {
    if (selectedIds.includes(userId)) {
      setSelectedIds(selectedIds.filter((item) => item !== userId));
    } else {
      setSelectedIds([...selectedIds, userId]);
    }
  };

  const handleDialogClose = (bRefresh) => {
    setUserDialogOpen(false);
    if (bRefresh) {
      fetchUsers();
    }
  };

  return (
    <div className={classes.content}>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onManageUser()}
        >
          Add User
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedIds.length !== 1}
          onClick={() => onManageUser()}
        >
          Edit User
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedIds.length}
          onClick={onDeleteUsers}
        >
          Delete User(s)
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center"></StyledTableCell>
              <StyledTableCell align="center">ID</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Created At</StyledTableCell>
              <StyledTableCell align="center">Updated At</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <StyledTableRow key={user.id}>
                <StyledTableCell align="center" style={{ width: 50 }}>
                  <Checkbox
                    color="primary"
                    checked={selectedIds.includes(user.id)}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent row click event from firing
                      handleSelectItem(user.id);
                    }}
                    inputProps={{
                      "aria-labelledby": `enhanced-table-checkbox_${user.id}`,
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">{user.id}</StyledTableCell>
                <StyledTableCell align="center">{user.name}</StyledTableCell>
                <StyledTableCell align="center">{user.email}</StyledTableCell>
                <StyledTableCell align="center">{user.status}</StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(user.created_at).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(user.updated_at).toLocaleDateString()}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isUserDialogOpen && (
        <UserDialog
          open={isUserDialogOpen}
          info={
            selectedIds.length > 0
              ? users.filter((item) => item.id == selectedIds[0])[0]
              : undefined
          }
          onClose={handleDialogClose}
        />
      )}
    </div>
  );
};

export default UserDetailsView;