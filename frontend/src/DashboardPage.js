import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper, Stack } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import WhatshotIcon from '@mui/icons-material/Whatshot';

// Helper to get last 7 days labels
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
  }
  return days;
}

// Helper to get completion data for last 7 days
function getWeeklyData(todos) {
  const days = getLast7Days();
  const today = new Date();
  return days.map((label, idx) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - idx));
    const dateStr = d.toISOString().slice(0, 10);
    const completed = todos.filter(t => t.completed && t.date === dateStr).length;
    return { day: label, completed };
  });
}

function getCompletionRate(todos) {
  const completed = todos.filter(t => t.completed).length;
  const pending = todos.length - completed;
  return [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending }
  ];
}

function getRecentCompleted(todos) {
  return todos
    .filter(t => t.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
}

const COLORS = ['#6C63FF', '#FF6584'];

const DashboardPage = ({ todos = [], streak = 0 }) => {
  const weeklyData = getWeeklyData(todos);
  const completionRate = getCompletionRate(todos);
  const recentCompleted = getRecentCompleted(todos);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={800} color="primary.main" mb={3}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Weekly Completion Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Weekly Completions
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" stroke="#8884d8" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#6C63FF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        {/* Completion Rate Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Completion Rate
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={completionRate}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {completionRate.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        {/* Streak Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, display: 'flex', alignItems: 'center' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 0 }}>
              <WhatshotIcon color={streak > 0 ? 'error' : 'disabled'} fontSize="large" />
              <Box>
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
        </Grid>
        {/* Recent Completed Todos */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Recent Completed
              </Typography>
              <Stack spacing={1}>
                {recentCompleted.length === 0 && (
                  <Typography color="text.secondary">No completed todos yet.</Typography>
                )}
                {recentCompleted.map(todo => (
                  <Paper key={todo.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: '#e3fcef' }}>
                    <Typography variant="subtitle2" fontWeight={600} color="success.main">
                      {todo.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {todo.date}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage; 