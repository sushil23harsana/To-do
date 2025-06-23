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
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          <Sidebar mode={mode} toggleTheme={toggleTheme} todos={todos} open={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
          <Box sx={{ flexGrow: 1, ml: { md: sidebarOpen ? '240px' : '72px' }, transition: 'margin 0.3s', py: 6 }}>
            {/* Sidebar toggle button */}
            <Box sx={{ position: 'absolute', top: 24, left: { md: sidebarOpen ? 250 : 82, xs: 16 }, zIndex: 1201, transition: 'left 0.3s' }}>
              <Button
                onClick={() => setSidebarOpen(o => !o)}
                variant="outlined"
                size="small"
                sx={{ minWidth: 0, p: 1, borderRadius: 2, boxShadow: 1 }}
              >
                {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
              </Button>
            </Box>
            <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
              <Routes>
                <Route path="/" element={
                  <Grid container spacing={4} alignItems="stretch" justifyContent="center">
                    {/* Add Todo Section (always left) */}
                    <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }}>
                      <Paper elevation={2} sx={{ maxWidth: 500, mx: 'auto', px: 3, py: 5, bgcolor: '#fff', color: 'inherit', boxShadow: 2, borderRadius: 4, minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                            sx={{ bgcolor: 'background.default', borderRadius: 2 }}
                          />
                          <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addTodo()}
                            size="medium"
                            sx={{ bgcolor: 'background.default', borderRadius: 2 }}
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
                                  sx={{ bgcolor: 'background.default', borderRadius: 2 }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={addTodo}
                            sx={{ fontWeight: 600, height: '48px', borderRadius: 2, boxShadow: 2, minWidth: 120, mt: 1 }}
                            fullWidth
                          >
                            Add
                          </Button>
                        </Stack>
                      </Paper>
                    </Grid>
                    {/* Vertical Divider for desktop */}
                    <Grid item md={0.1} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'stretch', justifyContent: 'center' }}>
                      <Box sx={{ width: 3, bgcolor: 'divider', borderRadius: 1, height: '100%' }} />
                    </Grid>
                    {/* Todo List Section (always right) */}
                    <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }}>
                      <Paper elevation={2} sx={{ p: 4, borderRadius: 4, bgcolor: '#fff', minHeight: 420, boxShadow: 2 }}>
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom color="primary.main" sx={{ mb: 2, letterSpacing: 1 }}>
                          Todo List
                        </Typography>
                        <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
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
                        </Box>
                      </Paper>
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
