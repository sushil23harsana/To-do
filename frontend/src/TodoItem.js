import React from "react";
import { Card, CardContent, Typography, Checkbox, IconButton, Box, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Fade from '@mui/material/Fade';

const TodoItem = ({ todo, onToggle, onDelete }) => (
  <Fade in={true} timeout={600}>
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: 2,
        bgcolor: todo.completed ? "#e3fcef" : "#fff",
        transition: "background 0.3s",
        opacity: todo.completed ? 0.7 : 1,
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Checkbox
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon color="success" />}
          sx={{ mr: 1 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            color={todo.completed ? "success.main" : "primary.main"}
            sx={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.title}
          </Typography>
          {todo.description && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
              {todo.description}
            </Typography>
          )}
          <Stack direction="row" spacing={2} mt={1}>
            <Typography variant="caption" color="text.secondary">
              Date: {todo.date}
            </Typography>
            {todo.created_at && (
              <Typography variant="caption" color="text.secondary">
                Created: {new Date(todo.created_at).toLocaleString()}
              </Typography>
            )}
          </Stack>
        </Box>
        <IconButton edge="end" color="error" onClick={() => onDelete(todo.id)}>
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  </Fade>
);

export default TodoItem; 