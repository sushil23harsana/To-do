import React from "react";
import { Box, Typography, Paper, Stack, Button, TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="secondary.main">
        AI Analytics
      </Typography>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: '#f0f4f8' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
          <FormControl sx={{ minWidth: 140 }}>
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
            sx={{ minWidth: 180 }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            color="secondary"
            onClick={fetchAnalytics}
            disabled={loadingAnalytics}
            sx={{ fontWeight: 600, px: 4, height: '56px' }}
          >
            {loadingAnalytics ? "Analyzing..." : "Get Analytics"}
          </Button>
        </Stack>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line", mt: 2, minHeight: 40 }}>
          {analytics}
        </Typography>
      </Paper>
    </Box>
  );
};

export default AnalyticsPage; 