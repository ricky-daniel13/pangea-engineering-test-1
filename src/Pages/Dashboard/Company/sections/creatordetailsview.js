import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from 'react-query';
import client from '../../../../API';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Button, Checkbox, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import CreatorDialog from "../creatorupdate"
const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingLeft: 250 + theme.spacing(3), // Add 250px for the navbar, plus the existing padding
    overflowY: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));

const CreatorDetailsView = () => {
  const classes = useStyles();
  const [creators, setCreators] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCreatorDialogOpen, setCreatorDialogOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState(null);

  const { mutate: fetchData } = useMutation(client.creators.list, {
    onSuccess: (data) => {
      console.log("Fetched creators:", data);
      setCreators(data);
    },
    onError: (error) => {
      console.error('Failed to fetch data:', error);
    },
  });

  useEffect(() => {
    fetchData();
  }, []);
  const handleDialogOpen = (creator = null) => {
    console.log("Editing creator:", creator);
    setEditingCreator(creator); // Here you set the editing creator correctly
    setCreatorDialogOpen(true);
  };
  

  const handleDialogClose = (refresh = false) => {
    setCreatorDialogOpen(false);
    setEditingCreator(null); // Reset editing invoice
    if (refresh) fetchData();
  };
  return (
    <div className={classes.content}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell  style={{ color: "white" }}>Creator Name</TableCell>
              <TableCell  style={{ color: "white" }}color align="center">TikTok Rate</TableCell>
              <TableCell style={{ color: "white" }} align="center">Instagram Rate</TableCell>
              <TableCell  style={{ color: "white" }}align="center">Geolocation</TableCell>
              <TableCell  style={{ color: "white" }}align="center">Average Views</TableCell>
              <TableCell  style={{ color: "white" }}align="center">Notes/Content Style</TableCell>
              <TableCell  style={{ color: "white" }}align="center">Edit</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {creators.map((creator) => (
              <TableRow key={creator.creator}>
                                <TableCell align="right">{creator.creator || 'N/A'}</TableCell>

                <TableCell align="right">{creator.tiktok_brand || 'N/A'}</TableCell>
                <TableCell align="right">{creator.ig_feed_post || 'N/A'}</TableCell>
                <TableCell align="right">{creator.geolocation_gender_ethnicity || 'N/A'}</TableCell>
                <TableCell align="right">{creator.avg_views || 'N/A'}</TableCell>
                <TableCell align="right">{creator.notes_content_style || 'N/A'}</TableCell>
                <TableCell>
                <IconButton onClick={() => handleDialogOpen(creator)}>
  <EditIcon />
</IconButton>

                    </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isCreatorDialogOpen && (
  <CreatorDialog
    open={isCreatorDialogOpen}
    onClose={handleDialogClose}
    creatorInfo={editingCreator} // Here's where it might go wrong
  />
)}

    </div>
    
  );
};

export default CreatorDetailsView;
