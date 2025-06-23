import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, TextField, Button, List, ListItem, ListItemText,
  Checkbox, IconButton, Paper, Box, Stack, Card
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

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
          <Sidebar mode={mode} toggleTheme={toggleTheme} todos={todos} />
          <Box sx={{ flexGrow: 1, ml: '240px', py: 6 }}>
            <Container maxWidth="md">
              <Paper elevation={6} sx={{ p: 6, borderRadius: 5, boxShadow: 6, minHeight: '80vh', display: 'flex', flexDirection: 'column', gap: 5, bgcolor: 'background.paper' }}>
                <Routes>
                  <Route path="/" element={
                    <>
                      {/* Add Todo Section */}
                      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3, p: 3, bgcolor: 'background.paper' }}>
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
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  sx={{ minWidth: 180, bgcolor: 'background.paper' }}
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <CalendarTodayIcon color="action" />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={addTodo}
                            sx={{ fontWeight: 600, px: 4, height: '56px', boxShadow: 2 }}
                          >
                            Add
                          </Button>
                        </Stack>
                      </Card>
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
                              <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                              />
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
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
