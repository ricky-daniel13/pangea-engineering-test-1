import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const PostingInstructionsDialog = ({ open, onClose, onSave, initialInstructions = "" }) => {
  const [instructions, setInstructions] = useState(initialInstructions);
  const inputRef = useRef(null);

  // Focus on the text field when the dialog opens and reset instructions to initial state on open
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setInstructions(initialInstructions);
    }
  }, [open, initialInstructions]);

  const handleSave = () => {
    onSave(instructions);
    onClose(); // Optionally close the dialog on save
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Posting Instructions</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="posting-instructions"
          label="Instructions"
          type="text"
          fullWidth
          multiline
          minRows={4}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostingInstructionsDialog;
