import React, { useState } from "react";
import { Container, Grid, Paper, Typography, Avatar, IconButton } from '@mui/material';
import Navbar from '../../../Components/Navbar/NavBar';
import { FavoriteBorder, Repeat, ChatBubbleOutline, Share } from "@mui/icons-material";

const trackers = () => {
  // This is sample data
  const [tweets, setTweets] = useState([
    // ... tweets data ...
    {
      user: {
        name: "John Doe",
        avatar: "https://via.placeholder.com/150"
      },
      time: "2023-07-21",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis."
    },
    {
      user: {
        name: "Jane Doe",
        avatar: "https://via.placeholder.com/150"
      },
      time: "2023-07-21",
      content: "Curabitur non ipsum id dolor ullamcorper elementum. Sed in massa metus."
    },
     {
      user: {
        name: "Jane Doe",
        avatar: "https://via.placeholder.com/150"
      },
      time: "2023-07-21",
      content: "Curabitur non ipsum id dolor ullamcorper elementum. Sed in massa metus."
    },
  ]);

  const [friends, setFriends] = useState([
    // ... friends data ...
    {
      name: "Friend One",
      avatar: "https://via.placeholder.com/150"
    },
    {
      name: "Friend Two",
      avatar: "https://via.placeholder.com/150"
    },
    {
      name: "Friend 2",
      avatar: "https://via.placeholder.com/150"
    },
    {
      name: "Friend 3",
      avatar: "https://via.placeholder.com/150"
    },
  ]);
  
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
                          <Typography variant="subtitle1">{tweet.user.name}</Typography>
                          <Typography variant="subtitle2">{tweet.time}</Typography>
                          <Typography variant="body1">{tweet.content}</Typography>
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
                          <Typography variant="subtitle1">{friend.name}</Typography>
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

export default trackers;
