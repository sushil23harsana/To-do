import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const QUOTES = [
  "Start where you are. Use what you have. Do what you can.",
  "Every day is a fresh start.",
  "Small steps every day.",
  "Dream big. Start small.",
  "Progress, not perfection.",
  "You are capable of amazing things.",
  "Stay positive, work hard, make it happen.",
  "Believe you can and you're halfway there.",
  "Discipline is the bridge between goals and accomplishment.",
  "Great things never come from comfort zones."
];

const MotivationalQuote = () => {
  const [index, setIndex] = useState(Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % QUOTES.length);
    }, 10000); // Change every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 1, bgcolor: 'background.paper' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1" fontStyle="italic" color="text.secondary">
            “{QUOTES[index]}”
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MotivationalQuote; 