import React, { useEffect, useState, useMemo } from "react";
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
  Chip,
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
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const mapCountryToGeoName = (country) => {
  const countryMap = {
    USA: "United States of America",
    UK: "United Kingdom",
    Mexico: "Mexico",
    Canada: "Canada",
    Colombia: "Colombia",
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

    console.log("Loading creator details");

    if (creatorId) {
      fetchCreatorDetails();
    }
  }, [creatorId]);

  const highlightedCountries = ["USA", "UK", "Mexico", "Canada", "Colombia"]
    .map(mapCountryToGeoName)
    .filter(Boolean);



  const parsePromotionDataNumbers = value => {
    return parseFloat(value.replaceAll('$', '').replaceAll(',', '') || 0);
  };

  const formatPromotionValue = value => {
    const numericValue = parseFloat(value.replace('$', '').replace(',', '') || 0);
    return numericValue > 999 ? numericValue.toLocaleString() : numericValue.toFixed(2);
  };

    const followersData = useMemo(() => {
    return [
      { name: "TikTok", value: parsePromotionDataNumbers(creatorDetails ? creatorDetails.tiktok : "0") },
      { name: "Instagram", value: parsePromotionDataNumbers(creatorDetails ? creatorDetails.instagram : "0") },
      { name: "YouTube", value: parsePromotionDataNumbers(creatorDetails ? creatorDetails.youtube : "0") },
    ];
  }, [creatorDetails]);

  const promotionData = useMemo(() => {
    return [
      {
        name: "TikTok Sound",
        value: (creatorDetails ? parsePromotionDataNumbers(creatorDetails.tiktok_sound) : 0),
      },
      {
        name: "TikTok Brand",
        value: (creatorDetails ? parsePromotionDataNumbers(creatorDetails.tiktok_brand) : 0),
      },
      {
        name: "Instagram Story",
        value: (creatorDetails ? parsePromotionDataNumbers(creatorDetails.ig_story) : 0),
      },
      {
        name: "Instagram Post",
        value: (creatorDetails ? parsePromotionDataNumbers(creatorDetails.ig_feed_post) : 0),
      },
      {
        name: "Instagram Sound",
        value: (creatorDetails ? parsePromotionDataNumbers(creatorDetails.ig_reels_sound) : 0),
      },
      {
        name: "Instagram Brand",
        value: (creatorDetails ? parsePromotionDataNumbers(creatorDetails.ig_reels_brand) : 0),
      },
    ]
  }, [creatorDetails]);

  if (loading) {
    return <Typography>Loading creator details...</Typography>;
  }

  if (!creatorDetails) {
    return <Typography>No creator details found.</Typography>;
  }

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
                      fill={["#02010f", "#eb2d9f", "#e01e14"][index]}
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
              <Bar dataKey="value" name="Rate" fill="#8884d8" />
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
          <Box style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
            <Typography variant="body1"><strong>Content Style:</strong></Typography>
            {creatorDetails.notes_content_style.split(',').map((tag) => (
              <Chip label={tag} key={tag} color="primary" style={{ marginInline: "0.5em" }}></Chip>
            ))}
          </Box>
          <ComposableMap>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {

                  const isHighlighted = highlightedCountries.includes(geo.properties.name);
                  //console.log("Geo: ", geo.properties.name, " isHighlighted?: ", isHighlighted);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isHighlighted ? "#FF5533" : "#DDD"}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>

        </Paper>
      </Box>
    </>
  );
};

export default CreatorDetailsPage;
