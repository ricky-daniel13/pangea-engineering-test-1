import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../../API"; // Adjust this import to your actual API client's location
import {
  Typography,
  Box,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import blitzLogo from "../../../Components/globalAssets/platty.png";
import routes from "../../../Config/routes";
import profilePhoto from "../../../Components/globalAssets/ppfLogo.png"; // Placeholder for the profile photo
const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
const mapCountryToIsoA3 = (country) => {
  const countryMap = {
    USA: "USA",
    UK: "GBR",
    Mexico: "MEX",
    Canada: "CAN",
    Colombia: "COL",
    // Add more mappings as necessary
  };
  return countryMap[country] || null;
};
const CreatorDetailsPage = () => {
  const { creatorId } = useParams();
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCreatorDetails = async () => {
      setLoading(true);
      try {
        const response = await client.creators.fetchDetails(creatorId);
        console.log("Received response:", response);
        console.log(client);

        // Directly use the response assuming 'response' already contains the data object
        if (response && Object.keys(response).length > 0) {
          setCreatorDetails(response); // Assuming 'response' is the data object you need
          console.log("Data set for creator:", response);
        } else {
          console.error("Data is empty or undefined.", response);
        }
      } catch (error) {
        console.error("Failed to fetch creator details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (creatorId) {
      fetchCreatorDetails();
    }
  }, [creatorId]);

  if (loading) {
    return <Typography>Loading creator details...</Typography>;
  }

  if (!creatorDetails) {
    return <Typography>No creator details found.</Typography>;
  }
  const highlightedCountries = ["USA", "UK", "Mexico", "Canada", "Colombia"]
    .map(mapCountryToIsoA3)
    .filter(Boolean);

  // Safely parse and calculate data for charts
  const followersData = [
    { name: "TikTok", value: parseInt(creatorDetails.tiktok || 0, 10) },
    { name: "Instagram", value: parseInt(creatorDetails.instagram || 0, 10) },
    { name: "YouTube", value: parseInt(creatorDetails.youtube || 0, 10) },
  ];
  const formatPromotionValue = value => {
    const numericValue = parseFloat(value.replace('$', '').replace(',', '') || 0);
    return numericValue > 999 ? numericValue.toLocaleString() : numericValue.toFixed(2);
  };
  const promotionData = [
    {
      name: "TikTok Sound",
      value: (creatorDetails.tiktok_sound || ''),
    },
    {
      name: "TikTok Brand",
      value: (creatorDetails.tiktok_brand || ''),
    },
    {
      name: "Instagram Sound",
      value: (creatorDetails.instagram_sound || ''),
    },
    {
      name: "Instagram Brand",
      value: (creatorDetails.instagram_brand || ''),
    },
  ];
  

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#000" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            onClick={() => navigate(routes.home)}
            sx={{ mr: 2 }}
          >
            <img
              src={blitzLogo}
              alt="logo"
              style={{ width: "120px", height: "50px" }}
            />
          </IconButton>
          {/* Navigation items here, if any */}
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f5f5f5" }}>
  <Grid container spacing={2} justifyContent="center" alignItems="center">
    <Grid item xs={12} sm={4}>
      <Box
        component="img"
        src={creatorDetails.pfphref || profilePhoto}
        alt="Profile"
        sx={{
          width: '100%',
          maxWidth: 120,
          height: 'auto',
          borderRadius: "50%",
        }}
      />
    </Grid>
    <Grid item xs={12} sm={8}>
      <Typography variant="h4" gutterBottom>
        @{creatorDetails.creator}
        </Typography>
        </Grid>
  </Grid>
        <Paper sx={{ padding: 2, margin: "20px 0" }}>
          <Typography variant="body1">
            <strong>TikTok Profile:</strong>{" "}
            <a
              href={creatorDetails.tiktok_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View TikTok
            </a>
          </Typography>
          <Typography variant="body1">
            <strong>Instagram Profile:</strong>{" "}
            <a
              href={creatorDetails.instagram_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Instagram
            </a>
          </Typography>
          <Typography variant="body1">
            <strong>YouTube Channel:</strong>{" "}
            <a
              href={creatorDetails.youtube_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View YouTube
            </a>
          </Typography>
          {/* Followers Distribution */}
          <Grid item xs={12} md={6}>
          <Typography variant="body1">
              <strong>Presented By:</strong> {creatorDetails.manager}
            </Typography>
            <Typography variant="body1">
              <strong>TikTok Followers:</strong> {creatorDetails.tiktok}
            </Typography>
            <Typography variant="body1">
              <strong>Instagram Followers:</strong> {creatorDetails.instagram}
            </Typography>
            <Typography variant="body1">
              <strong>YouTube Subscribers:</strong> {creatorDetails.youtube}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Followers Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={followersData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {followersData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#0088FE", "#00C49F", "#FFBB28"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Paper>

        {/* Promotion Rates */}
        <Paper sx={{ padding: 2, margin: "20px 0" }}>
          <Typography variant="h6" gutterBottom>
            Promotion Rates ($)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={promotionData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <List>
            {promotionData.map((data) => (
              <ListItem key={data.name}>
                <ListItemText
                  primary={`${data.name}: $${(data.value)}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Additional Details */}
        <Paper sx={{ padding: 2, margin: "20px 0" }}>
          <Typography variant="body1">
            <strong>Geolocation & Ethnicity:</strong>{" "}
            {creatorDetails.geolocation_gender_ethnicity}
          </Typography>
          <Typography variant="body1">
            <strong>Content Style:</strong> {creatorDetails.notes_content_style}
          </Typography>
          <ComposableMap>
  <Geographies geography={geoUrl}>
    {({ geographies }) =>
      geographies.map((geo) => {
        const isHighlighted = highlightedCountries.includes(geo.properties.ISO_A3);
        return isHighlighted ? (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill="#FF5533"
          />
        ) : null; // Don't render unhighlighted geographies to clean up the map
      }).length > 0 ? geographies.map(geo => (
        <Geography
          key={geo.rsmKey}
          geography={geo}
          fill="#DDD"
        />
      )) : <Typography sx={{ textAlign: 'center' }}>Creator can't be mapped.</Typography>
    }
  </Geographies>
</ComposableMap>

        </Paper>
      </Box>
    </>
  );
};

export default CreatorDetailsPage;
