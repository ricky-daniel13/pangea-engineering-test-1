import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

// Functional Component Declaration
const RecentCampaign = ({ campaign }) => {
  // Safely destructure properties with fallbacks
  const {
    name = "Unnamed Campaign", // Default name if not provided
    campaign_sum = 0, // Default budget if not provided
    proposal_date, // Leave as is, we'll handle if it's undefined later
    creators = [], // Default to an empty array if not provided
    campaign_status = "Unknown", // Default status if not provided
  } = campaign || {}; // Also protect against campaign itself being undefined

  // Calculate total posts up (assuming creators have a 'liveLink' when the post is up)
  const postsUp = creators.filter((creator) => creator.liveLink).length;

  // Remaining posts are the total number of creators minus the posts up
  const remainingPosts = creators.length - postsUp;

  // Calculate total views and total engagement from all creators
  const totalViews = creators.reduce(
    (acc, creator) => acc + (creator.totalViews || 0),
    0
  );
  const totalEngagement = creators.reduce(
    (acc, creator) => acc + (creator.totalEngagement || 0),
    0
  );

  // Format launchDate safely
  const formattedLaunchDate = proposal_date
    ? new Date(proposal_date).toLocaleDateString()
    : "Not set";

  return (
    <Card elevation={3} sx={{ minWidth: 275, margin: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Budget: ${campaign_sum.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Launch Date: {formattedLaunchDate}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Posts Up: {postsUp}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Remaining Posts: {remainingPosts}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Views: {totalViews.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Engagement: {totalEngagement.toLocaleString()}
        </Typography>
        <Typography
          variant="body2"
          color={status === "Launched" ? "success.main" : "error.main"}
        >
          Campaign Status: {campaign_status}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RecentCampaign;
