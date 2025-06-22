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

const API_URL = "http://127.0.0.1:8000/api/todos/";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [analytics, setAnalytics] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Fetch todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get(API_URL)
      .then(res => setTodos(res.data))
      .catch(err => console.error(err));
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
    axios.get("http://127.0.0.1:8000/api/analytics/", {
      params: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd')
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 6 }}>
      <Container maxWidth="md">
        <Paper elevation={6} sx={{ p: 6, borderRadius: 5, boxShadow: 6, minHeight: '80vh', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Typography variant="h2" align="center" gutterBottom fontWeight={800} color="primary.main" sx={{ letterSpacing: 2 }}>
            Todo App
          </Typography>
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
                  renderInput={(params) => <TextField {...params} />}
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
                {todos.map(todo => (
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
          {/* AI Analytics Section */}
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom color="secondary.main">
              AI Analytics
            </Typography>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: '#f0f4f8' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
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
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
