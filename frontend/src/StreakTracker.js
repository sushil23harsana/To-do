import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Badge } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

const StreakTracker = ({ todos }) => {
  const [streak, setStreak] = useState(0);
  const [lastDay, setLastDay] = useState(null);

  useEffect(() => {
    // Get completed todos for today
    const today = getTodayStr();
    const completedToday = todos.some(
      t => t.completed && t.date === today
    );
    let storedStreak = parseInt(localStorage.getItem('todo_streak') || '0', 10);
    let storedLastDay = localStorage.getItem('todo_streak_last_day');

    if (completedToday) {
      if (storedLastDay !== today) {
        // If yesterday was the last streak day, increment; else reset
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (storedLastDay === yesterday) {
          storedStreak += 1;
        } else {
          storedStreak = 1;
        }
        localStorage.setItem('todo_streak', storedStreak);
        localStorage.setItem('todo_streak_last_day', today);
      }
    } else if (storedLastDay !== today) {
      // If no completion today and lastDay is not today, streak is not incremented
      // (do not reset here, only reset if a new completion happens after a gap)
    }
    setStreak(storedStreak);
    setLastDay(storedLastDay);
  }, [todos]);

  return (
    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 1, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', p: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0 }}>
        <Badge badgeContent={streak} color="error" max={99} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <WhatshotIcon color={streak > 0 ? 'error' : 'disabled'} fontSize="large" />
        </Badge>
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            Streak
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {streak > 0
              ? `You've completed todos for ${streak} day${streak > 1 ? 's' : ''} in a row!`
              : 'Complete a todo today to start your streak!'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StreakTracker; 