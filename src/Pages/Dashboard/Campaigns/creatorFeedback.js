import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { ConfigValue } from "../../../Config";

const CreatorFeedbackDialog = ({ open, onClose, creator, campaignId, onSave, token }) => {
  const [userFeedback, setUserFeedback] = useState('');
  const [creatorFeedback, setCreatorFeedback] = useState('');
  const [lastFeedback, setLastFeedback] = useState('');

  useEffect(() => {
    if (open && creator) {
      setCreatorFeedback(creator.feedback ? creator.feedback : '');
      setLastFeedback(creator.feedback ? 'Last Feedback: ' + creator.feedback : '');
    }
  }, [creator, open]);

  const handleSave = async () => {
    const updatedCreator = {
      id: creator.id,
      feedback: userFeedback
    };

    const payload = {
      campaignId,
      creatorId: creator.id,
      feedback: userFeedback
    };

    try {
      const response = await fetch(`${ConfigValue.PUBLIC_REST_API_ENDPOINT}/campaign_handler/smsFeedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save posting instructions and feedback");
      }

      alert("Feedback updated successfully.");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Creator: {creator?.id}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Submit Feedback"
          type="text"
          fullWidth
          variant="outlined"
          value={userFeedback}
          onChange={(e) => setUserFeedback(e.target.value)}
        />
        {creatorFeedback && (
          <TextField
            margin="dense"
            label="Creator Feedback"
            type="text"
            fullWidth
            variant="outlined"
            value={creatorFeedback}
            disabled
          />
        )}
        {lastFeedback && (
          <TextField
            margin="dense"
            label="Last Feedback"
            type="text"
            fullWidth
            variant="outlined"
            value={lastFeedback}
            disabled
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatorFeedbackDialog;
