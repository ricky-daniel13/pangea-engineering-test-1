import React from "react";
import {
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";

// Custom UI component to display campaign details
const CampaignDetailsUI = ({ campaignDetails, newCreators }) => {
  if (!campaignDetails)
    return <Typography>Loading campaign details...</Typography>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Campaign Details
      </Typography>
      <Typography variant="body1">Name: {campaignDetails.name}</Typography>
      <Typography variant="body1">Brief: {campaignDetails.brief}</Typography>
      <Typography variant="body1">
        Proposal Date: {campaignDetails.proposal_date}
      </Typography>
      <Typography variant="body1">
        Ideal Due Date: {campaignDetails.ideal_duedate}
      </Typography>
      <Typography variant="body1">
        Campaign Sum: ${campaignDetails.campaign_sum}
      </Typography>
      <Divider style={{ margin: "20px 0" }} />
      <Typography variant="h6">Creators</Typography>
      <Grid item xs={12} style={{}}>
        <List>
          {campaignDetails.creators.map((creator, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${creator.name}`}
                secondary={`Following: ${creator.following}`}
              />
              <ListItemText
                primary={`Price: ${creator.price}`}
                secondary={`${creator.promotionPlatform} ${creator.promotionType}`}
              />
            </ListItem>
          ))}
        </List>
      </Grid>

      <Divider style={{ margin: "20px 0" }} />
      <Typography variant="h6">New Creators Added</Typography>
      <List>
        {newCreators.map((creator, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={creator.name}
              secondary={`Following: ${creator.following}`}
            />
            <ListItemText primary={`Price: ${creator.price}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CampaignDetailsUI;
