import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, TextField, Button, List, ListItem, ListItemText,
  Checkbox, IconButton, Paper, Box, Stack, MenuItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnalyticsPage from "./AnalyticsPage";
import { ThemeProvider } from '@mui/material/styles';
import getTheme from './theme';
import Sidebar from './Sidebar';
import DashboardPage from './DashboardPage';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

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
      date: date.toISOString().split('T')[0],
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
            <Container maxWidth="md" sx={{ py: 6 }}>
              <Routes>
                <Route path="/" element={
                  <Box>
                    {/* Add Todo Section */}
                    <Paper elevation={2} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper', mb: 4 }}>
                      <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 2, letterSpacing: 1 }}>
                        Add a New Todo
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Stay organized by adding your next task below.
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                          label="Title"
                          variant="outlined"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && addTodo()}
                          size="small"
                          sx={{ flex: 2 }}
                        />
                        <TextField
                          label="Description"
                          variant="outlined"
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && addTodo()}
                          size="small"
                          sx={{ flex: 3 }}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Date"
                            value={date}
                            onChange={setDate}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                variant="outlined"
                                sx={{ minWidth: 120 }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={addTodo}
                          sx={{ fontWeight: 600, height: 40, borderRadius: 2, minWidth: 100, boxShadow: 1 }}
                        >
                          Add
                        </Button>
                      </Stack>
                    </Paper>
                    {/* Todo List Section */}
                    <Paper elevation={2} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
                      <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 2, letterSpacing: 1 }}>
                        Todo List
                      </Typography>
                      <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        <List sx={{ p: 0 }}>
                          {todos.length === 0 && (
                            <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
                              No todos yet. Add one!
                            </Typography>
                          )}
                          {Array.isArray(todos) && [...todos]
                            .sort((a, b) => (b.priority === 'High') - (a.priority === 'High') || (b.priority === 'Medium') - (a.priority === 'Medium'))
                            .map((todo, idx) => (
                              <React.Fragment key={todo.id}>
                                <ListItem
                                  sx={{
                                    borderLeft: todo.priority === 'High' ? '5px solid #FF6B6B' : todo.priority === 'Medium' ? '5px solid #FFD600' : '5px solid transparent',
                                    bgcolor: todo.priority === 'High' ? '#FFF3F3' : todo.priority === 'Medium' ? '#FFFBEA' : 'inherit',
                                    mb: 1,
                                    borderRadius: 2,
                                  }}
                                  secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  }
                                >
                                  <Checkbox
                                    edge="start"
                                    checked={todo.completed}
                                    tabIndex={-1}
                                    disableRipple
                                    onChange={() => toggleTodo(todo)}
                                  />
                                  <ListItemText
                                    primary={todo.title}
                                    secondary={todo.description}
                                  />
                                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80, textAlign: 'right' }}>
                                    {todo.date}
                                  </Typography>
                                </ListItem>
                                {idx < todos.length - 1 && <Box sx={{ height: 1, bgcolor: 'divider', my: 1, mx: 1, borderRadius: 1 }} />}
                              </React.Fragment>
                            ))}
                        </List>
                      </Box>
                    </Paper>
                  </Box>
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
