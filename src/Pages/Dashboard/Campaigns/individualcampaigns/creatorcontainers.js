import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Grid,
  CardMedia,
  Card,
  Select,
  MenuItem,
  CardContent
} from "@mui/material";
import client from "../../../../API"; // adjust the path as necessary
import profilePhoto from "../../../../Components/globalAssets/ppfLogo.png"; // Placeholder for the profile photo

const CampaignsContainers = ({ creators, handleStatusChange }) => {
    return (
      <Grid container spacing={2}>
        {creators.map((creator, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={creator.pfphref || profilePhoto}
                alt={creator.name}
              />
              <CardContent>
                <Typography variant="h5">@{creator.name}</Typography>
                <Typography variant="h5">Following: {creator.following}</Typography>
                <Select
                  value={creator.status || "pitched"}
                  onChange={(event) => handleStatusChange(creator.id, event.target.value)}
                  style={{ marginTop: 20 }}
                >
                  <MenuItem value="pitched">Pitched</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="drop">Drop</MenuItem>
                  <MenuItem value="counter">Counter</MenuItem>
                  <MenuItem value="Accepted">Accepted</MenuItem>
                  <MenuItem value="declined">Declined</MenuItem>
                </Select>
                <Typography variant="body2">{`Price: ${creator.price}`}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <a
                    href={creator.platformLink ?? ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on {creator.promotionPlatform ?? ""}
                  </a>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
};

  
  export default CampaignsContainers;
