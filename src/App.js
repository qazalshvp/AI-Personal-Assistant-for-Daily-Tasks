import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";
import AssistantComponent from "./AssistantComponent"; // اضافه کردن AssistantComponent
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleAddTask = () => {
    if (!task) return;
    setTasks([...tasks, task]);
    setTask("");
    toast.success("Task added successfully!");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container
        maxWidth="sm"
        style={{
          padding: "20px",
          background: isDarkMode ? darkTheme.background : lightTheme.background,
          minHeight: "100vh",
          color: isDarkMode ? darkTheme.color : lightTheme.color,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          AI Personal Assistant
        </Typography>
        <Button onClick={toggleTheme} style={{ marginBottom: "20px" }}>
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>

        {/* افزودن AssistantComponent */}
        <AssistantComponent isDarkMode={isDarkMode} />

        <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
          <TextField
            label="Enter your task"
            variant="outlined"
            fullWidth
            value={task}
            onChange={(e) => setTask(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTask}
            style={{ marginRight: "10px" }}
          >
            Add Task
          </Button>
        </Paper>
        <ToastContainer />
      </Container>
    </ThemeProvider>
  );
};

export default App;
