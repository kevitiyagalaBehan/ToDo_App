const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a new task
router.post("/", async (req, res) => {
  const newTask = new Task({ title: req.body.title });
  await newTask.save();
  res.json(newTask);
});

// Delete a task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Update task completion status
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed: completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).send("Task not found");
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Error updating task completion");
  }
});

module.exports = router;
