import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import Navbar from "../../../Components/Navbar/NavBar";
import "./ZapFeed.css";
import {
  FavoriteBorder,
  Repeat,
  ChatBubbleOutline,
  Share,
} from "@mui/icons-material";
import { defaultFriends, defaultTweets } from "../../../Utils/constants";

const ZapFeed = () => {
  // This is sample data
  const [tweets, setTweets] = useState(defaultTweets);
  const [friends, setFriends] = useState(defaultFriends);

  return (
    <Container>
      <Navbar />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={20}>
            <Grid item xs={8}>
              <Paper>
                <Typography variant="h2">Feed</Typography>
                <Grid container spacing={2}>
                  {tweets.map((tweet, index) => (
                    <Grid item xs={12} key={index}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Avatar src={tweet.user.avatar} />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="subtitle1">
                            {tweet.user.name}
                          </Typography>
                          <Typography variant="subtitle2">
                            {tweet.time}
                          </Typography>
                          <Typography variant="body1">
                            {tweet.content}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item>
                              <IconButton>
                                <ChatBubbleOutline />
                              </IconButton>
                            </Grid>
                            <Grid item>
                              <IconButton>
                                <Repeat />
                              </IconButton>
                            </Grid>
                            <Grid item>
                              <IconButton>
                                <FavoriteBorder />
                              </IconButton>
                            </Grid>
                            <Grid item>
                              <IconButton>
                                <Share />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper>
                <Typography variant="h4">Friends</Typography>
                <Grid container spacing={2}>
                  {friends.map((friend, index) => (
                    <Grid item xs={12} key={index}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Avatar src={friend.avatar} />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="subtitle1">
                            {friend.name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ZapFeed;
