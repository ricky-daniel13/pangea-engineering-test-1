import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Container,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@material-ui/core";
import { useMutation } from "react-query";
import client from "../../../API";
import { useIsMounted } from "../../../Hooks/use-is-mounted";

const CreatorDialog = ({ open, onClose, onSubmit }) => {
  const [contactEmail, setContactEmail] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailSame, setEmailSame] = useState(false);
  const [creatorName, setCreatorName] = useState("");
  const [creatorRegion, setCreatorRegion] = useState("");
  const [platforms, setPlatforms] = useState({
    TikTok: false,
    Instagram: false,
    YouTube: false,
  });
  const [primaryMarket, setPrimaryMarket] = useState("");
  const [notesContentStyle, setNotesContentStyle] = useState(
    "tell us about yourself"
  );

  const [race, setRace] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [pfphref, setPfphref] = useState(""); // New state for profile photo URL

  // Instagram
  const [instagramLink, setInstagramLink] = useState("");
  const [instagramBrandRate, setInstagramBrandRate] = useState("");
  const [instagramFollowerCount, setInstagramFollowerCount] = useState("");
  const [instagramSongRate, setInstagramSongRate] = useState("");

  // TikTok
  const [tikTokLink, setTikTokLink] = useState("");
  const [tikTokFollowerCount, setTikTokFollowerCount] = useState("");
  const [tikTokBrandRate, setTikTokBrandRate] = useState("");
  const [tikTokSongRate, setTikTokSongRate] = useState("");

  // YouTube
  const [youtubeLink, setYoutubeLink] = useState("");
  const [youtube30sBrandRate, setYoutube30sBrandRate] = useState("");
  const [youtubeFollowerCount, setYoutubeFollowerCount] = useState("");
  const [youtube60sBrandRate, setYoutube60sBrandRate] = useState("");
  const [youtubeShortsBrandRate, setYoutubeShortsBrandRate] = useState("");
  // Add other platform-specific rates and links as neede
  const handlePlatformChange = (event) => {
    setPlatforms({ ...platforms, [event.target.name]: event.target.checked });
  };

  const handleEmailSameChange = (event) => {
    setEmailSame(event.target.checked); // Update the state to reflect the checkbox's status
    if (event.target.checked) {
      setPaymentEmail(contactEmail); // If checked, set the payment email to the contact email
    } else {
      setPaymentEmail(""); // If unchecked, clear the payment email field for manual input
    }
  };

  const { mutate: addNewCreator, isLoading } = useMutation(
    client.creators.add,
    {
      onSuccess: (data) => {
        alert("Creator added successfully");
        onClose()
      },
      onError: (error) => {
        alert("Error saving creator data:", error);
        onClose()
      },
    }
  );

  
  const handleFollowerCountChange = (setter) => (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ''); // Strip out non-numeric characters
    const formattedValue = formatNumber(rawValue);
    setter(formattedValue);
  };
  
  const formatNumber = (value) => {
    const number = parseInt(value, 10);
    return isNaN(number) ? "" : number.toLocaleString(); // Convert number to string with commas but no "$"
  };
  const formatRate = (value) => {
    const number = parseInt(value, 10);
    return isNaN(number) ? "" : `$${number.toLocaleString()}`;
  };

  const handleSaveCreator = async () => {
    const formattedTikTokLink = tikTokLink ? `https://www.tiktok.com/@${tikTokLink}` : null;
    const formattedInstagramLink = instagramLink ? `https://www.instagram.com/${instagramLink}` : null;
    const formattedYouTubeLink = youtubeLink ? `https://www.youtube.com/${youtubeLink}` : null;

    const payload = {
      creator: creatorName,
      tiktok: tikTokFollowerCount || null,
      tiktok_link: formattedTikTokLink || null,
      instagram: instagramFollowerCount || null,
      instagram_link: formattedInstagramLink || null,
      youtube: youtubeFollowerCount || null,
      youtube_link: formattedYouTubeLink || null,
      geolocationgenderethnicity: `${location} / ${gender} / ${race}` || null,
      primary_market: primaryMarket, // Include the selected primary market
      region: creatorRegion,
      notescontent_style: notesContentStyle || null, // Add this to your payload
      tiktok_sound: formatRate(tikTokSongRate) || null,
      tiktok_brand: formatRate(tikTokBrandRate) || null,
      ig_feed_post: formatRate(instagramBrandRate) || null,
      ig_story: null,
      ig_reels_sound: formatRate(instagramSongRate) || null,
      ig_reels_brand: formatRate(instagramBrandRate) || null, // This and other rates need actual form fields or logic
      "60s Integration": formatRate(youtube60sBrandRate) || null,
      "3045s Integration": formatRate(youtube30sBrandRate) || null, // This needs a corresponding field or logic to provide a value
      shorts: formatRate(youtubeShortsBrandRate) || null,
      phone_number: phoneNumber, // Make sure this matches the expected key in your Flask app
      pfphref: pfphref || null,
    };

    addNewCreator(payload);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Container maxWidth="xl">
        <h1>Creator Intake Form</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission via HTTP
            handleSaveCreator();
          }}
        >
          <TextField
            margin="dense"
            label="Creator Name"
            type="text"
            fullWidth
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            variant="outlined"
          />
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel>Creator Region</InputLabel>
            <Select
              label="Creator Region"
              value={creatorRegion}
              onChange={(e) => setCreatorRegion(e.target.value)}
            >
              <MenuItem value="NACAUKAUS">USA, Canada, UK, Australia</MenuItem>
              <MenuItem value="Europe">Europe</MenuItem>
              <MenuItem value="Asia">Asia</MenuItem>
              <MenuItem value="LATAM">LATAM</MenuItem>
              <MenuItem value="Africa">Africa</MenuItem>
            </Select>
          </FormControl>
          <FormGroup row>
            {Object.keys(platforms).map((platform) => (
              <FormControlLabel
                key={platform}
                control={
                  <Checkbox
                    checked={platforms[platform]}
                    onChange={handlePlatformChange}
                    name={platform}
                  />
                }
                label={platform}
              />
            ))}
          </FormGroup>
          {platforms.Instagram && (
            <>
              <TextField
                margin="dense"
                label="Instagram Username"
                type="text"
                fullWidth
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      instagram.com/
                    </InputAdornment>
                  ),
                }}
              />
               <TextField
                margin="dense"
                label="Instagram Follower Count"
                type="text"
                fullWidth
                value={instagramFollowerCount}
                onChange={handleFollowerCountChange(setInstagramFollowerCount)}
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Instagram Brand Rate"
                type="text"
                fullWidth
                value={instagramBrandRate}
                onChange={(e) => setInstagramBrandRate(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Instagram Song Rate"
                type="text"
                fullWidth
                value={instagramSongRate}
                onChange={(e) => setInstagramSongRate(e.target.value)}
                variant="outlined"
              />
            </>
          )}
          {platforms.TikTok && (
            <>
              <TextField
                margin="dense"
                label="TikTok Username"
                type="text"
                fullWidth
                value={tikTokLink}
                onChange={(e) => setTikTokLink(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      tiktok.com/@
                    </InputAdornment>
                  ),
                }}
              />
               <TextField
                margin="dense"
                label="TikTok Follower Count"
                type="text"
                fullWidth
                value={tikTokFollowerCount}
                onChange={handleFollowerCountChange(setTikTokFollowerCount)}
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="TikTok Brand Rate"
                type="text"
                fullWidth
                value={tikTokBrandRate}
                onChange={(e) => setTikTokBrandRate(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="TikTok Song Rate"
                type="text"
                fullWidth
                value={tikTokSongRate}
                onChange={(e) => setTikTokSongRate(e.target.value)}
                variant="outlined"
              />
            </>
          )}
          {platforms.YouTube && (
            <>
              <TextField
                margin="dense"
                label="Youtube Username"
                type="text"
                fullWidth
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      youtube.com/
                    </InputAdornment>
                  ),
                }}
              />
               <TextField
                margin="dense"
                label="YouTube Follower Count"
                type="text"
                fullWidth
                value={youtubeFollowerCount}
                onChange={handleFollowerCountChange(setYoutubeFollowerCount)}
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="YouTube Brand Rate - 30s"
                type="text"
                fullWidth
                value={youtube30sBrandRate}
                onChange={(e) => setYoutube30sBrandRate(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="YouTube Brand Rate - 60s"
                type="text"
                fullWidth
                value={youtube60sBrandRate}
                onChange={(e) => setYoutube60sBrandRate(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="YouTube Shorts Rate"
                type="text"
                fullWidth
                value={youtubeShortsBrandRate}
                onChange={(e) => setYoutubeShortsBrandRate(e.target.value)}
                variant="outlined"
              />
            </>
          )}

          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel id="race-select-label">Race (optional)</InputLabel>
            <Select
              labelId="race-select-label"
              value={race}
              onChange={(e) => setRace(e.target.value)}
              label="Race (optional)"
            >
              {/* Define your options here */}
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
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel id="gender-select-label">Gender</InputLabel>
            <Select
              labelId="gender-select-label"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              label="Gender"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Non-binary">Non-binary</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Location"
            type="text"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            variant="outlined"
          />
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel id="primary-market-label">Primary Market</InputLabel>
            <Select
              labelId="primary-market-label"
              value={primaryMarket}
              onChange={(e) => setPrimaryMarket(e.target.value)}
              label="Primary Market"
            >
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
          <TextField
            margin="dense"
            label="Bio"
            type="text"
            fullWidth
            multiline
            rows={4}
            placeholder="tell us about yourself"
            variant="outlined"
            value={notesContentStyle}
            onChange={(e) => setNotesContentStyle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Contact Email"
            type="email"
            fullWidth
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Paypal Payment Email"
            type="email"
            fullWidth
            disabled={emailSame}
            value={paymentEmail}
            onChange={(e) => setPaymentEmail(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Profile Photo URL"
            type="text"
            fullWidth
            value={pfphref}
            onChange={(e) => setPfphref(e.target.value)}
            variant="outlined"
            placeholder="Enter URL for profile photo"
          />
          <FormControlLabel
            control={
              <Checkbox checked={emailSame} onChange={handleEmailSameChange} />
            }
            label="Payment and contact email are the same"
          />
          <Button
            type="submit" // Ensures form submission behavior when Enter is pressed
            variant="contained"
            color="primary"
            style={{ marginTop: "5px", marginBottom: "10px" }} // Add some space above the button
          >
            Submit Information
          </Button>
        </form>
      </Container>
    </Dialog>
  );
};

export default CreatorDialog;
