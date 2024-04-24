import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Link,
  CardMedia,
  Grid,
  Button,
} from "@material-ui/core";
import profilePhoto from "../../../Components/globalAssets/ppfLogo.png"; // Placeholder for the profile photo

function CreatorContainers({
  creators,
  platform,
  onSelectCreator,
  selectedItems,
  onCardClick,
}) {
  const parseNumber = (numStr) => {
    if (numStr === null || numStr === undefined || numStr === "N/A") {
      return 0; // Return 0 for non-numeric or absent values
    }
    return parseInt(numStr.replace(/,/g, ""), 10);
  };
  const handleCardClick = (creator) => {
    // Adjusted to fetch price data correctly
    let platformPriceKey = `${platform.toLowerCase()}_${promotionType.toLowerCase()}`; // e.g., 'tiktok_brand'
    const price = creator[platformPriceKey]
      ? creator[platformPriceKey]
      : "Price Unavailable";

    const relevantData = {
      id: creator.creator,
      name: creator.creator,
      price: price, // Use corrected price
      following: creator[platform.toLowerCase()],
      promotionPlatform: platform,
      promotionType: "Brand", // You might want to make this dynamic
      platformLink: creator[`${platform.toLowerCase()}_link`],
    };

    onSelectCreator(relevantData);
  };

  return (
    <Grid container spacing={2}>
      {creators.map((creator, index) => {
        const followerCount = parseNumber(
          creator[platform.toLowerCase()] || "0",
        );
        const avgViews = parseNumber(creator.avg_views || "0"); // Default to '0' if avg_views is undefined
        let engagement = null;
        if (followerCount && avgViews) {
          engagement = (avgViews / followerCount) * 100; // calculate engagement percentage
        }

        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              onClick={() => onCardClick(creator.creator)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedItems.has(creator.creator)
                  ? "lightgreen"
                  : "white",
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={creator.pfphref || profilePhoto}
                alt={creator.creator}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  @{creator.creator}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Region: {creator.region}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Followers: {creator[platform.toLowerCase()]}
                </Typography>

                <Link
                  href={creator[`${platform.toLowerCase()}_link`]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View {platform} Profile
                </Link>
                {engagement && (
                  <Typography variant="body2" color="text.secondary" style={{ color: 'green' }}>
                    Engagement: {engagement.toFixed(2)}%
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default CreatorContainers;
