import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import styled from 'styled-components';

const UpdatesContainer = styled.div`
  display: flex;
  overflow-x: auto;  // Allows horizontal scrolling
  scroll-behavior: smooth;
  padding: 10px 0; // Added padding for visual spacing
`;

const UpdateCard = styled(Card)`
  flex: 0 0 auto;  // Flex-basis set to auto, keeps original width
  margin: 0 10px;  // Margin for spacing between cards
  width: 300px;  // Width of each card
`;

const RecentUpdates = () => {
  const updates = [
    { title: "Update 1", description: "Description of update 1." },
    { title: "Update 2", description: "Description of update 2." },
    { title: "Update 3", description: "Description of update 3." },
    { title: "Update 4", description: "Description of update 4." },
  ];

  return (
    <UpdatesContainer>
      {updates.map((update, index) => (
        <UpdateCard key={index} elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {update.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {update.description}
            </Typography>
          </CardContent>
        </UpdateCard>
      ))}
    </UpdatesContainer>
  );
};

export default RecentUpdates;
