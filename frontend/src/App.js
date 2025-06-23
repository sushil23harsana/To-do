import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, TextField, Button, List, ListItem, ListItemText,
  Checkbox, IconButton, Paper, Box, Stack, Card, Grid
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AnalyticsPage from "./AnalyticsPage";
import { ThemeProvider } from '@mui/material/styles';
import getTheme from './theme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InputAdornment from '@mui/material/InputAdornment';
import Sidebar from './Sidebar';
import TodoItem from "./TodoItem";
import DashboardPage from './DashboardPage';

const API_URL = process.env.REACT_APP_API_URL;
const API_BASE = process.env.REACT_APP_API_BASE;

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [analytics, setAnalytics] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [mode, setMode] = useState('light');
  const [analyticsStatus, setAnalyticsStatus] = useState('all');
  const [analyticsKeyword, setAnalyticsKeyword] = useState('');

  const theme = getTheme(mode);

  // Fetch todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get(API_URL)
      .then(res => {
        if (Array.isArray(res.data)) {
          setTodos(res.data);
        } else if (Array.isArray(res.data.todos)) {
          setTodos(res.data.todos);
        } else {
          setTodos([]);
        }
      })
      .catch(err => {
        setTodos([]);
        console.error(err);
      });
  };

  const addTodo = () => {
    if (!title.trim()) return;
    axios.post(API_URL, {
      title,
      description,
      completed: false,
      date: date.toISOString().split('T')[0]
    })
      .then(() => {
        setTitle("");
        setDescription("");
        fetchTodos();
      });
  };

  const toggleTodo = (todo) => {
    axios.patch(`${API_URL}${todo.id}/`, { completed: !todo.completed })
      .then(fetchTodos);
  };

  const deleteTodo = (id) => {
    axios.delete(`${API_URL}${id}/`).then(fetchTodos);
  };

  const fetchAnalytics = () => {
    setLoadingAnalytics(true);
    axios.get(`${API_BASE}analytics/`, {
      params: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd'),
        status: analyticsStatus,
        keyword: analyticsKeyword
      }
    })
    .then(res => {
      setAnalytics(res.data.ai_analytics);
      setLoadingAnalytics(false);
    })
    .catch(err => {
      setAnalytics("Error fetching analytics.");
      setLoadingAnalytics(false);
    });
  };

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  // Helper to get streak from localStorage
  function getStreak() {
    return parseInt(localStorage.getItem('todo_streak') || '0', 10);
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
          <Sidebar mode={mode} toggleTheme={toggleTheme} todos={todos} />
          <Box sx={{ flexGrow: 1, ml: '240px', py: 6 }}>
            <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
              <Routes>
                <Route path="/" element={
                  <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
                    {/* Add Todo Section */}
                    <Grid item xs={12} md={6}>
                      <Paper elevation={3} sx={{ maxWidth: 480, mx: 'auto', px: 3, py: 4, bgcolor: 'primary.50', boxShadow: 3, borderRadius: 4 }}>
                        <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mb: 1, letterSpacing: 1 }}>
                          Add a New Todo
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Stay organized by adding your next task below.
                        </Typography>
                        <Stack spacing={2}>
                          <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addTodo()}
                            size="medium"
                            sx={{ bgcolor: 'background.default' }}
                          />
                          <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addTodo()}
                            size="medium"
                            sx={{ bgcolor: 'background.default' }}
                          />
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="Date"
                              value={date}
                              onChange={setDate}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  size="medium"
                                  variant="outlined"
                                  sx={{ bgcolor: 'background.default' }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={addTodo}
                            sx={{ fontWeight: 600, height: '48px', borderRadius: 2, boxShadow: 1, minWidth: 120, mt: 1 }}
                            fullWidth
                          >
                            Add
                          </Button>
                        </Stack>
                      </Paper>
                    </Grid>
                    {/* Vertical Divider for desktop */}
                    <Grid item md={0.1} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'stretch', justifyContent: 'center' }}>
                      <Box sx={{ width: 2, bgcolor: 'divider', borderRadius: 1, height: '100%' }} />
                    </Grid>
                    {/* Todo List Section */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ px: 2, py: 3 }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom color="secondary.main" sx={{ mb: 2, letterSpacing: 1 }}>
                          Todo List
                        </Typography>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', maxHeight: '60vh', overflowY: 'auto' }}>
                          <List sx={{ p: 0 }}>
                            {todos.length === 0 && (
                              <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
                                No todos yet. Add one!
                              </Typography>
                            )}
                            {Array.isArray(todos) && todos.map((todo, idx) => (
                              <React.Fragment key={todo.id}>
                                <TodoItem
                                  todo={todo}
                                  onToggle={toggleTodo}
                                  onDelete={deleteTodo}
                                />
                                {idx < todos.length - 1 && <Box sx={{ height: 1, bgcolor: 'divider', my: 1, mx: 1, borderRadius: 1 }} />}
                              </React.Fragment>
                            ))}
                          </List>
                        </Paper>
                      </Box>
                    </Grid>
                  </Grid>
                } />
                <Route path="/analytics" element={
                  <AnalyticsPage
                    analytics={analytics}
                    loadingAnalytics={loadingAnalytics}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    fetchAnalytics={fetchAnalytics}
                    analyticsStatus={analyticsStatus}
                    setAnalyticsStatus={setAnalyticsStatus}
                    analyticsKeyword={analyticsKeyword}
                    setAnalyticsKeyword={setAnalyticsKeyword}
                  />
                } />
                <Route path="/dashboard" element={<DashboardPage todos={todos} streak={getStreak()} />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
