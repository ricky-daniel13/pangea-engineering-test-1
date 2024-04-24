import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { ConfigValue } from "../../../Config";

const EditCreatorDialog = ({ open, onClose, creator, onSave, brief }) => {
  const [creatorBrief, setCreatorBrief] = useState('');
  const [postingInstructions, setPostingInstructions] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [campaignId, setCampaignId] = useState('');

  console.log(creator)
  // Whenever the dialog opens with a new creator, reset the fields
  useEffect(() => {
    console.log('Dialog opened for creator:', creator); // Debug log
    if (open) {
      setCreatorBrief(creator.creatorBrief || brief || '');  // Assuming 'brief' is the key for the creator's brief
      setPostingInstructions(creator.postingInstructions || ''); 
      setCreatorName(creator.id || '');  // Assuming 'postingInstructions' is the key
      setCampaignId(creator.campaignId || '');  // Assuming 'postingInstructions' is the key
    }
  }, [creator, open]);

  const handleSave = async() => {
    if (!campaignId) { // Change from creator.campaignId to campaignId since it's state you're setting and checking
      console.error('No campaign ID provided');
      return; // Alert or show an error that the campaign ID is necessary
    }
  
    const updatedCreator = {
      id: creator.id, // Pass the creator's id to identify it in the backend
      creatorBrief: creatorBrief, // Ensure values are taken from state
      postingInstructions: postingInstructions
    };
    const payload = {
      campaignId: campaignId, // Taken from state
      creators: [updatedCreator]
    };
  
    try {
      // Make the API call to update creator details
      const response = await fetch(
        `${ConfigValue.PUBLIC_REST_API_ENDPOINT}/campaigns/updateCreatorSpecifics`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        // If the response is not OK, throw an error with the response's error message
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to save posting instructions"
        );
      }

      // Show a success message
      alert("Posting instructions updated successfully for all creators.");
      onClose(); // Maybe call onSave as well if you need to trigger parent component updates

    } catch (error) {
      // Log and alert any errors encountered during the update
      console.error("Error updating posting instructions:", error);
      alert(`Error: ${error.message}`);
      onClose(); // Maybe call onSave as well if you need to trigger parent component updates
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Creator: {creatorName}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Creator Brief"
          type="text"
          fullWidth
          variant="outlined"
          value={creatorBrief}
          onChange={(e) => setCreatorBrief(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Posting Instructions"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={postingInstructions}
          onChange={(e) => setPostingInstructions(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCreatorDialog;
