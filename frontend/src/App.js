import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, TextField, Button, List, ListItem, ListItemText,
  Checkbox, IconButton, Paper, Box, Stack
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AnalyticsPage from "./AnalyticsPage";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InputAdornment from '@mui/material/InputAdornment';

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
  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#d32f2f' },
    },
  });

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

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', py: 6 }}>
          <Container maxWidth="md">
            <Paper elevation={6} sx={{ p: 6, borderRadius: 5, boxShadow: 6, minHeight: '80vh', display: 'flex', flexDirection: 'column', gap: 5, bgcolor: 'background.paper' }}>
              {/* Navigation Bar */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ letterSpacing: 2 }}>
                  Todo App
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button component={Link} to="/" color="primary" sx={{ fontWeight: 600, mr: 2 }}>Todos</Button>
                  <Button component={Link} to="/analytics" color="secondary" sx={{ fontWeight: 600, mr: 2 }}>Analytics</Button>
                  <IconButton onClick={toggleTheme} color="inherit">
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                </Box>
              </Box>
              <Routes>
                <Route path="/" element={
                  <>
                    {/* Add Todo Section */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom color="secondary.main">
                        Add a New Todo
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                          label="Title"
                          variant="outlined"
                          fullWidth
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && addTodo()}
                        />
                        <TextField
                          label="Description"
                          variant="outlined"
                          fullWidth
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && addTodo()}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Date"
                            value={date}
                            onChange={setDate}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                sx: { minWidth: 180, bgcolor: 'background.paper' },
                                InputProps: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <CalendarTodayIcon color="action" />
                                    </InputAdornment>
                                  )
                                }
                              }
                            }}
                          />
                        </LocalizationProvider>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={addTodo}
                          sx={{ fontWeight: 600, px: 4, height: '56px' }}
                        >
                          Add
                        </Button>
                      </Stack>
                    </Box>
                    {/* Todo List Section */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom color="secondary.main">
                        Todo List
                      </Typography>
                      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: '#f0f4f8', maxHeight: '40vh', overflowY: 'auto' }}>
                        <List>
                          {todos.length === 0 && (
                            <Typography align="center" color="text.secondary">
                              No todos yet. Add one!
                            </Typography>
                          )}
                          {Array.isArray(todos) && todos.map(todo => (
                            <ListItem
                              key={todo.id}
                              sx={{
                                mb: 2,
                                borderRadius: 2,
                                bgcolor: todo.completed ? "#d0f5e8" : "#ffe0e0",
                                boxShadow: 1,
                                transition: "background 0.3s",
                                alignItems: 'flex-start',
                                py: 2
                              }}
                              secondaryAction={
                                <IconButton edge="end" color="error" onClick={() => deleteTodo(todo.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              }
                            >
                              <Checkbox
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo)}
                                sx={{
                                  color: todo.completed ? "success.main" : "error.main",
                                  mt: 1
                                }}
                              />
                              <ListItemText
                                primary={
                                  <>
                                    <Typography variant="h6" fontWeight={700} color={todo.completed ? "success.main" : "error.main"}>
                                      {todo.title}
                                    </Typography>
                                    {todo.description && (
                                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666', mb: 1 }}>
                                        {todo.description}
                                      </Typography>
                                    )}
                                  </>
                                }
                                secondary={
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Date: {todo.date}
                                    </Typography>
                                    {todo.created_at && (
                                      <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                        Created: {new Date(todo.created_at).toLocaleString()}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                                sx={{
                                  textDecoration: todo.completed ? "line-through" : "none",
                                  fontWeight: 500,
                                  fontSize: "1.1rem"
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Box>
                  </>
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
              </Routes>
            </Paper>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
