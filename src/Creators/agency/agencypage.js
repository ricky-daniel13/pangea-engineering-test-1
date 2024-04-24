import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography, makeStyles } from '@material-ui/core';
import client from '../../../../API'
import NavBar from '../../../../Components/Navbar/NavBar'; // Assuming NavBar is your navigation component
// Assuming NavBar is correct
import blitzLogo from "../../../../Components/globalAssets/platty.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  card: {
    maxWidth: 345,
    margin: theme.spacing(2),
  },
  media: {
    height: 200,
  },
}));

const AgencyCreatorRoster = () => {
    const classes = useStyles();
    const { manager } = useParams();
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    useEffect(() => {
        const fetchCreators = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await client.get(`/api/creators/manager/${manager}`);
                if (response && response.data.creators) {
                    setCreators(response.data.creators);
                } else {
                    setError('No creators found for this manager');
                }
            } catch (error) {
                console.error(`Failed to fetch creators for manager ${manager}`, error);
                setError(`Failed to fetch creators for manager ${manager}`);
            } finally {
                setLoading(false);
            }
        };
    
        if (manager) {
            fetchCreators();
        }
    }, [manager]);
    
  
    if (loading) {
      return <Typography>Loading...</Typography>;
    }
  
    if (error) {
      return <Typography color="error">{error}</Typography>;
    }
  
  return (
    <>
      <NavBar />
      <Grid container className={classes.root} spacing={4}>
        {creators.map((creator) => (
          <Grid item xs={12} sm={6} md={4} key={creator.id}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image={creator.pfphref || blitzLogo}
                title={`${creator.name}'s profile image`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {creator.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Platform: {creator.platform}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Followers: {creator.tiktok}
                </Typography>

                <Typography variant="body2" color="textSecondary" component="p">
                  <a href={creator.tiktok_link} target="_blank" rel="noopener noreferrer">
                    View Profile
                  </a>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default AgencyCreatorRoster;
