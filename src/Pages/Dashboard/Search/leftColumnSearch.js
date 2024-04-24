import React, { useState, useEffect } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  makeStyles,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useMutation } from "react-query";
import client from "../../../API";
import CreatorDialog from "./creatorintake"; // Adjust the path as necessary
import CreatorContainers from "./creatorcontainersearch";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2),
    width: 200,
  },
  content: {
    marginTop: theme.spacing(3),
    overflowX: "auto", // Ensure this container allows for horizontal scrolling
    marginLeft: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },

  table: {
    minWidth: 650,
  },
  filterContainer: {
    marginBottom: theme.spacing(3),
  },
  csvSection: {
    overflowX: "auto", // Ensure this container allows for horizontal scrolling
    marginLeft: theme.spacing(1),
  },
  csvTable: {
    width: "100%",
    tableLayout: "auto", // This can help with handling varying column widths
  },
  paper: {
    // Adding a new class for the Paper component
    marginBottom: theme.spacing(2), // Add some space below the table
    maxWidth: "100%", // Limit the Paper width to prevent overflow outside its parent container
    overflowX: "auto", // Allow horizontal scrolling within the Paper if the table overflows
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main, // Use your primary color here
    "& .MuiTableCell-head": {
      color: "white", // This will make the text white
    },
  },
  linkCell: {
    maxWidth: 100, // Set a specific maxWidth for link cells
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
}));

const LeftColumn = ({ onCreatorSelect }) => {
  const classes = useStyles();
  const [filter, setFilter] = useState("");
  const [region, setRegion] = useState(""); // Default to showing ALL Regions
  const [platform, setPlatform] = useState("TikTok"); // Default to TikTok Brand, and remove the option for None
  const [promotionType, setPromotionType] = useState("Brand"); // Assuming you want to start with TikTok Brand
  const [data, setData] = useState([]);
  const [race, setRace] = useState("");
  const [gender, setGender] = useState("");
  const [furtherLocation, setFurtherLocation] = useState("");
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [avgViews, setAvgViews] = useState("");
  const [selectedCreatorsData, setSelectedCreatorsData] = useState([]);
  const [campaignSum, setCampaignSum] = useState(0);
  const [isCreatorDialogOpen, setIsCreatorDialogOpen] = useState(false);
  const [primaryMarket, setPrimaryMarket] = useState("");
  const [followerRange, setFollowerRange] = useState("");
  const [cpmRange, setCpmRange] = useState("");
  const [showPretty, setShowPretty] = useState(true);

  const handleResetFilters = () => {
    setRegion("");
    setPlatform("TikTok");
    setPromotionType("Brand");
    setRace("");
    setGender("");
    setFurtherLocation("");
    setFilter("");
    setAvgViews(""); // Reset this as well if you're including the AVG Views Filter
    setPrimaryMarket("");
    setFollowerRange(""); // Reset the follower range
    setCpmRange("");
  };

  const { mutate: fetchData } = useMutation(client.creators.list, {
    onSuccess: async (data) => {
      console.log("Available keys in data objects:", Object.keys(data[0]));

      const sortByKey = platform === "TikTok" ? "tiktok" : "instagram";
      let creators = [...data];
      creators.sort((a, b) => {
        // Handle "N/A" values by setting them to a low number for sorting
        const aValue =
          a[sortByKey] === "N/A"
            ? -1
            : parseInt((a[sortByKey] ?? "0").replace(/,/g, ""), 10);
        const bValue =
          b[sortByKey] === "N/A"
            ? -1
            : parseInt((b[sortByKey] ?? "0").replace(/,/g, ""), 10);
        return bValue - aValue; // For descending order
      });

      setData(creators);
    },
    onError: (error) => {
      console.error("Failed to fetch data:", error);
    },
  });

  useEffect(() => {
    fetchData();
  }, [platform]); // Add platform to the dependency array to refetch & sort data when it changes
  
  useEffect(() => {
    if (data.length > 0) {
      let sortedAndUpdatedData = sortCreators([...data]); // Sort data first
      sortedAndUpdatedData = sortedAndUpdatedData.map((creator) => {
        const rate = creator[platformToKey[platform][0]]; // Assuming mapping is correct
        const avgViews = creator.avg_views;
  
        // Calculate CPM
        const cpm = calculateCPM(rate, avgViews);
        return { ...creator, cpm }; // Include calculated CPM in the creator object
      });
  
      setData(sortedAndUpdatedData); // Set sorted and updated data to state
    }
  }, [data, platform]); // Trigger when data or platform changes
  
  useEffect(() => {
    const sum = calculateTotalCampaignSum();
    setCampaignSum(sum);
    fetchData();
  }, [selectedCreatorsData]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };
  const handlePrimaryMarketChange = (event) => {
    setPrimaryMarket(event.target.value);
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };
  const handleCreatorSubmit = (formData) => {
    console.log(formData); // For now, just log the form data. You can replace this with your actual submission logic.
    setIsCreatorDialogOpen(false);
  };
  const parseNumber = (value) => {
    if (!value || value === "N/A") return 0;
    return parseInt(value.replace(/,/g, ""), 10);
  };
  const sortCreators = (creators) => {
    return creators.sort((a, b) => {
      // Prioritize 'Partner' status
      if (a.status === "Partner" && b.status !== "Partner") return -1;
      if (b.status === "Partner" && a.status !== "Partner") return 1;
  
      // Prioritize creators with non-null 'avg_views'
      const aViews = parseNumber(a.avg_views);
      const bViews = parseNumber(b.avg_views);
      if (aViews > 0 && bViews === 0) return -1;
      if (bViews > 0 && aViews === 0) return 1;
  
      // Use follower count as a tiebreaker
      const aFollowers = parseNumber(a.followers);
      const bFollowers = parseNumber(b.followers);
      return bFollowers - aFollowers; // Descending order
    });
  };

  const platformToKey = {
    TikTok: ["tikTok", "TikTok Sound", "TikTok Brand"],
    Instagram: ["instagram", "IG Reels Sound", "IG Reels Brand"],
    Youtube: ["youtube", "Integration_3045s", "Integration_60s", "shorts"], // Added keys for YouTube
  };

  const handlePlatformChange = (e) => {
    setPlatform(e.target.value);
    // Reset promotionType based on platform, defaulting to first available option or empty if none
    setPromotionType(promotionTypeOptions[e.target.value]?.[0] || "");
  };

  // Assuming each row in your data includes a unique identifier at index 0
  // Assuming the structure of your `data` array and the unique identifier is at index 0
  const handleSelectItem = (creatorId) => {
    const isSelected = selectedItems.has(creatorId);
    if (isSelected) {
      selectedItems.delete(creatorId);
    } else {
      selectedItems.add(creatorId);
    }
    setSelectedItems(new Set(selectedItems));

    const selectedCreator = data.find(
      (creator) => creator.creator === creatorId,
    );
    if (!selectedCreator) {
      console.warn(`Item with ID ${creatorId} not found.`);
      return;
    }

    // Dynamically determine the price key based on the selected promotion type and platform
    let priceKey = "";
    if (platform === "TikTok" && promotionType === "Sound") {
        priceKey = "tiktok_sound";
    } else if (platform === "TikTok" && promotionType === "Brand") {
        priceKey = "tiktok_brand";
    } else if (platform === "Instagram" && promotionType === "Feed Post") {
        priceKey = "ig_Feed_Post";
    } else if (platform === "Instagram" && promotionType === "Sound") {
        priceKey = "ig_reels_sound";
    } else if (platform === "Instagram" && promotionType === "Brand") {
        priceKey = "ig_reels_brand";
    } else if (platform === "YouTube" && promotionType === "3045s Integration") {
        priceKey = "integration_3045s";
    } else if (platform === "YouTube" && promotionType === "60s Integration") {
        priceKey = "integration_60s";
    } else if (platform === "YouTube" && promotionType === "shorts") {
      priceKey = "shorts";
    }
    
    const price = selectedCreator[priceKey] || "Price Unavailable";
    
    // Dynamically determine the platform link based on the selected platform
    const platformLinkKey = `${platform} Link`; // Constructs 'tiktokLink' or 'instagramLink', etc.
    const platformLink = selectedCreator[headerToKeyMap[platformLinkKey]];
    const followingCount = selectedCreator[platform.toLowerCase()];

    const relevantData = {
      id: selectedCreator.creator,
      name: selectedCreator.creator,
      price: price,
      following: followingCount,
      promotionPlatform: platform,
      promotionType: promotionType,
      platformLink: platformLink, // Includes the correct link based on the selected platform
    };

    if (!isSelected) {
      setSelectedCreatorsData((prev) => [...prev, relevantData]);
    } else {
      setSelectedCreatorsData((prev) =>
        prev.filter((item) => item.id !== creatorId),
      );
    }

    if (onCreatorSelect) {
      onCreatorSelect(relevantData);
    }
  };
  const handleCreatorSelect = (creatorData) => {
    const { id } = creatorData;

    // Check if the creator is already selected
    if (selectedItems.has(id)) {
      // Remove from selected items
      selectedItems.delete(id);
      setSelectedCreatorsData((prev) => prev.filter((item) => item.id !== id));
    } else {
      // Add to selected items
      selectedItems.add(id);
      setSelectedCreatorsData((prev) => [...prev, creatorData]);
    }

    // Update the Set state
    setSelectedItems(new Set(selectedItems));

    // Recalculate campaign total if necessary
    calculateTotalCampaignSum();
  };
  const calculateTotalCampaignSum = () => {
    const sum = selectedCreatorsData.reduce((accumulator, creator) => {
      // Ensure price is a string and default to "0" if not
      const priceAsString =
        typeof creator.price === "string" ? creator.price : "0";
      const cleanedPriceString = priceAsString.replace(/[^0-9.-]+/g, "");
      const price = parseFloat(cleanedPriceString);
      if (isFinite(price)) {
        return accumulator + price;
      } else {
        console.error(`Invalid price format detected: ${creator.price}`);
        return accumulator;
      }
    }, 0);
    return sum;
  };

  const handlePromotionTypeChange = (e) => {
    setPromotionType(e.target.value);
  };

  const headerToKeyMap = {
    Creator: "creator",
    TikTok: "tiktok", // Make sure this matches the data key for TikTok followers count
    Instagram: "instagram", // Make sure this matches the data key for Instagram followers count
    Youtube: "youtube",
    "Geolocation/Gender/Ethnicity": "geolocation_gender_ethnicity",
    "Primary Market": "primary_market",
    "Content Style": "notes_content_style",
    "TikTok Sound": "tiktok_sound",
    "TikTok Brand": "tiktok_brand",
    "IG Reels Sound": "ig_reels_sound",
    "IG Reels Brand": "ig_reels_brand",
    "Instagram Link": "instagram_link",
    "TikTok Link": "tiktok_link",
    "Youtube Link": "youtube_link",
    "AVG Views": "avg_views", // Make sure this matches exactly, including spaces
    "3045s Integration" : "integration_3045s",
    "60s Integration": "integration_60s",
    "shorts" : "shorts"
    // Add mappings for any other specific headers you have
  };
  const promotionTypeOptions = {
    TikTok: ["Sound", "Brand", "Livestream"],
    Instagram: ["Sound", "Brand", "Feed Post"],
    Youtube: ["3045s Integration", "60s Integration", "shorts"], // Specified YouTube options
  };

  const headers = {
    TikTok: [
      "Creator",
      "TikTok",
      "Geolocation/Gender/Ethnicity",
      "Primary Market",
      "Content Style",
      "TikTok Sound",
      "TikTok Brand",
      "TikTok Link",
      "AVG Views",
    ],
    Instagram: [
      "Creator",
      "Instagram",
      "Geolocation/Gender/Ethnicity",
      "Primary Market",
      "Content Style",
      "IG Reels Sound",
      "IG Reels Brand",
      "Instagram Link",
      "AVG Views",
    ],
    Youtube: [
      "Creator",
      "Youtube",
      "Geolocation/Gender/Ethnicity",
      "Primary Market",
      "Content Style",
      "25-45s Integration ",
      "60s Integration",
      "Shorts",
      "Youtube Link",
    ],
  };

  let platformHeaders = headers[platform];
  if (promotionType === "Brand") {
    platformHeaders = platformHeaders.filter(
      (header) => !header.includes("Sound"),
    );
  } else if (promotionType === "Sound") {
    platformHeaders = platformHeaders.filter(
      (header) => !header.includes("Brand"),
    );
  }
  const parseFollowerCount = (followerString) => {
    if (!followerString || followerString === "N/A") return 0;
    return parseInt(followerString.replace(/,/g, ""), 10) || 0;
  };

  const followerRangeMatch = (followerCount) => {
    switch (followerRange) {
      case "100k-1m":
        return followerCount >= 100000 && followerCount <= 1000000;
      case "1m-5m":
        return followerCount > 1000000 && followerCount <= 5000000;
      case "5m+":
        return followerCount > 5000000;
      default:
        return true;
    }
  };

  const calculateCPM = (rate, avgViews) => {
    if (!rate || !avgViews || rate === "N/A" || avgViews === "N/A") {
      return null; // Return null if either rate or avgViews is not available
    }
    // Extract numerical value from the rate which might be in a format like "$1,000"
    const numericalRate = parseInt(rate.replace(/[^0-9]/g, ""), 10);
    // Extract numerical value from avgViews which might be in a format like "100,000"
    const numericalViews = parseInt(avgViews.replace(/[^0-9]/g, ""), 10);

    if (isNaN(numericalRate) || isNaN(numericalViews)) {
      return null; // Return null if extraction failed
    }
    return (numericalRate / numericalViews) * 1000; // Calculate CPM
  };

  const filteredData = data.filter((creator) => {
    // Check for platform presence
    const platformKeys = platformToKey[platform];
    const isPlatformDataPresent = platformKeys.some(
      (key) =>
        creator[headerToKeyMap[key]] && creator[headerToKeyMap[key]] !== "N/A",
    );
    if (!isPlatformDataPresent) return false;

    // Check for primary market match
    const primaryMarketMatch =
      !primaryMarket || creator.primary_market === primaryMarket;
    const followerCount = parseFollowerCount(creator[platform.toLowerCase()]);

    // Implement Race, Gender, Location, and Avg Views filtering
    const raceGenderLocationMatch =
      race === "" || creator.geolocation_gender_ethnicity.includes(race);
    const genderMatch =
      gender === "" || creator.geolocation_gender_ethnicity.includes(gender);
    const locationMatch =
      furtherLocation === "" ||
      creator.geolocation_gender_ethnicity.includes(furtherLocation);

    // Parsing AVG Views to filter based on selected range
    let avgViewsMatch = true;
    const parseViews = (viewsString) => {
      if (!viewsString) {
        console.log("AVG Views is undefined or null.");
        return 0;
      }
      const parsedNumber = parseInt(viewsString.replace(/,/g, ""), 10) || 0;
      console.log(`Parsed AVG Views: ${parsedNumber}`);
      return parsedNumber;
    };

    if (avgViews !== "") {
      const avgViewsValue = parseViews(creator.avg_views);
      console.log(
        `AVG Views value for creator ${creator.creator}: ${avgViewsValue}`,
      );

      switch (avgViews) {
        case "10-50000":
          avgViewsMatch = avgViewsValue >= 10 && avgViewsValue <= 50000;
          break;
        case "50000-100000":
          avgViewsMatch = avgViewsValue > 50000 && avgViewsValue <= 100000;
          break;
        case "100000+":
          avgViewsMatch = avgViewsValue > 100000;
          break;
        default:
          avgViewsMatch = true;
      }
    }

    // New: Filter by region if selected
    const regionMatch = !region || creator.region === region;
    const cpmRangeMatch =
      cpmRange === "" ||
      (cpmRange === "0-10" && creator.cpm >= 0 && creator.cpm <= 10) ||
      (cpmRange === "10-25" && creator.cpm > 10 && creator.cpm <= 25) ||
      (cpmRange === "25+" && creator.cpm > 25);

    // Dynamically search across multiple columns for the filter term
    const searchMatch =
      filter === "" ||
      Object.values(creator).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(filter),
      );

    return (
      primaryMarketMatch &&
      raceGenderLocationMatch &&
      genderMatch &&
      locationMatch &&
      avgViewsMatch &&
      searchMatch &&
      regionMatch &&
      followerRangeMatch(followerCount) &&
      cpmRangeMatch
    );
  });
  const toggleView = () => {
    setShowPretty(!showPretty);
  };

  const generateCellContent = (creator, header) => {
    const key = headerToKeyMap[header];
    let content = creator[key];
    if (header === "Creator" && content !== "\\N" && content !== "N/A") {
      return (
        <div className={classes.linkCell}>
          {/* Modify this line to use the creatorId in the URL */}
          <a
            href={`https://blitzpay.pro/creators/${creator.creator}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        </div>
      );
    } else if (
      header.endsWith("Link") &&
      content !== "\\N" &&
      content !== "N/A"
    ) {
      return (
        <div className={classes.linkCell}>
          <a href={content} target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        </div>
      );
    } else if (content === "\\N") {
      return <span className={classes.tableCell}>N/A</span>;
    } else if (content == null || content == undefined) {
      return <span className={classes.tableCell}>N/A</span>;
    }

    return content;
  };

  return (
    <div>
      <Grid container spacing={3}>
        <div className={classes.content}>
          <Grid item xs={12} className={classes.filterContainer}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="region-select-label">Select Region</InputLabel>
              <Select
                labelId="region-select-label"
                id="region-select"
                value={region}
                onChange={handleRegionChange}
                label="Select Region"
              >
                <MenuItem value="">
                  <em>ALL</em>
                </MenuItem>
                <MenuItem value="NACAUKAUS">
                  USA, Canada, UK, Australia
                </MenuItem>
                <MenuItem value="EU">EU</MenuItem>
                <MenuItem value="LATAM">LATAM</MenuItem>
                <MenuItem value="Asia">Asia</MenuItem>

                {/* More regions */}
              </Select>
            </FormControl>
            {/* Platform Dropdown */}
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="platform-select-label">Platform</InputLabel>
              <Select
                labelId="platform-select-label"
                id="platform-select"
                value={platform}
                onChange={handlePlatformChange}
                label="Platform"
              >
                <MenuItem value="TikTok">TikTok</MenuItem>
                <MenuItem value="Instagram">Instagram</MenuItem>
                <MenuItem value="Youtube">Youtube</MenuItem>
                {/*<MenuItem value="Twitter">Twitter</MenuItem>*/}
              </Select>
            </FormControl>
            {/* Promotion Type Dropdown */}
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="promotion-type-label">Promotion Type</InputLabel>
              <Select
                labelId="promotion-type-label"
                id="promotion-type-select"
                value={promotionType}
                onChange={handlePromotionTypeChange}
                label="Promotion Type"
              >
                {platform &&
                  promotionTypeOptions[platform].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {/* Race Dropdown */}
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="race-select-label">Race</InputLabel>
              <Select
                labelId="race-select-label"
                id="race-select"
                value={race}
                onChange={(e) => setRace(e.target.value)}
                label="Race"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Asian">Asian</MenuItem>
                <MenuItem value="Black">Black</MenuItem>
                <MenuItem value="Hispanic">Hispanic</MenuItem>
                <MenuItem value="White">White</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            {/* Gender Dropdown */}
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="gender-select-label">Gender</InputLabel>
              <Select
                labelId="gender-select-label"
                id="gender-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                label="Gender"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            {/* Further Location Dropdown */}
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="further-location-select-label">
                Location
              </InputLabel>
              <Select
                labelId="further-location-select-label"
                id="further-location-select"
                value={furtherLocation}
                onChange={(e) => setFurtherLocation(e.target.value)}
                label="Further Location"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="US">US</MenuItem>
                <MenuItem value="UK">UK</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="Mexico">Mexico</MenuItem>
                <MenuItem value="Brazil">Brazil</MenuItem>
                <MenuItem value="Colombia">Colombia</MenuItem>
                <MenuItem value="Phillipines">Phillipines</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="primary-market-select-label">
                Primary Market
              </InputLabel>
              <Select
                labelId="primary-market-select-label"
                id="primary-market-select"
                value={primaryMarket}
                onChange={handlePrimaryMarketChange}
                label="Primary Market"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {[
                  "Activist",
                  "Artist",
                  "Beauty",
                  "Cars",
                  "Cosplay",
                  "Comedy",
                  "Country",
                  "Dance",
                  "Educational",
                  "Fashion",
                  "Fitness",
                  "Food",
                  "Gaming",
                  "Lifestyle",
                  "Music",
                  "Pets",
                  "Reviews",
                  "Sports",
                  "Tech",
                  "Thirst Trap",
                  "Travel",
                ].map((market) => (
                  <MenuItem key={market} value={market}>
                    {market}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="follower-range-label">Follower Range</InputLabel>
              <Select
                labelId="follower-range-label"
                id="follower-range-select"
                value={followerRange}
                onChange={(e) => setFollowerRange(e.target.value)}
                label="Follower Range"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="100k-1m">100k - 1m</MenuItem>
                <MenuItem value="1m-5m">1m - 5m</MenuItem>
                <MenuItem value="5m+">5m+</MenuItem>
              </Select>
            </FormControl>{" "}
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel id="avg-views-select-label">AVG Views</InputLabel>
              <Select
                labelId="avg-views-select-label"
                id="avg-views-select"
                value={avgViews}
                onChange={(e) => setAvgViews(e.target.value)}
                label="AVG Views"
              >
                {/* AVG Views MenuItems */}
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="10-50000">10-50,000</MenuItem>
                <MenuItem value="50000-100000">50,000-100,000</MenuItem>
                <MenuItem value="100000+">100,000+</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="cpm-range-label">CPM Range</InputLabel>
              <Select
                labelId="cpm-range-label"
                id="cpm-range-select"
                value={cpmRange}
                onChange={(e) => setCpmRange(e.target.value)}
                label="CPM Range"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="0-10">0-10 CPM</MenuItem>
                <MenuItem value="10-25">10-25 CPM</MenuItem>
                <MenuItem value="25+">25+ CPM</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="search-field"
              label="Search"
              variant="outlined"
              size="small"
              fullWidth
              className={classes.formControl}
              value={filter}
              onChange={handleFilterChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleResetFilters}
              className={classes.formControl}
              fullWidth
            >
              Reset Filters
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={() => setIsCreatorDialogOpen(true)}
            >
              Add Creators
            </Button>
            <Button onClick={toggleView}>
              {showPretty ? "Show CSV" : "Make it Pretty"}
            </Button>
          </Grid>

          <CreatorDialog
            open={isCreatorDialogOpen}
            onClose={() => setIsCreatorDialogOpen(false)}
            onSubmit={handleCreatorSubmit}
          />
        </div>
      </Grid>
      {showPretty ? (
        <CreatorContainers
          creators={filteredData}
          platform={platform}
          onSelectCreator={handleCreatorSelect}
          selectedItems={selectedItems}
          onCardClick={handleSelectItem}
        />
      ) : (
        <div className={classes.csvSection}>
          <Paper elevation={3}>
            <Table className={classes.csvTable}>
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  <TableCell padding="checkbox">Select</TableCell>{" "}
                  {/* Added "Select" header */}
                  {platformHeaders.map((header) => (
                    <TableCell key={header}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((creator, idx) => (
                  <TableRow
                    key={idx}
                    style={{
                      backgroundColor: selectedItems.has(creator.creator)
                        ? "lightgreen"
                        : "transparent",
                      maxWidth: 10,
                    }}
                    // Removed onClick from here to prevent row from toggling selection when clicking on Checkbox
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItems.has(creator.creator)}
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent event from bubbling to the row's onClick
                          handleSelectItem(creator.creator);
                        }}
                        color="primary"
                      />
                    </TableCell>
                    {platformHeaders.map((header) => (
                      <TableCell key={header}>
                        {generateCellContent(creator, header)}
                      </TableCell> // Adjusted to use generateCellContent
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default LeftColumn;
