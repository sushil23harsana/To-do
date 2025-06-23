import React from "react";
import { Box, Typography, Paper, Stack, Button, TextField, MenuItem, FormControl, InputLabel, Select, Card } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Fade from '@mui/material/Fade';

const AnalyticsPage = ({
  analytics,
  loadingAnalytics,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  fetchAnalytics,
  analyticsStatus,
  setAnalyticsStatus,
  analyticsKeyword,
  setAnalyticsKeyword,
}) => {
  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Fade in={true} timeout={700}>
        <Card sx={{ p: 4, borderRadius: 4, boxShadow: 4, bgcolor: 'background.paper', width: '100%' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom color="secondary.main">
            AI Analytics
          </Typography>
          {/* Filters Row */}
          <Stack direction="row" spacing={2} alignItems="center" mb={3} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={analyticsStatus}
                label="Status"
                onChange={e => setAnalyticsStatus(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="not_completed">Not Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Keyword"
              value={analyticsKeyword}
              onChange={e => setAnalyticsKeyword(e.target.value)}
              size="small"
              sx={{ minWidth: 140 }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField {...params} size="small" sx={{ minWidth: 120 }} />}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => <TextField {...params} size="small" sx={{ minWidth: 120 }} />}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              color="secondary"
              onClick={fetchAnalytics}
              disabled={loadingAnalytics}
              size="small"
              sx={{ fontWeight: 600, px: 3, height: 40, boxShadow: 2, minWidth: 120 }}
            >
              {loadingAnalytics ? "Analyzing..." : "Get Analytics"}
            </Button>
          </Stack>
          {/* Result Section */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#f7f8fa', minHeight: 60, mt: 2 }}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {analytics}
            </Typography>
          </Paper>
        </Card>
      </Fade>
    </Box>
  );
};

export default AnalyticsPage; 