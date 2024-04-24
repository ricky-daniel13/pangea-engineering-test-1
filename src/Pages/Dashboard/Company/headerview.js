import React from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  buttonGroup: {
    backgroundColor: 'grey', // Set the background color to grey
    display: 'flex', // Enable flex container to center buttons and manage spacing
    justifyContent: 'center', // Center the buttons horizontally
    '& > *': { // Apply styles to every button
      margin: theme.spacing(1), // Add space around each button
      flexGrow: 1, // Make buttons stretch to fill the container
    },
  },
  button: {
    margin: theme.spacing(1), // Add spacing between buttons if needed
  },
  // Example styles for different button colors
  companies: {
    backgroundColor: '#3f51b5', // Indigo
    color: '#fff',
    '&:hover': {
      backgroundColor: '#303f9f',
    },
  },
  campaigns: {
    backgroundColor: '#009688', // Teal
    color: '#fff',
    '&:hover': {
      backgroundColor: '#00796b',
    },
  },
  payouts: {
    backgroundColor: '#f44336', // Red
    color: '#fff',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  invoices: {
    backgroundColor: '#ff9800', // Orange
    color: '#fff',
    '&:hover': {
      backgroundColor: '#f57c00',
    },
  },
  creators: {
    backgroundColor: '#4caf50', // Green
    color: '#fff',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
}));

const HeaderView = ({ setCurrentView }) => {
  const classes = useStyles();

  return (
    <div className={classes.buttonGroup}>
      <Button className={`${classes.button} ${classes.companies}`} onClick={() => setCurrentView('companies')}>Company Details</Button>
      <Button className={`${classes.button} ${classes.campaigns}`} onClick={() => setCurrentView('campaigns')}>Campaigns</Button>
      <Button className={`${classes.button} ${classes.payouts}`} onClick={() => setCurrentView('payouts')}>Payouts</Button>
      <Button className={`${classes.button} ${classes.invoices}`} onClick={() => setCurrentView('invoices')}>Invoices</Button>
      <Button className={`${classes.button} ${classes.creators}`} onClick={() => setCurrentView('creators')}>Creators</Button>
      <Button className={`${classes.button} ${classes.companies}`} onClick={() => setCurrentView('admin')}>Admin</Button>

    </div>
  );
};

export default HeaderView;
