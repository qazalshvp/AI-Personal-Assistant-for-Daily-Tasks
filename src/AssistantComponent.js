import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getAssistantResponse } from "./api";
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "react-toastify/dist/ReactToastify.css";

const AssistantComponent = () => {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [toggleState, setToggleState] = useState({ toggle: false });
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    addedTasks: 0,
    updatedTasks: 0,
    deletedTasks: 0,
  });

  const getSmartSuggestions = (input) => {
    const allSuggestions = [
      "suggestion 1",
      "suggestion 2",
      "suggestion 3",
      "suggestion 4",
    ];
    return allSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(input.toLowerCase())
    );
  };

  useEffect(() => {
    if (userInput) {
      const newSuggestions = getSmartSuggestions(userInput);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [userInput]);

  const handleAskAssistant = async () => {
    if (!userInput) return;

    if (editingIndex !== null) {
      handleUpdateTask();
      return;
    }

    try {
      const assistantResponse = await getAssistantResponse(userInput);
      setResponse(assistantResponse);

      // اضافه کردن تسک
      setTasks((prevTasks) => [...prevTasks, userInput]);
      setAnalytics((prevAnalytics) => ({
        ...prevAnalytics,
        totalTasks: prevAnalytics.totalTasks + 1,
        addedTasks: prevAnalytics.addedTasks + 1,
      }));

      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get response from Assistant.");
    }
    setUserInput("");
    setSuggestions([]);
  };

  const handleUpdateTask = () => {
    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = userInput;
      setTasks(updatedTasks);
      setUserInput("");
      setEditingIndex(null);
      setAnalytics((prevAnalytics) => ({
        ...prevAnalytics,
        updatedTasks: prevAnalytics.updatedTasks + 1,
      }));
      toast.success("Task updated successfully!");
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    setAnalytics((prevAnalytics) => ({
      ...prevAnalytics,
      deletedTasks: prevAnalytics.deletedTasks + 1,
    }));
    toast.success("Task deleted successfully!");
  };

  const handleEditTask = (index) => {
    setUserInput(tasks[index]);
    setEditingIndex(index);
  };

  const handleToggle = () => {
    setToggleState((prevState) => ({
      ...prevState,
      toggle: !prevState.toggle,
    }));
  };

  // Data for the chart
  const chartData = [
    { name: "Total Tasks", value: analytics.totalTasks },
    { name: "Added Tasks", value: analytics.addedTasks },
    { name: "Updated Tasks", value: analytics.updatedTasks },
    { name: "Deleted Tasks", value: analytics.deletedTasks },
  ];

  return (
    <Container
      maxWidth="md"
      style={{
        padding: "40px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        marginTop: "40px",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        AI Personal Assistant
      </Typography>

      {/* Task Addition Section */}
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
        }}
      >
        <TextField
          label="Ask something..."
          variant="outlined"
          fullWidth
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={{ marginBottom: "20px" }}
          InputProps={{
            style: {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAskAssistant}
          fullWidth
          style={{
            borderRadius: "8px",
            textTransform: "capitalize",
          }}
        >
          {editingIndex !== null ? "Update Task" : "Ask Assistant"}
        </Button>

        {/* Suggestions List */}
        {suggestions.length > 0 && (
          <List style={{ marginTop: "10px" }}>
            {suggestions.map((suggestion, index) => (
              <ListItem key={index}>
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
        )}

        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Your Tasks:
        </Typography>
        <List>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <ListItem
                key={index}
                style={{ borderBottom: "1px solid #e0e0e0" }}
              >
                <ListItemText primary={task} />
                <IconButton edge="end" onClick={() => handleEditTask(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDeleteTask(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No tasks added yet." />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Analytics Section */}
      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Analytics and Reporting:
      </Typography>
      <Box
        style={{
          marginTop: "20px",
          backgroundColor: "#f0f4ff",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3f51b5" />
          </BarChart>
        </ResponsiveContainer>
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          Total Tasks: {analytics.totalTasks}
        </Typography>
        <Typography variant="body1">
          Added Tasks: {analytics.addedTasks}
        </Typography>
        <Typography variant="body1">
          Updated Tasks: {analytics.updatedTasks}
        </Typography>
        <Typography variant="body1">
          Deleted Tasks: {analytics.deletedTasks}
        </Typography>
      </Box>

      {/* Assistant Response Section */}
      <Button
        variant="outlined"
        color="primary"
        onClick={handleToggle}
        style={{
          marginBottom: "20px",
          marginTop: "20px",
          borderRadius: "8px",
        }}
      >
        {toggleState.toggle
          ? "Hide Assistant Response"
          : "Show Assistant Response"}
      </Button>
      {toggleState.toggle && (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6">Assistant Response:</Typography>
          <Typography>{response}</Typography>
        </Paper>
      )}
      <ToastContainer />
    </Container>
  );
};

export default AssistantComponent;
